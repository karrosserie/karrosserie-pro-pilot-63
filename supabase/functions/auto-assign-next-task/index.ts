import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TaskType {
  id: string;
  task_type: string;
  vehicle_id: string;
  company_id: string;
  user_id: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { taskId, companyId } = await req.json();

    if (!taskId || !companyId) {
      return new Response(
        JSON.stringify({ error: 'taskId and companyId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`🔄 Auto-assignment triggered for task: ${taskId}, company: ${companyId}`);

    // 1. Récupérer la tâche terminée
    const { data: completedTask, error: taskError } = await supabase
      .from('employee_schedule')
      .select('*')
      .eq('id', taskId)
      .eq('company_id', companyId)
      .single();

    if (taskError || !completedTask) {
      console.error('❌ Error fetching completed task:', taskError);
      return new Response(
        JSON.stringify({ error: 'Task not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Déterminer l'étape suivante selon le workflow
    const getNextTaskType = (currentTaskType: string): string | null => {
      const workflow = {
        // Workflow basé sur les vrais types de tâches dans la DB
        'Accueil & Préparation du dossier': 'Remplacement ou débosselage',
        'Remplacement ou débosselage': 'Contrôle technique de sécurité',
        'Contrôle technique de sécurité': 'Préparation peinture',
        'Préparation peinture': 'Mise en peinture',
        'Mise en peinture': 'Finitions & remontage',
        'Finitions & remontage': 'Clôture & livraison',
        'Clôture & livraison': null, // Dernière étape
        
        // Anciens types pour compatibilité
        'Accueil': 'Remplacement ou débosselage',
        'Démontage': 'Préparation peinture',
        'Débosselage & Ponçage': 'Préparation peinture',
        'Remplacement': 'Préparation peinture',
        'Finitions & Remontage': 'Clôture & livraison',
        'Clôture & Livraison': null
      };
      
      console.log(`🔍 Current task type: "${currentTaskType}"`);
      const nextType = workflow[currentTaskType as keyof typeof workflow] || null;
      console.log(`➡️ Next task type: "${nextType}"`);
      
      return nextType;
    };

    const nextTaskType = getNextTaskType(completedTask.task_type);
    
    if (!nextTaskType) {
      console.log('✅ Task workflow completed, no next step needed');
      
      // Si c'est l'étape finale (Clôture & livraison), marquer le véhicule comme terminé
      console.log(`🔍 Checking if task is final step: "${completedTask.task_type}"`);
      if (completedTask.task_type === 'Clôture & livraison' || (completedTask.task_type.includes('Clôture') && completedTask.task_type.includes('livraison'))) {
        console.log('🏁 Marking vehicle as completed for final step');
        
        const { error: vehicleUpdateError } = await supabase
          .from('vehicles')
          .update({ status: 'Terminé' })
          .eq('id', completedTask.vehicle_id)
          .eq('company_id', companyId);
          
        if (vehicleUpdateError) {
          console.error('❌ Error updating vehicle status:', vehicleUpdateError);
          return new Response(
            JSON.stringify({ error: 'Failed to update vehicle status' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        console.log('✅ Vehicle marked as completed');
        console.log('🚗 vehicule termine son status passe a terminé dans la table vehicles');
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Workflow completed and vehicle marked as finished',
            vehicleStatus: 'Terminé'
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: true, message: 'Workflow completed' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📋 Next task type determined: ${nextTaskType}`);

    // 3. VÉRIFIER S'IL N'Y A PAS DÉJÀ UNE TÂCHE DE CE TYPE POUR CE VÉHICULE (éviter les doublons)
    const { data: existingTasks, error: existingError } = await supabase
      .from('employee_schedule')
      .select('id')
      .eq('company_id', companyId)
      .eq('vehicle_id', completedTask.vehicle_id)
      .eq('task_type', nextTaskType)
      .neq('status', 'Terminé');

    if (existingError) {
      console.error('❌ Error checking existing tasks:', existingError);
    }

    if (existingTasks && existingTasks.length > 0) {
      console.log('⚠️ Task already exists for this vehicle and task type, skipping creation');
      return new Response(
        JSON.stringify({ success: true, message: 'Task already exists', existingTaskId: existingTasks[0].id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Récupérer UNIQUEMENT les employés qualifiés et disponibles - PAS DE FALLBACK
    const { data: employees, error: empError } = await supabase
      .rpc('get_available_employees', {
        p_company_id: companyId,
        p_task_type: nextTaskType
      });

    if (empError) {
      console.error('❌ Error fetching qualified employees:', empError);
      console.log('⚠️ Cannot proceed without qualified employees due to RPC error');
      return new Response(
        JSON.stringify({ error: 'Unable to find qualified employees', details: empError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Si on a des employés qualifiés, utiliser le premier disponible
    const selectedEmployee = employees && employees.length > 0 ? employees[0] : null;
    
    if (!selectedEmployee) {
      console.log('⚠️ No qualified employees available, creating task with waiting reason');
      
      // Créer la tâche mais avec une raison d'attente pour indiquer qu'elle attend un employé qualifié
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 1); // Commencer dans 1 heure
      
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 2); // Durée estimée: 2 heures
      
      const { data: newTask, error: createError } = await supabase
        .from('employee_schedule')
        .insert({
          company_id: companyId,
          user_id: null, // Pas d'employé assigné
          vehicle_id: completedTask.vehicle_id,
          task_type: nextTaskType,
          start_datetime: startTime.toISOString(),
          end_datetime: endTime.toISOString(),
          status: 'En attente',
          waiting_reason: `Aucun employé qualifié disponible pour: ${nextTaskType}`
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Error creating waiting task:', createError);
        return new Response(
          JSON.stringify({ error: 'Failed to create waiting task' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('⏳ Task created in waiting state for qualified employee:', newTask.id);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          nextTaskId: newTask.id,
          nextTaskType,
          status: 'waiting_for_qualified_employee',
          message: `Tâche créée en attente d'un employé qualifié pour: ${nextTaskType}`
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`👤 Selected qualified employee: ${selectedEmployee.user_id} (availability: ${selectedEmployee.availability_score || 'N/A'}, role priority: ${selectedEmployee.role_priority || 'N/A'})`);

    // Vérifier si c'est la dernière étape du workflow
    const isLastStep = nextTaskType === 'Clôture & livraison';

    if (isLastStep) {
      console.log('🎯 Dernière étape détectée - Préparation de 4 créneaux pour le webhook');
      
      // Trouver 4 créneaux disponibles sur 2 jours différents (matin et soir)
      const availableSlots = await findMultipleAvailableSlots(
        supabase,
        selectedEmployee.user_id,
        companyId,
        2 * 60 * 60 * 1000 // 2 heures par créneau
      );

      // Appeler le webhook N8N avec les créneaux proposés
      const webhookUrl = 'https://n8n.karrosserie.pro/webhook/5690cd1a-90c8-4dff-af89-4a723a7f5495';
      const webhookData = {
        vehicle_id: completedTask.vehicle_id,
        employee_id: selectedEmployee.user_id,
        slots: availableSlots
      };

      console.log('📞 Appel du webhook avec les données:', JSON.stringify(webhookData));

      try {
        // Construire l'URL avec les paramètres en query string pour GET
        const queryParams = new URLSearchParams({
          vehicle_id: webhookData.vehicle_id,
          employee_id: webhookData.employee_id,
          slots: JSON.stringify(webhookData.slots)
        });

        const fullWebhookUrl = `${webhookUrl}?${queryParams.toString()}`;
        
        const webhookResponse = await fetch(fullWebhookUrl, {
          method: 'GET'
        });

        if (!webhookResponse.ok) {
          console.error('❌ Webhook call failed:', await webhookResponse.text());
        } else {
          console.log('✅ Webhook appelé avec succès');
        }
      } catch (webhookError) {
        console.error('❌ Error calling webhook:', webhookError);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Créneaux proposés envoyés au webhook pour confirmation',
          nextTaskType,
          assignedEmployeeId: selectedEmployee.user_id,
          proposedSlots: availableSlots
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Pour les autres étapes, assigner automatiquement comme avant
    const { startTime, endTime } = await findNextAvailableSlotForEmployee(
      supabase, 
      selectedEmployee.user_id, 
      companyId, 
      2 * 60 * 60 * 1000 // 2 heures en millisecondes
    );
    
    const { data: newTask, error: createError } = await supabase
      .from('employee_schedule')
      .insert({
        company_id: companyId,
        user_id: selectedEmployee.user_id,
        vehicle_id: completedTask.vehicle_id,
        task_type: nextTaskType,
        start_datetime: startTime.toISOString(),
        end_datetime: endTime.toISOString(),
        status: 'En attente'
      })
      .select()
      .single();

    if (createError) {
      console.error('❌ Error creating new task:', createError);
      return new Response(
        JSON.stringify({ error: 'Failed to create next task' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ New task created and assigned to qualified employee:', newTask.id);
    
    // 6. Créer une notification pour l'employé assigné (optionnel)
    try {
      const { error: notifError } = await supabase
        .from('system_alerts')
        .insert({
          company_id: companyId,
          entity_type: 'task',
          employee_id: selectedEmployee.user_id,
          vehicle_id: completedTask.vehicle_id,
          alert_type: 'task_assigned',
          title: 'Nouvelle tâche assignée',
          message: `Nouvelle tâche: ${nextTaskType}`,
          reason: 'Auto-assignation avec qualification requise'
        });
        
      if (notifError) {
        console.error('⚠️ Error creating notification:', notifError);
      } else {
        console.log('📬 Notification created for qualified employee');
      }
    } catch (notifError) {
      console.error('⚠️ Error in notification creation:', notifError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        nextTaskId: newTask.id,
        nextTaskType,
        assignedEmployeeId: selectedEmployee.user_id,
        qualificationMatched: true
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ Error in auto-assign-next-task function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function pour trouver 4 créneaux disponibles (2 jours, matin et soir)
async function findMultipleAvailableSlots(
  supabase: any,
  userId: string,
  companyId: string,
  durationMs: number
): Promise<Array<{ start: string; end: string; period: string; day: number }>> {
  const slots: Array<{ start: string; end: string; period: string; day: number }> = [];
  let currentDate = new Date();
  let daysProcessed = 0;
  
  // Arrondir à la prochaine demi-heure
  const minutes = currentDate.getMinutes();
  if (minutes < 30) {
    currentDate.setMinutes(30, 0, 0);
  } else {
    currentDate.setHours(currentDate.getHours() + 1, 0, 0, 0);
  }
  
  // Trouver des créneaux sur 2 jours différents (1 matin + 1 soir par jour)
  while (slots.length < 4 && daysProcessed < 7) {
    // Éviter les weekends
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      currentDate.setDate(currentDate.getDate() + 1);
      currentDate.setHours(8, 0, 0, 0);
      continue;
    }
    
    const startDate = currentDate.toISOString().split('T')[0];
    
    // Récupérer les tâches existantes pour ce jour
    const { data: existingTasks } = await supabase
      .from('employee_schedule')
      .select('start_datetime, end_datetime')
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .gte('start_datetime', `${startDate}T00:00:00.000Z`)
      .lte('start_datetime', `${startDate}T23:59:59.999Z`)
      .neq('status', 'Terminé')
      .order('start_datetime', { ascending: true });
    
    // Chercher un créneau matin (8h-12h) et soir (14h-18h)
    const morningSlot = findSlotInPeriod(currentDate, existingTasks || [], 8, 12, durationMs);
    const eveningSlot = findSlotInPeriod(currentDate, existingTasks || [], 14, 18, durationMs);
    
    if (morningSlot) {
      slots.push({
        start: morningSlot.start.toISOString(),
        end: morningSlot.end.toISOString(),
        period: 'matin',
        day: daysProcessed + 1
      });
    }
    
    if (eveningSlot) {
      slots.push({
        start: eveningSlot.start.toISOString(),
        end: eveningSlot.end.toISOString(),
        period: 'soir',
        day: daysProcessed + 1
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
    currentDate.setHours(8, 0, 0, 0);
    daysProcessed++;
  }
  
  return slots.slice(0, 4); // S'assurer qu'on retourne max 4 créneaux
}

// Helper pour trouver un créneau dans une période spécifique
function findSlotInPeriod(
  date: Date,
  existingTasks: Array<{ start_datetime: string; end_datetime: string }>,
  periodStart: number,
  periodEnd: number,
  durationMs: number
): { start: Date; end: Date } | null {
  const proposedStart = new Date(date);
  proposedStart.setHours(periodStart, 0, 0, 0);
  
  const periodEndTime = new Date(date);
  periodEndTime.setHours(periodEnd, 0, 0, 0);
  
  const proposedEnd = new Date(proposedStart.getTime() + durationMs);
  
  // Vérifier que le créneau reste dans la période
  if (proposedEnd > periodEndTime) {
    return null;
  }
  
  // Vérifier qu'il n'y a pas de conflit avec les tâches existantes
  for (const task of existingTasks) {
    const taskStart = new Date(task.start_datetime);
    const taskEnd = new Date(task.end_datetime);
    
    // Vérifier si le créneau proposé chevauche une tâche existante
    if (proposedStart < taskEnd && proposedEnd > taskStart) {
      return null;
    }
  }
  
  return { start: proposedStart, end: proposedEnd };
}

// Helper function pour trouver le prochain créneau disponible pour un employé
async function findNextAvailableSlotForEmployee(
  supabase: any,
  userId: string,
  companyId: string,
  durationMs: number
): Promise<{ startTime: Date; endTime: Date }> {
  const now = new Date();
  let currentDate = new Date();
  
  // Si on est en cours de journée, utiliser l'heure actuelle + 30 minutes comme minimum
  // Si on est après 17h, commencer demain à 8h
  if (now.getHours() >= 17) {
    currentDate.setDate(currentDate.getDate() + 1);
    currentDate.setHours(8, 0, 0, 0);
  } else {
    // Utiliser l'heure actuelle arrondie à la prochaine demi-heure
    const minutes = now.getMinutes();
    let nextSlot = new Date(now);
    if (minutes < 30) {
      nextSlot.setMinutes(30, 0, 0);
    } else {
      nextSlot.setHours(nextSlot.getHours() + 1, 0, 0, 0);
    }
    currentDate = nextSlot;
  }
  
  let maxAttempts = 7;
  
  while (maxAttempts > 0) {
    // Éviter les weekends
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }
    
    const startDate = currentDate.toISOString().split('T')[0];
    console.log(`🔍 Recherche créneau pour employé ${userId} le ${startDate}`);

    // Récupérer TOUTES les tâches existantes pour cet employé ce jour-là (pas seulement celles qui commencent ce jour-là)
    const { data: existingTasks, error } = await supabase
      .from('employee_schedule')
      .select('start_datetime, end_datetime')
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .or(`and(start_datetime.gte.${startDate}T00:00:00.000Z,start_datetime.lt.${startDate}T23:59:59.999Z),and(end_datetime.gte.${startDate}T00:00:00.000Z,end_datetime.lt.${startDate}T23:59:59.999Z),and(start_datetime.lt.${startDate}T00:00:00.000Z,end_datetime.gt.${startDate}T23:59:59.999Z)`)
      .neq('status', 'Terminé') // Exclure seulement les tâches terminées
      .order('start_datetime', { ascending: true });

    if (error) {
      console.error('Error fetching existing tasks:', error);
      // En cas d'erreur, utiliser l'heure actuelle + 1 heure comme fallback sécurisé
      const fallbackStart = new Date();
      fallbackStart.setHours(fallbackStart.getHours() + 1);
      return {
        startTime: fallbackStart,
        endTime: new Date(fallbackStart.getTime() + durationMs)
      };
    }

    // Pour le jour actuel, utiliser l'heure calculée plus tôt, sinon 8h
    const workStartTime = new Date(currentDate);
    if (currentDate.toDateString() !== new Date().toDateString()) {
      workStartTime.setHours(8, 0, 0, 0); // Jour futur = 8h
    }
    // Sinon on garde l'heure calculée dans currentDate
    
    const workEndTime = new Date(currentDate);
    workEndTime.setHours(18, 20, 0, 0); // Fermeture à 18h20 maximum
    
    // Vérifier que la tâche peut se terminer avant la fermeture
    const latestPossibleStart = new Date(workEndTime.getTime() - durationMs);
    
    // Période de pause repas
    const lunchStartTime = new Date(currentDate);
    lunchStartTime.setHours(12, 0, 0, 0);
    
    const lunchEndTime = new Date(currentDate);
    lunchEndTime.setHours(14, 0, 0, 0);

    console.log(`📅 Vérification des créneaux pour le ${startDate}, tâches existantes: ${existingTasks?.length || 0}`);

    // Si pas de tâches ce jour-là, chercher le premier créneau libre (en évitant la pause repas)
    if (!existingTasks || existingTasks.length === 0) {
      let proposedStart = new Date(workStartTime);
      let proposedEnd = new Date(proposedStart.getTime() + durationMs);
      
      // Vérifier si la tâche peut se terminer avant la fermeture
      if (proposedEnd > workEndTime) {
        console.log(`⚠️ Tâche trop tardive pour le ${startDate}, programmée pour le jour suivant`);
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }
      
      // Vérifier si le créneau entre en conflit avec la pause repas
      if (proposedStart < lunchEndTime && proposedEnd > lunchStartTime) {
        // Si le créneau proposé chevauche avec la pause, le décaler après la pause
        proposedStart = new Date(lunchEndTime);
        proposedEnd = new Date(proposedStart.getTime() + durationMs);
        
        // Re-vérifier si la nouvelle heure de fin dépasse la fermeture
        if (proposedEnd > workEndTime) {
          console.log(`⚠️ Tâche après pause trop tardive pour le ${startDate}, programmée pour le jour suivant`);
          currentDate.setDate(currentDate.getDate() + 1);
          continue;
        }
      }
      
      if (proposedEnd <= workEndTime) {
        console.log(`✅ Aucune tâche existante, créneau libre à ${proposedStart.getHours()}:${proposedStart.getMinutes().toString().padStart(2, '0')} le ${startDate}`);
        return {
          startTime: proposedStart,
          endTime: proposedEnd
        };
      }
    } else {
      // Créer une liste de tous les créneaux occupés
      const busySlots = existingTasks
        .map((task: any) => ({
          start: new Date(task.start_datetime),
          end: new Date(task.end_datetime)
        }))
        .filter((slot: { start: Date; end: Date }) => {
          // Filtrer les créneaux qui intersectent avec notre journée de travail
          const dayStart = new Date(currentDate);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(currentDate);
          dayEnd.setHours(23, 59, 59, 999);
          
          return slot.start < dayEnd && slot.end > dayStart;
        })
        .sort((a: { start: Date; end: Date }, b: { start: Date; end: Date }) => a.start.getTime() - b.start.getTime());

      console.log(`🔍 Créneaux occupés détectés: ${busySlots.length}`);
      
      // Chercher un créneau libre en parcourant la journée
      // S'assurer que proposedStart n'est pas dans le passé
      let proposedStart = new Date(Math.max(workStartTime.getTime(), currentDate.getTime()));
      let foundSlot = false;

      // Vérifier si on peut placer la tâche avant la première tâche existante
      if (busySlots.length > 0) {
        const firstBusySlot = busySlots[0];
        let proposedEnd = new Date(proposedStart.getTime() + durationMs);
        
        // Vérifier si le créneau proposé chevauche avec la pause repas
        if (proposedStart < lunchEndTime && proposedEnd > lunchStartTime) {
          // Si le créneau chevauche avec la pause, essayer après la pause
          proposedStart = new Date(lunchEndTime);
          proposedEnd = new Date(proposedStart.getTime() + durationMs);
        }
        
        if (proposedEnd <= firstBusySlot.start && proposedStart >= workStartTime && proposedEnd <= workEndTime) {
          console.log(`✅ Créneau libre trouvé avant la première tâche: ${proposedStart.getHours()}:${proposedStart.getMinutes().toString().padStart(2, '0')}`);
          return {
            startTime: proposedStart,
            endTime: proposedEnd
          };
        }
      }

      // Chercher un créneau entre les tâches existantes
      for (let i = 0; i < busySlots.length - 1; i++) {
        const currentSlotEnd = busySlots[i].end;
        const nextSlotStart = busySlots[i + 1].start;
        
        // Ajouter un buffer de 5 minutes après la fin de la tâche précédente
        proposedStart = new Date(currentSlotEnd.getTime() + 5 * 60 * 1000);
        let proposedEnd = new Date(proposedStart.getTime() + durationMs);
        
        // Vérifier si le créneau proposé chevauche avec la pause repas
        if (proposedStart < lunchEndTime && proposedEnd > lunchStartTime) {
          // Si le créneau chevauche avec la pause, essayer après la pause
          if (currentSlotEnd <= lunchStartTime) {
            // La tâche précédente se termine avant la pause, commencer après la pause
            proposedStart = new Date(lunchEndTime.getTime() + 5 * 60 * 1000);
            proposedEnd = new Date(proposedStart.getTime() + durationMs);
          } else {
            // La tâche précédente se termine pendant ou après la pause, continuer normalement
            proposedStart = new Date(currentSlotEnd.getTime() + 5 * 60 * 1000);
            proposedEnd = new Date(proposedStart.getTime() + durationMs);
          }
        }
        
        // Vérifier si le créneau proposé rentre dans l'espace disponible et ne dépasse pas la fermeture
        if (proposedEnd <= nextSlotStart && proposedStart >= workStartTime && proposedEnd <= workEndTime) {
          console.log(`✅ Créneau libre trouvé entre les tâches: ${proposedStart.getHours()}:${proposedStart.getMinutes().toString().padStart(2, '0')}`);
          return {
            startTime: proposedStart,
            endTime: proposedEnd
          };
        }
      }

      // Chercher un créneau après la dernière tâche
      if (busySlots.length > 0) {
        const lastBusySlot = busySlots[busySlots.length - 1];
        proposedStart = new Date(lastBusySlot.end.getTime() + 5 * 60 * 1000);
        let proposedEnd = new Date(proposedStart.getTime() + durationMs);
        
        // Vérifier si le créneau proposé chevauche avec la pause repas
        if (proposedStart < lunchEndTime && proposedEnd > lunchStartTime) {
          // Si le créneau chevauche avec la pause, essayer après la pause
          proposedStart = new Date(lunchEndTime.getTime() + 5 * 60 * 1000);
          proposedEnd = new Date(proposedStart.getTime() + durationMs);
        }
        
        // Vérifier si la tâche peut se terminer avant la fermeture
        if (proposedStart >= workStartTime && proposedEnd <= workEndTime) {
          console.log(`✅ Créneau libre trouvé après la dernière tâche: ${proposedStart.getHours()}:${proposedStart.getMinutes().toString().padStart(2, '0')}`);
          return {
            startTime: proposedStart,
            endTime: proposedEnd
          };
        }
      }
    }
    
    // Passer au jour suivant
    currentDate.setDate(currentDate.getDate() + 1);
    currentDate.setHours(8, 0, 0, 0);
    maxAttempts--;
  }
  
  // Fallback si aucun créneau trouvé
  console.log('⚠️ Aucun créneau libre trouvé, utilisation du fallback');
  const fallbackStart = new Date();
  fallbackStart.setHours(fallbackStart.getHours() + 1);
  return {
    startTime: fallbackStart,
    endTime: new Date(fallbackStart.getTime() + durationMs)
  };
}
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Horaires de travail
const WORKING_HOURS = {
  START: 8, // 8h
  END: 18,  // 18h
  WORKING_DAYS: [1, 2, 3, 4, 5] // Lundi à vendredi (0 = dimanche)
};

interface TaskConflict {
  id: string;
  task_type: string;
  start_datetime: string;
  end_datetime: string;
  user_id: string;
  vehicle_id: string;
  status: string;
}

interface ShiftedTask {
  id: string;
  task_type: string;
  old_start: string;
  new_start: string;
  employee_name: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { plaque, nom, prenom, heure, employeId, companyId } = await req.json();

    if (!plaque || !nom || !prenom || !heure || !employeId || !companyId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Données manquantes' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('🚨 PRIORITY: Creating emergency vehicle:', { plaque, nom, prenom, heure, employeId, companyId });

    // 1. Validate employee exists and get user_id
    const { data: userCompany, error: userCompanyError } = await supabase
      .from('user_companies')
      .select('user_id, role, active')
      .eq('id', employeId)
      .eq('company_id', companyId)
      .eq('active', true)
      .maybeSingle();

    if (userCompanyError || !userCompany) {
      console.error('❌ Employee validation failed:', userCompanyError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Employé non valide ou inactif' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const actualUserId = userCompany.user_id;
    console.log('✅ Employee validated:', actualUserId);

    // 2. Check if employee has a task in progress
    const { data: currentTask, error: currentTaskError } = await supabase
      .from('employee_schedule')
      .select('id, task_type, start_datetime, real_start_datetime')
      .eq('user_id', actualUserId)
      .eq('company_id', companyId)
      .eq('status', 'En cours')
      .maybeSingle();

    if (currentTaskError) {
      console.error('❌ Error checking current task:', currentTaskError);
    }

    let pausedTaskId = null;
    if (currentTask) {
      console.log(`⏸️ Employee has a task in progress: ${currentTask.task_type}`);
      // Store the ID but we'll update it after creating the emergency task
      pausedTaskId = currentTask.id;
    }

    // 3. Calculate the emergency time slot with working hours validation
    const now = new Date();
    const [hours, minutes] = heure.split(':').map(Number);
    
    let emergencyStart = new Date(now);
    emergencyStart.setHours(hours, minutes, 0, 0);
    
    // Validate working hours and days
    emergencyStart = validateWorkingTime(emergencyStart);
    
    console.log(`🎯 Emergency time slot (validated): ${emergencyStart.toLocaleString()}`);
    
    // Emergency task duration (1 hour for "Accueil & Préparation du dossier")
    let emergencyEnd = new Date(emergencyStart);
    emergencyEnd.setHours(emergencyStart.getHours() + 1);
    
    // Check if the task would end after working hours
    if (emergencyEnd.getHours() > WORKING_HOURS.END || 
        (emergencyEnd.getHours() === WORKING_HOURS.END && emergencyEnd.getMinutes() > 0)) {
      console.log(`⏰ Emergency task would end at ${emergencyEnd.toLocaleTimeString()}, adjusting to next working day`);
      // Move to next working day
      emergencyStart = getNextWorkingDay(emergencyStart);
      emergencyEnd = new Date(emergencyStart);
      emergencyEnd.setHours(emergencyStart.getHours() + 1);
    }

    console.log('🎯 Final emergency time slot:', {
      start: emergencyStart.toISOString(),
      end: emergencyEnd.toISOString()
    });

    // 4. Find conflicting tasks for the same employee on the same day and analyze availability
    const dayStart = new Date(emergencyStart);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(emergencyStart);
    dayEnd.setHours(23, 59, 59, 999);

    const { data: existingTasks, error: tasksError } = await supabase
      .from('employee_schedule')
      .select('id, task_type, start_datetime, end_datetime, real_end_datetime, user_id, vehicle_id, status')
      .eq('user_id', actualUserId)
      .eq('company_id', companyId)
      .gte('start_datetime', dayStart.toISOString())
      .lte('start_datetime', dayEnd.toISOString())
      .in('status', ['En attente', 'En cours'])
      .order('start_datetime', { ascending: true });

    if (tasksError) {
      console.error('❌ Error fetching existing tasks:', tasksError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Erreur lors de la vérification des tâches existantes' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`📋 Found ${existingTasks?.length || 0} existing tasks for employee`);

    // 5. EMERGENCY PRIORITY: Always use the exact requested time, never adapt
    const taskDuration = 60 * 60 * 1000; // 1 hour in milliseconds
    let finalEmergencyStart = emergencyStart; // ALWAYS use the exact requested time
    
    console.log(`🚨 EMERGENCY PRIORITY: Vehicle will be placed at EXACT requested time: ${finalEmergencyStart.toLocaleString()}`);
    console.log(`🔄 Any conflicting tasks will be shifted automatically`);
    
    if (existingTasks && existingTasks.length > 0) {
      console.log(`📋 Found ${existingTasks.length} existing tasks - checking for conflicts to shift`);
    } else {
      console.log(`✅ No existing tasks, emergency can be scheduled at requested time`);
    }

    // 6. Identify conflicts and calculate shifts based on final emergency time
    const conflictingTasks: TaskConflict[] = [];
    const shiftedTasks: ShiftedTask[] = [];
    const finalEmergencyEnd = new Date(finalEmergencyStart.getTime() + taskDuration);

    if (existingTasks) {
      for (const task of existingTasks) {
        const taskStart = new Date(task.start_datetime);
        const taskEnd = task.real_end_datetime ? 
          new Date(task.real_end_datetime) : 
          new Date(task.end_datetime);

        // Check if task overlaps with emergency slot
        const hasConflict = (taskStart < finalEmergencyEnd && taskEnd > finalEmergencyStart);
        
        if (hasConflict) {
          conflictingTasks.push(task);
          console.log(`⚠️ Conflict detected with task: ${task.task_type} (${task.start_datetime} - ${task.end_datetime})`);
        }
      }
    }

    // 7. Create client and vehicle first
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .insert({
        first_name: prenom,
        last_name: nom,
        company_id: companyId
      })
      .select()
      .single();

    if (clientError) {
      console.error('❌ Error creating client:', clientError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Erreur lors de la création du client: ${clientError.message}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { data: vehicleData, error: vehicleError } = await supabase
      .from('vehicles')
      .insert({
        license_plate: plaque.toUpperCase(),
        client_id: clientData.id,
        company_id: companyId,
        status: 'En attente'
      })
      .select()
      .single();

    if (vehicleError) {
      console.error('❌ Error creating vehicle:', vehicleError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Erreur lors de la création du véhicule: ${vehicleError.message}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Client and vehicle created successfully');

    // 8. Shift conflicting tasks
    if (conflictingTasks.length > 0) {
      console.log(`🔄 Shifting ${conflictingTasks.length} conflicting tasks...`);
      
      // Find the end time of the emergency task as the start point for shifts
      let nextAvailableTime = new Date(finalEmergencyEnd);
      
      // Get employee profile for logging
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', actualUserId)
        .single();

      const employeeName = profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown';

      for (const conflictTask of conflictingTasks) {
        const originalStart = new Date(conflictTask.start_datetime);
        const originalEnd = new Date(conflictTask.end_datetime);
        const taskDuration = originalEnd.getTime() - originalStart.getTime();
        
        // Calculate new end time
        const newEnd = new Date(nextAvailableTime.getTime() + taskDuration);
        
        // Update the task with new times
        const { error: updateError } = await supabase
          .from('employee_schedule')
          .update({
            start_datetime: nextAvailableTime.toISOString(),
            end_datetime: newEnd.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', conflictTask.id);

        if (updateError) {
          console.error(`❌ Error shifting task ${conflictTask.id}:`, updateError);
        } else {
          console.log(`✅ Shifted task ${conflictTask.task_type}: ${originalStart.toLocaleTimeString()} → ${nextAvailableTime.toLocaleTimeString()}`);
          
          shiftedTasks.push({
            id: conflictTask.id,
            task_type: conflictTask.task_type,
            old_start: originalStart.toISOString(),
            new_start: nextAvailableTime.toISOString(),
            employee_name: employeeName
          });
        }
        
        // Next task starts after this one ends
        nextAvailableTime = newEnd;
      }
    }

    // 9. Create the emergency task at the exact requested time with "En cours" status
    const { data: scheduleData, error: scheduleError } = await supabase
      .from('employee_schedule')
      .insert({
        company_id: companyId,
        user_id: actualUserId,
        vehicle_id: vehicleData.id,
        task_type: 'Accueil & Préparation du dossier',
        start_datetime: finalEmergencyStart.toISOString(),
        end_datetime: finalEmergencyEnd.toISOString(),
        status: 'En cours',
        real_start_datetime: new Date().toISOString(),
        is_emergency: true // Mark as emergency to prevent workflow continuation
      })
      .select()
      .single();

    if (scheduleError) {
      console.error('❌ Error creating emergency schedule:', scheduleError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Erreur lors de la création de la tâche d'urgence: ${scheduleError.message}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('🎯 Emergency task created successfully at exact requested time');

    // Now update the paused task with the interrupted_by reference
    if (pausedTaskId) {
      const { error: pauseError } = await supabase
        .from('employee_schedule')
        .update({ 
          status: 'En attente',
          interrupted_by: scheduleData.id,
          waiting_reason: `Mis en pause pour urgence: ${formattedPlaque}`
        })
        .eq('id', pausedTaskId);

      if (pauseError) {
        console.error('❌ Error updating paused task with interrupted_by:', pauseError);
        // Don't fail the whole operation, just log the error
      } else {
        console.log(`✅ Updated paused task ${pausedTaskId} with interrupted_by: ${scheduleData.id}`);
      }
    }

    const response = {
      success: true,
      message: 'Véhicule d\'urgence ajouté avec priorité absolue',
      data: {
        clientId: clientData.id,
        vehicleId: vehicleData.id,
        scheduleId: scheduleData.id,
        pausedTaskId: pausedTaskId,
        emergencyTime: {
          start: finalEmergencyStart.toISOString(),
          end: finalEmergencyEnd.toISOString()
        },
        shiftedTasks: shiftedTasks,
        conflictsResolved: conflictingTasks.length
      }
    };

    console.log('✅ PRIORITY INSERTION COMPLETE:', {
      emergencyTaskId: scheduleData.id,
      tasksShifted: shiftedTasks.length,
      conflictsResolved: conflictingTasks.length
    });

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Erreur inattendue: ${error instanceof Error ? error.message : 'Erreur inconnue'}` 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

/**
 * Valide et ajuste une heure pour respecter les horaires de travail
 */
function validateWorkingTime(date: Date): Date {
  const now = new Date();
  
  console.log(`🕐 Validating working time from: ${date.toLocaleString()}`);
  
  // Si c'est dans le passé, utiliser maintenant comme base
  if (date <= now) {
    console.log(`⏰ Time ${date.toLocaleTimeString()} is in the past, using current time as base`);
    date = new Date(now);
  }
  
  // Si c'est un jour non ouvrable, aller au prochain jour ouvrable
  if (!WORKING_HOURS.WORKING_DAYS.includes(date.getDay())) {
    console.log(`📅 ${date.toLocaleDateString()} is not a working day, moving to next working day`);
    return getNextWorkingDay(date);
  }
  
  // Si c'est avant les heures de travail, commencer à 8h le même jour
  if (date.getHours() < WORKING_HOURS.START) {
    console.log(`⏰ Before working hours, starting at ${WORKING_HOURS.START}h`);
    date.setHours(WORKING_HOURS.START, 0, 0, 0);
    return date;
  }
  
  // Si c'est après les heures de travail, aller au prochain jour ouvrable
  if (date.getHours() >= WORKING_HOURS.END) {
    console.log(`⏰ After working hours, moving to next working day`);
    return getNextWorkingDay(date);
  }
  
  // C'est dans les heures de travail, utiliser l'heure demandée
  console.log(`✅ Within working hours, using requested time`);
  return date;
}

/**
 * Trouve le prochain jour ouvrable à 8h
 */
function getNextWorkingDay(date: Date): Date {
  const nextDay = new Date(date);
  
  do {
    nextDay.setDate(nextDay.getDate() + 1);
  } while (!WORKING_HOURS.WORKING_DAYS.includes(nextDay.getDay()));
  
  nextDay.setHours(WORKING_HOURS.START, 0, 0, 0);
  
  console.log(`📅 Next working day: ${nextDay.toLocaleString()}`);
  return nextDay;
}

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
        'Remplacement ou débosselage': 'Préparation peinture',
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
      return new Response(
        JSON.stringify({ success: true, message: 'Workflow completed' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📋 Next task type determined: ${nextTaskType}`);

    // 3. Récupérer UNIQUEMENT les employés qualifiés et disponibles - PAS DE FALLBACK
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

    console.log(`👤 Selected qualified employee: ${selectedEmployee.user_id} (score: ${selectedEmployee.availability_score || 'N/A'})`);

    // 5. Créer la nouvelle tâche assignée à l'employé qualifié
    const startTime = new Date();
    startTime.setHours(startTime.getHours() + 1); // Commencer dans 1 heure
    
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 2); // Durée estimée: 2 heures
    
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
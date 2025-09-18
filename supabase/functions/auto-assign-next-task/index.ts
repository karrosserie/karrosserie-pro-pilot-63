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
        'Accueil & Préparation du dossier': 'Remplacement ou débosselage',
        'Remplacement ou débosselage': 'Préparation peinture',
        'Préparation peinture': 'Mise en peinture',
        'Mise en peinture': 'Finitions & remontage',
        'Finitions & remontage': 'Clôture & livraison',
        'Clôture & livraison': null // Dernière étape
      };
      
      return workflow[currentTaskType as keyof typeof workflow] || null;
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

    // 3. Vérifier s'il n'y a pas déjà une tâche en cours/attente pour ce véhicule dans cette étape
    const { data: existingTask, error: existingError } = await supabase
      .from('employee_schedule')
      .select('*')
      .eq('company_id', companyId)
      .eq('vehicle_id', completedTask.vehicle_id)
      .eq('task_type', nextTaskType)
      .in('status', ['En attente', 'En cours'])
      .maybeSingle();

    if (existingError) {
      console.error('❌ Error checking existing task:', existingError);
    }

    if (existingTask) {
      console.log(`⚠️ Task already exists for vehicle ${completedTask.vehicle_id} in step ${nextTaskType}`);
      return new Response(
        JSON.stringify({ success: true, message: 'Task already exists for this step' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Récupérer les employés qualifiés et disponibles
    const { data: employees, error: empError } = await supabase
      .rpc('get_available_employees', {
        p_company_id: companyId,
        p_task_type: nextTaskType
      });

    if (empError) {
      console.error('❌ Error fetching employees:', empError);
      // Fallback: récupérer tous les employés de l'entreprise
      const { data: allEmployees, error: allEmpError } = await supabase
        .from('user_companies')
        .select('user_id')
        .eq('company_id', companyId)
        .eq('active', true);
        
      if (allEmpError || !allEmployees || allEmployees.length === 0) {
        console.error('❌ No employees found for company:', companyId);
        return new Response(
          JSON.stringify({ error: 'No available employees' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Sélectionner le premier employé disponible
      const selectedEmployeeId = allEmployees[0].user_id;
      console.log(`👤 Selected employee (fallback): ${selectedEmployeeId}`);
      
      // 5. Créer la nouvelle tâche
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 1); // Commencer dans 1 heure
      
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 2); // Durée estimée: 2 heures
      
      const { data: newTask, error: createError } = await supabase
        .from('employee_schedule')
        .insert({
          company_id: companyId,
          user_id: selectedEmployeeId,
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

      console.log('✅ New task created successfully:', newTask.id);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          nextTaskId: newTask.id,
          nextTaskType,
          assignedEmployeeId: selectedEmployeeId
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Si on a des employés qualifiés, utiliser le premier disponible
    const selectedEmployee = employees && employees.length > 0 ? employees[0] : null;
    
    if (!selectedEmployee) {
      console.log('⚠️ No qualified employees available, task will remain unassigned');
      return new Response(
        JSON.stringify({ success: true, message: 'No qualified employees available' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`👤 Selected qualified employee: ${selectedEmployee.user_id}`);

    // 6. Créer la nouvelle tâche assignée
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

    console.log('✅ New task created and assigned successfully:', newTask.id);
    
    // 7. Créer une notification pour l'employé assigné (optionnel)
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
          reason: 'Auto-assignation'
        });
        
      if (notifError) {
        console.error('⚠️ Error creating notification:', notifError);
      } else {
        console.log('📬 Notification created for employee');
      }
    } catch (notifError) {
      console.error('⚠️ Error in notification creation:', notifError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        nextTaskId: newTask.id,
        nextTaskType,
        assignedEmployeeId: selectedEmployee.user_id
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
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Ordre des étapes de carrosserie
const TASK_ORDER = [
  'Accueil & Préparation du dossier',
  'Remplacement ou débosselage', 
  'Préparation peinture',
  'Mise en peinture',
  'Finitions & remontage',
  'Clôture & livraison'
];

// Horaires de travail
const WORKING_HOURS = {
  START: 8, // 8h
  END: 18,  // 18h
  WORKING_DAYS: [1, 2, 3, 4, 5] // Lundi à vendredi (0 = dimanche)
};

// Mapping des types de tâches vers les IDs de qualifications
const TASK_TO_QUALIFICATION_MAP = {
  'Accueil & Préparation du dossier': 'accueil',
  'Remplacement ou débosselage': 'remplacement',
  'Préparation peinture': 'preparation',
  'Mise en peinture': 'peinture', 
  'Finitions & remontage': 'finitions',
  'Clôture & livraison': 'cloture'
};

interface EmployeeSchedule {
  id: string;
  task_type: string;
  status: string;
  vehicle_id: string;
  company_id: string;
  start_datetime: string;
  end_datetime: string;
  user_id: string;
  real_end_datetime: string | null;
}

interface Employee {
  user_id: string;
  qualifications: string[];
  profiles: {
    first_name: string;
    last_name: string;
  };
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

    const { taskId, companyId } = await req.json();

    console.log(`🚀 Auto-assigning next task for taskId: ${taskId}, companyId: ${companyId}`);

    // 1. Récupérer la tâche terminée
    const { data: completedTask, error: taskError } = await supabase
      .from('employee_schedule')
      .select('*')
      .eq('id', taskId)
      .single();

    if (taskError || !completedTask) {
      console.error('❌ Task not found:', taskError);
      return new Response(
        JSON.stringify({ error: 'Task not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`📝 Completed task: ${completedTask.task_type}`);

    // 2. Déterminer l'étape suivante
    const currentTaskIndex = TASK_ORDER.indexOf(completedTask.task_type);
    
    if (currentTaskIndex === -1) {
      console.log('⚠️ Task type not in workflow or is Absence');
      return new Response(
        JSON.stringify({ message: 'Task type not in workflow' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (currentTaskIndex === TASK_ORDER.length - 1) {
      console.log('✅ This was the final task in the workflow');
      return new Response(
        JSON.stringify({ message: 'Workflow completed' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const nextTaskType = TASK_ORDER[currentTaskIndex + 1];
    const requiredQualification = TASK_TO_QUALIFICATION_MAP[nextTaskType];
    
    console.log(`➡️ Next task: ${nextTaskType}, required qualification: ${requiredQualification}`);

    // 3. Trouver les employés avec les bonnes qualifications
    const { data: userCompanies, error: employeesError } = await supabase
      .from('user_companies')
      .select('user_id, qualifications')
      .eq('company_id', companyId)
      .eq('active', true);

    if (employeesError || !userCompanies) {
      console.error('❌ Error fetching employees:', employeesError);
      return new Response(
        JSON.stringify({ error: 'Error fetching employees' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Récupérer les profils séparément
    const userIds = userCompanies.map(uc => uc.user_id);
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', userIds);

    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
      return new Response(
        JSON.stringify({ error: 'Error fetching profiles' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Combiner les données
    const employees = userCompanies.map(uc => {
      const profile = profiles?.find(p => p.id === uc.user_id);
      return {
        user_id: uc.user_id,
        qualifications: uc.qualifications,
        profiles: profile ? {
          first_name: profile.first_name,
          last_name: profile.last_name
        } : null
      };
    });

    // Filtrer les employés ayant la qualification requise
    const qualifiedEmployees = employees.filter((employee: any) => 
      employee.qualifications && 
      employee.qualifications.includes(requiredQualification)
    );

    if (qualifiedEmployees.length === 0) {
      console.log(`⚠️ No employees found with qualification: ${requiredQualification}`);
      return new Response(
        JSON.stringify({ 
          error: `No employees available with required qualification: ${nextTaskType}`,
          nextTaskType,
          requiredQualification
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`👥 Found ${qualifiedEmployees.length} qualified employees`);

    // 4. Trouver l'employé disponible le plus tôt
    let selectedEmployee = null;
    let earliestAvailableTime = null;

    for (const employee of qualifiedEmployees) {
      // Récupérer les tâches actuelles de cet employé
      const { data: employeeTasks } = await supabase
        .from('employee_schedule')
        .select('start_datetime, end_datetime, status')
        .eq('user_id', employee.user_id)
        .eq('company_id', companyId)
        .in('status', ['En attente', 'En cours'])
        .order('end_datetime', { ascending: false });

      // Calculer le temps de disponibilité en respectant les horaires de travail
      let availableTime = calculateNextWorkingSlot(new Date().getTime()); // Maintenant par défaut, mais en respectant les horaires
      
      if (employeeTasks && employeeTasks.length > 0) {
        // L'employé sera disponible après sa dernière tâche, mais en respectant les horaires de travail
        const lastTask = employeeTasks[0];
        const lastTaskEndTime = new Date(lastTask.end_datetime);
        availableTime = calculateNextWorkingSlot(lastTaskEndTime.getTime());
      }

      console.log(`👤 Employee ${employee.profiles?.first_name} ${employee.profiles?.last_name} available at: ${availableTime.toISOString()}`);

      if (!earliestAvailableTime || availableTime < earliestAvailableTime) {
        earliestAvailableTime = availableTime;
        selectedEmployee = employee;
      }
    }

    if (!selectedEmployee) {
      console.error('❌ No employee selected');
      return new Response(
        JSON.stringify({ error: 'No employee could be selected' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`✅ Selected employee: ${selectedEmployee.profiles?.first_name} ${selectedEmployee.profiles?.last_name}`);

    // 5. Calculer les heures de la nouvelle tâche en respectant les horaires de travail
    let taskStartTime = calculateNextWorkingSlot(Math.max(
      earliestAvailableTime.getTime(),
      new Date().getTime() // Ne peut pas commencer dans le passé
    ));
    
    // Durée estimée par défaut (2h, peut être personnalisée selon le type de tâche)
    const taskDurationHours = getTaskDuration(nextTaskType);
    let taskEndTime = new Date(taskStartTime.getTime() + (taskDurationHours * 60 * 60 * 1000));

    // Vérifier si la tâche se termine après les heures de travail
    if (taskEndTime.getHours() > WORKING_HOURS.END || 
        (taskEndTime.getHours() === WORKING_HOURS.END && taskEndTime.getMinutes() > 0)) {
      console.log(`⏰ Task would end at ${taskEndTime.toLocaleTimeString()}, moving to next working day`);
      // Déplacer au jour ouvrable suivant
      taskStartTime = getNextWorkingDay(taskStartTime);
      taskStartTime.setHours(WORKING_HOURS.START, 0, 0, 0);
      taskEndTime = new Date(taskStartTime.getTime() + (taskDurationHours * 60 * 60 * 1000));
    }

    console.log(`📅 Task scheduled: ${taskStartTime.toLocaleString()} - ${taskEndTime.toLocaleString()}`);

    // 6. Créer la nouvelle tâche
    const { data: newTask, error: createError } = await supabase
      .from('employee_schedule')
      .insert({
        company_id: companyId,
        vehicle_id: completedTask.vehicle_id,
        task_type: nextTaskType,
        user_id: selectedEmployee.user_id,
        start_datetime: taskStartTime.toISOString(),
        end_datetime: taskEndTime.toISOString(),
        status: 'En attente'
      })
      .select()
      .single();

    if (createError) {
      console.error('❌ Error creating new task:', createError);
      return new Response(
        JSON.stringify({ error: 'Error creating new task', details: createError }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`🎯 New task created with ID: ${newTask.id}`);

    // 7. Supprimer la tâche terminée du planning
    const { error: deleteError } = await supabase
      .from('employee_schedule')
      .delete()
      .eq('id', taskId);

    if (deleteError) {
      console.error('⚠️ Error deleting completed task:', deleteError);
      // On continue même si la suppression échoue car la nouvelle tâche est créée
    } else {
      console.log(`🗑️ Completed task ${taskId} removed from schedule`);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        completedTask: completedTask.task_type,
        removedTaskId: taskId,
        nextTask: {
          id: newTask.id,
          type: nextTaskType,
          assignedTo: `${selectedEmployee.profiles?.first_name} ${selectedEmployee.profiles?.last_name}`,
          startTime: taskStartTime.toISOString(),
          endTime: taskEndTime.toISOString()
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function getTaskDuration(taskType: string): number {
  // Durées par défaut en heures (peuvent être personnalisées)
  const durations = {
    'Accueil & Préparation du dossier': 1,
    'Remplacement ou débosselage': 2.5,
    'Préparation peinture': 2.5, 
    'Mise en peinture': 5,
    'Finitions & remontage': 2,
    'Clôture & livraison': 0.5
  };
  
  return durations[taskType] || 2; // 2h par défaut
}

/**
 * Calcule le prochain créneau de travail disponible
 */
function calculateNextWorkingSlot(timestamp: number): Date {
  const date = new Date(timestamp);
  
  console.log(`🕐 Calculating next working slot from: ${date.toLocaleString()}`);
  
  // Si c'est un jour non ouvrable, aller au prochain jour ouvrable à 8h
  if (!WORKING_HOURS.WORKING_DAYS.includes(date.getDay())) {
    console.log(`📅 ${date.toLocaleDateString()} is not a working day, moving to next working day`);
    return getNextWorkingDay(date);
  }
  
  // Si c'est avant 8h, commencer à 8h le même jour
  if (date.getHours() < WORKING_HOURS.START) {
    console.log(`⏰ Before working hours, starting at ${WORKING_HOURS.START}h`);
    date.setHours(WORKING_HOURS.START, 0, 0, 0);
    return date;
  }
  
  // Si c'est après 18h, aller au prochain jour ouvrable à 8h
  if (date.getHours() >= WORKING_HOURS.END) {
    console.log(`⏰ After working hours, moving to next working day`);
    return getNextWorkingDay(date);
  }
  
  // C'est dans les heures de travail, utiliser l'heure actuelle
  console.log(`✅ Within working hours, using current time`);
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
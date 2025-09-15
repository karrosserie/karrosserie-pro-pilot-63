import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TaskToReschedule {
  id: string;
  user_id: string;
  vehicle_id: string;
  task_type: string;
  start_datetime: string;
  end_datetime: string;
  company_id: string;
}

interface ConflictingTask {
  id: string;
  start_datetime: string;
  end_datetime: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Format dates for SQL queries (YYYY-MM-DD)
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    console.log(`🔄 Starting task rescheduling for ${yesterdayStr}`);

    // Get all uncompleted tasks from yesterday and before (excluding tasks with waiting_reason)
    const { data: pendingTasks, error: tasksError } = await supabase
      .from('employee_schedule')
      .select('*')
      .in('status', ['En attente', 'En cours'])
      .lt('start_datetime', `${todayStr}T00:00:00.000Z`)
      .is('waiting_reason', null) // Exclure les tâches en attente avec raison
      .order('start_datetime', { ascending: true });

    if (tasksError) {
      console.error('❌ Error fetching pending tasks:', tasksError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch pending tasks' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!pendingTasks || pendingTasks.length === 0) {
      console.log('✅ No pending tasks to reschedule');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No pending tasks to reschedule',
          rescheduledTasks: []
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📋 Found ${pendingTasks.length} pending tasks to reschedule`);

    const rescheduledTasks = [];
    const companiesProcessed = new Set();

    // Group tasks by company to process them efficiently
    const tasksByCompany = pendingTasks.reduce((acc, task) => {
      if (!acc[task.company_id]) {
        acc[task.company_id] = [];
      }
      acc[task.company_id].push(task);
      return acc;
    }, {} as Record<string, TaskToReschedule[]>);

    // Process each company's tasks
    for (const [companyId, companyTasks] of Object.entries(tasksByCompany)) {
      console.log(`🏢 Processing ${companyTasks.length} tasks for company ${companyId}`);
      
      // Get next working day start time (8:00 AM), skip weekends
      const nextWorkingDay = getNextWorkingDay(today);
      nextWorkingDay.setHours(8, 0, 0, 0);
      
      let currentTime = new Date(nextWorkingDay);

      // Process tasks in chronological order
      for (const task of companyTasks) {
        try {
          // Calculate task duration
          const originalStart = new Date(task.start_datetime);
          const originalEnd = new Date(task.end_datetime);
          const durationMs = originalEnd.getTime() - originalStart.getTime();

          // Find next available slot
          const newStartTime = await findNextAvailableSlot(
            supabase,
            task.user_id,
            currentTime,
            durationMs,
            companyId
          );

          const newEndTime = new Date(newStartTime.getTime() + durationMs);

          // Update the task
          const { error: updateError } = await supabase
            .from('employee_schedule')
            .update({
              start_datetime: newStartTime.toISOString(),
              end_datetime: newEndTime.toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', task.id);

          if (updateError) {
            console.error(`❌ Error updating task ${task.id}:`, updateError);
            continue;
          }

          rescheduledTasks.push({
            taskId: task.id,
            taskType: task.task_type,
            originalStart: task.start_datetime,
            newStart: newStartTime.toISOString(),
            newEnd: newEndTime.toISOString(),
            userId: task.user_id,
            vehicleId: task.vehicle_id
          });

          // Update current time for next task placement
          currentTime = new Date(newEndTime.getTime() + 5 * 60 * 1000); // Add 5 minutes buffer

          console.log(`✅ Rescheduled task ${task.id} from ${task.start_datetime} to ${newStartTime.toISOString()}`);

        } catch (error) {
          console.error(`❌ Error processing task ${task.id}:`, error);
          continue;
        }
      }

      companiesProcessed.add(companyId);
    }

    console.log(`🎉 Successfully rescheduled ${rescheduledTasks.length} tasks for ${companiesProcessed.size} companies`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully rescheduled ${rescheduledTasks.length} tasks`,
        rescheduledTasks,
        companiesProcessed: Array.from(companiesProcessed)
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Unexpected error in reschedule-pending-tasks:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function findNextAvailableSlot(
  supabase: any,
  userId: string,
  startFrom: Date,
  durationMs: number,
  companyId: string
): Promise<Date> {
  const startDate = startFrom.toISOString().split('T')[0];
  const endDate = new Date(startFrom.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Get existing tasks for the employee on the target day
  const { data: existingTasks, error } = await supabase
    .from('employee_schedule')
    .select('start_datetime, end_datetime')
    .eq('user_id', userId)
    .eq('company_id', companyId)
    .gte('start_datetime', `${startDate}T00:00:00.000Z`)
    .lt('start_datetime', `${endDate}T23:59:59.999Z`)
    .order('start_datetime', { ascending: true });

  if (error) {
    console.error('Error fetching existing tasks:', error);
    return startFrom;
  }

  if (!existingTasks || existingTasks.length === 0) {
    return startFrom;
  }

  // Find first available slot
  let proposedStart = new Date(startFrom);
  
  for (const existingTask of existingTasks) {
    const existingStart = new Date(existingTask.start_datetime);
    const existingEnd = new Date(existingTask.end_datetime);
    const proposedEnd = new Date(proposedStart.getTime() + durationMs);

    // Check if proposed slot conflicts with existing task
    if (proposedStart < existingEnd && proposedEnd > existingStart) {
      // Move proposed start to after the existing task ends
      proposedStart = new Date(existingEnd.getTime() + 5 * 60 * 1000); // 5 minutes buffer
    }
  }

  return proposedStart;
}

function getNextWorkingDay(fromDate: Date): Date {
  const nextDay = new Date(fromDate);
  nextDay.setDate(nextDay.getDate() + 1);
  
  // Si c'est samedi (6), aller à lundi (+2 jours)
  // Si c'est dimanche (0), aller à lundi (+1 jour)
  const dayOfWeek = nextDay.getDay();
  if (dayOfWeek === 6) { // Samedi
    nextDay.setDate(nextDay.getDate() + 2);
  } else if (dayOfWeek === 0) { // Dimanche
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return nextDay;
}
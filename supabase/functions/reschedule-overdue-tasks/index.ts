import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('🔄 Starting overdue tasks rescheduling...')

    // Trouver toutes les tâches en retard (end_datetime dans le passé et status != 'Terminé')
    const now = new Date().toISOString()
    
    const { data: overdueTasks, error: overdueError } = await supabase
      .from('employee_schedule')
      .select(`
        id,
        start_datetime,
        end_datetime,
        status,
        task_type,
        user_id,
        vehicle_id,
        company_id,
        waiting_reason
      `)
      .lt('end_datetime', now)
      .neq('status', 'Terminé')
      .is('waiting_reason', null) // Éviter de reprendre les tâches déjà mises en attente

    if (overdueError) {
      console.error('❌ Error fetching overdue tasks:', overdueError)
      throw overdueError
    }

    if (!overdueTasks || overdueTasks.length === 0) {
      console.log('✅ No overdue tasks found')
      return new Response(
        JSON.stringify({ message: 'No overdue tasks to reschedule', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`📋 Found ${overdueTasks.length} overdue tasks`)

    // Regrouper par entreprise pour traiter efficacement
    const tasksByCompany = overdueTasks.reduce((acc, task) => {
      if (!acc[task.company_id]) {
        acc[task.company_id] = []
      }
      acc[task.company_id].push(task)
      return acc
    }, {} as Record<string, typeof overdueTasks>)

    let totalRescheduled = 0

    // Traiter chaque entreprise
    for (const [companyId, companyTasks] of Object.entries(tasksByCompany)) {
      console.log(`🏢 Processing ${companyTasks.length} overdue tasks for company ${companyId}`)

      for (const task of companyTasks) {
        try {
          // Calculer la nouvelle plage horaire (reporter au prochain jour ouvrable)
          const originalStart = new Date(task.start_datetime)
          const originalEnd = new Date(task.end_datetime)
          const taskDuration = originalEnd.getTime() - originalStart.getTime()

          // Trouver le prochain créneau disponible
          const nextSlot = await findNextAvailableSlot(supabase, {
            userId: task.user_id,
            companyId: task.company_id,
            duration: taskDuration,
            taskType: task.task_type
          })

          if (nextSlot) {
            // Mettre à jour la tâche avec la nouvelle plage horaire et une priorité élevée
            const { error: updateError } = await supabase
              .from('employee_schedule')
              .update({
                start_datetime: nextSlot.start.toISOString(),
                end_datetime: nextSlot.end.toISOString(),
                waiting_reason: 'Tâche reportée - Priorité élevée',
                updated_at: new Date().toISOString()
              })
              .eq('id', task.id)

            if (updateError) {
              console.error(`❌ Error updating task ${task.id}:`, updateError)
            } else {
              console.log(`✅ Rescheduled task ${task.id} from ${task.start_datetime} to ${nextSlot.start.toISOString()}`)
              totalRescheduled++
            }
          } else {
            // Si aucun créneau disponible, marquer comme en attente avec une priorité élevée
            const { error: updateError } = await supabase
              .from('employee_schedule')
              .update({
                waiting_reason: 'En attente de créneau - Priorité élevée',
                updated_at: new Date().toISOString()
              })
              .eq('id', task.id)

            if (updateError) {
              console.error(`❌ Error marking task ${task.id} as waiting:`, updateError)
            } else {
              console.log(`⏳ Marked task ${task.id} as waiting with high priority`)
              totalRescheduled++
            }
          }
        } catch (error) {
          console.error(`❌ Error processing task ${task.id}:`, error)
        }
      }
    }

    console.log(`🎉 Rescheduled ${totalRescheduled} overdue tasks`)

    return new Response(
      JSON.stringify({ 
        message: `Successfully processed overdue tasks`, 
        totalTasks: overdueTasks.length,
        rescheduled: totalRescheduled,
        companiesProcessed: Object.keys(tasksByCompany).length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Error in reschedule-overdue-tasks function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// Helper function pour trouver le prochain créneau disponible
async function findNextAvailableSlot(
  supabase: any, 
  options: {
    userId: string
    companyId: string
    duration: number
    taskType: string
  }
): Promise<{ start: Date, end: Date } | null> {
  const { userId, companyId, duration, taskType } = options
  
  // Commencer à chercher à partir de demain
  const searchStart = new Date()
  searchStart.setDate(searchStart.getDate() + 1)
  searchStart.setHours(8, 0, 0, 0) // Commencer à 8h

  // Chercher jusqu'à 2 semaines dans le futur
  const searchEnd = new Date(searchStart)
  searchEnd.setDate(searchEnd.getDate() + 14)

  // Récupérer les créneaux existants pour cet employé
  const { data: existingTasks, error } = await supabase
    .from('employee_schedule')
    .select('start_datetime, end_datetime')
    .eq('user_id', userId)
    .eq('company_id', companyId)
    .gte('start_datetime', searchStart.toISOString())
    .lte('end_datetime', searchEnd.toISOString())

  if (error) {
    console.error('Error fetching existing tasks:', error)
    return null
  }

  // Créer des créneaux de travail (8h-18h, lundi-vendredi)
  const workingHours = { start: 8, end: 18 }
  const durationHours = duration / (1000 * 60 * 60)

  for (let day = new Date(searchStart); day <= searchEnd; day.setDate(day.getDate() + 1)) {
    // Ignorer les weekends
    if (day.getDay() === 0 || day.getDay() === 6) continue

    // Chercher un créneau libre dans cette journée
    for (let hour = workingHours.start; hour <= workingHours.end - durationHours; hour += 0.5) {
      const slotStart = new Date(day)
      slotStart.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0)
      
      const slotEnd = new Date(slotStart.getTime() + duration)

      // Vérifier si ce créneau est libre
      const isSlotFree = !existingTasks?.some(task => {
        const taskStart = new Date(task.start_datetime)
        const taskEnd = new Date(task.end_datetime)
        
        return (slotStart < taskEnd && slotEnd > taskStart)
      })

      if (isSlotFree) {
        return { start: slotStart, end: slotEnd }
      }
    }
  }

  return null // Aucun créneau trouvé
}
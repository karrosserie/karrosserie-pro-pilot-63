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

    console.log('🎯 Starting automatic next task assignment...')

    // Trouver les tâches avec priorité élevée en attente
    const { data: priorityTasks, error: priorityError } = await supabase
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
      .like('waiting_reason', '%Priorité élevée%')
      .in('status', ['En attente', 'À planifier'])

    if (priorityError) {
      console.error('❌ Error fetching priority tasks:', priorityError)
      throw priorityError
    }

    if (!priorityTasks || priorityTasks.length === 0) {
      console.log('✅ No priority tasks waiting for assignment')
      return new Response(
        JSON.stringify({ message: 'No priority tasks to assign', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`📋 Found ${priorityTasks.length} priority tasks waiting for assignment`)

    let totalAssigned = 0

    for (const task of priorityTasks) {
      try {
        // Calculer la durée de la tâche
        const originalStart = new Date(task.start_datetime)
        const originalEnd = new Date(task.end_datetime)
        const taskDuration = originalEnd.getTime() - originalStart.getTime()

        // Trouver le prochain créneau disponible immédiatement
        const nextSlot = await findImmediateAvailableSlot(supabase, {
          userId: task.user_id,
          companyId: task.company_id,
          duration: taskDuration,
          taskType: task.task_type
        })

        if (nextSlot) {
          // Mettre à jour la tâche avec le nouveau créneau et retirer la priorité
          const { error: updateError } = await supabase
            .from('employee_schedule')
            .update({
              start_datetime: nextSlot.start.toISOString(),
              end_datetime: nextSlot.end.toISOString(),
              waiting_reason: null, // Retirer la raison d'attente
              status: 'En attente',
              updated_at: new Date().toISOString()
            })
            .eq('id', task.id)

          if (updateError) {
            console.error(`❌ Error updating priority task ${task.id}:`, updateError)
          } else {
            console.log(`✅ Assigned priority task ${task.id} to slot ${nextSlot.start.toISOString()}`)
            totalAssigned++
          }
        }
      } catch (error) {
        console.error(`❌ Error processing priority task ${task.id}:`, error)
      }
    }

    console.log(`🎉 Assigned ${totalAssigned} priority tasks`)

    return new Response(
      JSON.stringify({ 
        message: `Successfully assigned priority tasks`, 
        totalTasks: priorityTasks.length,
        assigned: totalAssigned
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Error in auto-assign-next-task function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// Helper function pour trouver le prochain créneau disponible immédiatement
async function findImmediateAvailableSlot(
  supabase: any, 
  options: {
    userId: string
    companyId: string
    duration: number
    taskType: string
  }
): Promise<{ start: Date, end: Date } | null> {
  const { userId, companyId, duration } = options
  
  // Commencer à chercher maintenant
  const now = new Date()
  const searchStart = new Date()
  
  // Si c'est en dehors des heures de travail, commencer le prochain jour ouvrable
  if (now.getHours() < 8 || now.getHours() >= 18 || now.getDay() === 0 || now.getDay() === 6) {
    searchStart.setDate(searchStart.getDate() + 1)
    while (searchStart.getDay() === 0 || searchStart.getDay() === 6) {
      searchStart.setDate(searchStart.getDate() + 1)
    }
    searchStart.setHours(8, 0, 0, 0)
  }

  // Chercher jusqu'à 1 semaine dans le futur
  const searchEnd = new Date(searchStart)
  searchEnd.setDate(searchEnd.getDate() + 7)

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

    // Pour aujourd'hui, commencer à l'heure actuelle ou 8h si c'est avant
    const startHour = day.toDateString() === now.toDateString() 
      ? Math.max(now.getHours() + (now.getMinutes() > 30 ? 1 : 0.5), workingHours.start)
      : workingHours.start

    // Chercher un créneau libre dans cette journée
    for (let hour = startHour; hour <= workingHours.end - durationHours; hour += 0.5) {
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
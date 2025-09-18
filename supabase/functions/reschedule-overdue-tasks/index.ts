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

          // Insérer la tâche en retard dans le planning et décaler les autres
          const insertionResult = await insertTaskAndShiftSchedule(supabase, {
            taskId: task.id,
            userId: task.user_id,
            companyId: task.company_id,
            duration: taskDuration,
            taskType: task.task_type,
            originalStart: task.start_datetime,
            originalEnd: task.end_datetime
          })

          if (insertionResult.success) {
            console.log(`✅ Inserted and shifted task ${task.id}: ${insertionResult.message}`)
            totalRescheduled++
          } else {
            console.error(`❌ Failed to insert task ${task.id}: ${insertionResult.message}`)
            
            // En cas d'échec, marquer comme en attente avec priorité élevée
            const { error: updateError } = await supabase
              .from('employee_schedule')
              .update({
                waiting_reason: 'En attente de créneau - Priorité élevée',
                updated_at: new Date().toISOString()
              })
              .eq('id', task.id)

            if (!updateError) {
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

// Helper function pour insérer une tâche en retard et décaler le planning existant
async function insertTaskAndShiftSchedule(
  supabase: any, 
  options: {
    taskId: string
    userId: string
    companyId: string
    duration: number
    taskType: string
    originalStart: string
    originalEnd: string
  }
): Promise<{ success: boolean, message: string }> {
  const { taskId, userId, companyId, duration, taskType, originalStart, originalEnd } = options
  
  try {
    // Trouver le prochain créneau de travail (demain 8h ou le prochain jour ouvrable)
    const insertionTime = getNextWorkingSlot()
    const insertionEnd = new Date(insertionTime.getTime() + duration)

    console.log(`🔄 Inserting overdue task ${taskId} at ${insertionTime.toISOString()}`)

    // Récupérer toutes les tâches existantes pour cet employé à partir du point d'insertion
    const { data: tasksToShift, error: fetchError } = await supabase
      .from('employee_schedule')
      .select('id, start_datetime, end_datetime, task_type')
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .gte('start_datetime', insertionTime.toISOString())
      .neq('id', taskId) // Exclure la tâche qu'on est en train de reprogrammer
      .order('start_datetime', { ascending: true })

    if (fetchError) {
      console.error('Error fetching tasks to shift:', fetchError)
      return { success: false, message: `Error fetching tasks: ${fetchError.message}` }
    }

    // Calculer les nouveaux créneaux pour toutes les tâches existantes
    let currentShiftTime = new Date(insertionEnd)
    const updatedTasks = []

    for (const existingTask of tasksToShift || []) {
      const taskDuration = new Date(existingTask.end_datetime).getTime() - new Date(existingTask.start_datetime).getTime()
      
      // Ajuster l'heure si on dépasse les heures de travail ou si c'est un weekend
      currentShiftTime = adjustToWorkingHours(currentShiftTime)
      
      const newStart = new Date(currentShiftTime)
      const newEnd = new Date(currentShiftTime.getTime() + taskDuration)
      
      updatedTasks.push({
        id: existingTask.id,
        start_datetime: newStart.toISOString(),
        end_datetime: newEnd.toISOString()
      })
      
      // Préparer le prochain créneau
      currentShiftTime = new Date(newEnd)
      
      console.log(`📅 Task ${existingTask.id} will be shifted to ${newStart.toISOString()}`)
    }

    // Commencer une transaction pour mettre à jour toutes les tâches
    console.log(`🔄 Updating ${updatedTasks.length + 1} tasks...`)

    // 1. Mettre à jour la tâche en retard avec le nouveau créneau d'insertion
    const { error: overdueUpdateError } = await supabase
      .from('employee_schedule')
      .update({
        start_datetime: insertionTime.toISOString(),
        end_datetime: insertionEnd.toISOString(),
        waiting_reason: null, // Retirer le waiting_reason car la tâche est maintenant programmée
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)

    if (overdueUpdateError) {
      console.error('Error updating overdue task:', overdueUpdateError)
      return { success: false, message: `Error updating overdue task: ${overdueUpdateError.message}` }
    }

    // 2. Mettre à jour toutes les tâches décalées
    for (const updatedTask of updatedTasks) {
      const { error: shiftError } = await supabase
        .from('employee_schedule')
        .update({
          start_datetime: updatedTask.start_datetime,
          end_datetime: updatedTask.end_datetime,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedTask.id)

      if (shiftError) {
        console.error(`Error shifting task ${updatedTask.id}:`, shiftError)
        // Continue avec les autres tâches même si une échoue
      }
    }

    return { 
      success: true, 
      message: `Task inserted at ${insertionTime.toISOString()}, ${updatedTasks.length} tasks shifted`
    }

  } catch (error) {
    console.error('Error in insertTaskAndShiftSchedule:', error)
    return { success: false, message: `Unexpected error: ${error.message}` }
  }
}

// Helper function pour obtenir le prochain créneau de travail
function getNextWorkingSlot(): Date {
  const now = new Date()
  let nextSlot = new Date()
  
  // Si nous sommes en semaine et avant 18h, programmer pour demain 8h
  // Sinon, trouver le prochain jour ouvrable
  if (now.getDay() >= 1 && now.getDay() <= 5 && now.getHours() < 18) {
    nextSlot.setDate(now.getDate() + 1)
  } else {
    // Trouver le prochain lundi
    const daysUntilMonday = (8 - now.getDay()) % 7 || 7
    nextSlot.setDate(now.getDate() + daysUntilMonday)
  }
  
  nextSlot.setHours(8, 0, 0, 0)
  return nextSlot
}

// Helper function pour ajuster une heure aux heures de travail
function adjustToWorkingHours(dateTime: Date): Date {
  const adjusted = new Date(dateTime)
  
  // Si c'est un weekend, passer au lundi suivant
  if (adjusted.getDay() === 0) { // Dimanche
    adjusted.setDate(adjusted.getDate() + 1)
    adjusted.setHours(8, 0, 0, 0)
  } else if (adjusted.getDay() === 6) { // Samedi
    adjusted.setDate(adjusted.getDate() + 2)
    adjusted.setHours(8, 0, 0, 0)
  }
  
  // Si c'est après 18h, passer au jour suivant à 8h
  if (adjusted.getHours() >= 18) {
    adjusted.setDate(adjusted.getDate() + 1)
    adjusted.setHours(8, 0, 0, 0)
    
    // Vérifier à nouveau si le nouveau jour est un weekend
    return adjustToWorkingHours(adjusted)
  }
  
  // Si c'est avant 8h, ajuster à 8h
  if (adjusted.getHours() < 8) {
    adjusted.setHours(8, 0, 0, 0)
  }
  
  return adjusted
}
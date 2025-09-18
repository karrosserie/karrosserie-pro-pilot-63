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
    // Récupérer les horaires de travail de l'entreprise
    const workingHours = await getCompanyWorkingHours(supabase, companyId)
    
    // Trouver le prochain créneau de travail en utilisant les horaires réels
    const insertionTime = await getNextWorkingSlot(workingHours)
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
      currentShiftTime = await adjustToWorkingHours(currentShiftTime, workingHours)
      
      const newStart = new Date(currentShiftTime)
      const newEnd = new Date(currentShiftTime.getTime() + taskDuration)
      
      // Vérifier si la tâche dépasse les heures de travail
      const endOfWorkDay = await getEndOfWorkDay(newStart, workingHours)
      if (newEnd > endOfWorkDay) {
        // Si la tâche dépasse, la reporter au jour suivant
        currentShiftTime = await getNextWorkingSlot(workingHours, newStart)
        const adjustedStart = new Date(currentShiftTime)
        const adjustedEnd = new Date(currentShiftTime.getTime() + taskDuration)
        
        updatedTasks.push({
          id: existingTask.id,
          start_datetime: adjustedStart.toISOString(),
          end_datetime: adjustedEnd.toISOString()
        })
        
        currentShiftTime = new Date(adjustedEnd)
        console.log(`📅 Task ${existingTask.id} shifted to next day: ${adjustedStart.toISOString()}`)
      } else {
        updatedTasks.push({
          id: existingTask.id,
          start_datetime: newStart.toISOString(),
          end_datetime: newEnd.toISOString()
        })
        
        currentShiftTime = new Date(newEnd)
        console.log(`📅 Task ${existingTask.id} will be shifted to ${newStart.toISOString()}`)
      }
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

// Helper function pour récupérer les horaires de travail d'une entreprise
async function getCompanyWorkingHours(supabase: any, companyId: string) {
  const { data: schedules, error } = await supabase
    .from('workshop_schedule')
    .select('*')
    .eq('company_id', companyId)
    .eq('enabled', true)
    .order('day_of_week')

  if (error || !schedules || schedules.length === 0) {
    console.log('⚠️ No workshop schedule found, using default hours (8h-18h)')
    // Horaires par défaut si pas de configuration
    return {
      1: { morning_start: '08:00', morning_end: '12:00', afternoon_start: '13:00', afternoon_end: '18:00' }, // Lundi
      2: { morning_start: '08:00', morning_end: '12:00', afternoon_start: '13:00', afternoon_end: '18:00' }, // Mardi
      3: { morning_start: '08:00', morning_end: '12:00', afternoon_start: '13:00', afternoon_end: '18:00' }, // Mercredi
      4: { morning_start: '08:00', morning_end: '12:00', afternoon_start: '13:00', afternoon_end: '18:00' }, // Jeudi
      5: { morning_start: '08:00', morning_end: '12:00', afternoon_start: '13:00', afternoon_end: '18:00' }  // Vendredi
    }
  }

  // Convertir les données en format utilisable
  const workingHours: any = {}
  for (const schedule of schedules) {
    const dayNum = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(schedule.day_of_week)
    if (dayNum >= 1 && dayNum <= 5) { // Jours ouvrables seulement
      workingHours[dayNum] = {
        morning_start: schedule.morning_start,
        morning_end: schedule.morning_end,
        afternoon_start: schedule.afternoon_start,
        afternoon_end: schedule.afternoon_end,
        full_day: schedule.full_day
      }
    }
  }

  return workingHours
}

// Helper function pour obtenir le prochain créneau de travail
async function getNextWorkingSlot(workingHours: any, fromDate?: Date): Promise<Date> {
  const now = fromDate || new Date()
  let nextSlot = new Date(now)
  
  // Chercher le prochain jour ouvrable
  for (let i = 1; i <= 7; i++) {
    nextSlot.setDate(now.getDate() + i)
    const dayOfWeek = nextSlot.getDay()
    
    if (workingHours[dayOfWeek]) {
      const schedule = workingHours[dayOfWeek]
      const morningStart = schedule.morning_start || '08:00'
      const [hour, minute] = morningStart.split(':').map(Number)
      nextSlot.setHours(hour, minute, 0, 0)
      return nextSlot
    }
  }
  
  // Fallback : lundi prochain à 8h
  const daysUntilMonday = (8 - now.getDay()) % 7 || 7
  nextSlot.setDate(now.getDate() + daysUntilMonday)
  nextSlot.setHours(8, 0, 0, 0)
  return nextSlot
}

// Helper function pour ajuster une heure aux heures de travail
async function adjustToWorkingHours(dateTime: Date, workingHours: any): Promise<Date> {
  const adjusted = new Date(dateTime)
  const dayOfWeek = adjusted.getDay()
  
  // Si c'est un weekend ou jour non travaillé, passer au prochain jour ouvrable
  if (!workingHours[dayOfWeek]) {
    return await getNextWorkingSlot(workingHours, adjusted)
  }
  
  const schedule = workingHours[dayOfWeek]
  
  // Déterminer les heures de fin (afternoon_end ou morning_end si pas d'après-midi)
  const endTime = schedule.afternoon_end || schedule.morning_end || '18:00'
  const [endHour, endMinute] = endTime.split(':').map(Number)
  
  const endOfDay = new Date(adjusted)
  endOfDay.setHours(endHour, endMinute, 0, 0)
  
  // Si on dépasse les heures de travail, passer au jour suivant
  if (adjusted >= endOfDay) {
    return await getNextWorkingSlot(workingHours, adjusted)
  }
  
  // Vérifier si on est avant le début de la journée
  const startTime = schedule.morning_start || '08:00'
  const [startHour, startMinute] = startTime.split(':').map(Number)
  
  const startOfDay = new Date(adjusted)
  startOfDay.setHours(startHour, startMinute, 0, 0)
  
  if (adjusted < startOfDay) {
    adjusted.setHours(startHour, startMinute, 0, 0)
  }
  
  return adjusted
}

// Helper function pour obtenir la fin de journée de travail
async function getEndOfWorkDay(date: Date, workingHours: any): Promise<Date> {
  const dayOfWeek = date.getDay()
  const schedule = workingHours[dayOfWeek]
  
  if (!schedule) {
    // Jour non travaillé, retourner début de journée
    const result = new Date(date)
    result.setHours(0, 0, 0, 0)
    return result
  }
  
  const endTime = schedule.afternoon_end || schedule.morning_end || '18:00'
  const [endHour, endMinute] = endTime.split(':').map(Number)
  
  const endOfDay = new Date(date)
  endOfDay.setHours(endHour, endMinute, 0, 0)
  
  return endOfDay
}
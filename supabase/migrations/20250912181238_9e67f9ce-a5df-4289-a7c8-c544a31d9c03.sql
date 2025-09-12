-- Create function to auto-assign next task when a task is completed
CREATE OR REPLACE FUNCTION public.trigger_auto_assign_next_task()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Vérifier si le statut est passé à "Terminé"
  IF OLD.status != 'Terminé' AND NEW.status = 'Terminé' THEN
    -- Mettre à jour real_end_datetime si pas encore défini
    IF NEW.real_end_datetime IS NULL THEN
      NEW.real_end_datetime = NOW();
    END IF;
    
    -- Appeler l'edge function en arrière-plan pour assigner la tâche suivante
    PERFORM net.http_post(
      url := 'https://jukdsypvuehnniskgpfd.supabase.co/functions/v1/auto-assign-next-task',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'taskId', NEW.id::text,
        'companyId', NEW.company_id::text
      )
    );
    
    RAISE LOG 'Auto-assign trigger fired for task: % (%), company: %', NEW.id, NEW.task_type, NEW.company_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger on employee_schedule table
DROP TRIGGER IF EXISTS auto_assign_next_task_trigger ON public.employee_schedule;

CREATE TRIGGER auto_assign_next_task_trigger
  BEFORE UPDATE ON public.employee_schedule
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_auto_assign_next_task();

COMMENT ON FUNCTION public.trigger_auto_assign_next_task() IS 'Automatically assigns the next task in the workflow when a task is completed';
COMMENT ON TRIGGER auto_assign_next_task_trigger ON public.employee_schedule IS 'Triggers automatic assignment of next task when status changes to Terminé';
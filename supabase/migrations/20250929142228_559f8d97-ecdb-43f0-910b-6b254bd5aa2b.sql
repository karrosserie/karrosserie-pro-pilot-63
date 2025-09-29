-- Créer la fonction trigger pour auto-assignment
CREATE OR REPLACE FUNCTION public.trigger_auto_assign_next_task()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Vérifier si le statut est passé à "Terminé"
  IF OLD.status != 'Terminé' AND NEW.status = 'Terminé' THEN
    -- Appeler l'edge function auto-assign-next-task
    PERFORM net.http_post(
      url := 'https://jukdsypvuehnniskgpfd.supabase.co/functions/v1/auto-assign-next-task',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1a2RzeXB2dWVobm5pc2tncGZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk5MDkxMiwiZXhwIjoyMDYzNTY2OTEyfQ.6tfMw4CYqnI2AmhgDFq56mM4QdBxkzJ2_GpGdabFJ_E'
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
$function$;

-- Supprimer l'ancien trigger s'il existe
DROP TRIGGER IF EXISTS trigger_auto_assign_next_task ON employee_schedule;

-- Créer le nouveau trigger
CREATE TRIGGER trigger_auto_assign_next_task
  AFTER UPDATE ON employee_schedule
  FOR EACH ROW
  EXECUTE FUNCTION trigger_auto_assign_next_task();
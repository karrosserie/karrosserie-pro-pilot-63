-- Update the trigger function to use the correct service role key
CREATE OR REPLACE FUNCTION trigger_auto_assign_next_task()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
$$;
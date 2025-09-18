-- Corriger le trigger pour éviter les appels multiples simultanés
CREATE OR REPLACE FUNCTION public.trigger_auto_assign_next_task()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  task_workflow_map jsonb := '{
    "Accueil & Préparation du dossier": "Remplacement ou débosselage",
    "Remplacement ou débosselage": "Préparation à la peinture", 
    "Préparation à la peinture": "Mise en peinture",
    "Mise en peinture": "Finitions & remontage",
    "Finitions & remontage": "Contrôle final & livraison"
  }';
  next_task_type text;
  existing_task_count integer;
BEGIN
  -- Vérifier si le statut est passé à "Terminé"
  IF OLD.status != 'Terminé' AND NEW.status = 'Terminé' THEN
    -- Mettre à jour real_end_datetime si pas encore défini
    IF NEW.real_end_datetime IS NULL THEN
      NEW.real_end_datetime = NOW();
    END IF;
    
    -- Déterminer le type de tâche suivante
    next_task_type := task_workflow_map->>NEW.task_type;
    
    IF next_task_type IS NOT NULL THEN
      -- Vérifier s'il existe déjà une tâche du même type pour ce véhicule
      SELECT COUNT(*) INTO existing_task_count
      FROM employee_schedule 
      WHERE vehicle_id = NEW.vehicle_id 
        AND task_type = next_task_type 
        AND company_id = NEW.company_id
        AND status != 'Terminé';
      
      -- Ne déclencher l'auto-assignment que s'il n'y a pas déjà une tâche similaire
      IF existing_task_count = 0 THEN
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
        
        RAISE LOG 'Auto-assign trigger fired for task: % (%), company: %, next task: %', NEW.id, NEW.task_type, NEW.company_id, next_task_type;
      ELSE
        RAISE LOG 'Auto-assign skipped - task already exists: % for vehicle: %', next_task_type, NEW.vehicle_id;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Nettoyer les doublons existants - garder seulement la tâche la plus récente
DELETE FROM employee_schedule 
WHERE id IN (
  SELECT es1.id 
  FROM employee_schedule es1
  INNER JOIN employee_schedule es2 ON (
    es1.vehicle_id = es2.vehicle_id 
    AND es1.task_type = es2.task_type 
    AND es1.company_id = es2.company_id
    AND es1.status = es2.status
    AND es1.status != 'Terminé'
    AND es1.created_at < es2.created_at
  )
);
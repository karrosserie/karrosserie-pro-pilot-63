-- Corriger le problème de duplication des tâches lors de la réassignation

-- 1. Supprimer les tâches dupliquées existantes (garder la plus récente de chaque groupe)
WITH duplicates AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY company_id, vehicle_id, task_type 
      ORDER BY created_at DESC
    ) as rn
  FROM employee_schedule 
  WHERE status != 'Terminé'
)
DELETE FROM employee_schedule 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- 2. Créer un index unique conditionnel pour empêcher les futures duplications
-- (sans CONCURRENTLY pour éviter l'erreur de transaction)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_task_per_vehicle
ON employee_schedule (company_id, vehicle_id, task_type)
WHERE status != 'Terminé';

-- 3. Améliorer le trigger avec une meilleure gestion des conditions de course
CREATE OR REPLACE FUNCTION public.trigger_auto_assign_next_task()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  task_workflow_map jsonb := '{
    "Accueil & Préparation du dossier": "Remplacement ou débosselage",
    "Remplacement ou débosselage": "Préparation peinture", 
    "Préparation peinture": "Mise en peinture",
    "Mise en peinture": "Finitions & remontage",
    "Finitions & remontage": "Clôture & livraison"
  }';
  next_task_type text;
  existing_task_count integer;
  lock_key bigint;
BEGIN
  -- Vérifier si le statut est passé à "Terminé"
  IF OLD.status != 'Terminé' AND NEW.status = 'Terminé' THEN
    -- Mettre à jour real_end_datetime si pas encore défini
    IF NEW.real_end_datetime IS NULL THEN
      NEW.real_end_datetime = NOW();
    END IF;
    
    -- Déterminer le type de tâche suivante
    next_task_type := task_workflow_map->>NEW.task_type::text;
    
    IF next_task_type IS NOT NULL THEN
      -- Créer une clé de verrou unique basée sur le véhicule et le type de tâche suivante
      -- Ceci empêche les appels simultanés de créer des tâches dupliquées
      lock_key := (('x' || substr(md5(NEW.vehicle_id::text || next_task_type), 1, 16))::bit(64))::bigint;
      
      -- Acquérir un verrou advisory pour éviter les conditions de course
      IF pg_try_advisory_xact_lock(lock_key) THEN
        -- Vérifier s'il existe déjà une tâche du même type pour ce véhicule
        SELECT COUNT(*) INTO existing_task_count
        FROM employee_schedule 
        WHERE vehicle_id = NEW.vehicle_id 
          AND task_type = next_task_type::schedule_task_type
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
      ELSE
        -- Si le verrou ne peut pas être acquis, cela signifie qu'un autre processus gère déjà cette tâche
        RAISE LOG 'Auto-assign skipped - another process is already handling this vehicle-task combination: % -> %', NEW.vehicle_id, next_task_type;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;
-- Supprimer les tâches dupliquées créées accidentellement
-- Garder seulement la plus récente pour chaque combinaison vehicle_id + task_type + status

WITH duplicates AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY vehicle_id, task_type, status 
      ORDER BY created_at DESC
    ) as rn
  FROM employee_schedule
  WHERE 
    company_id = '7a6094d4-20e9-4dee-a965-31b443441262'
    AND status IN ('En attente', 'En cours')
    AND task_type = 'Clôture & livraison'
    AND created_at > now() - interval '1 hour'
)
DELETE FROM employee_schedule
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);
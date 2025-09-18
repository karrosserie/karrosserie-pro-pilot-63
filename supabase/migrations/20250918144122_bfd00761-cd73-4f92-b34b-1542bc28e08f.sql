-- Nettoyer les doublons existants - garder seulement la tâche la plus récente pour chaque véhicule/étape
DELETE FROM employee_schedule 
WHERE id IN (
  SELECT es1.id 
  FROM employee_schedule es1
  INNER JOIN employee_schedule es2 ON (
    es1.vehicle_id = es2.vehicle_id 
    AND es1.task_type = es2.task_type 
    AND es1.status = es2.status
    AND es1.status != 'Terminé'
    AND es1.created_at < es2.created_at
  )
);
-- Corriger l'association des tâches et photos pour le véhicule MP-985-PO
-- Le problème: la tâche "Remplacement ou débosselage" terminée est associée au mauvais véhicule

-- 1. Mettre à jour la tâche de débosselage pour qu'elle soit associée au bon véhicule (MP-985-PO)
UPDATE public.employee_schedule 
SET vehicle_id = '2830f2b7-b8f1-46c8-8023-015181407c9d'  -- MP-985-PO
WHERE id = 'b9f2cb0d-2e3b-4937-a183-fa7a5805f111'  -- Tâche débosselage terminée
  AND task_type = 'Remplacement ou débosselage'
  AND status = 'Terminé';

-- 2. Mettre à jour les photos de cette tâche pour qu'elles pointent vers le bon véhicule
UPDATE public.task_photos 
SET vehicle_id = '2830f2b7-b8f1-46c8-8023-015181407c9d'  -- MP-985-PO
WHERE task_id = 'b9f2cb0d-2e3b-4937-a183-fa7a5805f111'  -- Tâche débosselage terminée
  AND vehicle_id = '71cb9225-a4cc-4599-aa6b-b6ac391c1e09';  -- Ancien véhicule FB-440-JM

-- Vérification: afficher les corrections apportées
SELECT 
  'Tâche corrigée' as type,
  es.id,
  es.task_type,
  es.status,
  v.license_plate as nouveau_vehicule
FROM employee_schedule es
JOIN vehicles v ON v.id = es.vehicle_id
WHERE es.id = 'b9f2cb0d-2e3b-4937-a183-fa7a5805f111'

UNION ALL

SELECT 
  'Photos corrigées' as type,
  tp.id,
  tp.photo_type,
  'task_photo' as status,
  v.license_plate as nouveau_vehicule
FROM task_photos tp
JOIN vehicles v ON v.id = tp.vehicle_id  
WHERE tp.task_id = 'b9f2cb0d-2e3b-4937-a183-fa7a5805f111';
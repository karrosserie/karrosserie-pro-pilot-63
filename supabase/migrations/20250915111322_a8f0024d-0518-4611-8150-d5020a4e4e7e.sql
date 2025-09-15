-- Nettoyage final: supprimer les colonnes photo de employee_schedule
-- et le bucket employee-tasks maintenant que tout est migré vers task_photos

-- Étape 1: Supprimer les colonnes photo de employee_schedule
ALTER TABLE public.employee_schedule 
DROP COLUMN IF EXISTS start_photo_url,
DROP COLUMN IF EXISTS end_photo_url;

-- Étape 2: Supprimer le bucket employee-tasks
DELETE FROM storage.buckets WHERE id = 'employee-tasks';
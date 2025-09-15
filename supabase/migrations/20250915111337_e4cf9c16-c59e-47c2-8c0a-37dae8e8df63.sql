-- Nettoyage final: supprimer les colonnes photo de employee_schedule seulement
-- (le bucket sera nettoyé manuellement plus tard)

-- Supprimer les colonnes photo de employee_schedule
ALTER TABLE public.employee_schedule 
DROP COLUMN IF EXISTS start_photo_url,
DROP COLUMN IF EXISTS end_photo_url;

-- Migration pour supprimer le champ reference de la table expertise_reports
-- et s'assurer que le statut par défaut est "Importé"

BEGIN;

-- Supprimer la colonne reference de la table expertise_reports
ALTER TABLE public.expertise_reports 
DROP COLUMN IF EXISTS reference;

-- Mettre à jour la colonne status pour avoir "Importé" comme valeur par défaut
ALTER TABLE public.expertise_reports 
ALTER COLUMN status SET DEFAULT 'Importé';

-- Mettre à jour les enregistrements existants qui n'ont pas de statut
UPDATE public.expertise_reports 
SET status = 'Importé' 
WHERE status IS NULL;

COMMIT;

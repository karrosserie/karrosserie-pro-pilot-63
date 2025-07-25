-- Rendre le champ report_id nullable dans la table imports
ALTER TABLE public.imports 
ALTER COLUMN report_id DROP NOT NULL;
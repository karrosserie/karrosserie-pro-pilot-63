-- Ajouter le champ document à la table imports
ALTER TABLE public.imports 
ADD COLUMN document TEXT;
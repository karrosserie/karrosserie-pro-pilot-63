-- Ajouter le champ ai_relance_enabled à la table company_preferences
ALTER TABLE public.company_preferences 
ADD COLUMN ai_relance_enabled boolean NOT NULL DEFAULT true;
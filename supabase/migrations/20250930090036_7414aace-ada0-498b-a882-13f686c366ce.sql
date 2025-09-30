-- Ajout du champ controle_technique_securite_time à la table company_preferences
ALTER TABLE public.company_preferences
ADD COLUMN IF NOT EXISTS controle_technique_securite_time time without time zone DEFAULT '01:30:00'::time without time zone;

-- Commentaire pour expliquer le champ
COMMENT ON COLUMN public.company_preferences.controle_technique_securite_time IS 'Durée estimée pour l''étape de contrôle technique de sécurité';
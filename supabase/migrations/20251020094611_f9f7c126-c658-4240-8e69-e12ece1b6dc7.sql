-- Ajouter les colonnes pour les pop-ups d'intro de la flotte
ALTER TABLE public.user_onboarding_progress
ADD COLUMN IF NOT EXISTS fleet_loans_intro_seen BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS fleet_violations_intro_seen BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS fleet_help_intro_seen BOOLEAN NOT NULL DEFAULT false;
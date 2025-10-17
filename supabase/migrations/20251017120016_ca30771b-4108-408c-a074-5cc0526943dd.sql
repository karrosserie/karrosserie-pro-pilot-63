-- Ajouter le champ pour la pop-up de sélection d'OR dans les cessions
ALTER TABLE public.user_onboarding_progress
ADD COLUMN IF NOT EXISTS cession_select_order_help_seen BOOLEAN NOT NULL DEFAULT false;
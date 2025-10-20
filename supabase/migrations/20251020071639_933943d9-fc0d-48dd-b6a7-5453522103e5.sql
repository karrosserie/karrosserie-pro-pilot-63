-- Add fleet_loan_created_help_seen column to user_onboarding_progress table
ALTER TABLE public.user_onboarding_progress 
ADD COLUMN IF NOT EXISTS fleet_loan_created_help_seen boolean NOT NULL DEFAULT false;
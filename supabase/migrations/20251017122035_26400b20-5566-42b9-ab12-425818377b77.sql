-- Add completion_dialog_shown field to user_onboarding_progress
ALTER TABLE public.user_onboarding_progress 
ADD COLUMN completion_dialog_shown boolean NOT NULL DEFAULT false;
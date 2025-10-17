-- Add cession_initialize_button_help_seen to user_onboarding_progress
ALTER TABLE user_onboarding_progress 
ADD COLUMN IF NOT EXISTS cession_initialize_button_help_seen boolean NOT NULL DEFAULT false;
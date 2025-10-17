-- Créer une table pour suivre les aides/guides vus par chaque utilisateur
CREATE TABLE IF NOT EXISTS public.user_onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.company_info(id) ON DELETE CASCADE,
  
  -- Pop-ups et guides vus
  quote_convert_help_seen BOOLEAN NOT NULL DEFAULT false,
  repair_order_help_seen BOOLEAN NOT NULL DEFAULT false,
  cession_help_seen BOOLEAN NOT NULL DEFAULT false,
  fleet_reservation_help_seen BOOLEAN NOT NULL DEFAULT false,
  fleet_reservation_guide_completed BOOLEAN NOT NULL DEFAULT false,
  expertise_report_prompt_seen BOOLEAN NOT NULL DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, company_id)
);

-- Activer RLS
ALTER TABLE public.user_onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent lire et modifier leurs propres données
CREATE POLICY "Users can view their own onboarding progress"
  ON public.user_onboarding_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding progress"
  ON public.user_onboarding_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding progress"
  ON public.user_onboarding_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_user_onboarding_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_onboarding_progress_updated_at
  BEFORE UPDATE ON public.user_onboarding_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_user_onboarding_progress_updated_at();
-- Créer la table onboarding_state pour stocker l'état d'onboarding de chaque utilisateur
CREATE TABLE IF NOT EXISTS public.onboarding_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  state JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_onboarding_state_user_id ON public.onboarding_state(user_id);

-- Activer RLS
ALTER TABLE public.onboarding_state ENABLE ROW LEVEL SECURITY;

-- Politique RLS : Les utilisateurs peuvent voir et modifier leur propre état d'onboarding
CREATE POLICY "Users can view their own onboarding state"
  ON public.onboarding_state
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding state"
  ON public.onboarding_state
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding state"
  ON public.onboarding_state
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Politique RLS pour le service role (utilisé par les edge functions)
CREATE POLICY "Service role can read all onboarding states"
  ON public.onboarding_state
  FOR SELECT
  TO service_role
  USING (true);

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_onboarding_state_updated_at
  BEFORE UPDATE ON public.onboarding_state
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
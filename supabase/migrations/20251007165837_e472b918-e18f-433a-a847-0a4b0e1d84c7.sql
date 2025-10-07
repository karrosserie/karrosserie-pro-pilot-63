-- Créer un type enum pour les types d'erreurs de migration
CREATE TYPE migration_error_type AS ENUM (
  'invalid_phone_number',
  'invalid_email',
  'invalid_siren',
  'geocoding_failed',
  'insee_api_error',
  'other'
);

-- Créer la table migration_error
CREATE TABLE public.migration_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.company_info(id) ON DELETE CASCADE NOT NULL,
  error_type migration_error_type NOT NULL,
  error_message TEXT NOT NULL,
  error_details JSONB,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Ajouter un index sur company_id pour les requêtes
CREATE INDEX idx_migration_errors_company_id ON public.migration_errors(company_id);

-- Ajouter un index sur error_type pour les statistiques
CREATE INDEX idx_migration_errors_type ON public.migration_errors(error_type);

-- Ajouter un index sur resolved pour filtrer les erreurs non résolues
CREATE INDEX idx_migration_errors_resolved ON public.migration_errors(resolved);

-- Activer RLS
ALTER TABLE public.migration_errors ENABLE ROW LEVEL SECURITY;

-- Policy: Les membres de la carrosserie peuvent voir leurs erreurs
CREATE POLICY "Company members can view their migration errors"
ON public.migration_errors
FOR SELECT
USING (user_belongs_to_company(auth.uid(), company_id));

-- Policy: Les admins peuvent voir toutes les erreurs
CREATE POLICY "Admins can view all migration errors"
ON public.migration_errors
FOR SELECT
USING (get_current_user_role() = 'admin');

-- Policy: Les membres peuvent créer des erreurs pour leur carrosserie
CREATE POLICY "Company members can create migration errors"
ON public.migration_errors
FOR INSERT
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Policy: Les membres peuvent mettre à jour leurs erreurs (pour marquer comme résolues)
CREATE POLICY "Company members can update their migration errors"
ON public.migration_errors
FOR UPDATE
USING (user_belongs_to_company(auth.uid(), company_id));

-- Policy: Les admins peuvent tout gérer
CREATE POLICY "Admins can manage all migration errors"
ON public.migration_errors
FOR ALL
USING (get_current_user_role() = 'admin');

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_migration_errors_updated_at
BEFORE UPDATE ON public.migration_errors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Commentaires pour la documentation
COMMENT ON TABLE public.migration_errors IS 'Table de traçage des erreurs lors des migrations/inscriptions de carrosseries';
COMMENT ON COLUMN public.migration_errors.error_type IS 'Type d''erreur rencontrée (invalid_phone_number, invalid_email, etc.)';
COMMENT ON COLUMN public.migration_errors.error_message IS 'Message d''erreur lisible pour l''utilisateur';
COMMENT ON COLUMN public.migration_errors.error_details IS 'Détails techniques de l''erreur au format JSON';
COMMENT ON COLUMN public.migration_errors.resolved IS 'Indique si l''erreur a été résolue';

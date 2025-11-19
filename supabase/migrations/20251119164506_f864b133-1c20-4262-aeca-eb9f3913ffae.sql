-- Table pour stocker l'historique des SMS de validation client
CREATE TABLE IF NOT EXISTS public.client_validation_sms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.company_info(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  report_id UUID NOT NULL REFERENCES public.expertise_reports(id) ON DELETE CASCADE,
  phone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  missing_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'delivered')),
  is_reminder BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  webhook_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour optimiser les requêtes de vérification de doublon
CREATE INDEX idx_client_validation_sms_report ON public.client_validation_sms(report_id, sent_at);
CREATE INDEX idx_client_validation_sms_company ON public.client_validation_sms(company_id);
CREATE INDEX idx_client_validation_sms_client ON public.client_validation_sms(client_id);

-- Trigger de mise à jour automatique du timestamp
CREATE TRIGGER update_client_validation_sms_updated_at
  BEFORE UPDATE ON public.client_validation_sms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies
ALTER TABLE public.client_validation_sms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view SMS from their company"
  ON public.client_validation_sms
  FOR SELECT
  USING (company_id = (SELECT public.get_effective_company_id()));

CREATE POLICY "Users can insert SMS for their company"
  ON public.client_validation_sms
  FOR INSERT
  WITH CHECK (company_id = (SELECT public.get_effective_company_id()));
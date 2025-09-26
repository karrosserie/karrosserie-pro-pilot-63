-- Créer la table gocardless_customers pour lier les compagnies aux clients GoCardless
CREATE TABLE public.gocardless_customers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES public.company_info(id) ON DELETE CASCADE,
  gocardless_customer_id text NOT NULL UNIQUE,
  given_name text NOT NULL,
  family_name text NOT NULL,
  email text NOT NULL,
  phone_number text,
  address_line1 text NOT NULL,
  city text NOT NULL,
  postal_code text NOT NULL,
  country_code text NOT NULL DEFAULT 'FR',
  status text NOT NULL DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(company_id) -- Une compagnie ne peut avoir qu'un seul client GoCardless
);

-- Créer la table gocardless_mandates pour stocker les mandats SEPA
CREATE TABLE public.gocardless_mandates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES public.company_info(id) ON DELETE CASCADE,
  gocardless_customer_id uuid NOT NULL REFERENCES public.gocardless_customers(id) ON DELETE CASCADE,
  gocardless_mandate_id text NOT NULL UNIQUE,
  scheme text NOT NULL DEFAULT 'sepa_core',
  reference text NOT NULL,
  status text NOT NULL DEFAULT 'pending_submission',
  iban text NOT NULL,
  account_holder_name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone,
  cancelled_at timestamp with time zone,
  UNIQUE(company_id) -- Une compagnie ne peut avoir qu'un seul mandat actif
);

-- Créer la table gocardless_payments pour l'historique des prélèvements
CREATE TABLE public.gocardless_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES public.company_info(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES public.company_subscriptions(id) ON DELETE SET NULL,
  gocardless_mandate_id uuid NOT NULL REFERENCES public.gocardless_mandates(id) ON DELETE CASCADE,
  gocardless_payment_id text NOT NULL UNIQUE,
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  description text NOT NULL,
  status text NOT NULL DEFAULT 'pending_submission',
  charge_date date NOT NULL,
  metadata jsonb DEFAULT '{}',
  failure_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  confirmed_at timestamp with time zone,
  paid_out_at timestamp with time zone,
  failed_at timestamp with time zone
);

-- Ajouter des champs dans company_subscriptions pour le statut de paiement
ALTER TABLE public.company_subscriptions 
ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS last_payment_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS last_payment_status text,
ADD COLUMN IF NOT EXISTS next_payment_attempt timestamp with time zone,
ADD COLUMN IF NOT EXISTS payment_failures_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS auto_billing_enabled boolean DEFAULT false;

-- Activer RLS sur les nouvelles tables
ALTER TABLE public.gocardless_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gocardless_mandates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gocardless_payments ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS pour gocardless_customers
CREATE POLICY "Company members can manage their gocardless customers" 
ON public.gocardless_customers 
FOR ALL 
USING (user_belongs_to_company(auth.uid(), company_id) OR (get_current_user_role() = 'admin'::text))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id) OR (get_current_user_role() = 'admin'::text));

-- Créer les politiques RLS pour gocardless_mandates
CREATE POLICY "Company members can manage their gocardless mandates" 
ON public.gocardless_mandates 
FOR ALL 
USING (user_belongs_to_company(auth.uid(), company_id) OR (get_current_user_role() = 'admin'::text))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id) OR (get_current_user_role() = 'admin'::text));

-- Créer les politiques RLS pour gocardless_payments
CREATE POLICY "Company members can view their gocardless payments" 
ON public.gocardless_payments 
FOR SELECT 
USING (user_belongs_to_company(auth.uid(), company_id) OR (get_current_user_role() = 'admin'::text));

CREATE POLICY "System can manage gocardless payments" 
ON public.gocardless_payments 
FOR ALL 
USING ((get_current_user_role() = 'admin'::text) OR (auth.jwt() ->> 'role'::text) = 'service_role'::text)
WITH CHECK ((get_current_user_role() = 'admin'::text) OR (auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Créer les triggers pour updated_at
CREATE TRIGGER update_gocardless_customers_updated_at
  BEFORE UPDATE ON public.gocardless_customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gocardless_mandates_updated_at
  BEFORE UPDATE ON public.gocardless_mandates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gocardless_payments_updated_at
  BEFORE UPDATE ON public.gocardless_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Créer des index pour les performances
CREATE INDEX idx_gocardless_customers_company_id ON public.gocardless_customers(company_id);
CREATE INDEX idx_gocardless_customers_gocardless_id ON public.gocardless_customers(gocardless_customer_id);

CREATE INDEX idx_gocardless_mandates_company_id ON public.gocardless_mandates(company_id);
CREATE INDEX idx_gocardless_mandates_customer_id ON public.gocardless_mandates(gocardless_customer_id);
CREATE INDEX idx_gocardless_mandates_gocardless_id ON public.gocardless_mandates(gocardless_mandate_id);
CREATE INDEX idx_gocardless_mandates_status ON public.gocardless_mandates(status);

CREATE INDEX idx_gocardless_payments_company_id ON public.gocardless_payments(company_id);
CREATE INDEX idx_gocardless_payments_mandate_id ON public.gocardless_payments(gocardless_mandate_id);
CREATE INDEX idx_gocardless_payments_subscription_id ON public.gocardless_payments(subscription_id);
CREATE INDEX idx_gocardless_payments_gocardless_id ON public.gocardless_payments(gocardless_payment_id);
CREATE INDEX idx_gocardless_payments_status ON public.gocardless_payments(status);
CREATE INDEX idx_gocardless_payments_charge_date ON public.gocardless_payments(charge_date);
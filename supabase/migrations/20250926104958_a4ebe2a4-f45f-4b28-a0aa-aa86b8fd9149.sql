-- Ajouter les champs GoCardless à la table company_info
ALTER TABLE public.company_info 
ADD COLUMN IF NOT EXISTS gocardless_customer_id text,
ADD COLUMN IF NOT EXISTS gocardless_mandate_id text,
ADD COLUMN IF NOT EXISTS gocardless_mandate_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS sepa_enabled boolean DEFAULT false;
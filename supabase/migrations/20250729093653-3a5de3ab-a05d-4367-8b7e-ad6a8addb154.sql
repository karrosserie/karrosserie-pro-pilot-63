-- Ajouter les colonnes manquantes à la table company_preferences
ALTER TABLE public.company_preferences 
ADD COLUMN IF NOT EXISTS show_repair_order_on_documents boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS show_client_signature_repair_orders boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS use_date_based_reference boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS show_payment_details boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS set_activities_as_homepage boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS show_warning_text boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS next_repair_order_ref text NOT NULL DEFAULT '1',
ADD COLUMN IF NOT EXISTS next_invoice_ref text NOT NULL DEFAULT '1',
ADD COLUMN IF NOT EXISTS next_credit_ref text NOT NULL DEFAULT '1',
ADD COLUMN IF NOT EXISTS payment_details text,
ADD COLUMN IF NOT EXISTS invoice_non_engagement_clause text,
ADD COLUMN IF NOT EXISTS repair_order_non_engagement_clause text,
ADD COLUMN IF NOT EXISTS payment_conditions text,
ADD COLUMN IF NOT EXISTS late_payment_penalties text,
ADD COLUMN IF NOT EXISTS company_details text;
-- Ajouter la colonne n8n_webhook_url aux préférences d'entreprise
ALTER TABLE public.company_preferences 
ADD COLUMN IF NOT EXISTS n8n_webhook_url text;
-- Ajouter la colonne gocardless_subscription_id à company_subscriptions
ALTER TABLE company_subscriptions 
ADD COLUMN IF NOT EXISTS gocardless_subscription_id TEXT UNIQUE;
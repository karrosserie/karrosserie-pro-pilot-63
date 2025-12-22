-- Ajouter la colonne email_sent aux tables de documents
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS email_sent boolean DEFAULT false;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS email_sent boolean DEFAULT false;
ALTER TABLE repair_orders ADD COLUMN IF NOT EXISTS email_sent boolean DEFAULT false;
-- Add signature-related columns to repair_orders table
ALTER TABLE repair_orders
ADD COLUMN IF NOT EXISTS oodrive_contract_id VARCHAR,
ADD COLUMN IF NOT EXISTS signed_document_url VARCHAR;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_repair_orders_oodrive_contract_id
ON repair_orders(oodrive_contract_id)
WHERE oodrive_contract_id IS NOT NULL;

-- Add comment
COMMENT ON COLUMN repair_orders.oodrive_contract_id IS 'ID du contrat Oodrive pour la signature électronique';
COMMENT ON COLUMN repair_orders.signed_document_url IS 'URL du document signé stocké sur Supabase Storage';
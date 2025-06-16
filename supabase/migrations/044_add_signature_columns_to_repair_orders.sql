
-- Add signature columns to repair_orders table
ALTER TABLE repair_orders 
ADD COLUMN IF NOT EXISTS client_signature TEXT,
ADD COLUMN IF NOT EXISTS client_name_signature TEXT,
ADD COLUMN IF NOT EXISTS signature_date TIMESTAMPTZ;

-- Add separate data fields to repair_orders table to match quotes structure
ALTER TABLE repair_orders
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS claim_number TEXT,
ADD COLUMN IF NOT EXISTS current_mileage TEXT;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_repair_orders_claim_number ON repair_orders(claim_number);
CREATE INDEX IF NOT EXISTS idx_repair_orders_description ON repair_orders(description);
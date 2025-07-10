-- Add data fields to repair_orders table for repairs, parts, and discounts
ALTER TABLE repair_orders
ADD COLUMN IF NOT EXISTS repairs_data JSON,
ADD COLUMN IF NOT EXISTS parts_data JSON,
ADD COLUMN IF NOT EXISTS discounts_data JSON;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_repair_orders_repairs_data ON repair_orders USING GIN (repairs_data);
CREATE INDEX IF NOT EXISTS idx_repair_orders_parts_data ON repair_orders USING GIN (parts_data);
CREATE INDEX IF NOT EXISTS idx_repair_orders_discounts_data ON repair_orders USING GIN (discounts_data);
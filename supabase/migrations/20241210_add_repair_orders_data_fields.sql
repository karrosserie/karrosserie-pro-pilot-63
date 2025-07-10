-- Add data fields to repair_orders table for repairs, parts, and discounts
ALTER TABLE repair_orders
ADD COLUMN IF NOT EXISTS repairs_data JSONB,
ADD COLUMN IF NOT EXISTS parts_data JSONB,
ADD COLUMN IF NOT EXISTS discounts_data JSONB;

-- Add indexes for better query performance with proper operator class
CREATE INDEX IF NOT EXISTS idx_repair_orders_repairs_data ON repair_orders USING GIN (repairs_data jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_repair_orders_parts_data ON repair_orders USING GIN (parts_data jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_repair_orders_discounts_data ON repair_orders USING GIN (discounts_data jsonb_path_ops);
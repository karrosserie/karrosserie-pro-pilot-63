-- Add order_date field to repair_orders table

ALTER TABLE repair_orders 
ADD COLUMN IF NOT EXISTS order_date DATE;

-- Add comment to document the change
COMMENT ON COLUMN repair_orders.order_date IS 'Date de l''ordre de réparation';
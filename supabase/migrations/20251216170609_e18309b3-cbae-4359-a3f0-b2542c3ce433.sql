-- Add expertise scheduling columns to repair_orders
ALTER TABLE repair_orders 
ADD COLUMN IF NOT EXISTS expertise_date DATE,
ADD COLUMN IF NOT EXISTS expertise_time TIME;
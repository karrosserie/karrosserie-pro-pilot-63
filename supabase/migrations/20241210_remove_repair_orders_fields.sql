-- Remove unused fields from repair_orders table
ALTER TABLE repair_orders
DROP COLUMN IF EXISTS start_date,
DROP COLUMN IF EXISTS end_date,
DROP COLUMN IF EXISTS estimated_hours,
DROP COLUMN IF EXISTS description,
DROP COLUMN IF EXISTS current_mileage;
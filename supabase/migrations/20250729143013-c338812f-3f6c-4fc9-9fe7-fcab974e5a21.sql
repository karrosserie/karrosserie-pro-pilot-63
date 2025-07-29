-- Remove date fields from vehicles table
ALTER TABLE public.vehicles 
DROP COLUMN IF EXISTS arrival_date,
DROP COLUMN IF EXISTS start_date,
DROP COLUMN IF EXISTS end_date;

-- Add date fields to repair_orders table
ALTER TABLE public.repair_orders 
ADD COLUMN IF NOT EXISTS arrival_date date,
ADD COLUMN IF NOT EXISTS start_date date,
ADD COLUMN IF NOT EXISTS end_date date;
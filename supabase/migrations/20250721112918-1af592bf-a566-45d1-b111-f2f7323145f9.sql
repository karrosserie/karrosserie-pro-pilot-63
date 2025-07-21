-- Remove unused columns from cessions table
ALTER TABLE public.cessions 
DROP COLUMN IF EXISTS vehicle_id,
DROP COLUMN IF EXISTS buyer_name,
DROP COLUMN IF EXISTS buyer_contact,
DROP COLUMN IF EXISTS sale_amount,
DROP COLUMN IF EXISTS sale_date,
DROP COLUMN IF EXISTS sale_price,
DROP COLUMN IF EXISTS notes;
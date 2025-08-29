-- Add driver license fields to clients table
ALTER TABLE public.clients 
ADD COLUMN license_number TEXT,
ADD COLUMN license_issue_date DATE,
ADD COLUMN prefecture TEXT,
ADD COLUMN date_of_birth DATE,
ADD COLUMN place_of_birth TEXT,
ADD COLUMN driver_license_front_url TEXT,
ADD COLUMN driver_license_back_url TEXT;

-- Remove these fields from fleet_reservations as they should be in clients table
ALTER TABLE public.fleet_reservations
DROP COLUMN IF EXISTS license_number,
DROP COLUMN IF EXISTS license_issue_date,  
DROP COLUMN IF EXISTS prefecture,
DROP COLUMN IF EXISTS date_of_birth,
DROP COLUMN IF EXISTS place_of_birth,
DROP COLUMN IF EXISTS driver_license_front_url,
DROP COLUMN IF EXISTS driver_license_back_url;
-- Add missing driver license fields to clients table (skip existing ones)
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS license_number TEXT,
ADD COLUMN IF NOT EXISTS license_issue_date DATE,
ADD COLUMN IF NOT EXISTS prefecture TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS place_of_birth TEXT;

-- Remove these fields from fleet_reservations as they should be in clients table
ALTER TABLE public.fleet_reservations
DROP COLUMN IF EXISTS license_number,
DROP COLUMN IF EXISTS license_issue_date,  
DROP COLUMN IF EXISTS prefecture,
DROP COLUMN IF EXISTS date_of_birth,
DROP COLUMN IF EXISTS place_of_birth,
DROP COLUMN IF EXISTS driver_license_front_url,
DROP COLUMN IF EXISTS driver_license_back_url;
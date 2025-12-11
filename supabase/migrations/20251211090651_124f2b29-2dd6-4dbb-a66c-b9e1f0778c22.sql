-- Add assistance fields to fleet_reservations table
ALTER TABLE public.fleet_reservations
ADD COLUMN IF NOT EXISTS has_assistance boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS assistance_case_number varchar(255),
ADD COLUMN IF NOT EXISTS assistance_email varchar(255);
-- Add points_lost field to fleet_violations table
ALTER TABLE public.fleet_violations 
ADD COLUMN points_lost INTEGER DEFAULT 0;
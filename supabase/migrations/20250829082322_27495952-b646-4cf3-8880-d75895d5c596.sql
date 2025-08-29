-- Add missing foreign key constraint between fleet_violations and fleet_vehicles
ALTER TABLE public.fleet_violations 
ADD CONSTRAINT fk_fleet_violations_fleet_vehicle_id 
FOREIGN KEY (fleet_vehicle_id) REFERENCES public.fleet_vehicles(id) ON DELETE CASCADE;
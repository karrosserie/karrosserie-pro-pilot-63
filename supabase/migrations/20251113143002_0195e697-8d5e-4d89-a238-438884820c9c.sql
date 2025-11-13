-- Add vehicle_id column to messageries table to link messages to specific vehicles
ALTER TABLE public.messageries 
ADD COLUMN vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL;

-- Create an index for better query performance
CREATE INDEX idx_messageries_vehicle_id ON public.messageries(vehicle_id);
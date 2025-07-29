-- Add general condition and cleanliness condition fields to repair_orders table
ALTER TABLE public.repair_orders 
ADD COLUMN IF NOT EXISTS general_condition text,
ADD COLUMN IF NOT EXISTS cleanliness_condition text;
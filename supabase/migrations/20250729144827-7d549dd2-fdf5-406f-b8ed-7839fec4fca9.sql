-- Add personal_items field to repair_orders table
ALTER TABLE public.repair_orders 
ADD COLUMN personal_items text;
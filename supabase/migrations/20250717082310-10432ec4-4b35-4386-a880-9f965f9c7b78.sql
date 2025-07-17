-- Add vehicule_id column to tokens table
ALTER TABLE public.tokens 
ADD COLUMN vehicule_id uuid;
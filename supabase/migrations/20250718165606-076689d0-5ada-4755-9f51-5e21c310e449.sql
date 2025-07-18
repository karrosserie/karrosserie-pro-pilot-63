-- Add active field to user_companies table
ALTER TABLE public.user_companies 
ADD COLUMN active boolean NOT NULL DEFAULT true;
-- Add archived field to invoices table
ALTER TABLE public.invoices 
ADD COLUMN archived boolean NOT NULL DEFAULT false;
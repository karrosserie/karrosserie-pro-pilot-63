-- Revert client_response to allow NULL values
ALTER TABLE public.client_relances 
ALTER COLUMN client_response DROP NOT NULL;
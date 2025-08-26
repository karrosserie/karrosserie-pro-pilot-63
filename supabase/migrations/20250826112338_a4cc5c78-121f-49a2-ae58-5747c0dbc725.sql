-- Add column to disable automatic reminders for clients
ALTER TABLE public.clients 
ADD COLUMN auto_relances_disabled boolean NOT NULL DEFAULT false;

-- Add index for better performance when filtering clients with auto reminders enabled
CREATE INDEX idx_clients_auto_relances_disabled ON public.clients(auto_relances_disabled);
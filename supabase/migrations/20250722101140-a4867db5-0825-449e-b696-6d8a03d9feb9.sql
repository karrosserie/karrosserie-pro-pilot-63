
-- Add oodrive_contract_id to cessions table
ALTER TABLE public.cessions ADD COLUMN oodrive_contract_id TEXT NULL;

-- Add oodrive_recipient_id to clients table
ALTER TABLE public.clients ADD COLUMN oodrive_recipient_id TEXT NULL;

-- Add oodrive_recipient_id to company_info table
ALTER TABLE public.company_info ADD COLUMN oodrive_recipient_id TEXT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.cessions.oodrive_contract_id IS 'Oodrive contract identifier for signature tracking';
COMMENT ON COLUMN public.clients.oodrive_recipient_id IS 'Oodrive recipient identifier for the client';
COMMENT ON COLUMN public.company_info.oodrive_recipient_id IS 'Oodrive recipient identifier for the company';

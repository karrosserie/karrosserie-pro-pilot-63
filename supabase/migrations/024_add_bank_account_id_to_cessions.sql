
-- Add bank_account_id column to cessions table

ALTER TABLE public.cessions 
ADD COLUMN bank_account_id UUID REFERENCES public.bank_accounts(id);

-- Add comment for the new column
COMMENT ON COLUMN public.cessions.bank_account_id IS 'Reference to the bank account for the cession';

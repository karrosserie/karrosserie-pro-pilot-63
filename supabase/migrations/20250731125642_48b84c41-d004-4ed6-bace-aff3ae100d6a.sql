-- Add account_id column to bridge table with foreign key reference to bank_accounts
ALTER TABLE public.bridge 
ADD COLUMN account_id uuid REFERENCES public.bank_accounts(id);
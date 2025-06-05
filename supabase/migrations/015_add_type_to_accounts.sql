
-- Add type column to bank_accounts table
ALTER TABLE public.bank_accounts ADD COLUMN type text DEFAULT 'Courant' CHECK (type IN ('Courant', 'Épargne', 'Professionnel'));

-- Update existing bank accounts to have the default type
UPDATE public.bank_accounts SET type = 'Courant' WHERE type IS NULL;

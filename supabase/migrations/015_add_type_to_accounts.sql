
-- Add type column to accounts table
ALTER TABLE public.accounts ADD COLUMN type text DEFAULT 'Courant' CHECK (type IN ('Courant', 'Épargne', 'Professionnel'));

-- Update existing accounts to have the default type
UPDATE public.accounts SET type = 'Courant' WHERE type IS NULL;

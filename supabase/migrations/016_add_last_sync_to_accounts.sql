
-- Add last_sync column to bank_accounts table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bank_accounts' AND column_name = 'last_sync') THEN
        ALTER TABLE public.bank_accounts ADD COLUMN last_sync timestamp with time zone DEFAULT timezone('utc'::text, now());
    END IF;
END $$;

-- Update existing bank accounts to have a last_sync value
UPDATE public.bank_accounts SET last_sync = updated_at WHERE last_sync IS NULL;


-- Add last_sync column to accounts table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'accounts' AND column_name = 'last_sync') THEN
        ALTER TABLE public.accounts ADD COLUMN last_sync timestamp with time zone DEFAULT timezone('utc'::text, now());
    END IF;
END $$;

-- Update existing accounts to have a last_sync value
UPDATE public.accounts SET last_sync = updated_at WHERE last_sync IS NULL;

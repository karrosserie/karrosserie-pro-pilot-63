
-- Add missing columns to cessions table

ALTER TABLE public.cessions 
ADD COLUMN IF NOT EXISTS reference TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'en_attente';

-- Update existing records to have proper references
UPDATE public.cessions 
SET reference = 'CC-' || EXTRACT(YEAR FROM created_at) || '-' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::TEXT, 3, '0')
WHERE reference = '';

-- Add check constraint for status values
ALTER TABLE public.cessions 
ADD CONSTRAINT cessions_status_check 
CHECK (status IN ('en_attente', 'envoyee', 'signee', 'payee'));

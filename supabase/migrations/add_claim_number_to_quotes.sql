-- Add claim_number column to quotes table
ALTER TABLE public.quotes 
ADD COLUMN IF NOT EXISTS claim_number TEXT;

-- Add comment to explain the field
COMMENT ON COLUMN quotes.claim_number IS 'Numéro de sinistre associé au devis';
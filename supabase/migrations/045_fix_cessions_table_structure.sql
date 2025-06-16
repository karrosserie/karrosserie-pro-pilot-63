
-- Fix cessions table structure and ensure all required columns exist with proper types

-- First, ensure the table exists with all required columns
CREATE TABLE IF NOT EXISTS public.cessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic cession information
  reference TEXT NOT NULL DEFAULT '',
  status TEXT DEFAULT 'en_attente',
  
  -- Required fields for the new cession form
  repair_order_id UUID REFERENCES public.repair_orders(id) ON DELETE SET NULL,
  bank_account_id UUID REFERENCES public.bank_accounts(id) ON DELETE SET NULL,
  incident_number TEXT,
  incident_date DATE,
  policy_number TEXT,
  report_number TEXT,
  expert_name TEXT,
  insurance_company_id UUID REFERENCES public.insurance_companies(id) ON DELETE SET NULL,
  
  -- Legacy fields (for backward compatibility)
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  buyer_name TEXT DEFAULT '',
  buyer_contact TEXT,
  sale_price NUMERIC(10,2) DEFAULT 0,
  sale_date DATE DEFAULT CURRENT_DATE,
  expertise_date DATE,
  expertise_amount NUMERIC(10,2),
  salvage_value NUMERIC(10,2),
  notes TEXT,
  document_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  -- Check and add repair_order_id if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cessions' AND column_name = 'repair_order_id') THEN
    ALTER TABLE public.cessions ADD COLUMN repair_order_id UUID REFERENCES public.repair_orders(id) ON DELETE SET NULL;
  END IF;
  
  -- Check and add bank_account_id if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cessions' AND column_name = 'bank_account_id') THEN
    ALTER TABLE public.cessions ADD COLUMN bank_account_id UUID REFERENCES public.bank_accounts(id) ON DELETE SET NULL;
  END IF;
  
  -- Check and add incident_number if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cessions' AND column_name = 'incident_number') THEN
    ALTER TABLE public.cessions ADD COLUMN incident_number TEXT;
  END IF;
  
  -- Check and add incident_date if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cessions' AND column_name = 'incident_date') THEN
    ALTER TABLE public.cessions ADD COLUMN incident_date DATE;
  END IF;
  
  -- Check and add policy_number if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cessions' AND column_name = 'policy_number') THEN
    ALTER TABLE public.cessions ADD COLUMN policy_number TEXT;
  END IF;
  
  -- Check and add report_number if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cessions' AND column_name = 'report_number') THEN
    ALTER TABLE public.cessions ADD COLUMN report_number TEXT;
  END IF;
  
  -- Check and add expert_name if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cessions' AND column_name = 'expert_name') THEN
    ALTER TABLE public.cessions ADD COLUMN expert_name TEXT;
  END IF;
  
  -- Check and add insurance_company_id if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cessions' AND column_name = 'insurance_company_id') THEN
    ALTER TABLE public.cessions ADD COLUMN insurance_company_id UUID REFERENCES public.insurance_companies(id) ON DELETE SET NULL;
  END IF;
  
  -- Ensure reference column exists and has proper default
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cessions' AND column_name = 'reference') THEN
    ALTER TABLE public.cessions ADD COLUMN reference TEXT NOT NULL DEFAULT '';
  ELSE
    -- Update existing reference column to ensure it's not null
    ALTER TABLE public.cessions ALTER COLUMN reference SET DEFAULT '';
    
    -- Update records with empty references using a simpler approach
    UPDATE public.cessions 
    SET reference = 'CC-' || EXTRACT(YEAR FROM created_at) || '-' || LPAD((
      SELECT COUNT(*) + 1 
      FROM public.cessions c2 
      WHERE c2.created_at <= public.cessions.created_at 
      AND EXTRACT(YEAR FROM c2.created_at) = EXTRACT(YEAR FROM public.cessions.created_at)
    )::TEXT, 3, '0')
    WHERE reference IS NULL OR reference = '';
  END IF;
  
  -- Ensure status column exists with proper default and constraint
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cessions' AND column_name = 'status') THEN
    ALTER TABLE public.cessions ADD COLUMN status TEXT DEFAULT 'en_attente';
  END IF;
  
  -- Ensure buyer_name has proper default
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cessions' AND column_name = 'buyer_name') THEN
    ALTER TABLE public.cessions ALTER COLUMN buyer_name SET DEFAULT '';
    UPDATE public.cessions SET buyer_name = '' WHERE buyer_name IS NULL;
  ELSE
    ALTER TABLE public.cessions ADD COLUMN buyer_name TEXT DEFAULT '';
  END IF;
  
  -- Ensure sale_price has proper type and default
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cessions' AND column_name = 'sale_price') THEN
    ALTER TABLE public.cessions ALTER COLUMN sale_price TYPE NUMERIC(10,2);
    ALTER TABLE public.cessions ALTER COLUMN sale_price SET DEFAULT 0;
    UPDATE public.cessions SET sale_price = 0 WHERE sale_price IS NULL;
  ELSE
    ALTER TABLE public.cessions ADD COLUMN sale_price NUMERIC(10,2) DEFAULT 0;
  END IF;
  
  -- Ensure sale_date has proper default
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cessions' AND column_name = 'sale_date') THEN
    ALTER TABLE public.cessions ALTER COLUMN sale_date SET DEFAULT CURRENT_DATE;
    UPDATE public.cessions SET sale_date = CURRENT_DATE WHERE sale_date IS NULL;
  ELSE
    ALTER TABLE public.cessions ADD COLUMN sale_date DATE DEFAULT CURRENT_DATE;
  END IF;
END $$;

-- Drop existing status constraint if it exists
ALTER TABLE public.cessions DROP CONSTRAINT IF EXISTS cessions_status_check;

-- Add updated status constraint with all valid status values
ALTER TABLE public.cessions 
ADD CONSTRAINT cessions_status_check 
CHECK (status IN (
  'en_attente',
  'en_attente_signature', 
  'signee',
  'signature_refusee',
  'lettre_recommandee_envoyee',
  'lettre_recommandee_recue',
  'lettre_recommandee_non_recuperee',
  'lettre_recommandee_refusee',
  'lettre_recommandee_presentee',
  'payee'
));

-- Ensure RLS is enabled
ALTER TABLE public.cessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view their own cessions" ON public.cessions;
DROP POLICY IF EXISTS "Users can insert their own cessions" ON public.cessions;
DROP POLICY IF EXISTS "Users can update their own cessions" ON public.cessions;
DROP POLICY IF EXISTS "Users can delete their own cessions" ON public.cessions;

-- Create RLS policies
CREATE POLICY "Users can view their own cessions" ON public.cessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cessions" ON public.cessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cessions" ON public.cessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cessions" ON public.cessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cessions_user_id ON public.cessions(user_id);
CREATE INDEX IF NOT EXISTS idx_cessions_repair_order_id ON public.cessions(repair_order_id);
CREATE INDEX IF NOT EXISTS idx_cessions_status ON public.cessions(status);
CREATE INDEX IF NOT EXISTS idx_cessions_reference ON public.cessions(reference);

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_cessions_updated_at ON public.cessions;
CREATE TRIGGER update_cessions_updated_at 
    BEFORE UPDATE ON public.cessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add helpful comments
COMMENT ON TABLE public.cessions IS 'Table for managing debt assignments (cessions de créance)';
COMMENT ON COLUMN public.cessions.reference IS 'Unique reference for the cession';
COMMENT ON COLUMN public.cessions.status IS 'Current status of the cession process';
COMMENT ON COLUMN public.cessions.repair_order_id IS 'Reference to the associated repair order';
COMMENT ON COLUMN public.cessions.bank_account_id IS 'Reference to the bank account for payment';
COMMENT ON COLUMN public.cessions.incident_number IS 'Insurance incident number';
COMMENT ON COLUMN public.cessions.incident_date IS 'Date of the incident';
COMMENT ON COLUMN public.cessions.policy_number IS 'Insurance policy number';
COMMENT ON COLUMN public.cessions.report_number IS 'Expert report number';
COMMENT ON COLUMN public.cessions.expert_name IS 'Name of the insurance expert';
COMMENT ON COLUMN public.cessions.insurance_company_id IS 'Reference to the insurance company';

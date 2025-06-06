
-- Recreate cessions table with all necessary columns

CREATE TABLE IF NOT EXISTS public.cessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- Basic cession information
  reference TEXT NOT NULL DEFAULT '',
  status TEXT DEFAULT 'en_attente',
  
  -- Legacy fields (for compatibility)
  buyer_name TEXT,
  buyer_contact TEXT,
  sale_amount NUMERIC DEFAULT 0,
  sale_date DATE,
  notes TEXT,
  document_url TEXT,
  
  -- New cession fields
  repair_order_id UUID REFERENCES public.repair_orders(id),
  bank_account_id UUID REFERENCES public.bank_accounts(id),
  incident_number TEXT,
  incident_date DATE,
  policy_number TEXT,
  report_number TEXT,
  expert_name TEXT,
  insurance_company_id UUID REFERENCES public.insurance_companies(id),
  
  -- Legacy vehicle reference (for compatibility)
  vehicle_id UUID REFERENCES public.vehicles(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS (Row Level Security)
ALTER TABLE public.cessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own cessions" ON public.cessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cessions" ON public.cessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cessions" ON public.cessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cessions" ON public.cessions
  FOR DELETE USING (auth.uid() = user_id);

-- Add check constraint for status values
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

-- Add indexes for better performance
CREATE INDEX idx_cessions_user_id ON public.cessions(user_id);
CREATE INDEX idx_cessions_repair_order_id ON public.cessions(repair_order_id);
CREATE INDEX idx_cessions_status ON public.cessions(status);
CREATE INDEX idx_cessions_sale_date ON public.cessions(sale_date);

-- Add comments for documentation
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

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cessions_updated_at 
    BEFORE UPDATE ON public.cessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

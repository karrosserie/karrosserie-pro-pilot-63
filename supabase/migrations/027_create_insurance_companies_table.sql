
-- Create insurance_companies table
CREATE TABLE IF NOT EXISTS public.insurance_companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS (Row Level Security)
ALTER TABLE public.insurance_companies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies - Insurance companies can be read by all authenticated users
CREATE POLICY "Authenticated users can view insurance companies" ON public.insurance_companies
  FOR SELECT USING (auth.role() = 'authenticated');

-- Insert static data
INSERT INTO public.insurance_companies (id, name) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'AXA'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Allianz'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Generali'),
  ('550e8400-e29b-41d4-a716-446655440004', 'MAIF'),
  ('550e8400-e29b-41d4-a716-446655440005', 'MACIF'),
  ('550e8400-e29b-41d4-a716-446655440006', 'MAAF'),
  ('550e8400-e29b-41d4-a716-446655440007', 'Groupama'),
  ('550e8400-e29b-41d4-a716-446655440008', 'Crédit Agricole Assurances'),
  ('550e8400-e29b-41d4-a716-446655440009', 'Matmut'),
  ('550e8400-e29b-41d4-a716-44665544000a', 'Direct Assurance')
ON CONFLICT (id) DO NOTHING;

-- Add indexes for better performance
CREATE INDEX idx_insurance_companies_name ON public.insurance_companies(name);

-- Add comments for documentation
COMMENT ON TABLE public.insurance_companies IS 'Table for managing insurance companies';
COMMENT ON COLUMN public.insurance_companies.name IS 'Insurance company name';

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_insurance_companies_updated_at 
    BEFORE UPDATE ON public.insurance_companies 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

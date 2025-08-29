-- Create table for fleet vehicle violations
CREATE TABLE public.fleet_violations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fleet_vehicle_id UUID NOT NULL,
  license_plate TEXT NOT NULL,
  violation_date DATE NOT NULL,
  violation_time TIME,
  location TEXT,
  violation_type TEXT NOT NULL,
  fine_amount NUMERIC DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'En attente',
  reference_number TEXT,
  due_date DATE,
  notes TEXT,
  document_url TEXT,
  borrower_name TEXT,
  borrower_phone TEXT,
  borrower_email TEXT,
  company_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.fleet_violations ENABLE ROW LEVEL SECURITY;

-- Create policies for company access
CREATE POLICY "Company members can manage fleet violations"
ON public.fleet_violations
FOR ALL
USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Create indexes for better performance
CREATE INDEX idx_fleet_violations_vehicle_id ON public.fleet_violations(fleet_vehicle_id);
CREATE INDEX idx_fleet_violations_company_id ON public.fleet_violations(company_id);
CREATE INDEX idx_fleet_violations_date ON public.fleet_violations(violation_date);
CREATE INDEX idx_fleet_violations_status ON public.fleet_violations(payment_status);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_fleet_violations_updated_at
BEFORE UPDATE ON public.fleet_violations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
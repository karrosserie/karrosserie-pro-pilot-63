
-- Add expert_name column to cessions table

ALTER TABLE public.cessions 
ADD COLUMN expert_name TEXT;

-- Add other missing columns for cession functionality
ALTER TABLE public.cessions 
ADD COLUMN incident_number TEXT,
ADD COLUMN incident_date DATE,
ADD COLUMN policy_number TEXT,
ADD COLUMN report_number TEXT,
ADD COLUMN insurance_company_id UUID REFERENCES public.insurance_companies(id),
ADD COLUMN repair_order_id UUID REFERENCES public.repair_orders(id),
ADD COLUMN status TEXT DEFAULT 'en_attente';

-- Add comments for the new columns
COMMENT ON COLUMN public.cessions.expert_name IS 'Name of the insurance expert';
COMMENT ON COLUMN public.cessions.incident_number IS 'Insurance incident number';
COMMENT ON COLUMN public.cessions.incident_date IS 'Date of the incident';
COMMENT ON COLUMN public.cessions.policy_number IS 'Insurance policy number';
COMMENT ON COLUMN public.cessions.report_number IS 'Expert report number';
COMMENT ON COLUMN public.cessions.insurance_company_id IS 'Reference to the insurance company';
COMMENT ON COLUMN public.cessions.repair_order_id IS 'Reference to the repair order';
COMMENT ON COLUMN public.cessions.status IS 'Status of the cession';

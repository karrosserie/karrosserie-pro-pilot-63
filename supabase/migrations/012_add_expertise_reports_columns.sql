
-- Add missing columns to expertise_reports table

ALTER TABLE public.expertise_reports 
ADD COLUMN IF NOT EXISTS report_number TEXT,
ADD COLUMN IF NOT EXISTS report_date DATE,
ADD COLUMN IF NOT EXISTS claim_number TEXT,
ADD COLUMN IF NOT EXISTS incident_date DATE,
ADD COLUMN IF NOT EXISTS policy_number TEXT,
ADD COLUMN IF NOT EXISTS repairs_data TEXT,
ADD COLUMN IF NOT EXISTS parts_data TEXT;

-- Add index for better performance on report_number lookups
CREATE INDEX IF NOT EXISTS idx_expertise_reports_report_number ON public.expertise_reports(report_number);
CREATE INDEX IF NOT EXISTS idx_expertise_reports_claim_number ON public.expertise_reports(claim_number);

-- Update the updated_at trigger for expertise_reports if it doesn't exist
DROP TRIGGER IF EXISTS update_expertise_reports_updated_at ON public.expertise_reports;
CREATE TRIGGER update_expertise_reports_updated_at
    BEFORE UPDATE ON public.expertise_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

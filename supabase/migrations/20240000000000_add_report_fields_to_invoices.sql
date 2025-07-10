-- Add report fields to invoices table to match quotes table structure

ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS report_number TEXT,
ADD COLUMN IF NOT EXISTS policy_number TEXT,
ADD COLUMN IF NOT EXISTS report_date DATE,
ADD COLUMN IF NOT EXISTS expert_name TEXT,
ADD COLUMN IF NOT EXISTS incident_date DATE;

-- Update RLS policies if needed (they should inherit from existing policies)

-- Add comment to document the change
COMMENT ON COLUMN invoices.report_number IS 'Numéro du rapport d''expertise';
COMMENT ON COLUMN invoices.policy_number IS 'Numéro de police d''assurance';
COMMENT ON COLUMN invoices.report_date IS 'Date du rapport d''expertise';
COMMENT ON COLUMN invoices.expert_name IS 'Nom de l''expert';
COMMENT ON COLUMN invoices.incident_date IS 'Date du sinistre';
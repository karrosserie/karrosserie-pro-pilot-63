-- Add report_id field to quotes table to track which expertise report was used for conversion
ALTER TABLE quotes 
ADD COLUMN report_id UUID REFERENCES expertise_reports(id);

-- Add index for better query performance
CREATE INDEX idx_quotes_report_id ON quotes(report_id);

-- Add comment for documentation
COMMENT ON COLUMN quotes.report_id IS 'ID of the expertise report used to create this quote (for converted quotes)';
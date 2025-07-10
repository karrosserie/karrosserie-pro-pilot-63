-- Add discount_data field to quotes table to store discounts as JSON
ALTER TABLE quotes 
ADD COLUMN discount_data TEXT;

-- Add comment for documentation
COMMENT ON COLUMN quotes.discount_data IS 'JSON data containing discounts information';
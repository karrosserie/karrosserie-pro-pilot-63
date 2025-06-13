
-- Add payment_due_date column to invoices table
ALTER TABLE invoices ADD COLUMN payment_due_date DATE;

-- Add comment to explain the field
COMMENT ON COLUMN invoices.payment_due_date IS 'Date limite de paiement de la facture';

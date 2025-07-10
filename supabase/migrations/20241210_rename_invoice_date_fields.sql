-- Rename invoice date fields
-- due_date → date
-- payment_due_date → due_date

ALTER TABLE invoices 
  RENAME COLUMN due_date TO date;

ALTER TABLE invoices 
  RENAME COLUMN payment_due_date TO due_date;
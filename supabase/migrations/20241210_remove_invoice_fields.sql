-- Migration: Remove description, current_mileage, payment_date, and payment_method fields from invoices table
-- Created: 2024-12-10

-- Remove the fields that are no longer needed
ALTER TABLE invoices 
DROP COLUMN IF EXISTS description,
DROP COLUMN IF EXISTS current_mileage,
DROP COLUMN IF EXISTS payment_date,
DROP COLUMN IF EXISTS payment_method;
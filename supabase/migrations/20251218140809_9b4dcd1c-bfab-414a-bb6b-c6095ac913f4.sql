-- Add is_franchise_credit column to credits table
ALTER TABLE credits ADD COLUMN IF NOT EXISTS is_franchise_credit BOOLEAN DEFAULT false;
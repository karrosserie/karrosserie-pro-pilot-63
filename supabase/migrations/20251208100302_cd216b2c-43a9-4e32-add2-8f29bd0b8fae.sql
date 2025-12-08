-- Add check scan date column to receipts table
ALTER TABLE public.receipts ADD COLUMN IF NOT EXISTS check_scan_date timestamp with time zone;
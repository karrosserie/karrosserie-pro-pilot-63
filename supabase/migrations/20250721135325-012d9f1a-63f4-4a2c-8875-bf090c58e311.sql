-- Add new fields to insurance_companies table
ALTER TABLE public.insurance_companies 
ADD COLUMN address TEXT,
ADD COLUMN address2 TEXT,
ADD COLUMN zipcode TEXT,
ADD COLUMN city TEXT,
ADD COLUMN phone TEXT,
ADD COLUMN email TEXT;
-- Add sinister_date and expertise_report_number columns to fleet_reservations
ALTER TABLE public.fleet_reservations 
ADD COLUMN sinister_date DATE,
ADD COLUMN expertise_report_number VARCHAR;
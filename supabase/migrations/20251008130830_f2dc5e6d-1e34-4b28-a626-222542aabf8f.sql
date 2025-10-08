-- Enable RLS on otp_codes table (only accessible via service_role/Edge Functions)
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- No policies needed as this table is only accessed by Edge Functions with service_role key
-- This prevents any direct access from the frontend while allowing Edge Functions to operate
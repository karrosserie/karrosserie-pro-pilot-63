-- Create the otp_codes table
CREATE TABLE public.otp_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  telephone TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '10 minutes'),
  used BOOLEAN NOT NULL DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  attempts INTEGER NOT NULL DEFAULT 0
);

-- Create indexes for performance
CREATE INDEX idx_otp_codes_telephone ON public.otp_codes(telephone);
CREATE INDEX idx_otp_codes_created_at ON public.otp_codes(created_at);
CREATE INDEX idx_otp_codes_telephone_code ON public.otp_codes(telephone, code);

-- RLS is disabled for this table as it's not used by the frontend
-- Only Edge Functions and service_role will access it

-- Create function to automatically clean expired OTP codes (older than 24h)
CREATE OR REPLACE FUNCTION public.cleanup_expired_otp_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.otp_codes
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- Create trigger to automatically set expires_at on insert
CREATE OR REPLACE FUNCTION public.set_otp_expiration()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.expires_at := NEW.created_at + INTERVAL '10 minutes';
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_otp_expiration
BEFORE INSERT ON public.otp_codes
FOR EACH ROW
EXECUTE FUNCTION public.set_otp_expiration();
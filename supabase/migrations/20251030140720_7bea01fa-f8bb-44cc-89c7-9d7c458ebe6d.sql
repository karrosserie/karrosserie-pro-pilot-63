-- Add actual_communication_date and is_inbound to messageries
ALTER TABLE public.messageries 
ADD COLUMN actual_communication_date timestamp with time zone DEFAULT now(),
ADD COLUMN is_inbound boolean DEFAULT false;

-- Add actual_communication_date and is_inbound to messagerie_replies
ALTER TABLE public.messagerie_replies 
ADD COLUMN actual_communication_date timestamp with time zone DEFAULT now(),
ADD COLUMN is_inbound boolean DEFAULT false;

-- Update existing records to use created_at as actual_communication_date
UPDATE public.messageries SET actual_communication_date = created_at WHERE actual_communication_date IS NULL;
UPDATE public.messagerie_replies SET actual_communication_date = created_at WHERE actual_communication_date IS NULL;

-- Add comments for clarity
COMMENT ON COLUMN public.messageries.actual_communication_date IS 'Real date when the communication happened (different from created_at which is when it was recorded in system)';
COMMENT ON COLUMN public.messageries.is_inbound IS 'True if client contacted us, false if we contacted client';
COMMENT ON COLUMN public.messagerie_replies.actual_communication_date IS 'Real date when this exchange happened';
COMMENT ON COLUMN public.messagerie_replies.is_inbound IS 'True if client sent this, false if we sent it';
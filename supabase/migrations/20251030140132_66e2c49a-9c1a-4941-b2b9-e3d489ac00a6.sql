-- Add client_id to messageries table to link messages to clients
ALTER TABLE public.messageries 
ADD COLUMN client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL;

CREATE INDEX idx_messageries_client_id ON public.messageries(client_id);

-- Add columns to track conversation status
ALTER TABLE public.messageries
ADD COLUMN last_reply_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN replies_count INTEGER DEFAULT 0;

-- Create messagerie_replies table for conversation threads
CREATE TABLE public.messagerie_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  messagerie_id UUID NOT NULL REFERENCES public.messageries(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.company_info(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('carrosserie', 'client')),
  sender_id UUID, -- user_id if carrosserie, client_id if client
  content TEXT NOT NULL,
  channel TEXT NOT NULL, -- Mail, SMS, WhatsApp, Téléphone
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_by_client BOOLEAN DEFAULT FALSE,
  read_by_company BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_messagerie_replies_messagerie_id ON public.messagerie_replies(messagerie_id);
CREATE INDEX idx_messagerie_replies_sender ON public.messagerie_replies(sender_type, sender_id);
CREATE INDEX idx_messagerie_replies_created_at ON public.messagerie_replies(created_at DESC);

-- Enable RLS on messagerie_replies
ALTER TABLE public.messagerie_replies ENABLE ROW LEVEL SECURITY;

-- RLS Policy for messagerie_replies
CREATE POLICY "Company members can manage replies"
  ON public.messagerie_replies
  FOR ALL
  USING (user_belongs_to_company(auth.uid(), company_id))
  WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Create function to update replies_count and last_reply_at
CREATE OR REPLACE FUNCTION update_messagerie_reply_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.messageries
  SET 
    replies_count = (
      SELECT COUNT(*) 
      FROM public.messagerie_replies 
      WHERE messagerie_id = NEW.messagerie_id
    ),
    last_reply_at = NEW.sent_at,
    updated_at = NOW()
  WHERE id = NEW.messagerie_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update stats
CREATE TRIGGER trigger_update_messagerie_reply_stats
  AFTER INSERT ON public.messagerie_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_messagerie_reply_stats();
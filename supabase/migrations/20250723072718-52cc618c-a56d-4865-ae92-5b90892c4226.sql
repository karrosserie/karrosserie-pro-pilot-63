-- Create bridge table
CREATE TABLE public.bridge (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bridge_id UUID NOT NULL,
  access_token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.bridge ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own bridge data" ON public.bridge
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bridge data" ON public.bridge
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bridge data" ON public.bridge
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bridge data" ON public.bridge
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.bridge
  FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);

-- Create indexes for better performance
CREATE INDEX idx_bridge_user_id ON public.bridge(user_id);
CREATE INDEX idx_bridge_bridge_id ON public.bridge(bridge_id);
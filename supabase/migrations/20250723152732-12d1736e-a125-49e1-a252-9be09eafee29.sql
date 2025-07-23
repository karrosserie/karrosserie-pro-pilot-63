-- Create intervention_sheets table
CREATE TABLE public.intervention_sheets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_id UUID NOT NULL,
  vehicle_id UUID NOT NULL,
  carrosserie_reports JSONB DEFAULT '[]'::jsonb,
  mecanique_reports JSONB DEFAULT '[]'::jsonb,
  electrique_reports JSONB DEFAULT '[]'::jsonb,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.intervention_sheets ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own intervention sheets" 
ON public.intervention_sheets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own intervention sheets" 
ON public.intervention_sheets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own intervention sheets" 
ON public.intervention_sheets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own intervention sheets" 
ON public.intervention_sheets 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_intervention_sheets_updated_at
BEFORE UPDATE ON public.intervention_sheets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
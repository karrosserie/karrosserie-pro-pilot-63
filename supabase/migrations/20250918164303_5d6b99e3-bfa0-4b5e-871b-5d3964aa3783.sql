-- Create peinture_info table for storing paint information with vehicle details
CREATE TABLE public.peinture_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  task_id UUID NOT NULL,
  vehicle_id UUID NOT NULL,
  paint_brand TEXT NOT NULL,
  color_code TEXT NOT NULL,
  vehicle_brand TEXT,
  vehicle_model TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.peinture_info ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Company members can manage peinture info" 
ON public.peinture_info 
FOR ALL 
USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Add trigger for updated_at
CREATE TRIGGER update_peinture_info_updated_at
BEFORE UPDATE ON public.peinture_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
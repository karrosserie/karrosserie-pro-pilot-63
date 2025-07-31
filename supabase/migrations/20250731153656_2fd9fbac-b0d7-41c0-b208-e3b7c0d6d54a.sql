-- Créer une table pour gérer les étapes de workflow des véhicules dans l'atelier
CREATE TABLE public.vehicle_workflow_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL,
  company_id UUID NOT NULL,
  current_step TEXT NOT NULL DEFAULT 'accueil_preparation',
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  technician_id UUID,
  estimated_completion_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vehicle_workflow_steps ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Company members can manage vehicle workflow steps" 
ON public.vehicle_workflow_steps 
FOR ALL 
USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Create trigger for timestamp updates
CREATE TRIGGER update_vehicle_workflow_steps_updated_at
BEFORE UPDATE ON public.vehicle_workflow_steps
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default workflow steps for existing vehicles
INSERT INTO public.vehicle_workflow_steps (vehicle_id, company_id, current_step, progress_percentage)
SELECT v.id, v.company_id, 'accueil_preparation', 0
FROM public.vehicles v
WHERE v.company_id IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM public.vehicle_workflow_steps vws 
  WHERE vws.vehicle_id = v.id
);
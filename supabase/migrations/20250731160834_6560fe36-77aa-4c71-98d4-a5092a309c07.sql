-- Créer une table pour les horaires d'ouverture de l'atelier
CREATE TABLE public.workshop_schedule (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  enabled BOOLEAN NOT NULL DEFAULT true,
  full_day BOOLEAN NOT NULL DEFAULT false,
  morning_start TIME,
  morning_end TIME,
  afternoon_start TIME,
  afternoon_end TIME,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, day_of_week)
);

-- Activer RLS
ALTER TABLE public.workshop_schedule ENABLE ROW LEVEL SECURITY;

-- Créer des politiques RLS
CREATE POLICY "Company members can manage workshop schedule" 
ON public.workshop_schedule 
FOR ALL 
USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_workshop_schedule_updated_at
  BEFORE UPDATE ON public.workshop_schedule
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
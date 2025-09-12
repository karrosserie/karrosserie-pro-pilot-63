-- Créer une table pour les photos de véhicules prises dans les étapes atelier
CREATE TABLE public.vehicle_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL,
  company_id UUID NOT NULL,
  employee_id UUID NOT NULL,
  photo_type TEXT NOT NULL DEFAULT 'workshop', -- Type de photo (workshop, inspection, etc.)
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur la table
ALTER TABLE public.vehicle_photos ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Company members can view vehicle photos" 
ON public.vehicle_photos 
FOR SELECT 
USING (user_belongs_to_company(auth.uid(), company_id));

CREATE POLICY "Company members can insert vehicle photos" 
ON public.vehicle_photos 
FOR INSERT 
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

CREATE POLICY "Company members can update vehicle photos" 
ON public.vehicle_photos 
FOR UPDATE 
USING (user_belongs_to_company(auth.uid(), company_id));

CREATE POLICY "Company members can delete vehicle photos" 
ON public.vehicle_photos 
FOR DELETE 
USING (user_belongs_to_company(auth.uid(), company_id));

-- Créer un trigger pour mettre à jour updated_at
CREATE TRIGGER update_vehicle_photos_updated_at
BEFORE UPDATE ON public.vehicle_photos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
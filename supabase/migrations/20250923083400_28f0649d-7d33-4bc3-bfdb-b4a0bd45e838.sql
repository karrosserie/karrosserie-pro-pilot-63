-- Supprimer toutes les politiques viewer existantes pour éviter les conflits
DROP POLICY IF EXISTS "Viewer role can read all clients" ON public.clients;
DROP POLICY IF EXISTS "Viewer role can read all vehicles" ON public.vehicles;  
DROP POLICY IF EXISTS "Viewer role can read all employee schedules" ON public.employee_schedule;
DROP POLICY IF EXISTS "Viewer role can read all task photos" ON public.task_photos;

-- Supprimer les anciennes politiques d'accès public avec tokens
DROP POLICY IF EXISTS "Allow public read client with valid token" ON public.clients;
DROP POLICY IF EXISTS "Allow public update client documents with valid token" ON public.clients;
DROP POLICY IF EXISTS "Allow public read vehicle with valid token" ON public.vehicles;

-- 1. Créer la politique viewer pour les clients
CREATE POLICY "Viewer role can read all clients" 
ON public.clients 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'viewer'
  )
);

-- 2. Créer la politique viewer pour les véhicules  
CREATE POLICY "Viewer role can read all vehicles" 
ON public.vehicles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'viewer'
  )
);

-- 3. Créer la politique viewer pour employee_schedule (tâches)
CREATE POLICY "Viewer role can read all employee schedules" 
ON public.employee_schedule 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'viewer'
  )
);

-- 4. Créer la table task_photos si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.task_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES public.employee_schedule(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  company_id uuid NOT NULL
);

-- Activer RLS sur task_photos
ALTER TABLE public.task_photos ENABLE ROW LEVEL SECURITY;

-- 5. Créer les politiques pour task_photos
DROP POLICY IF EXISTS "Company members can manage task photos" ON public.task_photos;
CREATE POLICY "Company members can manage task photos" 
ON public.task_photos 
FOR ALL 
USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

CREATE POLICY "Viewer role can read all task photos" 
ON public.task_photos 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'viewer'
  )
);
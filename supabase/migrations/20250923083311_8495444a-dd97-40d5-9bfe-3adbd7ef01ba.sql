-- 1. Créer l'utilisateur mobile avec le rôle viewer
-- Note: L'utilisateur sera créé via l'interface d'administration, ici on prépare la structure

-- 2. Modifier les politiques RLS pour les clients - Remplacer l'accès public par le rôle viewer
DROP POLICY IF EXISTS "Allow public read client with valid token" ON public.clients;

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

-- 3. Modifier les politiques RLS pour les véhicules - Remplacer l'accès public par le rôle viewer  
DROP POLICY IF EXISTS "Allow public read vehicle with valid token" ON public.vehicles;

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

-- 4. Ajouter une politique spécifique pour viewer sur employee_schedule (tâches)
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

-- 5. Créer la table task_photos si elle n'existe pas et ajouter la politique viewer
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

-- Politique pour les membres d'entreprise sur task_photos
CREATE POLICY "Company members can manage task photos" 
ON public.task_photos 
FOR ALL 
USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Politique pour viewer sur task_photos
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

-- 6. Supprimer les anciennes politiques de mise à jour publique des clients avec tokens
DROP POLICY IF EXISTS "Allow public update client documents with valid token" ON public.clients;
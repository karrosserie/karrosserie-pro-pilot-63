-- 1. Modifier les politiques RLS pour les clients - Remplacer l'accès public par le rôle viewer
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

-- 2. Modifier les politiques RLS pour les véhicules - Remplacer l'accès public par le rôle viewer  
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

-- 3. Ajouter une politique spécifique pour viewer sur employee_schedule (tâches)
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

-- 4. Ajouter politique viewer sur task_photos (si la table existe déjà)
DROP POLICY IF EXISTS "Viewer role can read all task photos" ON public.task_photos;

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

-- 5. Supprimer les anciennes politiques de mise à jour publique des clients avec tokens
DROP POLICY IF EXISTS "Allow public update client documents with valid token" ON public.clients;
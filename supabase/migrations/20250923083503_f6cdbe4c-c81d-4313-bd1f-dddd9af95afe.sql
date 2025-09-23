-- Nettoyer et recréer les politiques RLS pour le rôle viewer

-- 1. Supprimer toutes les politiques viewer existantes
DROP POLICY IF EXISTS "Viewer role can read all clients" ON public.clients;
DROP POLICY IF EXISTS "Viewer role can read all vehicles" ON public.vehicles;  
DROP POLICY IF EXISTS "Viewer role can read all employee schedules" ON public.employee_schedule;
DROP POLICY IF EXISTS "Viewer role can read all task photos" ON public.task_photos;

-- 2. Supprimer les anciennes politiques publiques avec tokens
DROP POLICY IF EXISTS "Allow public read client with valid token" ON public.clients;
DROP POLICY IF EXISTS "Allow public read vehicle with valid token" ON public.vehicles;
DROP POLICY IF EXISTS "Allow public update client documents with valid token" ON public.clients;

-- 3. Créer les nouvelles politiques pour le rôle viewer
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

-- 4. Créer politique pour task_photos si la table existe
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'task_photos' AND table_schema = 'public') THEN
    EXECUTE 'CREATE POLICY "Viewer role can read all task photos" ON public.task_photos FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = ''viewer''))';
  END IF;
END $$;
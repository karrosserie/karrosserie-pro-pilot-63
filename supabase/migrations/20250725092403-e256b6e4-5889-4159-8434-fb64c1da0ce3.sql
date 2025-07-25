-- Ajouter le champ user_id à la table imports
ALTER TABLE public.imports 
ADD COLUMN user_id UUID NOT NULL;

-- Ajouter une clé étrangère vers auth.users (bien qu'on évite généralement les FK vers auth.users, 
-- nous utilisons cette approche ici pour la cohérence avec les autres tables)
-- Note: Nous ne créons pas de FK vers auth.users pour éviter les problèmes

-- Mettre à jour les politiques RLS pour utiliser le user_id directement
DROP POLICY IF EXISTS "Users can view imports of their own reports" ON public.imports;
DROP POLICY IF EXISTS "Users can insert imports for their own reports" ON public.imports;
DROP POLICY IF EXISTS "Users can update imports of their own reports" ON public.imports;
DROP POLICY IF EXISTS "Users can delete imports of their own reports" ON public.imports;

-- Nouvelles politiques utilisant directement user_id
CREATE POLICY "Users can view their own imports" 
ON public.imports 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own imports" 
ON public.imports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own imports" 
ON public.imports 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own imports" 
ON public.imports 
FOR DELETE 
USING (auth.uid() = user_id);
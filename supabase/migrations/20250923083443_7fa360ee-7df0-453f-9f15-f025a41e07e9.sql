-- Ajouter la colonne role à profiles si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND table_schema = 'public' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN role text DEFAULT 'user';
  END IF;
END $$;

-- Créer une contrainte pour garantir que seuls certains rôles sont autorisés
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin', 'user', 'viewer', 'Propriétaire', 'Carrossier', 'Carrossier de courtoisie', 'Responsable', 'Responsable admin'));

-- Commenter la procédure à suivre
COMMENT ON COLUMN public.profiles.role IS 'Rôle de l''utilisateur. Valeurs possibles: admin, user, viewer, Propriétaire, Carrossier, Carrossier de courtoisie, Responsable, Responsable admin';

-- Vérification que les politiques RLS fonctionnent avec le rôle viewer
-- (pas d'action nécessaire, juste pour documentation)
SELECT 
  schemaname, 
  tablename, 
  policyname
FROM pg_policies 
WHERE policyname LIKE '%viewer%';
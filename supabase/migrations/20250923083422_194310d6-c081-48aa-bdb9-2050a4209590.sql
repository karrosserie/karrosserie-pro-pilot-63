-- Créer l'utilisateur mobile avec email user-mobile@karrosserie.pro
-- et rôle viewer dans la table profiles

-- 1. Insérer l'utilisateur dans auth.users (avec mot de passe haché)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000'::uuid,
  'user-mobile@karrosserie.pro',
  crypt('Karrosser1.Pr0', gen_salt('bf')),  -- Mot de passe : Karrosser1.Pr0
  now(),  -- Email confirmé immédiatement
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"viewer"}',
  false,
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- 2. Créer le profil correspondant dans la table profiles avec le rôle viewer
INSERT INTO public.profiles (
  id,
  first_name,
  last_name,
  email,
  role
) 
SELECT 
  u.id,
  'Mobile',
  'User',
  u.email,
  'viewer'
FROM auth.users u 
WHERE u.email = 'user-mobile@karrosserie.pro'
ON CONFLICT (id) DO UPDATE SET 
  role = 'viewer',
  first_name = 'Mobile',
  last_name = 'User';

-- 3. Vérifier que la colonne role existe dans profiles, sinon l'ajouter
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
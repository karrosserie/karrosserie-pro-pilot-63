-- Réexécuter l'assignation des rôles pour les utilisateurs de test
DO $$
DECLARE
  target_company_id uuid;
  user_id uuid;
  users_data jsonb := '[
    {"email": "carrossier@gmail.com", "first_name": "Test", "last_name": "Carrossier", "role": "Carrossier"},
    {"email": "carrossiercourtois@gmail.com", "first_name": "Test", "last_name": "Carrossier Courtoisie", "role": "Carrossier-vehicule de courtoisie"},
    {"email": "responsable@gmail.com", "first_name": "Test", "last_name": "Responsable", "role": "Responsable"},
    {"email": "responsableadmin@gmail.com", "first_name": "Test", "last_name": "Responsable Admin", "role": "Responsable administratif"}
  ]';
  user_record jsonb;
BEGIN
  -- Récupérer la première entreprise disponible
  SELECT id INTO target_company_id 
  FROM public.company_info 
  ORDER BY created_at ASC 
  LIMIT 1;
  
  IF target_company_id IS NULL THEN
    RAISE EXCEPTION 'Aucune entreprise trouvée. Créez d''abord une entreprise.';
  END IF;
  
  RAISE NOTICE 'Configuration des utilisateurs de test pour l''entreprise %', target_company_id;
  
  -- Traiter chaque utilisateur
  FOR user_record IN SELECT * FROM jsonb_array_elements(users_data)
  LOOP
    -- Chercher l'utilisateur dans auth.users
    SELECT id INTO user_id 
    FROM auth.users 
    WHERE email = user_record->>'email'
    LIMIT 1;
    
    IF user_id IS NOT NULL THEN
      -- Créer ou mettre à jour le profil
      INSERT INTO public.profiles (id, first_name, last_name, email, created_at, updated_at)
      VALUES (user_id, user_record->>'first_name', user_record->>'last_name', user_record->>'email', now(), now())
      ON CONFLICT (id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        email = EXCLUDED.email,
        updated_at = now();
      
      -- Supprimer l'ancienne association si elle existe
      DELETE FROM public.user_companies WHERE user_id = user_id;
      
      -- Créer l'association utilisateur-entreprise avec le rôle approprié
      INSERT INTO public.user_companies (user_id, company_id, role, active, created_at, updated_at)
      VALUES (user_id, target_company_id, user_record->>'role', true, now(), now());
      
      RAISE NOTICE 'Utilisateur % configuré avec le rôle %', user_record->>'email', user_record->>'role';
    ELSE
      RAISE NOTICE 'ATTENTION: L''utilisateur % n''existe pas encore dans auth.users. Créez-le d''abord via l''interface Supabase.', user_record->>'email';
    END IF;
  END LOOP;
END $$;
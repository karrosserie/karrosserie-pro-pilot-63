-- Créer des utilisateurs de test pour l'accessibilité avec rôles spécifiques
-- Note: Les utilisateurs doivent d'abord être créés manuellement dans l'interface Supabase Auth
-- Cette migration prépare leurs profils et rôles une fois qu'ils se connectent

-- Créer les profils pour les utilisateurs de test (ils seront créés automatiquement lors de la première connexion via le trigger)
-- Mais on peut aussi les préparer ici avec des UUIDs fixes pour faciliter les tests

-- Fonction pour créer un utilisateur de test complet
CREATE OR REPLACE FUNCTION create_test_user(
  user_email text,
  user_first_name text,
  user_last_name text,
  user_role text,
  target_company_id uuid
) RETURNS void AS $$
DECLARE
  user_id uuid;
  profile_exists boolean;
BEGIN
  -- Vérifier si l'utilisateur existe déjà via son email
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = user_email
  LIMIT 1;
  
  -- Si l'utilisateur n'existe pas, on ne peut pas continuer
  -- (l'utilisateur doit être créé via l'interface Supabase Auth)
  IF user_id IS NULL THEN
    RAISE NOTICE 'Utilisateur % n''existe pas encore dans auth.users. Créez-le d''abord via l''interface Supabase.', user_email;
    RETURN;
  END IF;
  
  -- Vérifier si le profil existe
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = user_id) INTO profile_exists;
  
  -- Créer ou mettre à jour le profil
  IF profile_exists THEN
    UPDATE public.profiles 
    SET 
      first_name = user_first_name,
      last_name = user_last_name,
      email = user_email,
      updated_at = now()
    WHERE id = user_id;
  ELSE
    INSERT INTO public.profiles (id, first_name, last_name, email, created_at, updated_at)
    VALUES (user_id, user_first_name, user_last_name, user_email, now(), now());
  END IF;
  
  -- Supprimer l'ancienne association si elle existe
  DELETE FROM public.user_companies WHERE user_id = user_id;
  
  -- Créer l'association utilisateur-entreprise avec le rôle approprié
  INSERT INTO public.user_companies (user_id, company_id, role, active, created_at, updated_at)
  VALUES (user_id, target_company_id, user_role, true, now(), now());
  
  RAISE NOTICE 'Utilisateur de test % configuré avec le rôle %', user_email, user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Obtenir la première entreprise disponible pour les tests
DO $$
DECLARE
  target_company_id uuid;
BEGIN
  -- Récupérer la première entreprise disponible
  SELECT id INTO target_company_id 
  FROM public.company_info 
  ORDER BY created_at ASC 
  LIMIT 1;
  
  IF target_company_id IS NULL THEN
    RAISE EXCEPTION 'Aucune entreprise trouvée. Créez d''abord une entreprise.';
  END IF;
  
  RAISE NOTICE 'Utilisation de l''entreprise % pour les utilisateurs de test', target_company_id;
  
  -- Créer les utilisateurs de test (ils doivent d'abord exister dans auth.users)
  PERFORM create_test_user('carrossier@gmail.com', 'Test', 'Carrossier', 'Carrossier', target_company_id);
  PERFORM create_test_user('carrossiercourtois@gmail.com', 'Test', 'Carrossier Courtoisie', 'Carrossier-vehicule de courtoisie', target_company_id);
  PERFORM create_test_user('responsable@gmail.com', 'Test', 'Responsable', 'Responsable', target_company_id);
  PERFORM create_test_user('responsableadmin@gmail.com', 'Test', 'Responsable Admin', 'Responsable administratif', target_company_id);
END $$;

-- Nettoyer la fonction temporaire
DROP FUNCTION create_test_user(text, text, text, text, uuid);
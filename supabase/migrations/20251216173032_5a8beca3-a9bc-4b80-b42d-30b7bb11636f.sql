-- Fix handle_new_user trigger to create profiles for team members
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_company_id uuid;
BEGIN
  -- Vérifier si l'utilisateur est membre d'une équipe (invité)
  IF new.raw_user_meta_data->>'is_team_member' = 'true' THEN
    -- Créer SEULEMENT le profil pour les membres d'équipe (sans company_info)
    INSERT INTO public.profiles (
      id, first_name, last_name, phone_number, email
    )
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'first_name', ''),
      COALESCE(new.raw_user_meta_data->>'last_name', ''),
      COALESCE(new.raw_user_meta_data->>'phone_number', ''),
      new.email
    );
    RETURN new;
  END IF;

  -- Créer l'entrée company_info pour les propriétaires
  INSERT INTO public.company_info (
    name, email, phone, address, zipcode, city, siret, siren, tva
  )
  VALUES (
    COALESCE(new.raw_user_meta_data->>'company_name', ''),
    new.email,
    COALESCE(new.raw_user_meta_data->>'phone_number', ''),
    COALESCE(new.raw_user_meta_data->>'address', ''),
    COALESCE(new.raw_user_meta_data->>'postal_code', ''),
    COALESCE(new.raw_user_meta_data->>'city', ''),
    COALESCE(new.raw_user_meta_data->>'siret', ''),
    COALESCE(new.raw_user_meta_data->>'siren', ''),
    COALESCE(new.raw_user_meta_data->>'tva', '')
  )
  RETURNING id INTO new_company_id;

  -- Créer le profil utilisateur avec le rôle 'Propriétaire'
  INSERT INTO public.profiles (
    id, first_name, last_name, phone_number, email, role
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    COALESCE(new.raw_user_meta_data->>'phone_number', ''),
    new.email,
    'user'
  );

  -- Créer l'association utilisateur-entreprise
  INSERT INTO public.user_companies (
    user_id, company_id, role, active
  )
  VALUES (
    new.id,
    new_company_id,
    'Propriétaire',
    true
  );

  -- Créer les préférences de l'entreprise
  INSERT INTO public.company_preferences (company_id)
  VALUES (new_company_id);

  RETURN new;
END;
$function$;

-- Corriger le profil manquant pour l'utilisateur existant
INSERT INTO public.profiles (id, first_name, last_name, phone_number, email)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'first_name', ''),
  COALESCE(raw_user_meta_data->>'last_name', ''),
  COALESCE(raw_user_meta_data->>'phone_number', ''),
  email
FROM auth.users 
WHERE id = 'd88743a1-a3e6-4d95-8601-0b1f982d4f7c'
ON CONFLICT (id) DO NOTHING;
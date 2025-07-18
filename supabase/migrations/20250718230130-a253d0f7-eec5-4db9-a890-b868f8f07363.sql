-- Modifier la fonction pour créer automatiquement une compagnie et l'entrée user_companies
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_company_id uuid;
BEGIN
  -- Créer le profil utilisateur
  INSERT INTO public.profiles (id, first_name, last_name, email, phone_number)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email,
    NEW.raw_user_meta_data->>'phone_number'
  );
  
  -- Créer une nouvelle compagnie
  INSERT INTO public.company_info (id, name, email, phone, address, city, zipcode, siren, siret, tva)
  VALUES (
    gen_random_uuid(),
    COALESCE(NEW.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
    '',
    '',
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO new_company_id;
  
  -- Créer l'entrée user_companies avec le rôle Propriétaire
  INSERT INTO public.user_companies (user_id, company_id, role, active)
  VALUES (
    NEW.id,
    new_company_id,
    'Propriétaire',
    true
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
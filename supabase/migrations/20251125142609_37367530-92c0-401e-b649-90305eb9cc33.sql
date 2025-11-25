-- Mettre à jour la fonction handle_new_user pour stocker ville et code postal séparément
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_company_id uuid;
BEGIN
  -- Vérifier si l'utilisateur est membre d'une équipe
  IF new.raw_user_meta_data->>'is_team_member' = 'true' THEN
    -- Si c'est un membre d'équipe, ne pas créer de company_info ni de profil
    RETURN new;
  END IF;

  -- Créer l'entrée company_info (si pas un membre d'équipe)
  INSERT INTO public.company_info (
    name, 
    siren, 
    siret, 
    tva, 
    email, 
    phone, 
    address, 
    city,
    zipcode
  )
  VALUES (
    COALESCE(new.raw_user_meta_data->>'company_name', ''),
    COALESCE(new.raw_user_meta_data->>'company_siren', ''),
    COALESCE(new.raw_user_meta_data->>'company_siret', ''),
    COALESCE(new.raw_user_meta_data->>'company_vat_number', ''),
    new.email,
    COALESCE(new.raw_user_meta_data->>'phone_number', ''),
    COALESCE(new.raw_user_meta_data->>'company_address', ''),
    COALESCE(new.raw_user_meta_data->>'company_city', ''),
    COALESCE(new.raw_user_meta_data->>'company_zipcode', '')
  )
  RETURNING id INTO new_company_id;

  -- Créer le profil utilisateur
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    phone_number,
    email,
    company_id,
    role
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    COALESCE(new.raw_user_meta_data->>'phone_number', ''),
    new.email,
    new_company_id,
    'Administrateur'
  );

  -- Créer les préférences de l'entreprise avec les valeurs par défaut
  INSERT INTO public.company_preferences (
    company_id,
    invoice_template,
    show_payment_details,
    show_warning_text,
    language,
    currency,
    timezone
  )
  VALUES (
    new_company_id,
    'standard',
    true,
    true,
    'fr',
    'EUR',
    'Europe/Paris'
  );

  RETURN new;
END;
$$;
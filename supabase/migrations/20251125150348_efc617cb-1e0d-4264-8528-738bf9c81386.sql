-- Ajouter l'insertion dans user_companies au trigger handle_new_user

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_company_id uuid;
BEGIN
  -- Vérifier si l'utilisateur est membre d'une équipe
  IF new.raw_user_meta_data->>'is_team_member' = 'true' THEN
    RETURN new;
  END IF;

  -- Créer l'entrée company_info
  INSERT INTO public.company_info (
    name, siren, siret, tva, email, phone, address, city, zipcode
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

  -- Créer le profil utilisateur avec le rôle 'Propriétaire'
  INSERT INTO public.profiles (
    id, first_name, last_name, phone_number, email, company_id, role
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    COALESCE(new.raw_user_meta_data->>'phone_number', ''),
    new.email,
    new_company_id,
    'Propriétaire'
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
  INSERT INTO public.company_preferences (
    company_id, invoice_template, show_payment_details, 
    show_warning_text, language, currency, timezone
  )
  VALUES (
    new_company_id, 'standard', true, true, 'fr', 'EUR', 'Europe/Paris'
  );

  RETURN new;
END;
$$;
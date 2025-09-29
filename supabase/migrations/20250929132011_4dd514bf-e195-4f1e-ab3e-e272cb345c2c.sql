-- Modifier la fonction handle_new_user pour inclure la géolocalisation automatique
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  new_company_id uuid;
  trial_plan_id uuid;
  is_team_member boolean := false;
  geocode_response jsonb;
  company_latitude numeric;
  company_longitude numeric;
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
  
  -- Vérifier s'il s'agit d'un ajout via l'interface équipe
  IF NEW.raw_user_meta_data->>'is_team_member' = 'true' THEN
    is_team_member := true;
  END IF;
  
  -- Ne créer une entreprise automatique que si ce n'est PAS un membre d'équipe
  IF NOT is_team_member THEN
    -- Récupérer les coordonnées GPS de l'adresse si une adresse est fournie
    IF NEW.raw_user_meta_data->>'company_address' IS NOT NULL AND 
       NEW.raw_user_meta_data->>'company_address' != '' THEN
      
      BEGIN
        -- Appeler l'edge function de géocodage
        SELECT content INTO geocode_response
        FROM http((
          'POST',
          'https://jukdsypvuehnniskgpfd.supabase.co/functions/v1/geocode-company-address',
          ARRAY[
            http_header('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1a2RzeXB2dWVobm5pc2tncGZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk5MDkxMiwiZXhwIjoyMDYzNTY2OTEyfQ.6tfMw4CYqnI2AmhgDFq56mM4QdBxkzJ2_GpGdabFJ_E'),
            http_header('Content-Type', 'application/json')
          ],
          'application/json',
          json_build_object('address', NEW.raw_user_meta_data->>'company_address')::text
        ));

        -- Extraire les coordonnées si la géolocalisation a réussi
        IF geocode_response IS NOT NULL AND geocode_response->>'success' = 'true' THEN
          company_latitude := (geocode_response->>'latitude')::numeric;
          company_longitude := (geocode_response->>'longitude')::numeric;
          
          RAISE LOG 'Géolocalisation réussie pour adresse: %, lat: %, lon: %', 
                    NEW.raw_user_meta_data->>'company_address', 
                    company_latitude, 
                    company_longitude;
        ELSE
          RAISE LOG 'Échec de la géolocalisation pour adresse: %', NEW.raw_user_meta_data->>'company_address';
        END IF;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'Erreur lors de la géolocalisation: %', SQLERRM;
          -- Continuer sans géolocalisation en cas d'erreur
      END;
    END IF;
    
    -- Créer une nouvelle compagnie avec les informations du formulaire et les coordonnées
    INSERT INTO public.company_info (
      id, 
      name, 
      email, 
      phone, 
      address, 
      city, 
      zipcode, 
      siren, 
      siret, 
      tva,
      latitude,
      longitude
    )
    VALUES (
      gen_random_uuid(),
      COALESCE(NEW.raw_user_meta_data->>'company_name', COALESCE(NEW.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', '')),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
      COALESCE(NEW.raw_user_meta_data->>'company_address', ''),
      '', -- Ville sera extraite de l'adresse si nécessaire
      '', -- Code postal sera extrait de l'adresse si nécessaire
      COALESCE(NEW.raw_user_meta_data->>'company_siren', ''),
      COALESCE(NEW.raw_user_meta_data->>'company_siret', ''),
      COALESCE(NEW.raw_user_meta_data->>'company_vat_number', ''),
      company_latitude,
      company_longitude
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
    
    -- Récupérer le plan d'essai
    SELECT id INTO trial_plan_id 
    FROM public.subscription_plans 
    WHERE name = 'Plan d''Essai' AND is_active = true 
    LIMIT 1;
    
    -- Créer l'abonnement d'essai automatiquement
    IF trial_plan_id IS NOT NULL THEN
      INSERT INTO public.company_subscriptions (
        company_id,
        subscription_plan_id,
        status,
        start_date,
        end_date,
        next_billing_date,
        tokens_remaining,
        tokens_used
      ) VALUES (
        new_company_id,
        trial_plan_id,
        'active',
        NOW(),
        NOW() + INTERVAL '30 days',
        NULL, -- Pas de prélèvement pour l'essai
        25, -- Jetons inclus dans l'essai
        0
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;
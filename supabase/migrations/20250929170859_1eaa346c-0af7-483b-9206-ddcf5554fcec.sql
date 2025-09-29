-- Corriger la fonction handle_new_user pour éviter le type http_response inexistant
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
  company_address text;
  http_status integer;
  http_content text;
BEGIN
  RAISE LOG 'TRIGGER EXECUTED: handle_new_user for user: %', NEW.id;
  
  -- Créer le profil utilisateur
  INSERT INTO public.profiles (id, first_name, last_name, email, phone_number)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email,
    NEW.raw_user_meta_data->>'phone_number'
  );
  
  RAISE LOG 'Profile created for user: %', NEW.id;
  
  -- Vérifier s'il s'agit d'un ajout via l'interface équipe
  IF NEW.raw_user_meta_data->>'is_team_member' = 'true' THEN
    is_team_member := true;
    RAISE LOG 'User identified as team member: %', NEW.id;
  END IF;
  
  -- Ne créer une entreprise automatique que si ce n'est PAS un membre d'équipe
  IF NOT is_team_member THEN
    RAISE LOG 'Creating company for user: %', NEW.id;
    
    -- Récupérer l'adresse de l'entreprise
    company_address := NEW.raw_user_meta_data->>'company_address';
    RAISE LOG 'Company address extracted: %', company_address;
    
    -- Récupérer les coordonnées GPS de l'adresse si une adresse est fournie
    IF company_address IS NOT NULL AND company_address != '' THEN
      RAISE LOG 'Starting geocoding attempt for address: %', company_address;
      
      BEGIN
        -- Utiliser l'extension http avec la syntaxe correcte
        WITH http_result AS (
          SELECT * FROM http((
            'POST',
            'https://jukdsypvuehnniskgpfd.supabase.co/functions/v1/geocode-company-address',
            ARRAY[
              http_header('Content-Type', 'application/json'),
              http_header('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1a2RzeXB2dWVobm5pc2tncGZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk5MDkxMiwiZXhwIjoyMDYzNTY2OTEyfQ.6tfMw4CYqnI2AmhgDFq56mM4QdBxkzJ2_GpGdabFJ_E')
            ],
            'application/json',
            json_build_object('address', company_address)::text
          )::http_request)
        )
        SELECT status, content INTO http_status, http_content
        FROM http_result;

        RAISE LOG 'HTTP Status for geocoding: %, Content: %', http_status, http_content;

        -- Vérifier le statut HTTP
        IF http_status = 200 THEN
          -- Parser la réponse JSON
          BEGIN
            geocode_response := http_content::jsonb;
            RAISE LOG 'Parsed geocoding response: %', geocode_response;

            -- Extraire les coordonnées si la géolocalisation a réussi
            IF geocode_response IS NOT NULL AND geocode_response->>'success' = 'true' THEN
              company_latitude := (geocode_response->>'latitude')::numeric;
              company_longitude := (geocode_response->>'longitude')::numeric;
              
              RAISE LOG 'Geocoding successful for address: %, lat: %, lon: %', 
                        company_address, 
                        company_latitude, 
                        company_longitude;
            ELSE
              RAISE LOG 'Geocoding failed - response: %', geocode_response;
              IF geocode_response IS NOT NULL THEN
                RAISE LOG 'Geocoding error: %', geocode_response->>'error';
              END IF;
            END IF;
          EXCEPTION
            WHEN OTHERS THEN
              RAISE LOG 'Error parsing JSON response: %, Content: %', SQLERRM, http_content;
          END;
        ELSE
          RAISE LOG 'HTTP error during geocoding: Status %, Content: %', http_status, http_content;
        END IF;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'Exception during geocoding HTTP call: %', SQLERRM;
          -- Continue without geocoding in case of error
      END;
      
      RAISE LOG 'Geocoding attempt completed';
    ELSE
      RAISE LOG 'No address provided for geocoding';
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
      COALESCE(company_address, ''),
      '', -- Ville sera extraite de l'adresse si nécessaire
      '', -- Code postal sera extrait de l'adresse si nécessaire
      COALESCE(NEW.raw_user_meta_data->>'company_siren', ''),
      COALESCE(NEW.raw_user_meta_data->>'company_siret', ''),
      COALESCE(NEW.raw_user_meta_data->>'company_vat_number', ''),
      company_latitude,
      company_longitude
    )
    RETURNING id INTO new_company_id;
    
    RAISE LOG 'Company created with ID: %, lat: %, lon: %', new_company_id, company_latitude, company_longitude;
    
    -- Créer l'entrée user_companies avec le rôle Propriétaire
    INSERT INTO public.user_companies (user_id, company_id, role, active)
    VALUES (
      NEW.id,
      new_company_id,
      'Propriétaire',
      true
    );
    
    RAISE LOG 'User_companies relation created for user: % and company: %', NEW.id, new_company_id;
    
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
      
      RAISE LOG 'Trial subscription created for company: %', new_company_id;
    ELSE
      RAISE LOG 'No trial plan found';
    END IF;
  END IF;
  
  RAISE LOG 'TRIGGER COMPLETED: handle_new_user for user: %', NEW.id;
  RETURN NEW;
END;
$function$;
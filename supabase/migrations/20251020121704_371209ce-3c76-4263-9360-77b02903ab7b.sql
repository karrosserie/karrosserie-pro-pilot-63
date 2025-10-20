-- Modifier la fonction handle_new_user pour appeler le webhook après la création de l'entreprise
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  new_company_id uuid;
  trial_plan_id uuid;
  is_team_member boolean := false;
  company_address text;
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
    
    -- Créer une nouvelle compagnie avec les informations du formulaire
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
      '',
      '',
      COALESCE(NEW.raw_user_meta_data->>'company_siren', ''),
      COALESCE(NEW.raw_user_meta_data->>'company_siret', ''),
      COALESCE(NEW.raw_user_meta_data->>'company_vat_number', ''),
      NULL,
      NULL
    )
    RETURNING id INTO new_company_id;
    
    RAISE LOG 'Company created with ID: %', new_company_id;
    
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
        NULL,
        25,
        0
      );
      
      RAISE LOG 'Trial subscription created for company: %', new_company_id;
    ELSE
      RAISE LOG 'No trial plan found';
    END IF;

    -- Appeler le webhook n8n pour notifier la création de l'entreprise
    BEGIN
      PERFORM net.http_post(
        url := 'https://jukdsypvuehnniskgpfd.supabase.co/functions/v1/notify-company-creation',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1a2RzeXB2dWVobm5pc2tncGZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk5MDkxMiwiZXhwIjoyMDYzNTY2OTEyfQ.6tfMw4CYqnI2AmhgDFq56mM4QdBxkzJ2_GpGdabFJ_E'
        ),
        body := jsonb_build_object('company_id', new_company_id::text)
      );
      RAISE LOG 'Webhook notification triggered for company: %', new_company_id;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE LOG 'Warning: Webhook notification failed for company %, but continuing: %', new_company_id, SQLERRM;
    END;
  END IF;
  
  RAISE LOG 'TRIGGER COMPLETED: handle_new_user for user: %', NEW.id;
  RETURN NEW;
END;
$function$;
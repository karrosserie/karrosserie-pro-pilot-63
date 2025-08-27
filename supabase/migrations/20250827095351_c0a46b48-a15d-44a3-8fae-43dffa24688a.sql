-- Add trial subscription plan
INSERT INTO public.subscription_plans (name, description, price, billing_period, features, tokens_included, is_active) 
VALUES 
('Plan d''Essai', 'Essai gratuit de 30 jours avec fonctionnalités limitées', 0, 'monthly', '["Accès complet pendant 30 jours", "25 jetons inclus", "Support par email"]', 25, true);

-- Update handle_new_user function to create trial subscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  new_company_id uuid;
  trial_plan_id uuid;
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
  
  RETURN NEW;
END;
$function$;
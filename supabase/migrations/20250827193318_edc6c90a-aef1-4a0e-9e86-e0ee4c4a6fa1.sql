-- Corriger les fonctions avec SET search_path
CREATE OR REPLACE FUNCTION public.get_effective_company_id()
RETURNS uuid
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  impersonation_company_id text;
  effective_company_id uuid;
BEGIN
  -- Pour l'impersonation, nous utilisons les paramètres de session
  -- Les paramètres peuvent être définis depuis l'application
  BEGIN
    SELECT current_setting('app.impersonation_company_id', true) INTO impersonation_company_id;
    
    -- Si nous sommes en mode impersonation et que l'utilisateur est admin
    IF impersonation_company_id IS NOT NULL AND impersonation_company_id != '' 
       AND public.get_current_user_role() = 'admin' THEN
      effective_company_id := impersonation_company_id::uuid;
    ELSE
      -- Retourner la company_id normale de l'utilisateur
      SELECT uc.company_id INTO effective_company_id
      FROM public.user_companies uc
      WHERE uc.user_id = auth.uid() 
      AND uc.active = true
      LIMIT 1;
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      -- En cas d'erreur, retourner la company_id normale
      SELECT uc.company_id INTO effective_company_id
      FROM public.user_companies uc
      WHERE uc.user_id = auth.uid() 
      AND uc.active = true
      LIMIT 1;
  END;
  
  RETURN effective_company_id;
END;
$$;

-- Corriger user_belongs_to_company avec SET search_path
CREATE OR REPLACE FUNCTION public.user_belongs_to_company(p_user_id uuid, p_company_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  effective_company_id uuid;
BEGIN
  -- Si l'utilisateur est admin et en mode impersonation
  IF public.get_current_user_role() = 'admin' THEN
    effective_company_id := public.get_effective_company_id();
    IF effective_company_id IS NOT NULL THEN
      RETURN effective_company_id = p_company_id;
    END IF;
  END IF;
  
  -- Vérification normale
  RETURN EXISTS (
    SELECT 1 FROM public.user_companies
    WHERE user_id = p_user_id 
    AND company_id = p_company_id 
    AND active = true
  );
END;
$$;

-- Corriger is_admin_impersonating avec SET search_path
CREATE OR REPLACE FUNCTION public.is_admin_impersonating()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  impersonation_company_id text;
BEGIN
  -- Vérifier si l'utilisateur est admin
  IF public.get_current_user_role() != 'admin' THEN
    RETURN false;
  END IF;
  
  -- Vérifier s'il y a une impersonation active
  BEGIN
    SELECT current_setting('app.impersonation_company_id', true) INTO impersonation_company_id;
    RETURN impersonation_company_id IS NOT NULL AND impersonation_company_id != '';
  EXCEPTION
    WHEN OTHERS THEN
      RETURN false;
  END;
END;
$$;
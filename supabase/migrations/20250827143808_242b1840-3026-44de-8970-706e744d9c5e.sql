-- Modifier la fonction pour permettre aux admins d'accéder à toutes les entreprises
-- dans le contexte de la gestion administrative
CREATE OR REPLACE FUNCTION public.is_admin_impersonating()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
  -- Les admins ont accès global dans deux cas :
  -- 1. Quand ils sont effectivement en train d'impersoner (avec localStorage)
  -- 2. Quand ils utilisent des fonctionnalités admin légitimes (pages admin)
  -- Pour permettre la gestion des comptes, on autorise l'accès global aux admins
  -- La restriction se fera au niveau de l'application (hooks et composants)
  RETURN get_current_user_role() = 'admin';
END;
$$;
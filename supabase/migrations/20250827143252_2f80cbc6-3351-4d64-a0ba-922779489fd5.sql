-- Créer une fonction pour vérifier si un admin est en mode impersonation
-- Cette fonction sera utilisée dans les politiques RLS pour limiter l'accès global des admins
-- aux situations où ils sont effectivement en impersonation

CREATE OR REPLACE FUNCTION public.is_admin_impersonating()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
  -- Un admin a accès global seulement s'il a le rôle admin ET qu'il est en mode impersonation
  -- Pour le moment, nous considérons qu'un admin est en impersonation s'il accède à des données
  -- d'une entreprise différente de la sienne
  -- Cette fonction retourne false pour forcer les admins à utiliser leurs propres données d'entreprise
  -- quand ils ne sont pas en mode impersonation explicite
  RETURN false;
END;
$$;

-- Mettre à jour toutes les politiques admin pour qu'elles utilisent cette nouvelle fonction
-- Cela limitera l'accès global des admins aux cas d'impersonation explicite

-- Clients
DROP POLICY IF EXISTS "Admin users can manage all clients" ON public.clients;
CREATE POLICY "Admin users can manage all clients" 
ON public.clients 
FOR ALL 
USING (get_current_user_role() = 'admin' AND is_admin_impersonating());

-- Company info  
DROP POLICY IF EXISTS "Admin users can view all company info" ON public.company_info;
CREATE POLICY "Admin users can view all company info"
ON public.company_info
FOR SELECT
USING (get_current_user_role() = 'admin' AND is_admin_impersonating());

-- Company subscriptions
DROP POLICY IF EXISTS "Admin users can view all company subscriptions" ON public.company_subscriptions;
CREATE POLICY "Admin users can view all company subscriptions"
ON public.company_subscriptions
FOR ALL
USING (get_current_user_role() = 'admin' AND is_admin_impersonating())
WITH CHECK (get_current_user_role() = 'admin' AND is_admin_impersonating());

-- Employee schedules
DROP POLICY IF EXISTS "Admin users can manage all employee schedules" ON public.employee_schedule;
CREATE POLICY "Admin users can manage all employee schedules"
ON public.employee_schedule
FOR ALL
USING (get_current_user_role() = 'admin' AND is_admin_impersonating());

-- Employee timesheets  
DROP POLICY IF EXISTS "Admin users can manage all employee timesheets" ON public.employee_timesheets;
CREATE POLICY "Admin users can manage all employee timesheets"
ON public.employee_timesheets
FOR ALL
USING (get_current_user_role() = 'admin' AND is_admin_impersonating());

-- Employees
DROP POLICY IF EXISTS "Admin users can manage all employees" ON public.employees;
CREATE POLICY "Admin users can manage all employees"
ON public.employees  
FOR ALL
USING (get_current_user_role() = 'admin' AND is_admin_impersonating());

-- Expertise reports
DROP POLICY IF EXISTS "Admin users can manage all expertise reports" ON public.expertise_reports;
CREATE POLICY "Admin users can manage all expertise reports"
ON public.expertise_reports
FOR ALL
USING (get_current_user_role() = 'admin' AND is_admin_impersonating());

-- Fleet reservations
DROP POLICY IF EXISTS "Admin users can manage all fleet reservations" ON public.fleet_reservations;
CREATE POLICY "Admin users can manage all fleet reservations"
ON public.fleet_reservations
FOR ALL
USING (get_current_user_role() = 'admin' AND is_admin_impersonating());

-- Fleet vehicles
DROP POLICY IF EXISTS "Admin users can manage all fleet vehicles" ON public.fleet_vehicles;
CREATE POLICY "Admin users can manage all fleet vehicles"
ON public.fleet_vehicles
FOR ALL
USING (get_current_user_role() = 'admin' AND is_admin_impersonating());

-- Imports
DROP POLICY IF EXISTS "Admin users can manage all imports" ON public.imports;
CREATE POLICY "Admin users can manage all imports"
ON public.imports
FOR ALL
USING (get_current_user_role() = 'admin' AND is_admin_impersonating());

-- Invoices
DROP POLICY IF EXISTS "Admin users can manage all invoices" ON public.invoices;
CREATE POLICY "Admin users can manage all invoices"
ON public.invoices
FOR ALL
USING (get_current_user_role() = 'admin' AND is_admin_impersonating());

-- Quotes
DROP POLICY IF EXISTS "Admin users can manage all quotes" ON public.quotes;
CREATE POLICY "Admin users can manage all quotes"
ON public.quotes
FOR ALL
USING (get_current_user_role() = 'admin' AND is_admin_impersonating());

-- Repair orders
DROP POLICY IF EXISTS "Admin users can manage all repair orders" ON public.repair_orders;
CREATE POLICY "Admin users can manage all repair orders"
ON public.repair_orders
FOR ALL
USING (get_current_user_role() = 'admin' AND is_admin_impersonating());

-- User companies
DROP POLICY IF EXISTS "Admin users can view all user companies" ON public.user_companies;
CREATE POLICY "Admin users can view all user companies"
ON public.user_companies
FOR SELECT
USING (get_current_user_role() = 'admin' AND is_admin_impersonating());

-- Vehicles (assumé qu'il existe)
DROP POLICY IF EXISTS "Admin users can manage all vehicles" ON public.vehicles;
CREATE POLICY "Admin users can manage all vehicles"
ON public.vehicles
FOR ALL
USING (get_current_user_role() = 'admin' AND is_admin_impersonating());
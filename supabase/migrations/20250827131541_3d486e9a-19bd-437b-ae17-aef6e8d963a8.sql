-- Ajouter des politiques RLS pour permettre aux admins d'accéder à toutes les données
-- Cela permet l'impersonation admin

-- Clients
CREATE POLICY "Admin users can manage all clients" 
ON public.clients 
FOR ALL 
USING (get_current_user_role() = 'admin');

-- Vehicles  
CREATE POLICY "Admin users can manage all vehicles"
ON public.vehicles
FOR ALL
USING (get_current_user_role() = 'admin');

-- Invoices
CREATE POLICY "Admin users can manage all invoices"
ON public.invoices
FOR ALL
USING (get_current_user_role() = 'admin');

-- Quotes
CREATE POLICY "Admin users can manage all quotes"
ON public.quotes
FOR ALL
USING (get_current_user_role() = 'admin');

-- Repair Orders
CREATE POLICY "Admin users can manage all repair orders"
ON public.repair_orders
FOR ALL
USING (get_current_user_role() = 'admin');

-- Fleet Vehicles
CREATE POLICY "Admin users can manage all fleet vehicles"
ON public.fleet_vehicles
FOR ALL
USING (get_current_user_role() = 'admin');

-- Fleet Reservations
CREATE POLICY "Admin users can manage all fleet reservations"
ON public.fleet_reservations
FOR ALL
USING (get_current_user_role() = 'admin');

-- Employees
CREATE POLICY "Admin users can manage all employees"
ON public.employees
FOR ALL
USING (get_current_user_role() = 'admin');

-- Employee Schedules
CREATE POLICY "Admin users can manage all employee schedules"
ON public.employee_schedule
FOR ALL
USING (get_current_user_role() = 'admin');

-- Employee Timesheets
CREATE POLICY "Admin users can manage all employee timesheets"
ON public.employee_timesheets
FOR ALL
USING (get_current_user_role() = 'admin');

-- Expertise Reports
CREATE POLICY "Admin users can manage all expertise reports"
ON public.expertise_reports
FOR ALL
USING (get_current_user_role() = 'admin');

-- Imports
CREATE POLICY "Admin users can manage all imports"
ON public.imports
FOR ALL
USING (get_current_user_role() = 'admin');
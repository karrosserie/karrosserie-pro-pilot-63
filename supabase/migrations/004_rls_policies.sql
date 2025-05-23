
-- Create RLS policies for all tables

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Clients policies
CREATE POLICY "Users can view own clients" ON public.clients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own clients" ON public.clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients" ON public.clients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients" ON public.clients
  FOR DELETE USING (auth.uid() = user_id);

-- Vehicles policies
CREATE POLICY "Users can view own vehicles" ON public.vehicles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own vehicles" ON public.vehicles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vehicles" ON public.vehicles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vehicles" ON public.vehicles
  FOR DELETE USING (auth.uid() = user_id);

-- Fleet vehicles policies
CREATE POLICY "Users can view own fleet vehicles" ON public.fleet_vehicles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own fleet vehicles" ON public.fleet_vehicles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fleet vehicles" ON public.fleet_vehicles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fleet vehicles" ON public.fleet_vehicles
  FOR DELETE USING (auth.uid() = user_id);

-- Quotes policies
CREATE POLICY "Users can view own quotes" ON public.quotes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own quotes" ON public.quotes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quotes" ON public.quotes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quotes" ON public.quotes
  FOR DELETE USING (auth.uid() = user_id);

-- Repair orders policies
CREATE POLICY "Users can view own repair orders" ON public.repair_orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own repair orders" ON public.repair_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own repair orders" ON public.repair_orders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own repair orders" ON public.repair_orders
  FOR DELETE USING (auth.uid() = user_id);

-- Invoices policies
CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own invoices" ON public.invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices" ON public.invoices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoices" ON public.invoices
  FOR DELETE USING (auth.uid() = user_id);

-- Expertise reports policies
CREATE POLICY "Users can view own expertise reports" ON public.expertise_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own expertise reports" ON public.expertise_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expertise reports" ON public.expertise_reports
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expertise reports" ON public.expertise_reports
  FOR DELETE USING (auth.uid() = user_id);

-- Cessions policies
CREATE POLICY "Users can view own cessions" ON public.cessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own cessions" ON public.cessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cessions" ON public.cessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cessions" ON public.cessions
  FOR DELETE USING (auth.uid() = user_id);

-- Fleet reservations policies
CREATE POLICY "Users can view own fleet reservations" ON public.fleet_reservations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own fleet reservations" ON public.fleet_reservations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fleet reservations" ON public.fleet_reservations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fleet reservations" ON public.fleet_reservations
  FOR DELETE USING (auth.uid() = user_id);

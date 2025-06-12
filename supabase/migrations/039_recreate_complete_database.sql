
-- Migration complète pour recréer toutes les tables de la base de données
-- Cette migration supprime et recrée toutes les tables avec leur structure complète

-- Supprimer toutes les tables existantes (dans l'ordre inverse des dépendances)
DROP TABLE IF EXISTS public.fleet_returns CASCADE;
DROP TABLE IF EXISTS public.fleet_reservations CASCADE;
DROP TABLE IF EXISTS public.receipts CASCADE;
DROP TABLE IF EXISTS public.expenses CASCADE;
DROP TABLE IF EXISTS public.credits CASCADE;
DROP TABLE IF EXISTS public.cessions CASCADE;
DROP TABLE IF EXISTS public.expertise_reports CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.repair_orders CASCADE;
DROP TABLE IF EXISTS public.quotes CASCADE;
DROP TABLE IF EXISTS public.fleet_vehicles CASCADE;
DROP TABLE IF EXISTS public.vehicles CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.company_info CASCADE;
DROP TABLE IF EXISTS public.bank_accounts CASCADE;
DROP TABLE IF EXISTS public.car_models CASCADE;
DROP TABLE IF EXISTS public.car_brands CASCADE;
DROP TABLE IF EXISTS public.insurance_companies CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Supprimer les fonctions existantes
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.update_fleet_vehicles_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.update_fleet_reservations_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.update_fleet_returns_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.update_receipts_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.update_company_info_updated_at() CASCADE;

-- Créer la fonction update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Table profiles (étend auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone_number TEXT,
  company_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table insurance_companies
CREATE TABLE public.insurance_companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table car_brands
CREATE TABLE public.car_brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table car_models
CREATE TABLE public.car_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES public.car_brands(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(brand_id, name)
);

-- Table bank_accounts
CREATE TABLE public.bank_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  bank TEXT NOT NULL,
  iban TEXT NOT NULL,
  bic TEXT NOT NULL,
  balance DECIMAL(15,2) DEFAULT 0.00,
  type TEXT DEFAULT 'Courant' CHECK (type IN ('Courant', 'Épargne', 'Professionnel')),
  status TEXT DEFAULT 'Actif' CHECK (status IN ('Actif', 'Inactif', 'Suspendu')),
  last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table company_info
CREATE TABLE public.company_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  zipCode TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  siren TEXT NOT NULL DEFAULT '',
  siret TEXT NOT NULL DEFAULT '',
  tva TEXT NOT NULL DEFAULT '',
  logo_url TEXT,
  notifications JSONB NOT NULL DEFAULT '{"email": true, "push": true, "sms": false}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- Table clients
CREATE TABLE public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT,
  driver_license_front_url TEXT,
  driver_license_back_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table vehicles
CREATE TABLE public.vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  brand_id UUID REFERENCES public.car_brands(id) ON DELETE SET NULL,
  year INTEGER,
  license_plate TEXT NOT NULL,
  vin TEXT,
  engine_number TEXT,
  color TEXT,
  fuel_type TEXT,
  mileage INTEGER,
  insurance_company TEXT,
  insurance_expiry_date DATE,
  arrival_date DATE,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'En attente' CHECK (status IN ('En attente', 'Réservé', 'En cours', 'Terminé', 'Annulé')),
  road_test TEXT,
  road_test_notes TEXT,
  fuel_level INTEGER DEFAULT 50,
  pre_accident_defects TEXT,
  work_items JSONB,
  registration_document_front_url TEXT,
  registration_document_back_url TEXT,
  vehicle_image_url TEXT,
  vehicle_images JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table fleet_vehicles
CREATE TABLE public.fleet_vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vin VARCHAR(17),
  engine_number VARCHAR(255),
  brand VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  year INTEGER,
  license_plate VARCHAR(50) NOT NULL,
  color VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Disponible' CHECK (status IN ('Disponible', 'En prêt', 'En maintenance', 'Hors service')),
  mileage INTEGER DEFAULT 0,
  registration_front_url TEXT,
  registration_back_url TEXT,
  insurance_card_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table quotes
CREATE TABLE public.quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  reference TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  tax_rate DECIMAL DEFAULT 20.0,
  status TEXT DEFAULT 'draft',
  valid_until DATE,
  notes TEXT,
  document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table repair_orders
CREATE TABLE public.repair_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES public.quotes(id) ON DELETE SET NULL,
  reference TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  start_date DATE,
  end_date DATE,
  estimated_hours DECIMAL,
  notes TEXT,
  document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table invoices
CREATE TABLE public.invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  repair_order_id UUID REFERENCES public.repair_orders(id) ON DELETE SET NULL,
  reference TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  tax_rate DECIMAL DEFAULT 20.0,
  status TEXT DEFAULT 'pending',
  due_date DATE,
  payment_date DATE,
  payment_method TEXT,
  notes TEXT,
  document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table expertise_reports
CREATE TABLE public.expertise_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  reference TEXT NOT NULL,
  expert_name TEXT,
  amount DECIMAL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  document_url TEXT,
  report_number TEXT,
  report_date DATE,
  claim_number TEXT,
  incident_date DATE,
  policy_number TEXT,
  repairs_data TEXT,
  parts_data TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table cessions
CREATE TABLE public.cessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  repair_order_id UUID REFERENCES public.repair_orders(id) ON DELETE SET NULL,
  bank_account_id UUID REFERENCES public.bank_accounts(id) ON DELETE SET NULL,
  insurance_company_id UUID REFERENCES public.insurance_companies(id) ON DELETE SET NULL,
  reference TEXT NOT NULL DEFAULT '',
  status TEXT DEFAULT 'en_attente' CHECK (status IN (
    'en_attente',
    'en_attente_signature', 
    'signee',
    'signature_refusee',
    'lettre_recommandee_envoyee',
    'lettre_recommandee_recue',
    'lettre_recommandee_non_recuperee',
    'lettre_recommandee_refusee',
    'lettre_recommandee_presentee',
    'payee'
  )),
  buyer_name TEXT,
  buyer_contact TEXT,
  sale_amount NUMERIC DEFAULT 0,
  sale_date DATE,
  incident_number TEXT,
  incident_date DATE,
  policy_number TEXT,
  report_number TEXT,
  expert_name TEXT,
  notes TEXT,
  document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table credits
CREATE TABLE public.credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reference TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'En attente' CHECK (status IN ('En attente', 'Payé', 'Annulé')),
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  items_data JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, reference)
);

-- Table expenses
CREATE TABLE public.expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL DEFAULT 'Note de frais' CHECK (type IN ('Note de frais', 'Facture d''achat')),
  proof_url TEXT,
  date DATE NOT NULL,
  vat_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  supplier TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Péage', 'Carburant', 'Hôtel', 'Restaurant', 'Autres')),
  assign_to_vehicle BOOLEAN NOT NULL DEFAULT FALSE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'En attente' CHECK (status IN ('En attente', 'Validé', 'Payé', 'Refusé')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table receipts
CREATE TABLE public.receipts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  reference TEXT,
  date DATE NOT NULL,
  amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'En attente',
  payment_method TEXT NOT NULL,
  bank_account TEXT NOT NULL,
  notes TEXT,
  payment_proofs TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table fleet_reservations
CREATE TABLE public.fleet_reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fleet_vehicle_id UUID REFERENCES public.fleet_vehicles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  expected_return_date TIMESTAMP WITH TIME ZONE,
  actual_return_date TIMESTAMP WITH TIME ZONE,
  start_mileage INTEGER NOT NULL DEFAULT 0,
  end_mileage INTEGER,
  fuel_level_start INTEGER NOT NULL DEFAULT 100 CHECK (fuel_level_start >= 0 AND fuel_level_start <= 100),
  fuel_level_end INTEGER CHECK (fuel_level_end >= 0 AND fuel_level_end <= 100),
  notes TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  license_number VARCHAR(50),
  license_issue_date DATE,
  prefecture VARCHAR(10),
  holder_info TEXT,
  date_of_birth DATE,
  place_of_birth VARCHAR(100),
  driver_license_front_url TEXT,
  driver_license_back_url TEXT,
  client_insurance BOOLEAN DEFAULT false,
  insurance_company_name VARCHAR(100),
  insurance_phone VARCHAR(20),
  insurance_email VARCHAR(100),
  insurance_contract_number VARCHAR(50),
  insurance_address TEXT,
  insurance_city VARCHAR(50),
  insurance_postal_code VARCHAR(10),
  attestation_accepted BOOLEAN DEFAULT false,
  client_signature TEXT,
  vehicle_images JSONB DEFAULT '[]'::jsonb,
  damages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table fleet_returns
CREATE TABLE public.fleet_returns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fleet_reservation_id UUID REFERENCES public.fleet_reservations(id) ON DELETE CASCADE NOT NULL,
  fleet_vehicle_id UUID REFERENCES public.fleet_vehicles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  return_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  return_mileage INTEGER NOT NULL DEFAULT 0,
  fuel_level_return INTEGER NOT NULL DEFAULT 100 CHECK (fuel_level_return >= 0 AND fuel_level_return <= 100),
  notes TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending_review', 'damaged')),
  vehicle_images JSONB DEFAULT '[]'::jsonb,
  damages JSONB DEFAULT '[]'::jsonb,
  attestation_accepted BOOLEAN DEFAULT false,
  client_signature TEXT,
  client_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expertise_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_returns ENABLE ROW LEVEL SECURITY;

-- Créer les index pour optimiser les performances
CREATE INDEX idx_car_models_brand_id ON public.car_models(brand_id);
CREATE INDEX idx_car_brands_name ON public.car_brands(name);
CREATE INDEX idx_insurance_companies_name ON public.insurance_companies(name);
CREATE INDEX idx_bank_accounts_user_id ON public.bank_accounts(user_id);
CREATE INDEX idx_bank_accounts_status ON public.bank_accounts(status);
CREATE INDEX idx_bank_accounts_type ON public.bank_accounts(type);
CREATE INDEX idx_company_info_user_id ON public.company_info(user_id);
CREATE INDEX idx_clients_user_id ON public.clients(user_id);
CREATE INDEX idx_vehicles_user_id ON public.vehicles(user_id);
CREATE INDEX idx_vehicles_client_id ON public.vehicles(client_id);
CREATE INDEX idx_vehicles_brand_id ON public.vehicles(brand_id);
CREATE INDEX idx_vehicles_status ON public.vehicles(status);
CREATE INDEX idx_fleet_vehicles_user_id ON public.fleet_vehicles(user_id);
CREATE INDEX idx_fleet_vehicles_status ON public.fleet_vehicles(status);
CREATE INDEX idx_fleet_vehicles_brand ON public.fleet_vehicles(brand);
CREATE INDEX idx_fleet_vehicles_license_plate ON public.fleet_vehicles(license_plate);
CREATE UNIQUE INDEX idx_fleet_vehicles_vin ON public.fleet_vehicles(vin) WHERE vin IS NOT NULL;
CREATE INDEX idx_quotes_user_id ON public.quotes(user_id);
CREATE INDEX idx_quotes_client_id ON public.quotes(client_id);
CREATE INDEX idx_quotes_vehicle_id ON public.quotes(vehicle_id);
CREATE INDEX idx_repair_orders_user_id ON public.repair_orders(user_id);
CREATE INDEX idx_repair_orders_client_id ON public.repair_orders(client_id);
CREATE INDEX idx_repair_orders_vehicle_id ON public.repair_orders(vehicle_id);
CREATE INDEX idx_repair_orders_quote_id ON public.repair_orders(quote_id);
CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX idx_invoices_vehicle_id ON public.invoices(vehicle_id);
CREATE INDEX idx_invoices_repair_order_id ON public.invoices(repair_order_id);
CREATE INDEX idx_expertise_reports_user_id ON public.expertise_reports(user_id);
CREATE INDEX idx_expertise_reports_client_id ON public.expertise_reports(client_id);
CREATE INDEX idx_expertise_reports_vehicle_id ON public.expertise_reports(vehicle_id);
CREATE INDEX idx_expertise_reports_report_number ON public.expertise_reports(report_number);
CREATE INDEX idx_expertise_reports_claim_number ON public.expertise_reports(claim_number);
CREATE INDEX idx_cessions_user_id ON public.cessions(user_id);
CREATE INDEX idx_cessions_vehicle_id ON public.cessions(vehicle_id);
CREATE INDEX idx_cessions_repair_order_id ON public.cessions(repair_order_id);
CREATE INDEX idx_cessions_status ON public.cessions(status);
CREATE INDEX idx_cessions_sale_date ON public.cessions(sale_date);
CREATE INDEX idx_credits_user_id ON public.credits(user_id);
CREATE INDEX idx_credits_client_id ON public.credits(client_id);
CREATE INDEX idx_credits_vehicle_id ON public.credits(vehicle_id);
CREATE INDEX idx_credits_invoice_id ON public.credits(invoice_id);
CREATE INDEX idx_credits_status ON public.credits(status);
CREATE INDEX idx_credits_created_at ON public.credits(created_at);
CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX idx_expenses_date ON public.expenses(date);
CREATE INDEX idx_expenses_category ON public.expenses(category);
CREATE INDEX idx_expenses_vehicle_id ON public.expenses(vehicle_id);
CREATE INDEX idx_expenses_status ON public.expenses(status);
CREATE INDEX idx_receipts_user_id ON public.receipts(user_id);
CREATE INDEX idx_receipts_invoice_id ON public.receipts(invoice_id);
CREATE INDEX idx_receipts_date ON public.receipts(date);
CREATE INDEX idx_receipts_status ON public.receipts(status);
CREATE INDEX idx_fleet_reservations_vehicle_id ON public.fleet_reservations(fleet_vehicle_id);
CREATE INDEX idx_fleet_reservations_client_id ON public.fleet_reservations(client_id);
CREATE INDEX idx_fleet_reservations_user_id ON public.fleet_reservations(user_id);
CREATE INDEX idx_fleet_reservations_start_date ON public.fleet_reservations(start_date);
CREATE INDEX idx_fleet_reservations_status ON public.fleet_reservations(status);
CREATE INDEX idx_fleet_reservations_created_at ON public.fleet_reservations(created_at);
CREATE INDEX idx_fleet_returns_reservation_id ON public.fleet_returns(fleet_reservation_id);
CREATE INDEX idx_fleet_returns_vehicle_id ON public.fleet_returns(fleet_vehicle_id);
CREATE INDEX idx_fleet_returns_client_id ON public.fleet_returns(client_id);
CREATE INDEX idx_fleet_returns_user_id ON public.fleet_returns(user_id);
CREATE INDEX idx_fleet_returns_return_date ON public.fleet_returns(return_date);
CREATE INDEX idx_fleet_returns_status ON public.fleet_returns(status);

-- Créer les triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insurance_companies_updated_at
    BEFORE UPDATE ON public.insurance_companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_car_brands_updated_at
    BEFORE UPDATE ON public.car_brands
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_car_models_updated_at
    BEFORE UPDATE ON public.car_models
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bank_accounts_updated_at
    BEFORE UPDATE ON public.bank_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_info_updated_at
    BEFORE UPDATE ON public.company_info
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON public.vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fleet_vehicles_updated_at
    BEFORE UPDATE ON public.fleet_vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
    BEFORE UPDATE ON public.quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_repair_orders_updated_at
    BEFORE UPDATE ON public.repair_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expertise_reports_updated_at
    BEFORE UPDATE ON public.expertise_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cessions_updated_at
    BEFORE UPDATE ON public.cessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credits_updated_at
    BEFORE UPDATE ON public.credits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
    BEFORE UPDATE ON public.expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_receipts_updated_at
    BEFORE UPDATE ON public.receipts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fleet_reservations_updated_at
    BEFORE UPDATE ON public.fleet_reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fleet_returns_updated_at
    BEFORE UPDATE ON public.fleet_returns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Créer les politiques RLS de base (lecture/écriture pour le propriétaire)
CREATE POLICY "Users can view own profiles" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profiles" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profiles" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Politiques pour les tables de référence (lecture publique)
CREATE POLICY "Allow public read access to insurance companies" ON public.insurance_companies
    FOR SELECT USING (true);
CREATE POLICY "Allow public read access to car brands" ON public.car_brands
    FOR SELECT USING (true);
CREATE POLICY "Allow public read access to car models" ON public.car_models
    FOR SELECT USING (true);

-- Politiques pour les données utilisateur (CRUD pour le propriétaire)
CREATE POLICY "Users can manage own bank accounts" ON public.bank_accounts
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own company info" ON public.company_info
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own clients" ON public.clients
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own vehicles" ON public.vehicles
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own fleet vehicles" ON public.fleet_vehicles
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own quotes" ON public.quotes
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own repair orders" ON public.repair_orders
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own invoices" ON public.invoices
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own expertise reports" ON public.expertise_reports
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own cessions" ON public.cessions
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own credits" ON public.credits
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own expenses" ON public.expenses
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own receipts" ON public.receipts
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own fleet reservations" ON public.fleet_reservations
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own fleet returns" ON public.fleet_returns
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Créer la fonction pour gérer les nouveaux utilisateurs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, phone_number)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email,
    NEW.raw_user_meta_data->>'phone_number'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger pour les nouveaux utilisateurs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insérer les données de référence pour les compagnies d'assurance
INSERT INTO public.insurance_companies (id, name) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'AXA'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Allianz'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Generali'),
  ('550e8400-e29b-41d4-a716-446655440004', 'MAIF'),
  ('550e8400-e29b-41d4-a716-446655440005', 'MACIF'),
  ('550e8400-e29b-41d4-a716-446655440006', 'MAAF'),
  ('550e8400-e29b-41d4-a716-446655440007', 'Groupama'),
  ('550e8400-e29b-41d4-a716-446655440008', 'Crédit Agricole Assurances'),
  ('550e8400-e29b-41d4-a716-446655440009', 'Matmut'),
  ('550e8400-e29b-41d4-a716-44665544000a', 'Direct Assurance'),
  ('550e8400-e29b-41d4-a716-44665544000b', 'Zurich'),
  ('550e8400-e29b-41d4-a716-44665544000c', 'Aviva'),
  ('550e8400-e29b-41d4-a716-44665544000d', 'MMA'),
  ('550e8400-e29b-41d4-a716-44665544000e', 'GMF'),
  ('550e8400-e29b-41d4-a716-44665544000f', 'Autre')
ON CONFLICT (id) DO NOTHING;

-- Insérer les données de référence pour les marques de voiture
INSERT INTO public.car_brands (name) VALUES 
  ('Audi'), ('BMW'), ('Mercedes-Benz'), ('Volkswagen'), ('Peugeot'), 
  ('Renault'), ('Citroën'), ('Ford'), ('Opel'), ('Toyota'),
  ('Nissan'), ('Volvo'), ('Fiat'), ('Seat'), ('Skoda'), ('Autre')
ON CONFLICT (name) DO NOTHING;

-- Insérer quelques modèles pour les principales marques
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'A1' as model_name UNION ALL SELECT 'A3' UNION ALL SELECT 'A4' UNION ALL 
  SELECT 'A5' UNION ALL SELECT 'A6' UNION ALL SELECT 'Q3' UNION ALL SELECT 'Q5' UNION ALL SELECT 'Q7'
) models
WHERE b.name = 'Audi'
ON CONFLICT (brand_id, name) DO NOTHING;

INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Série 1' as model_name UNION ALL SELECT 'Série 3' UNION ALL SELECT 'Série 5' UNION ALL 
  SELECT 'X1' UNION ALL SELECT 'X3' UNION ALL SELECT 'X5'
) models
WHERE b.name = 'BMW'
ON CONFLICT (brand_id, name) DO NOTHING;

INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Classe A' as model_name UNION ALL SELECT 'Classe C' UNION ALL SELECT 'Classe E' UNION ALL 
  SELECT 'GLA' UNION ALL SELECT 'GLC' UNION ALL SELECT 'GLE'
) models
WHERE b.name = 'Mercedes-Benz'
ON CONFLICT (brand_id, name) DO NOTHING;

INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, 'Autre modèle'
FROM public.car_brands b
WHERE b.name = 'Autre'
ON CONFLICT (brand_id, name) DO NOTHING;

-- Ajouter des commentaires pour documenter les tables
COMMENT ON TABLE public.profiles IS 'Profils utilisateur étendant auth.users';
COMMENT ON TABLE public.insurance_companies IS 'Compagnies d''assurance';
COMMENT ON TABLE public.car_brands IS 'Marques de véhicules';
COMMENT ON TABLE public.car_models IS 'Modèles de véhicules par marque';
COMMENT ON TABLE public.bank_accounts IS 'Comptes bancaires des utilisateurs';
COMMENT ON TABLE public.company_info IS 'Informations d''entreprise des utilisateurs';
COMMENT ON TABLE public.clients IS 'Clients des utilisateurs';
COMMENT ON TABLE public.vehicles IS 'Véhicules des clients';
COMMENT ON TABLE public.fleet_vehicles IS 'Véhicules de courtoisie';
COMMENT ON TABLE public.quotes IS 'Devis';
COMMENT ON TABLE public.repair_orders IS 'Ordres de réparation';
COMMENT ON TABLE public.invoices IS 'Factures';
COMMENT ON TABLE public.expertise_reports IS 'Rapports d''expertise';
COMMENT ON TABLE public.cessions IS 'Cessions de créance';
COMMENT ON TABLE public.credits IS 'Avoirs';
COMMENT ON TABLE public.expenses IS 'Notes de frais';
COMMENT ON TABLE public.receipts IS 'Reçus';
COMMENT ON TABLE public.fleet_reservations IS 'Réservations de véhicules de courtoisie';
COMMENT ON TABLE public.fleet_returns IS 'Retours de véhicules de courtoisie';

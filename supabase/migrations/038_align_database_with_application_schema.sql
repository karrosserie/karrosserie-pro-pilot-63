

-- Migration to align database schema with application expectations
-- This migration adds missing columns and updates existing tables

-- Update vehicles table to match application expectations
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'En attente',
ADD COLUMN IF NOT EXISTS vehicle_images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS registration_document_front_url TEXT,
ADD COLUMN IF NOT EXISTS registration_document_back_url TEXT,
ADD COLUMN IF NOT EXISTS arrival_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS engine_number TEXT,
ADD COLUMN IF NOT EXISTS fuel_level INTEGER DEFAULT 100 CHECK (fuel_level >= 0 AND fuel_level <= 100),
ADD COLUMN IF NOT EXISTS insurance_company TEXT,
ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES public.car_brands(id),
ADD COLUMN IF NOT EXISTS model_id UUID REFERENCES public.car_models(id);

-- Add check constraint for vehicle status
ALTER TABLE public.vehicles 
DROP CONSTRAINT IF EXISTS vehicles_status_check;
ALTER TABLE public.vehicles 
ADD CONSTRAINT vehicles_status_check 
CHECK (status IN ('En attente', 'Réservé', 'En cours', 'Terminé', 'Annulé'));

-- Update expenses table to add missing status column
ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'En attente' CHECK (status IN ('En attente', 'Validé', 'Payé', 'Refusé'));

-- Update invoices table to add missing columns that application expects
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS payment_due_date DATE,
ADD COLUMN IF NOT EXISTS payment_details TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS repairs_data JSONB,
ADD COLUMN IF NOT EXISTS parts_data JSONB,
ADD COLUMN IF NOT EXISTS discounts_data JSONB,
ADD COLUMN IF NOT EXISTS claim_number TEXT,
ADD COLUMN IF NOT EXISTS current_mileage TEXT;

-- Ensure car_brands and car_models tables exist with proper structure
CREATE TABLE IF NOT EXISTS public.car_brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.car_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES public.car_brands(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(brand_id, name)
);

-- Enable RLS on lookup tables if not already enabled
ALTER TABLE public.car_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_models ENABLE ROW LEVEL SECURITY;

-- Create policies for lookup tables (public read access)
DROP POLICY IF EXISTS "Allow public read access to car brands" ON public.car_brands;
CREATE POLICY "Allow public read access to car brands" ON public.car_brands
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to car models" ON public.car_models;
CREATE POLICY "Allow public read access to car models" ON public.car_models
  FOR SELECT USING (true);

-- Insert basic car brands if they don't exist
INSERT INTO public.car_brands (name) VALUES 
  ('Audi'), ('BMW'), ('Mercedes-Benz'), ('Volkswagen'), ('Peugeot'), 
  ('Renault'), ('Citroën'), ('Ford'), ('Opel'), ('Toyota'),
  ('Nissan'), ('Volvo'), ('Fiat'), ('Seat'), ('Skoda'), ('Autre')
ON CONFLICT (name) DO NOTHING;

-- Insert basic models for major brands
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, 'Autre modèle'
FROM public.car_brands b
WHERE NOT EXISTS (
  SELECT 1 FROM public.car_models m WHERE m.brand_id = b.id
);

-- Add indexes for better performance on new columns
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_brand_id ON public.vehicles(brand_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_model_id ON public.vehicles(model_id);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON public.expenses(status);
CREATE INDEX IF NOT EXISTS idx_invoices_claim_number ON public.invoices(claim_number);

-- Add comments for new columns
COMMENT ON COLUMN public.vehicles.status IS 'Statut du véhicule (En attente, Réservé, En cours, Terminé, Annulé)';
COMMENT ON COLUMN public.vehicles.vehicle_images IS 'Images du véhicule au format JSON';
COMMENT ON COLUMN public.vehicles.registration_document_front_url IS 'URL du certificat d''immatriculation recto';
COMMENT ON COLUMN public.vehicles.registration_document_back_url IS 'URL du certificat d''immatriculation verso';
COMMENT ON COLUMN public.vehicles.arrival_date IS 'Date d''arrivée du véhicule';
COMMENT ON COLUMN public.vehicles.end_date IS 'Date de fin de traitement';
COMMENT ON COLUMN public.vehicles.engine_number IS 'Numéro de moteur';
COMMENT ON COLUMN public.vehicles.fuel_level IS 'Niveau de carburant (0-100)';
COMMENT ON COLUMN public.vehicles.insurance_company IS 'Compagnie d''assurance';
COMMENT ON COLUMN public.vehicles.brand_id IS 'Référence vers la marque dans car_brands';
COMMENT ON COLUMN public.vehicles.model_id IS 'Référence vers le modèle dans car_models';
COMMENT ON COLUMN public.expenses.status IS 'Statut de la note de frais';
COMMENT ON COLUMN public.invoices.payment_due_date IS 'Date d''échéance de paiement';
COMMENT ON COLUMN public.invoices.payment_details IS 'Détails du paiement';
COMMENT ON COLUMN public.invoices.description IS 'Description de la facture';
COMMENT ON COLUMN public.invoices.repairs_data IS 'Données des réparations au format JSON';
COMMENT ON COLUMN public.invoices.parts_data IS 'Données des pièces au format JSON';
COMMENT ON COLUMN public.invoices.discounts_data IS 'Données des remises au format JSON';
COMMENT ON COLUMN public.invoices.claim_number IS 'Numéro de sinistre';
COMMENT ON COLUMN public.invoices.current_mileage IS 'Kilométrage actuel';

-- Create trigger functions for updated_at if they don't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for car_brands and car_models
DROP TRIGGER IF EXISTS update_car_brands_updated_at ON public.car_brands;
CREATE TRIGGER update_car_brands_updated_at 
    BEFORE UPDATE ON public.car_brands 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_car_models_updated_at ON public.car_models;
CREATE TRIGGER update_car_models_updated_at 
    BEFORE UPDATE ON public.car_models 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();


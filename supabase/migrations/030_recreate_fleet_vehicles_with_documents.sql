
-- Supprimer la table existante si elle existe
DROP TABLE IF EXISTS public.fleet_vehicles CASCADE;

-- Créer la table fleet_vehicles avec tous les champs nécessaires incluant les documents
CREATE TABLE public.fleet_vehicles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter les index pour optimiser les performances
CREATE INDEX idx_fleet_vehicles_user_id ON public.fleet_vehicles(user_id);
CREATE INDEX idx_fleet_vehicles_status ON public.fleet_vehicles(status);
CREATE INDEX idx_fleet_vehicles_brand ON public.fleet_vehicles(brand);
CREATE INDEX idx_fleet_vehicles_license_plate ON public.fleet_vehicles(license_plate);
CREATE UNIQUE INDEX idx_fleet_vehicles_vin ON public.fleet_vehicles(vin) WHERE vin IS NOT NULL;

-- Activer RLS (Row Level Security)
ALTER TABLE public.fleet_vehicles ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Users can view their own fleet vehicles" ON public.fleet_vehicles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fleet vehicles" ON public.fleet_vehicles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fleet vehicles" ON public.fleet_vehicles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fleet vehicles" ON public.fleet_vehicles
    FOR DELETE USING (auth.uid() = user_id);

-- Créer une fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_fleet_vehicles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger pour mettre à jour updated_at
CREATE TRIGGER trigger_update_fleet_vehicles_updated_at
    BEFORE UPDATE ON public.fleet_vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_fleet_vehicles_updated_at();

-- Ajouter des commentaires pour documenter la table
COMMENT ON TABLE public.fleet_vehicles IS 'Table pour gérer les véhicules de courtoisie de la flotte';
COMMENT ON COLUMN public.fleet_vehicles.vin IS 'Numéro de série du véhicule (17 caractères)';
COMMENT ON COLUMN public.fleet_vehicles.engine_number IS 'Numéro de moteur du véhicule';
COMMENT ON COLUMN public.fleet_vehicles.brand IS 'Marque du véhicule';
COMMENT ON COLUMN public.fleet_vehicles.model IS 'Modèle du véhicule';
COMMENT ON COLUMN public.fleet_vehicles.year IS 'Année du véhicule';
COMMENT ON COLUMN public.fleet_vehicles.license_plate IS 'Plaque d\'immatriculation';
COMMENT ON COLUMN public.fleet_vehicles.color IS 'Couleur du véhicule';
COMMENT ON COLUMN public.fleet_vehicles.status IS 'Statut du véhicule (Disponible, En prêt, En maintenance, Hors service)';
COMMENT ON COLUMN public.fleet_vehicles.mileage IS 'Kilométrage du véhicule';
COMMENT ON COLUMN public.fleet_vehicles.registration_front_url IS 'URL du certificat d\'immatriculation recto';
COMMENT ON COLUMN public.fleet_vehicles.registration_back_url IS 'URL du certificat d\'immatriculation verso';
COMMENT ON COLUMN public.fleet_vehicles.insurance_card_url IS 'URL de la carte verte d\'assurance';


-- Drop existing table if it exists
DROP TABLE IF EXISTS fleet_reservations CASCADE;

-- Create fleet_reservations table with all required fields
CREATE TABLE fleet_reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Foreign keys
    fleet_vehicle_id UUID NOT NULL REFERENCES fleet_vehicles(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Reservation dates
    start_date DATE NOT NULL,
    expected_return_date DATE NOT NULL,
    actual_return_date DATE,
    
    -- Vehicle condition at start/end
    start_mileage INTEGER NOT NULL DEFAULT 0,
    end_mileage INTEGER,
    fuel_level_start INTEGER NOT NULL DEFAULT 100 CHECK (fuel_level_start >= 0 AND fuel_level_start <= 100),
    fuel_level_end INTEGER CHECK (fuel_level_end >= 0 AND fuel_level_end <= 100),
    
    -- General information
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    
    -- Driver license information
    license_number VARCHAR(50),
    license_issue_date DATE,
    prefecture VARCHAR(10),
    holder_info TEXT,
    date_of_birth DATE,
    place_of_birth VARCHAR(100),
    
    -- Document URLs
    driver_license_front_url TEXT,
    driver_license_back_url TEXT,
    
    -- Insurance information
    client_insurance BOOLEAN DEFAULT false,
    insurance_company_name VARCHAR(100),
    insurance_phone VARCHAR(20),
    insurance_email VARCHAR(100),
    insurance_contract_number VARCHAR(50),
    insurance_address TEXT,
    insurance_city VARCHAR(50),
    insurance_postal_code VARCHAR(10),
    
    -- Attestation and signature
    attestation_accepted BOOLEAN DEFAULT false,
    client_signature TEXT,
    
    -- Additional data stored as JSON
    vehicle_images JSONB DEFAULT '[]'::jsonb,
    damages JSONB DEFAULT '[]'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_fleet_reservations_vehicle_id ON fleet_reservations(fleet_vehicle_id);
CREATE INDEX idx_fleet_reservations_client_id ON fleet_reservations(client_id);
CREATE INDEX idx_fleet_reservations_user_id ON fleet_reservations(user_id);
CREATE INDEX idx_fleet_reservations_start_date ON fleet_reservations(start_date);
CREATE INDEX idx_fleet_reservations_status ON fleet_reservations(status);
CREATE INDEX idx_fleet_reservations_created_at ON fleet_reservations(created_at);

-- Enable Row Level Security
ALTER TABLE fleet_reservations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own company's fleet reservations" ON fleet_reservations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()
        )
    );

CREATE POLICY "Users can insert fleet reservations for their company" ON fleet_reservations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()
        )
        AND user_id = auth.uid()
    );

CREATE POLICY "Users can update their own company's fleet reservations" ON fleet_reservations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own company's fleet reservations" ON fleet_reservations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()
        )
    );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_fleet_reservations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on record modification
CREATE TRIGGER trigger_update_fleet_reservations_updated_at
    BEFORE UPDATE ON fleet_reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_fleet_reservations_updated_at();

-- Add comments for documentation
COMMENT ON TABLE fleet_reservations IS 'Table pour gérer les prêts de véhicules de flotte aux clients';
COMMENT ON COLUMN fleet_reservations.fleet_vehicle_id IS 'ID du véhicule de flotte prêté';
COMMENT ON COLUMN fleet_reservations.client_id IS 'ID du client qui emprunte le véhicule';
COMMENT ON COLUMN fleet_reservations.user_id IS 'ID de l''utilisateur qui a créé la réservation';
COMMENT ON COLUMN fleet_reservations.start_date IS 'Date de début du prêt';
COMMENT ON COLUMN fleet_reservations.expected_return_date IS 'Date de retour prévue';
COMMENT ON COLUMN fleet_reservations.actual_return_date IS 'Date de retour effective';
COMMENT ON COLUMN fleet_reservations.start_mileage IS 'Kilométrage au départ';
COMMENT ON COLUMN fleet_reservations.end_mileage IS 'Kilométrage au retour';
COMMENT ON COLUMN fleet_reservations.fuel_level_start IS 'Niveau de carburant au départ (0-100)';
COMMENT ON COLUMN fleet_reservations.fuel_level_end IS 'Niveau de carburant au retour (0-100)';
COMMENT ON COLUMN fleet_reservations.vehicle_images IS 'Photos du véhicule au format JSON';
COMMENT ON COLUMN fleet_reservations.damages IS 'Dommages constatés au format JSON';
COMMENT ON COLUMN fleet_reservations.attestation_accepted IS 'Acceptation de l''attestation de prêt';
COMMENT ON COLUMN fleet_reservations.client_signature IS 'Signature électronique du client';


-- Create fleet_returns table for vehicle return processing
CREATE TABLE IF NOT EXISTS fleet_returns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Foreign keys
    fleet_reservation_id UUID NOT NULL REFERENCES fleet_reservations(id) ON DELETE CASCADE,
    fleet_vehicle_id UUID NOT NULL REFERENCES fleet_vehicles(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Return information
    return_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    return_mileage INTEGER NOT NULL DEFAULT 0,
    fuel_level_return INTEGER NOT NULL DEFAULT 100 CHECK (fuel_level_return >= 0 AND fuel_level_return <= 100),
    
    -- General information
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending_review', 'damaged')),
    
    -- Vehicle condition at return
    vehicle_images JSONB DEFAULT '[]'::jsonb,
    damages JSONB DEFAULT '[]'::jsonb,
    
    -- Attestation and signature for return
    attestation_accepted BOOLEAN DEFAULT false,
    client_signature TEXT,
    client_name VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fleet_returns_reservation_id ON fleet_returns(fleet_reservation_id);
CREATE INDEX IF NOT EXISTS idx_fleet_returns_vehicle_id ON fleet_returns(fleet_vehicle_id);
CREATE INDEX IF NOT EXISTS idx_fleet_returns_client_id ON fleet_returns(client_id);
CREATE INDEX IF NOT EXISTS idx_fleet_returns_user_id ON fleet_returns(user_id);
CREATE INDEX IF NOT EXISTS idx_fleet_returns_return_date ON fleet_returns(return_date);
CREATE INDEX IF NOT EXISTS idx_fleet_returns_status ON fleet_returns(status);

-- Enable Row Level Security
ALTER TABLE fleet_returns ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for data security
CREATE POLICY "Users can view their own fleet returns" ON fleet_returns
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fleet returns" ON fleet_returns
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fleet returns" ON fleet_returns
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fleet returns" ON fleet_returns
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_fleet_returns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on record modification
CREATE TRIGGER trigger_update_fleet_returns_updated_at
    BEFORE UPDATE ON fleet_returns
    FOR EACH ROW
    EXECUTE FUNCTION update_fleet_returns_updated_at();

-- Add table and column comments for documentation
COMMENT ON TABLE fleet_returns IS 'Table pour gérer les retours de véhicules de flotte';
COMMENT ON COLUMN fleet_returns.fleet_reservation_id IS 'ID de la réservation associée';
COMMENT ON COLUMN fleet_returns.fleet_vehicle_id IS 'ID du véhicule retourné';
COMMENT ON COLUMN fleet_returns.client_id IS 'ID du client qui retourne le véhicule';
COMMENT ON COLUMN fleet_returns.user_id IS 'ID de l''utilisateur qui traite le retour';
COMMENT ON COLUMN fleet_returns.return_date IS 'Date et heure du retour';
COMMENT ON COLUMN fleet_returns.return_mileage IS 'Kilométrage au retour';
COMMENT ON COLUMN fleet_returns.fuel_level_return IS 'Niveau de carburant au retour (0-100)';
COMMENT ON COLUMN fleet_returns.vehicle_images IS 'Photos du véhicule au retour au format JSON';
COMMENT ON COLUMN fleet_returns.damages IS 'Dommages constatés au retour au format JSON';
COMMENT ON COLUMN fleet_returns.attestation_accepted IS 'Acceptation de l''attestation de retour';
COMMENT ON COLUMN fleet_returns.client_signature IS 'Signature électronique du client pour le retour';
COMMENT ON COLUMN fleet_returns.client_name IS 'Nom du client pour l''attestation de retour';

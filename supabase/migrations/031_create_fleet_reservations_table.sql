
-- Drop existing table if it exists
DROP TABLE IF EXISTS fleet_reservations;

-- Create fleet_reservations table
CREATE TABLE fleet_reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fleet_vehicle_id UUID NOT NULL REFERENCES fleet_vehicles(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    expected_return_date DATE NOT NULL,
    actual_return_date DATE,
    start_mileage INTEGER NOT NULL DEFAULT 0,
    end_mileage INTEGER,
    fuel_level_start INTEGER NOT NULL DEFAULT 100,
    fuel_level_end INTEGER,
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    
    -- License information
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
    
    -- Attestation
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
CREATE INDEX idx_fleet_reservations_start_date ON fleet_reservations(start_date);
CREATE INDEX idx_fleet_reservations_status ON fleet_reservations(status);

-- Enable RLS
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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_fleet_reservations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_fleet_reservations_updated_at
    BEFORE UPDATE ON fleet_reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_fleet_reservations_updated_at();

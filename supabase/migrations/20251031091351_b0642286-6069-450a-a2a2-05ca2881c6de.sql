-- Simple migration to add complexity_level column
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS complexity_level TEXT CHECK (complexity_level IN ('leger', 'moyen', 'lourd')) DEFAULT 'moyen';

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_vehicles_complexity_level ON vehicles(complexity_level);
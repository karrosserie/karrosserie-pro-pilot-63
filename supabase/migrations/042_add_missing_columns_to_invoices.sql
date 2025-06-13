
-- Add missing columns to invoices table
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS claim_number TEXT,
ADD COLUMN IF NOT EXISTS current_mileage TEXT,
ADD COLUMN IF NOT EXISTS repairs_data JSONB,
ADD COLUMN IF NOT EXISTS parts_data JSONB,
ADD COLUMN IF NOT EXISTS discounts_data JSONB,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_details TEXT;

-- Add comments to explain the fields
COMMENT ON COLUMN invoices.claim_number IS 'Numéro de sinistre associé à la facture';
COMMENT ON COLUMN invoices.current_mileage IS 'Kilométrage actuel du véhicule au moment de la facture';
COMMENT ON COLUMN invoices.repairs_data IS 'Données JSON des réparations effectuées';
COMMENT ON COLUMN invoices.parts_data IS 'Données JSON des pièces utilisées';
COMMENT ON COLUMN invoices.discounts_data IS 'Données JSON des remises appliquées';
COMMENT ON COLUMN invoices.notes IS 'Notes et remarques sur la facture';
COMMENT ON COLUMN invoices.payment_method IS 'Méthode de paiement utilisée';
COMMENT ON COLUMN invoices.payment_details IS 'Détails du paiement';

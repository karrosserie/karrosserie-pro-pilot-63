
-- Migration complète pour corriger la table invoices
-- Ajouter tous les champs manquants et corriger les types

-- Ajouter les champs manquants s'ils n'existent pas déjà
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5,2) DEFAULT 20.0;

-- Vérifier et corriger les contraintes existantes
-- S'assurer que les colonnes JSONB acceptent NULL
ALTER TABLE invoices ALTER COLUMN repairs_data DROP NOT NULL;
ALTER TABLE invoices ALTER COLUMN parts_data DROP NOT NULL;
ALTER TABLE invoices ALTER COLUMN discounts_data DROP NOT NULL;

-- S'assurer que les colonnes texte acceptent NULL
ALTER TABLE invoices ALTER COLUMN claim_number DROP NOT NULL;
ALTER TABLE invoices ALTER COLUMN current_mileage DROP NOT NULL;
ALTER TABLE invoices ALTER COLUMN notes DROP NOT NULL;
ALTER TABLE invoices ALTER COLUMN payment_method DROP NOT NULL;
ALTER TABLE invoices ALTER COLUMN payment_details DROP NOT NULL;
ALTER TABLE invoices ALTER COLUMN description DROP NOT NULL;

-- Corriger les types de données si nécessaire
ALTER TABLE invoices ALTER COLUMN amount TYPE DECIMAL(10,2);
ALTER TABLE invoices ALTER COLUMN tax_rate TYPE DECIMAL(5,2);

-- Mettre à jour les valeurs par défaut
ALTER TABLE invoices ALTER COLUMN amount SET DEFAULT 0;
ALTER TABLE invoices ALTER COLUMN status SET DEFAULT 'En attente de paiement';

-- Ajouter des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_vehicle_id ON invoices(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_invoices_repair_order_id ON invoices(repair_order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_reference ON invoices(reference);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);

-- Vérifier et corriger les contraintes de clés étrangères
-- S'assurer que les références existent
DO $$
BEGIN
    -- Vérifier si la contrainte FK pour client_id existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'invoices_client_id_fkey' 
        AND table_name = 'invoices'
    ) THEN
        ALTER TABLE invoices 
        ADD CONSTRAINT invoices_client_id_fkey 
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL;
    END IF;

    -- Vérifier si la contrainte FK pour vehicle_id existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'invoices_vehicle_id_fkey' 
        AND table_name = 'invoices'
    ) THEN
        ALTER TABLE invoices 
        ADD CONSTRAINT invoices_vehicle_id_fkey 
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL;
    END IF;

    -- Vérifier si la contrainte FK pour repair_order_id existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'invoices_repair_order_id_fkey' 
        AND table_name = 'invoices'
    ) THEN
        ALTER TABLE invoices 
        ADD CONSTRAINT invoices_repair_order_id_fkey 
        FOREIGN KEY (repair_order_id) REFERENCES repair_orders(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Mettre à jour les commentaires
COMMENT ON COLUMN invoices.description IS 'Description générale de la facture';
COMMENT ON COLUMN invoices.tax_rate IS 'Taux de TVA appliqué (en pourcentage)';

-- S'assurer que la colonne user_id a une contrainte NOT NULL
ALTER TABLE invoices ALTER COLUMN user_id SET NOT NULL;

-- Vérifier et nettoyer les données existantes
UPDATE invoices SET status = 'En attente de paiement' WHERE status IS NULL;
UPDATE invoices SET amount = 0 WHERE amount IS NULL;

-- Migration pour ajouter le champ archived aux tables de documents
-- Date: 2025-01-09
-- Description: Ajout du champ archived pour les devis, ordres de réparation et avoirs

BEGIN;

-- Ajouter le champ archived à la table quotes
ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT false;

-- Ajouter le champ archived à la table repair_orders
ALTER TABLE repair_orders 
ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT false;

-- Ajouter le champ archived à la table credits
ALTER TABLE credits 
ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT false;

-- Créer des index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_quotes_archived ON quotes(archived);
CREATE INDEX IF NOT EXISTS idx_repair_orders_archived ON repair_orders(archived);
CREATE INDEX IF NOT EXISTS idx_credits_archived ON credits(archived);

COMMIT;
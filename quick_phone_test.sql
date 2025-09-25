-- Test rapide : ajouter les colonnes et quelques numéros de test

-- Ajouter les colonnes manquantes
ALTER TABLE repair_orders
ADD COLUMN IF NOT EXISTS oodrive_contract_id VARCHAR,
ADD COLUMN IF NOT EXISTS signed_document_url VARCHAR;

-- Mettre à jour les 3 premiers clients avec des numéros valides
UPDATE clients
SET phone = CASE
    WHEN ROW_NUMBER() OVER (ORDER BY id) = 1 THEN '0612345678'
    WHEN ROW_NUMBER() OVER (ORDER BY id) = 2 THEN '+33712345678'
    WHEN ROW_NUMBER() OVER (ORDER BY id) = 3 THEN '06 12 34 56 78'
END
WHERE id IN (
    SELECT c.id
    FROM clients c
    JOIN repair_orders ro ON c.id = ro.client_id
    GROUP BY c.id
    ORDER BY COUNT(ro.id) DESC
    LIMIT 3
);
-- Script temporaire pour ajouter des numéros de téléphone aux clients de test
-- À exécuter via l'interface Supabase Dashboard -> SQL Editor

-- Ajouter les colonnes nécessaires à repair_orders si pas encore fait
ALTER TABLE repair_orders
ADD COLUMN IF NOT EXISTS oodrive_contract_id VARCHAR,
ADD COLUMN IF NOT EXISTS signed_document_url VARCHAR;

-- Ajouter des numéros de téléphone aux premiers clients (remplacez par de vrais numéros de test)
UPDATE clients
SET phone = '0123456789'
WHERE phone IS NULL
AND id IN (
  SELECT DISTINCT client_id
  FROM repair_orders
  WHERE client_id IS NOT NULL
  LIMIT 5
);

-- Afficher les clients avec des ordres de réparation et leur téléphone
SELECT
  c.id,
  c.first_name,
  c.last_name,
  c.phone,
  COUNT(ro.id) as repair_orders_count
FROM clients c
JOIN repair_orders ro ON c.id = ro.client_id
GROUP BY c.id, c.first_name, c.last_name, c.phone
ORDER BY repair_orders_count DESC
LIMIT 10;
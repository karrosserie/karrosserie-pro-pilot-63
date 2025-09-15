-- Migration pour ajouter le consentement WhatsApp aux clients
-- Date: 2025-01-15
-- Description: Ajout du champ whatsapp_consent à la table clients

BEGIN;

-- Ajouter la colonne whatsapp_consent à la table clients
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS whatsapp_consent BOOLEAN;

COMMIT;
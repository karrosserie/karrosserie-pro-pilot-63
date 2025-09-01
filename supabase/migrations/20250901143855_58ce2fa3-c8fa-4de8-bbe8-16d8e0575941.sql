-- Migration pour ajouter les colonnes manquantes de relance IA à la table company_preferences
-- Date: 2025-01-20
-- Description: Ajout des champs AI relance pour les paramètres de configuration

BEGIN;

-- Ajouter les colonnes manquantes pour les paramètres de relance IA
ALTER TABLE company_preferences 
ADD COLUMN IF NOT EXISTS ai_relance_delay_before_first INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS ai_relance_max_relances INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS ai_relance_channels_email BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS ai_relance_channels_sms BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS ai_relance_channels_whatsapp BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ai_relance_channels_phone BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ai_relance_channels_mail BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ai_relance_auto_mise_en_demeure BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS ai_relance_prompt TEXT DEFAULT 'Rédigez une relance de paiement professionnelle et courtoise pour la facture {facture_ref} d''un montant de {montant}€ échue depuis {jours_retard} jours pour le client {nom_client}.',
ADD COLUMN IF NOT EXISTS ai_relance_tonality TEXT DEFAULT 'professional';

COMMIT;
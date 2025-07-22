-- Nettoyage des tables non liées au projet automobile/réparation

-- Supprimer les tables liées aux artisans/prestataires
DROP TABLE IF EXISTS artisans_certifies CASCADE;
DROP TABLE IF EXISTS prestataires CASCADE;

-- Supprimer les tables liées aux enchères
DROP TABLE IF EXISTS auction_offers CASCADE;
DROP TABLE IF EXISTS auction_requests CASCADE;

-- Supprimer les tables liées aux assemblées/bâtiments
DROP TABLE IF EXISTS assemblies CASCADE;
DROP TABLE IF EXISTS buildings CASCADE;

-- Supprimer les tables liées à la gestion bancaire/financière
DROP TABLE IF EXISTS bank_accounts CASCADE;
DROP TABLE IF EXISTS bank_tx CASCADE;
DROP TABLE IF EXISTS cash_accounts CASCADE;
DROP TABLE IF EXISTS cash_flow_entries CASCADE;
DROP TABLE IF EXISTS cash_forecast CASCADE;
DROP TABLE IF EXISTS cash_movements CASCADE;

-- Supprimer les tables liées aux mandats/procurations
DROP TABLE IF EXISTS mandats_ag CASCADE;
DROP TABLE IF EXISTS mandats_count CASCADE;
DROP TABLE IF EXISTS procurations CASCADE;

-- Supprimer les tables liées aux courriers
DROP TABLE IF EXISTS letters CASCADE;

-- Supprimer les vues/tables de dashboard non essentielles
DROP VIEW IF EXISTS dashboard_summary CASCADE;

-- Supprimer la table user_roles (les rôles peuvent être gérés dans profiles)
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TYPE IF EXISTS app_role CASCADE;

-- Supprimer les fonctions non utilisées
DROP FUNCTION IF EXISTS check_cash_flow_alerts() CASCADE;
DROP FUNCTION IF EXISTS cleanup_old_forecasts() CASCADE;
DROP FUNCTION IF EXISTS generate_qr_hash() CASCADE;
DROP FUNCTION IF EXISTS check_mandate_limits(text, uuid) CASCADE;
DROP FUNCTION IF EXISTS get_user_role(uuid) CASCADE;
DROP FUNCTION IF EXISTS verify_phone_and_get_user(text) CASCADE;
DROP FUNCTION IF EXISTS verify_otp_and_create_session(text, text) CASCADE;
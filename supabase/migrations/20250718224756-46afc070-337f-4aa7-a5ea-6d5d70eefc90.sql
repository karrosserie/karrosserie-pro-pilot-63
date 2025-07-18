-- Ajouter une contrainte unique sur company_id pour permettre l'upsert
ALTER TABLE company_preferences ADD CONSTRAINT company_preferences_company_id_unique UNIQUE (company_id);
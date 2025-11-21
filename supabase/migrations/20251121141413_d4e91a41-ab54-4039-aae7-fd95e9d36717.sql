-- Ajouter la colonne quote_id à la table fleet_reservations
ALTER TABLE fleet_reservations 
ADD COLUMN quote_id uuid REFERENCES quotes(id) ON DELETE SET NULL;

-- Créer un index pour optimiser les recherches
CREATE INDEX idx_fleet_reservations_quote_id ON fleet_reservations(quote_id);

-- Ajouter un commentaire pour la documentation
COMMENT ON COLUMN fleet_reservations.quote_id IS 'Devis associé au prêt (optionnel)';
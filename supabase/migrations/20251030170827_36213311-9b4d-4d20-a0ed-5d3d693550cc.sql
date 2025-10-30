-- Ajouter les colonnes category et status à la table messageries
ALTER TABLE messageries 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'autre',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'nouveau';

-- Créer des index pour améliorer les performances de filtrage
CREATE INDEX IF NOT EXISTS idx_messageries_category ON messageries(category);
CREATE INDEX IF NOT EXISTS idx_messageries_status ON messageries(status);
CREATE INDEX IF NOT EXISTS idx_messageries_composite ON messageries(category, status, priority, resolved) WHERE archived = false;

-- Ajouter des commentaires pour la documentation
COMMENT ON COLUMN messageries.category IS 'Catégorie du message: sinistre, devis, sav, reclamation, information, facturation, autre';
COMMENT ON COLUMN messageries.status IS 'Statut du message: nouveau, en_cours, en_attente_client, planifie, resolu, archive';
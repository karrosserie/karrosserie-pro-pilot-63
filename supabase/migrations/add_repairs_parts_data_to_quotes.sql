-- Ajouter les colonnes repairs_data et parts_data à la table quotes
ALTER TABLE quotes 
ADD COLUMN repairs_data text,
ADD COLUMN parts_data text;
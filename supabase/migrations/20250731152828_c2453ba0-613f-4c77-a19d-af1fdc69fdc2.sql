-- Ajouter les colonnes pour les temps par défaut du workflow dans company_preferences
ALTER TABLE public.company_preferences 
ADD COLUMN accueil_preparation_time TIME DEFAULT '01:00:00',
ADD COLUMN remplacement_debosselage_time TIME DEFAULT '02:30:00',
ADD COLUMN preparation_peinture_time TIME DEFAULT '02:30:00',
ADD COLUMN mise_en_peinture_time TIME DEFAULT '05:00:00',
ADD COLUMN finitions_remontage_time TIME DEFAULT '02:00:00',
ADD COLUMN cloture_livraison_time TIME DEFAULT '00:30:00';

-- Mettre à jour les lignes existantes avec les valeurs par défaut
UPDATE public.company_preferences 
SET 
  accueil_preparation_time = '01:00:00',
  remplacement_debosselage_time = '02:30:00',
  preparation_peinture_time = '02:30:00',
  mise_en_peinture_time = '05:00:00',
  finitions_remontage_time = '02:00:00',
  cloture_livraison_time = '00:30:00'
WHERE 
  accueil_preparation_time IS NULL OR
  remplacement_debosselage_time IS NULL OR
  preparation_peinture_time IS NULL OR
  mise_en_peinture_time IS NULL OR
  finitions_remontage_time IS NULL OR
  cloture_livraison_time IS NULL;
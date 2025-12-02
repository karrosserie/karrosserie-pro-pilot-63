-- Table des pièces automobiles
CREATE TABLE public.automotive_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('fourniture', 'piece_carrosserie')),
  subcategory TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour les recherches rapides
CREATE INDEX idx_automotive_parts_category ON public.automotive_parts(category);
CREATE INDEX idx_automotive_parts_name ON public.automotive_parts(name);

-- RLS Policies
ALTER TABLE public.automotive_parts ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour tous
CREATE POLICY "Anyone can read automotive parts" 
  ON public.automotive_parts FOR SELECT 
  USING (true);

-- Insertion des Fournitures & Accessoires (29 pièces)
INSERT INTO public.automotive_parts (name, category, subcategory) VALUES
('Agrafes de fixation plastique', 'fourniture', 'fixation'),
('Clips de fixation carrosserie', 'fourniture', 'fixation'),
('Rivets', 'fourniture', 'fixation'),
('Boulons, écrous, vis spécifiques carrosserie', 'fourniture', 'fixation'),
('Clips et supports de garniture intérieure', 'fourniture', 'fixation'),
('Cache-écrous et caches plastiques divers', 'fourniture', 'fixation'),
('Embouts divers', 'fourniture', 'fixation'),
('Joints de porte', 'fourniture', 'etancheite'),
('Joints de hayon ou coffre', 'fourniture', 'etancheite'),
('Baguettes décoratives et de protection latérales', 'fourniture', 'decoration'),
('Moulures de pare-chocs', 'fourniture', 'decoration'),
('Sigles, logos et insignes de marque', 'fourniture', 'decoration'),
('Poignées de porte', 'fourniture', 'poignee'),
('Enjoliveurs de poignées et de baguettes', 'fourniture', 'poignee'),
('Poignées de coffre ou hayon', 'fourniture', 'poignee'),
('Rétroviseurs intérieurs', 'fourniture', 'retroviseur'),
('Rétroviseurs extérieurs complets ou glace seule', 'fourniture', 'retroviseur'),
('Antennes', 'fourniture', 'accessoire'),
('Balais d''essuie-glace', 'fourniture', 'accessoire'),
('Gicleurs de lave-glace', 'fourniture', 'accessoire'),
('Vérins de hayon ou coffre', 'fourniture', 'accessoire'),
('Supports de plaques d''immatriculation', 'fourniture', 'accessoire'),
('Plastiques de protection de passage de roue', 'fourniture', 'protection'),
('Protections de bas de caisse', 'fourniture', 'protection'),
('Pare-boue avant et arrière', 'fourniture', 'protection'),
('Cache moteur plastique', 'fourniture', 'protection'),
('Supports et silentblocs de pare-chocs', 'fourniture', 'support'),
('Dispositifs d''éclairage accessoires', 'fourniture', 'eclairage'),
('Caches feux antibrouillard et supports feux', 'fourniture', 'eclairage'),

-- Pièces de carrosserie (45 pièces)
('Capot avant gauche', 'piece_carrosserie', 'capot'),
('Capot avant droit', 'piece_carrosserie', 'capot'),
('Calandre avant', 'piece_carrosserie', 'avant'),
('Aile avant gauche', 'piece_carrosserie', 'aile'),
('Aile avant droite', 'piece_carrosserie', 'aile'),
('Aile arrière gauche', 'piece_carrosserie', 'aile'),
('Aile arrière droite', 'piece_carrosserie', 'aile'),
('Porte avant gauche', 'piece_carrosserie', 'porte'),
('Porte avant droite', 'piece_carrosserie', 'porte'),
('Porte arrière gauche', 'piece_carrosserie', 'porte'),
('Porte arrière droite', 'piece_carrosserie', 'porte'),
('Pare-chocs avant', 'piece_carrosserie', 'pare_chocs'),
('Pare-chocs arrière', 'piece_carrosserie', 'pare_chocs'),
('Support pare-chocs avant', 'piece_carrosserie', 'pare_chocs'),
('Support pare-chocs arrière', 'piece_carrosserie', 'pare_chocs'),
('Hayon ou porte coffre arrière', 'piece_carrosserie', 'arriere'),
('Rétroviseur extérieur gauche', 'piece_carrosserie', 'retroviseur'),
('Rétroviseur extérieur droit', 'piece_carrosserie', 'retroviseur'),
('Bas de caisse gauche', 'piece_carrosserie', 'bas_caisse'),
('Bas de caisse droit', 'piece_carrosserie', 'bas_caisse'),
('Toit / pavillon', 'piece_carrosserie', 'toit'),
('Pilier A gauche', 'piece_carrosserie', 'pilier'),
('Pilier A droit', 'piece_carrosserie', 'pilier'),
('Pilier B gauche', 'piece_carrosserie', 'pilier'),
('Pilier B droit', 'piece_carrosserie', 'pilier'),
('Pilier C gauche', 'piece_carrosserie', 'pilier'),
('Pilier C droit', 'piece_carrosserie', 'pilier'),
('Pare-brise', 'piece_carrosserie', 'vitrage'),
('Lunette arrière', 'piece_carrosserie', 'vitrage'),
('Vitre latérale avant gauche', 'piece_carrosserie', 'vitrage'),
('Vitre latérale avant droite', 'piece_carrosserie', 'vitrage'),
('Vitre latérale arrière gauche', 'piece_carrosserie', 'vitrage'),
('Vitre latérale arrière droite', 'piece_carrosserie', 'vitrage'),
('Poignée de porte avant gauche', 'piece_carrosserie', 'poignee'),
('Poignée de porte avant droite', 'piece_carrosserie', 'poignee'),
('Poignée de porte arrière gauche', 'piece_carrosserie', 'poignee'),
('Poignée de porte arrière droite', 'piece_carrosserie', 'poignee'),
('Feu avant gauche', 'piece_carrosserie', 'eclairage'),
('Feu avant droit', 'piece_carrosserie', 'eclairage'),
('Feu arrière gauche', 'piece_carrosserie', 'eclairage'),
('Feu arrière droit', 'piece_carrosserie', 'eclairage'),
('Passage de roue avant gauche', 'piece_carrosserie', 'passage_roue'),
('Passage de roue avant droit', 'piece_carrosserie', 'passage_roue'),
('Passage de roue arrière gauche', 'piece_carrosserie', 'passage_roue'),
('Passage de roue arrière droit', 'piece_carrosserie', 'passage_roue');
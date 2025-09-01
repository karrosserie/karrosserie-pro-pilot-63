-- Créer un dossier judiciaire fictif pour tester l'interface
INSERT INTO public.judicial_cases (
  reference,
  demandeur,
  defendeur,
  contexte,
  chronologie,
  relation,
  obligations,
  references_legales,
  demandes,
  interets_details,
  depens_details,
  pieces,
  status,
  montant_dossier,
  interets,
  depens,
  company_id,
  created_at,
  updated_at
) VALUES (
  'FAC-2024-002',
  'Garage Pro SARL
123 Avenue de la République
13001 Marseille
SIRET: 12345678901234',
  'Entreprise Martin SARL
456 Boulevard des Entrepreneurs  
13006 Marseille
SIRET: 98765432109876',
  'Prestations de réparation automobile effectuées sur véhicule suite à sinistre. Facture émise le 15 novembre 2024 pour un montant de 8 200,00€ TTC correspondant à des travaux de carrosserie et peinture.',
  '• 02/11/2024 : Réception du véhicule et établissement du devis n°DEV-2024-156
• 05/11/2024 : Acceptation du devis par le client (signature)
• 06/11/2024 : Début des travaux de réparation
• 14/11/2024 : Fin des travaux et restitution du véhicule
• 15/11/2024 : Émission de la facture FAC-2024-002
• 30/11/2024 : Première relance (email)
• 15/12/2024 : Deuxième relance (courrier)
• 03/01/2025 : Mise en demeure par LRAR
• 18/01/2025 : Expiration du délai de 15 jours',
  'Le défendeur nous a confié son véhicule pour des travaux de réparation suite à un sinistre. Un devis détaillé a été établi et accepté par écrit avant le commencement des travaux.',
  'En vertu du contrat de réparation accepté, le défendeur était tenu de régler la facture dans un délai de 30 jours suivant la livraison du véhicule réparé.',
  '• Article 1231-1 du Code civil (exécution des obligations)
• Article 1231-6 du Code civil (intérêts de retard)
• Décret n°2014-1292 du 23 octobre 2014 (indemnité forfaitaire pour frais de recouvrement)',
  'DEMANDE au Tribunal de bien vouloir :
• CONDAMNER le défendeur à payer la somme de 8 200,00€ au titre du principal
• CONDAMNER le défendeur à payer la somme de 287,00€ au titre des pénalités de retard
• CONDAMNER le défendeur à payer la somme de 40,00€ au titre de l''indemnité forfaitaire
• CONDAMNER le défendeur aux dépens',
  'Intérêts légaux à compter de la mise en demeure (03/01/2025) au taux de 3,5% l''an, soit 287,00€ à ce jour.',
  'Frais de greffe, frais de signification et tous autres frais de procédure selon le tarif en vigueur.',
  'Pièce n°1 : Facture FAC-2024-002 du 15/11/2024
Pièce n°2 : Devis signé DEV-2024-156 du 02/11/2024  
Pièce n°3 : Bon de livraison du 14/11/2024
Pièce n°4 : Historique des relances (5 relances)
Pièce n°5 : Mise en demeure LRAR du 03/01/2025
Pièce n°6 : Accusé de réception LRAR',
  'ready',
  8200.00,
  true,
  true,
  (SELECT id FROM public.company_info LIMIT 1),
  NOW(),
  NOW()
);

-- Créer un client fictif si nécessaire
INSERT INTO public.clients (
  first_name,
  last_name,
  email,
  phone,
  address,
  city,
  postal_code,
  company_id,
  created_at,
  updated_at
) VALUES (
  'Jean-Pierre',
  'Martin',
  'jp.martin@entreprise-martin.fr',
  '04 91 12 34 56',
  '456 Boulevard des Entrepreneurs',
  'Marseille',
  '13006',
  (SELECT id FROM public.company_info LIMIT 1),
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Créer une facture fictive liée
INSERT INTO public.invoices (
  reference,
  client_id,
  amount,
  status,
  date,
  due_date,
  notes,
  company_id,
  created_at,
  updated_at
) VALUES (
  'FAC-2024-002',
  (SELECT id FROM public.clients WHERE last_name = 'Martin' LIMIT 1),
  8200.00,
  'En retard',
  '2024-11-15',
  '2024-12-15',
  'Facture de réparation automobile - Véhicule Peugeot 308',
  (SELECT id FROM public.company_info LIMIT 1),
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;
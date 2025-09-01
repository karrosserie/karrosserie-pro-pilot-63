-- Créer un encaissement fictif de test pour vérifier que les statistiques se mettent à jour
INSERT INTO public.receipts (
  reference,
  date,
  amount,
  status,
  payment_method,
  bank_account,
  notes,
  payment_proofs,
  invoice_id,
  company_id
) VALUES (
  'FICT-001',
  CURRENT_DATE,
  250.00,
  'Encaissé',
  'Carte bancaire',
  'Compte Principal',
  'Encaissement fictif de test - Vérification du système de statistiques',
  '{}',
  NULL,
  (SELECT id FROM public.company_info LIMIT 1)
);

// Données mockées pour les transactions
export const mockTransactions = [
  { 
    id: 1, 
    reference: 'P-2023-001', 
    date: '20/05/2023', 
    description: 'Paiement facture F-2023-001',
    type: 'Encaissement', 
    method: 'Carte bancaire',
    amount: '3 785,00 €'
  },
  { 
    id: 2, 
    reference: 'D-2023-001', 
    date: '18/05/2023', 
    description: 'Achat de pièces automobiles',
    type: 'Dépense', 
    method: 'Virement',
    amount: '1 250,00 €'
  },
  { 
    id: 3, 
    reference: 'P-2023-002', 
    date: '15/05/2023', 
    description: 'Paiement facture F-2023-003',
    type: 'Encaissement', 
    method: 'Chèque',
    amount: '2 100,00 €'
  },
  { 
    id: 4, 
    reference: 'D-2023-002', 
    date: '14/05/2023', 
    description: 'Frais de carburant',
    type: 'Dépense', 
    method: 'Carte bancaire',
    amount: '85,50 €'
  },
  { 
    id: 5, 
    reference: 'P-2023-003', 
    date: '10/05/2023', 
    description: 'Paiement facture F-2023-002',
    type: 'Encaissement', 
    method: 'Virement',
    amount: '2 950,00 €'
  }
];

// Données pour le graphique
export const chartData = [
  { month: 'Jan', revenue: 12500, expenses: 8200 },
  { month: 'Fév', revenue: 15000, expenses: 9100 },
  { month: 'Mar', revenue: 18000, expenses: 10200 },
  { month: 'Avr', revenue: 16500, expenses: 9800 },
  { month: 'Mai', revenue: 21000, expenses: 11500 },
  { month: 'Juin', revenue: 19500, expenses: 10800 },
];

// Données pour les cartes de statistiques
export const statsCards = [
  {
    title: 'Chiffre d\'affaires',
    value: '89 500,00 €',
    period: 'depuis le début de l\'année',
    trend: '+12%',
    trendUp: true
  },
  {
    title: 'Dépenses totales',
    value: '52 300,00 €',
    period: 'depuis le début de l\'année',
    trend: '+8%',
    trendUp: true
  },
  {
    title: 'Résultat net',
    value: '37 200,00 €',
    period: 'depuis le début de l\'année',
    trend: '+15%',
    trendUp: true
  },
  {
    title: 'Montant à encaisser',
    value: '8 750,00 €',
    period: 'factures en attente',
    trend: '-5%',
    trendUp: false
  }
];

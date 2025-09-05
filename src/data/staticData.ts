// Données statiques pour démonstration et captures d'écran

export const STATIC_AUTH = {
  session: {
    user: {
      id: 'demo-user-123',
      email: 'demo@karrosserie-dupont.fr',
      user_metadata: {
        first_name: 'Jean',
        last_name: 'Dupont',
        phone_number: '01 23 45 67 89',
      }
    },
    access_token: 'demo-token-123',
  },
  profile: {
    id: 'demo-user-123',
    first_name: 'Jean',
    last_name: 'Dupont',
    email: 'demo@karrosserie-dupont.fr',
    phone: '01 23 45 67 89',
    company_id: 'demo-company-123',
    is_admin: false,
  }
};

export const STATIC_COMPANY = {
  id: 'demo-company-123',
  name: 'Karrosserie Dupont',
  address: '123 Avenue de la Réparation',
  postal_code: '75012',
  city: 'Paris',
  phone: '01 23 45 67 89',
  email: 'contact@karrosserie-dupont.fr',
  siret: '12345678901234',
  logo_url: null,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

export const STATIC_PROFILES = [
  {
    id: 'demo-user-123',
    first_name: 'Jean',
    last_name: 'Dupont',
    email: 'demo@karrosserie-dupont.fr',
    phone: '01 23 45 67 89',
    company_id: 'demo-company-123',
    is_admin: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  }
];

export const STATIC_USER_COMPANIES = [
  {
    id: 'user-company-123',
    user_id: 'demo-user-123',
    company_id: 'demo-company-123',
    active: true,
    role: 'owner',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  }
];

export const STATIC_SUBSCRIPTIONS = [
  {
    id: 'subscription-123',
    company_id: 'demo-company-123',
    plan_type: 'premium',
    status: 'active',
    tokens_remaining: 1000,
    tokens_limit: 1500,
    billing_period_start: '2024-01-01T00:00:00.000Z',
    billing_period_end: '2024-12-31T23:59:59.000Z',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  }
];

export const STATIC_TOKENS = [
  {
    id: 'token-123',
    company_id: 'demo-company-123',
    tokens_used: 500,
    tokens_limit: 1500,
    period_start: '2024-01-01T00:00:00.000Z',
    period_end: '2024-12-31T23:59:59.000Z',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  }
];

export const STATIC_CLIENTS = [
  {
    id: 'client-1',
    first_name: 'Marie',
    last_name: 'Martin',
    email: 'marie.martin@email.fr',
    phone: '06 12 34 56 78',
    address: '45 Rue de la République',
    postal_code: '75011',
    city: 'Paris',
    company_id: 'demo-company-123',
    created_at: '2024-01-15T00:00:00.000Z',
    updated_at: '2024-01-15T00:00:00.000Z',
    driver_license_front_url: null,
    driver_license_back_url: null,
    oodrive_recipient_id: null,
  },
  {
    id: 'client-2',
    first_name: 'Pierre',
    last_name: 'Bernard',
    email: 'pierre.bernard@email.fr',
    phone: '06 87 65 43 21',
    address: '78 Boulevard Saint-Germain',
    postal_code: '75006',
    city: 'Paris',
    company_id: 'demo-company-123',
    created_at: '2024-01-20T00:00:00.000Z',
    updated_at: '2024-01-20T00:00:00.000Z',
    driver_license_front_url: null,
    driver_license_back_url: null,
    oodrive_recipient_id: null,
  },
  {
    id: 'client-3',
    first_name: 'Sophie',
    last_name: 'Durand',
    email: 'sophie.durand@email.fr',
    phone: '06 45 78 90 12',
    address: '12 Place de la Bastille',
    postal_code: '75004',
    city: 'Paris',
    company_id: 'demo-company-123',
    created_at: '2024-02-01T00:00:00.000Z',
    updated_at: '2024-02-01T00:00:00.000Z',
    driver_license_front_url: null,
    driver_license_back_url: null,
    oodrive_recipient_id: null,
  },
];

export const STATIC_CAR_BRANDS = [
  { id: 'brand-1', name: 'Renault', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: 'brand-2', name: 'Peugeot', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: 'brand-3', name: 'Citroën', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: 'brand-4', name: 'Volkswagen', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: 'brand-5', name: 'BMW', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
];

export const STATIC_CAR_MODELS = [
  { id: 'model-1', name: 'Clio', brand_id: 'brand-1', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: 'model-2', name: 'Mégane', brand_id: 'brand-1', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: 'model-3', name: '208', brand_id: 'brand-2', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: 'model-4', name: '308', brand_id: 'brand-2', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: 'model-5', name: 'C3', brand_id: 'brand-3', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: 'model-6', name: 'Golf', brand_id: 'brand-4', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: 'model-7', name: 'Série 3', brand_id: 'brand-5', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
];

export const STATIC_VEHICLES = [
  {
    id: 'vehicle-1',
    license_plate: 'AB-123-CD',
    mileage: 45000,
    client_id: 'client-1',
    brand_id: 'brand-1',
    model_id: 'model-1',
    year: 2020,
    vin: 'VF1RG25041H123456',
    energy: 'Essence',
    doors: 5,
    color: 'Blanc',
    company_id: 'demo-company-123',
    created_at: '2024-01-15T00:00:00.000Z',
    updated_at: '2024-01-15T00:00:00.000Z',
    car_brands: { id: 'brand-1', name: 'Renault' },
    car_models: { id: 'model-1', name: 'Clio' },
  },
  {
    id: 'vehicle-2',
    license_plate: 'EF-456-GH',
    mileage: 78000,
    client_id: 'client-2',
    brand_id: 'brand-2',
    model_id: 'model-3',
    year: 2018,
    vin: 'VF32C5FX6JW123456',
    energy: 'Diesel',
    doors: 5,
    color: 'Noir',
    company_id: 'demo-company-123',
    created_at: '2024-01-20T00:00:00.000Z',
    updated_at: '2024-01-20T00:00:00.000Z',
    car_brands: { id: 'brand-2', name: 'Peugeot' },
    car_models: { id: 'model-3', name: '208' },
  },
  {
    id: 'vehicle-3',
    license_plate: 'IJ-789-KL',
    mileage: 32000,
    client_id: 'client-3',
    brand_id: 'brand-4',
    model_id: 'model-6',
    year: 2021,
    vin: 'WVWZZZ1JZYM123456',
    energy: 'Essence',
    doors: 5,
    color: 'Gris',
    company_id: 'demo-company-123',
    created_at: '2024-02-01T00:00:00.000Z',
    updated_at: '2024-02-01T00:00:00.000Z',
    car_brands: { id: 'brand-4', name: 'Volkswagen' },
    car_models: { id: 'model-6', name: 'Golf' },
  },
];

export const STATIC_REPAIR_ORDERS = [
  {
    id: 'repair-order-1',
    reference: 'OR-2024-001',
    vehicle_id: 'vehicle-1',
    client_id: 'client-1',
    company_id: 'demo-company-123',
    description: 'Réparation suite à accrochage parking - Pare-chocs avant et aile droite',
    status: 'in_progress',
    start_date: '2024-03-01',
    end_date: '2024-03-05',
    labor_hours: 8,
    labor_rate: 75.00,
    parts_total: 450.00,
    total_amount: 1050.00,
    created_at: '2024-02-28T00:00:00.000Z',
    updated_at: '2024-02-28T00:00:00.000Z',
  },
  {
    id: 'repair-order-2',
    reference: 'OR-2024-002',
    vehicle_id: 'vehicle-2',
    client_id: 'client-2',
    company_id: 'demo-company-123',
    description: 'Carrosserie - Portière arrière gauche suite à rayure profonde',
    status: 'completed',
    start_date: '2024-02-15',
    end_date: '2024-02-18',
    labor_hours: 6,
    labor_rate: 75.00,
    parts_total: 280.00,
    total_amount: 730.00,
    created_at: '2024-02-14T00:00:00.000Z',
    updated_at: '2024-02-18T00:00:00.000Z',
  },
  {
    id: 'repair-order-3',
    reference: 'OR-2024-003',
    vehicle_id: 'vehicle-3',
    client_id: 'client-3',
    company_id: 'demo-company-123',
    description: 'Débosselage capot et polissage carrosserie complète',
    status: 'pending',
    start_date: '2024-03-10',
    end_date: '2024-03-12',
    labor_hours: 4,
    labor_rate: 75.00,
    parts_total: 120.00,
    total_amount: 420.00,
    created_at: '2024-03-05T00:00:00.000Z',
    updated_at: '2024-03-05T00:00:00.000Z',
  },
];

export const STATIC_QUOTES = [
  {
    id: 'quote-1',
    reference: 'DEV-2024-001',
    vehicle_id: 'vehicle-1',
    client_id: 'client-1',
    company_id: 'demo-company-123',
    description: 'Devis réparation carrosserie - Pare-chocs et aile droite',
    status: 'accepted',
    items: [
      {
        description: 'Pare-chocs avant - Réparation et peinture',
        quantity: 1,
        unit_price: 350.00,
        total: 350.00,
      },
      {
        description: 'Aile droite - Débosselage et peinture',
        quantity: 1,
        unit_price: 450.00,
        total: 450.00,
      },
      {
        description: 'Main d\'œuvre carrosserie',
        quantity: 8,
        unit_price: 75.00,
        total: 600.00,
      },
    ],
    subtotal: 1400.00,
    vat_rate: 20,
    vat_amount: 280.00,
    total_amount: 1680.00,
    valid_until: '2024-04-01',
    created_at: '2024-02-25T00:00:00.000Z',
    updated_at: '2024-02-28T00:00:00.000Z',
  },
  {
    id: 'quote-2',
    reference: 'DEV-2024-002',
    vehicle_id: 'vehicle-2',
    client_id: 'client-2',
    company_id: 'demo-company-123',
    description: 'Devis réparation portière arrière gauche',
    status: 'completed',
    items: [
      {
        description: 'Portière arrière gauche - Réparation rayure',
        quantity: 1,
        unit_price: 280.00,
        total: 280.00,
      },
      {
        description: 'Main d\'œuvre',
        quantity: 6,
        unit_price: 75.00,
        total: 450.00,
      },
    ],
    subtotal: 730.00,
    vat_rate: 20,
    vat_amount: 146.00,
    total_amount: 876.00,
    valid_until: '2024-03-15',
    created_at: '2024-02-10T00:00:00.000Z',
    updated_at: '2024-02-18T00:00:00.000Z',
  },
];

export const STATIC_INVOICES = [
  {
    id: 'invoice-1',
    reference: 'FACT-2024-001',
    vehicle_id: 'vehicle-2',
    client_id: 'client-2',
    repair_order_id: 'repair-order-2',
    company_id: 'demo-company-123',
    description: 'Facture réparation portière arrière gauche',
    status: 'paid',
    items: [
      {
        description: 'Portière arrière gauche - Réparation rayure',
        quantity: 1,
        unit_price: 280.00,
        total: 280.00,
      },
      {
        description: 'Main d\'œuvre carrosserie',
        quantity: 6,
        unit_price: 75.00,
        total: 450.00,
      },
    ],
    subtotal: 730.00,
    vat_rate: 20,
    vat_amount: 146.00,
    total_amount: 876.00,
    due_date: '2024-03-20',
    payment_date: '2024-03-18',
    created_at: '2024-02-18T00:00:00.000Z',
    updated_at: '2024-03-18T00:00:00.000Z',
    clients: {
      id: 'client-2',
      first_name: 'Pierre',
      last_name: 'Bernard',
      email: 'pierre.bernard@email.fr',
      phone: '06 87 65 43 21',
      address: '78 Boulevard Saint-Germain',
      postal_code: '75006',
      city: 'Paris',
    },
    vehicles: {
      id: 'vehicle-2',
      license_plate: 'EF-456-GH',
      mileage: 78000,
      car_brands: { id: 'brand-2', name: 'Peugeot' },
      car_models: { id: 'model-3', name: '208' },
    },
    repair_orders: {
      id: 'repair-order-2',
      reference: 'OR-2024-002',
    },
  },
  {
    id: 'invoice-2',
    reference: 'FACT-2024-002',
    vehicle_id: 'vehicle-1',
    client_id: 'client-1',
    repair_order_id: null,
    company_id: 'demo-company-123',
    description: 'Facture entretien courant',
    status: 'pending',
    items: [
      {
        description: 'Vidange moteur',
        quantity: 1,
        unit_price: 85.00,
        total: 85.00,
      },
      {
        description: 'Changement filtres (air + huile)',
        quantity: 1,
        unit_price: 45.00,
        total: 45.00,
      },
      {
        description: 'Main d\'œuvre',
        quantity: 1.5,
        unit_price: 75.00,
        total: 112.50,
      },
    ],
    subtotal: 242.50,
    vat_rate: 20,
    vat_amount: 48.50,
    total_amount: 291.00,
    due_date: '2024-04-01',
    payment_date: null,
    created_at: '2024-03-02T00:00:00.000Z',
    updated_at: '2024-03-02T00:00:00.000Z',
    clients: {
      id: 'client-1',
      first_name: 'Marie',
      last_name: 'Martin',
      email: 'marie.martin@email.fr',
      phone: '06 12 34 56 78',
      address: '45 Rue de la République',
      postal_code: '75011',
      city: 'Paris',
    },
    vehicles: {
      id: 'vehicle-1',
      license_plate: 'AB-123-CD',
      mileage: 45000,
      car_brands: { id: 'brand-1', name: 'Renault' },
      car_models: { id: 'model-1', name: 'Clio' },
    },
    repair_orders: null,
  },
];

export const STATIC_EXPENSES = [
  {
    id: 'expense-1',
    description: 'Peinture carrosserie - Bidon 5L blanc nacré',
    amount: 145.50,
    category: 'Fournitures',
    date: '2024-02-15',
    company_id: 'demo-company-123',
    receipt_url: null,
    created_at: '2024-02-15T00:00:00.000Z',
    updated_at: '2024-02-15T00:00:00.000Z',
  },
  {
    id: 'expense-2',
    description: 'Outillage - Pistolet à peinture professionnel',
    amount: 275.00,
    category: 'Équipement',
    date: '2024-02-20',
    company_id: 'demo-company-123',
    receipt_url: null,
    created_at: '2024-02-20T00:00:00.000Z',
    updated_at: '2024-02-20T00:00:00.000Z',
  },
  {
    id: 'expense-3',
    description: 'Carburant véhicule de service',
    amount: 85.40,
    category: 'Transport',
    date: '2024-02-25',
    company_id: 'demo-company-123',
    receipt_url: null,
    created_at: '2024-02-25T00:00:00.000Z',
    updated_at: '2024-02-25T00:00:00.000Z',
  },
];

export const STATIC_RECEIPTS = [
  {
    id: 'receipt-1',
    invoice_id: 'invoice-1',
    amount: 876.00,
    payment_method: 'Chèque',
    payment_date: '2024-03-18',
    reference: 'CHQ-2024-001',
    company_id: 'demo-company-123',
    created_at: '2024-03-18T00:00:00.000Z',
    updated_at: '2024-03-18T00:00:00.000Z',
  },
];

export const STATIC_INSURANCE_COMPANIES = [
  {
    id: 'insurance-1',
    name: 'AXA Assurances',
    contact_person: 'Marie Duchemin',
    phone: '01 23 45 67 89',
    email: 'marie.duchemin@axa.fr',
    address: '45 Avenue de l\'Opéra',
    postal_code: '75002',
    city: 'Paris',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'insurance-2',
    name: 'Allianz France',
    contact_person: 'Pierre Moreau',
    phone: '01 34 56 78 90',
    email: 'pierre.moreau@allianz.fr',
    address: '87 Rue de Richelieu',
    postal_code: '75002',
    city: 'Paris',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'insurance-3',
    name: 'MAIF',
    contact_person: 'Sophie Laurent',
    phone: '01 45 67 89 01',
    email: 'sophie.laurent@maif.fr',
    address: '12 Boulevard Haussmann',
    postal_code: '75009',
    city: 'Paris',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
];

export const STATIC_MESSAGERIES = [
  {
    id: 'message-1',
    company_id: 'demo-company-123',
    priority: 1,
    title: 'Réclamation client urgent - Peinture défaillante',
    channel: 'Téléphone',
    eta: '2h',
    time: 'Il y a 15 min',
    date: '2024-03-05',
    summary: 'Client Marie Martin insatisfaite de la qualité de peinture sur sa Renault Clio. Demande reprise immédiate.',
    message: 'Bonjour, je suis très mécontente du travail effectué sur ma voiture. La peinture présente des défauts visibles et ne correspond pas à la couleur d\'origine. Je souhaite une reprise immédiate car j\'ai un rendez-vous important demain. Merci de me rappeler rapidement.',
    tags: ['réclamation', 'peinture', 'urgent', 'client-VIP'],
    resolved: false,
    archived: false,
    created_at: '2024-03-05T14:15:00.000Z',
    updated_at: '2024-03-05T14:15:00.000Z',
  },
  {
    id: 'message-2',
    company_id: 'demo-company-123',
    priority: 2,
    title: 'Demande devis réparation suite sinistre',
    channel: 'Mail',
    eta: '24h',
    time: 'Il y a 2h',
    date: '2024-03-05',
    summary: 'Nouveau client avec véhicule Peugeot 308 suite à accident. Dégâts importants pare-chocs et aile droite.',
    message: 'Madame, Monsieur, suite à un accident survenu ce matin, ma Peugeot 308 nécessite des réparations importantes. Les dégâts concernent principalement le pare-chocs avant et l\'aile droite. Pourriez-vous établir un devis détaillé ? Mon assurance AXA prendra en charge les frais. Merci de me contacter au plus vite.',
    tags: ['devis', 'sinistre', 'peugeot', 'assurance'],
    resolved: false,
    archived: false,
    created_at: '2024-03-05T12:30:00.000Z',
    updated_at: '2024-03-05T12:30:00.000Z',
  },
  {
    id: 'message-3',
    company_id: 'demo-company-123',
    priority: 3,
    title: 'Rendez-vous entretien périodique',
    channel: 'WhatsApp',
    eta: '48h',
    time: 'Il y a 4h',
    date: '2024-03-05',
    summary: 'Client Pierre Bernard souhaite programmer l\'entretien de sa BMW Série 3 pour la semaine prochaine.',
    message: 'Salut ! J\'aimerais programmer l\'entretien de ma BMW pour la semaine prochaine. Vidange + révision complète. Vous avez des créneaux disponibles mardi ou mercredi ? Merci 🚗',
    tags: ['entretien', 'rendez-vous', 'bmw', 'routine'],
    resolved: false,
    archived: false,
    created_at: '2024-03-05T10:45:00.000Z',
    updated_at: '2024-03-05T10:45:00.000Z',
  },
  {
    id: 'message-4',
    company_id: 'demo-company-123',
    priority: 4,
    title: 'Question sur garantie réparation',
    channel: 'Mail',
    eta: '7j',
    time: 'Hier 16h',
    date: '2024-03-04',
    summary: 'Ancienne cliente Sophie Durand s\'interroge sur la durée de garantie de sa réparation effectuée il y a 6 mois.',
    message: 'Bonjour, j\'ai fait réparer ma Volkswagen Golf chez vous il y a environ 6 mois (facture FACT-2023-156). Je constate aujourd\'hui un léger défaut sur la zone réparée. Pourriez-vous me rappeler les conditions de garantie ? Est-ce que cela peut être repris gratuitement ? Cordialement.',
    tags: ['garantie', 'suivi', 'volkswagen', 'ancien-client'],
    resolved: false,
    archived: false,
    created_at: '2024-03-04T16:20:00.000Z',
    updated_at: '2024-03-04T16:20:00.000Z',
  },
  {
    id: 'message-5',
    company_id: 'demo-company-123',
    priority: 2,
    title: 'Problème livraison pièce détachée',
    channel: 'Téléphone',
    eta: '24h',
    time: 'Hier 14h',
    date: '2024-03-04',
    summary: 'Fournisseur Peugeot signale un retard de livraison pour la pièce commandée. Impact sur planning client.',
    message: 'Bonjour, c\'est Marc de chez Peugeot Pièces Détachées. Je vous appelle concernant votre commande du pare-chocs pour la 208 blanche. Il y a un souci d\'approvisionnement, la livraison sera retardée de 3 jours. Pouvez-vous prévenir votre client ? Désolé pour le désagrément.',
    tags: ['fournisseur', 'retard', 'pièce', 'planning'],
    resolved: true,
    archived: false,
    created_at: '2024-03-04T14:10:00.000Z',
    updated_at: '2024-03-04T15:30:00.000Z',
  },
  {
    id: 'message-6',
    company_id: 'demo-company-123',
    priority: 3,
    title: 'Demande de facturation électronique',
    channel: 'Mail',
    eta: '48h',
    time: 'Avant-hier 11h',
    date: '2024-03-03',
    summary: 'Client professionnel demande activation facturation électronique pour ses futures prestations.',
    message: 'Messieurs, notre entreprise Logistics Pro souhaite désormais recevoir toutes ses factures au format électronique. Pouvez-vous configurer votre système pour nos prochaines prestations ? Notre numéro SIRET est 78945612301234. Merci de confirmer la prise en compte.',
    tags: ['facturation', 'électronique', 'professionnel', 'configuration'],
    resolved: true,
    archived: true,
    created_at: '2024-03-03T11:15:00.000Z',
    updated_at: '2024-03-03T17:45:00.000Z',
  },
  {
    id: 'message-7',
    company_id: 'demo-company-123',
    priority: 1,
    title: 'Véhicule de remplacement indisponible',
    channel: 'Message',
    eta: '2h',
    time: 'Ce matin 9h',
    date: '2024-03-05',
    summary: 'Client en panique car véhicule de remplacement promis n\'est pas disponible. RDV important cet après-midi.',
    message: 'URGENT !! Vous m\'aviez promis un véhicule de remplacement pour aujourd\'hui pendant que vous réparez ma voiture. J\'arrive dans 30 minutes et j\'ai ABSOLUMENT besoin d\'une voiture pour un RDV client à 14h. C\'est inacceptable ! Trouvez-moi une solution IMMÉDIATEMENT !',
    tags: ['véhicule-remplacement', 'urgence', 'service-client', 'mécontentement'],
    resolved: false,
    archived: false,
    created_at: '2024-03-05T09:15:00.000Z',
    updated_at: '2024-03-05T09:15:00.000Z',
  },
  {
    id: 'message-8',
    company_id: 'demo-company-123',
    priority: 4,
    title: 'Remerciements client satisfait',
    channel: 'WhatsApp',
    eta: '7j',
    time: 'La semaine dernière',
    date: '2024-02-28',
    summary: 'Cliente très satisfaite du service rendu. Recommandera le garage à ses proches.',
    message: 'Bonsoir ! Je tenais à vous remercier pour l\'excellent travail sur ma Citroën C3. La réparation est parfaite, impossible de voir où était le choc ! Votre équipe est très professionnelle et les délais ont été respectés. Je vous recommanderai sans hésiter. Merci encore ! 😊',
    tags: ['remerciements', 'satisfaction', 'recommandation', 'citroën'],
    resolved: true,
    archived: true,
    created_at: '2024-02-28T18:30:00.000Z',
    updated_at: '2024-02-28T18:30:00.000Z',
  }
];

export const STATIC_EXPERTISE_REPORTS = [
  {
    id: 'expertise-1',
    company_id: 'demo-company-123',
    client_id: 'client-1',
    vehicle_id: 'vehicle-1',
    report_number: 'EXP-2024-001',
    report_date: '2024-02-20',
    claim_number: 'SIN-45678901',
    incident_date: '2024-02-15',
    policy_number: 'POL-123456789',
    amount: 1850.00,
    status: 'Validé',
    description: 'Expertise suite collision arrière - Remplacement pare-chocs et feu arrière',
    repairs_data: JSON.stringify([
      {
        description: 'Remplacement pare-chocs arrière',
        quantity: 1,
        labor_hours: 3.5,
        labor_rate: 75.00,
        total: 262.50
      },
      {
        description: 'Dépose/pose feu arrière droit',
        quantity: 1,
        labor_hours: 1.5,
        labor_rate: 75.00,
        total: 112.50
      }
    ]),
    parts_data: JSON.stringify([
      {
        description: 'Pare-chocs arrière Renault Clio (peinture comprise)',
        quantity: 1,
        unit_price: 850.00,
        total: 850.00
      },
      {
        description: 'Feu arrière droit',
        quantity: 1,
        unit_price: 125.00,
        total: 125.00
      },
      {
        description: 'Peinture et vernis',
        quantity: 1,
        unit_price: 500.00,
        total: 500.00
      }
    ]),
    created_at: '2024-02-20T10:30:00.000Z',
    updated_at: '2024-02-20T10:30:00.000Z',
    clients: {
      first_name: 'Marie',
      last_name: 'Martin'
    },
    vehicles: {
      id: 'vehicle-1',
      license_plate: 'AB-123-CD',
      car_brands: { name: 'Renault' },
      car_models: { name: 'Clio' }
    }
  },
  {
    id: 'expertise-2',
    company_id: 'demo-company-123',
    client_id: 'client-2',
    vehicle_id: 'vehicle-2',
    report_number: 'EXP-2024-002',
    report_date: '2024-02-25',
    claim_number: 'SIN-78901234',
    incident_date: '2024-02-22',
    policy_number: 'POL-987654321',
    amount: 2450.00,
    status: 'En cours',
    description: 'Expertise dégâts latéraux suite à accrochage en stationnement',
    repairs_data: JSON.stringify([
      {
        description: 'Réparation portière avant droite',
        quantity: 1,
        labor_hours: 4.0,
        labor_rate: 75.00,
        total: 300.00
      },
      {
        description: 'Débosselage aile droite',
        quantity: 1,
        labor_hours: 3.0,
        labor_rate: 75.00,
        total: 225.00
      }
    ]),
    parts_data: JSON.stringify([
      {
        description: 'Poignée de portière extérieure',
        quantity: 1,
        unit_price: 85.00,
        total: 85.00
      },
      {
        description: 'Moulure latérale',
        quantity: 1,
        unit_price: 120.00,
        total: 120.00
      },
      {
        description: 'Peinture complète côté droit',
        quantity: 1,
        unit_price: 1720.00,
        total: 1720.00
      }
    ]),
    created_at: '2024-02-25T14:20:00.000Z',
    updated_at: '2024-02-25T14:20:00.000Z',
    clients: {
      first_name: 'Pierre',
      last_name: 'Bernard'
    },
    vehicles: {
      id: 'vehicle-2',
      license_plate: 'EF-456-GH',
      car_brands: { name: 'Peugeot' },
      car_models: { name: '208' }
    }
  },
  {
    id: 'expertise-3',
    company_id: 'demo-company-123',
    client_id: 'client-3',
    vehicle_id: 'vehicle-3',
    report_number: 'EXP-2024-003',
    report_date: '2024-03-01',
    claim_number: 'SIN-11223344',
    incident_date: '2024-02-28',
    policy_number: 'POL-456789123',
    amount: 3200.00,
    status: 'Importé',
    description: 'Expertise complète suite collision frontale - Dégâts importants',
    repairs_data: JSON.stringify([
      {
        description: 'Remplacement capot',
        quantity: 1,
        labor_hours: 4.5,
        labor_rate: 75.00,
        total: 337.50
      },
      {
        description: 'Réparation radiateur',
        quantity: 1,
        labor_hours: 2.5,
        labor_rate: 75.00,
        total: 187.50
      },
      {
        description: 'Contrôle géométrie et parallélisme',
        quantity: 1,
        labor_hours: 1.0,
        labor_rate: 75.00,
        total: 75.00
      }
    ]),
    parts_data: JSON.stringify([
      {
        description: 'Capot avant Volkswagen Golf',
        quantity: 1,
        unit_price: 950.00,
        total: 950.00
      },
      {
        description: 'Grille de radiateur',
        quantity: 1,
        unit_price: 280.00,
        total: 280.00
      },
      {
        description: 'Phare avant droit',
        quantity: 1,
        unit_price: 450.00,
        total: 450.00
      },
      {
        description: 'Support pare-chocs',
        quantity: 1,
        unit_price: 320.00,
        total: 320.00
      },
      {
        description: 'Peinture et finition',
        quantity: 1,
        unit_price: 600.00,
        total: 600.00
      }
    ]),
    created_at: '2024-03-01T09:15:00.000Z',
    updated_at: '2024-03-01T09:15:00.000Z',
    clients: {
      first_name: 'Sophie',
      last_name: 'Durand'
    },
    vehicles: {
      id: 'vehicle-3',
      license_plate: 'IJ-789-KL',
      car_brands: { name: 'Volkswagen' },
      car_models: { name: 'Golf' }
    }
  }
];

export const STATIC_CREDITS = [
  {
    id: 'credit-1',
    company_id: 'demo-company-123',
    reference: 'AV-2024-001',
    client_id: 'client-1',
    vehicle_id: 'vehicle-1',
    invoice_id: 'invoice-1',
    status: 'Émis',
    amount: 145.50,
    items_data: JSON.stringify([
      {
        description: 'Avoir sur facture FACT-2024-001 - Remise client fidèle',
        quantity: 1,
        unit_price: 145.50,
        total: 145.50,
        type: 'remise'
      }
    ]),
    notes: 'Remise accordée suite à la fidélité du client - 5 ans de collaboration',
    created_date: '2024-03-10',
    created_at: '2024-03-10T14:30:00.000Z',
    updated_at: '2024-03-10T14:30:00.000Z',
    clients: {
      id: 'client-1',
      first_name: 'Marie',
      last_name: 'Martin'
    },
    vehicles: {
      id: 'vehicle-1',
      brand: 'Renault',
      model: 'Clio',
      license_plate: 'AB-123-CD'
    },
    invoices: {
      id: 'invoice-1',
      reference: 'FACT-2024-001'
    }
  },
  {
    id: 'credit-2',
    company_id: 'demo-company-123',
    reference: 'AV-2024-002',
    client_id: 'client-2',
    vehicle_id: 'vehicle-2',
    invoice_id: 'invoice-2',
    status: 'Émis',
    amount: 75.00,
    items_data: JSON.stringify([
      {
        description: 'Avoir suite erreur de facturation - Trop-perçu main d\'œuvre',
        quantity: 1,
        unit_price: 75.00,
        total: 75.00,
        type: 'erreur'
      }
    ]),
    notes: 'Erreur de calcul sur les heures de main d\'œuvre facturées (2h au lieu de 1h)',
    created_date: '2024-03-08',
    created_at: '2024-03-08T11:45:00.000Z',
    updated_at: '2024-03-08T11:45:00.000Z',
    clients: {
      id: 'client-2',
      first_name: 'Pierre',
      last_name: 'Bernard'
    },
    vehicles: {
      id: 'vehicle-2',
      brand: 'Peugeot',
      model: '208',
      license_plate: 'EF-456-GH'
    },
    invoices: {
      id: 'invoice-2',
      reference: 'FACT-2024-002'
    }
  },
  {
    id: 'credit-3',
    company_id: 'demo-company-123',
    reference: 'AV-2024-003',
    client_id: 'client-3',
    vehicle_id: 'vehicle-3',
    invoice_id: null,
    status: 'Brouillon',
    amount: 280.00,
    items_data: JSON.stringify([
      {
        description: 'Avoir suite retour marchandise - Pièce défectueuse',
        quantity: 1,
        unit_price: 280.00,
        total: 280.00,
        type: 'retour'
      }
    ]),
    notes: 'Pièce défectueuse livrée par le fournisseur - Retour et remboursement client',
    created_date: '2024-03-12',
    created_at: '2024-03-12T16:20:00.000Z',
    updated_at: '2024-03-12T16:20:00.000Z',
    clients: {
      id: 'client-3',
      first_name: 'Sophie',
      last_name: 'Durand'
    },
    vehicles: {
      id: 'vehicle-3',
      brand: 'Volkswagen',
      model: 'Golf',
      license_plate: 'IJ-789-KL'
    },
    invoices: null
  }
];

export const STATIC_BANK_ACCOUNTS = [
  {
    id: 'bank-1',
    company_id: 'demo-company-123',
    bank: 'Crédit Agricole',
    iban: 'FR14 2004 1010 0505 0001 3M02 606',
    bic: 'AGRIFRPP840',
    account_name: 'Karrosserie Dupont - Compte Principal',
    is_default: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'bank-2',
    company_id: 'demo-company-123',
    bank: 'BNP Paribas',
    iban: 'FR76 3000 3033 5000 0372 8564 505',
    bic: 'BNPAFRPPPOI',
    account_name: 'Karrosserie Dupont - Compte Épargne',
    is_default: false,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  }
];

export const STATIC_CESSIONS = [
  {
    id: 'cession-1',
    reference: 'CES-2024-001',
    status: 'en_attente_signature',
    company_id: 'demo-company-123',
    repair_order_id: 'repair-order-1',
    bank_account_id: 'bank-1',
    incident_number: 'INC-45678901',
    incident_date: '2024-02-15',
    policy_number: 'POL-123456789',
    report_number: 'EXP-2024-001',
    expert_name: 'Jean-Pierre MARTIN',
    insurance_company_id: 'insurance-1',
    document_url: null,
    oodrive_contract_id: null,
    created_at: '2024-02-22T10:30:00.000Z',
    updated_at: '2024-02-22T15:45:00.000Z',
    insurance_companies: {
      name: 'AXA Assurances'
    },
    repair_orders: {
      reference: 'OR-2024-001',
      created_at: '2024-02-28T00:00:00.000Z',
      amount: 1050.00,
      parts_data: null,
      repairs_data: null,
      clients: {
        first_name: 'Marie',
        last_name: 'Martin',
        address: '45 Rue de la République',
        city: 'Paris',
        postal_code: '75011',
        email: 'marie.martin@email.fr',
        phone: '06 12 34 56 78',
        oodrive_recipient_id: null
      },
      vehicles: {
        license_plate: 'AB-123-CD',
        vin: 'VF1RG25041H123456',
        mileage: 45000,
        car_brands: { name: 'Renault' },
        car_models: { name: 'Clio' }
      }
    },
    bank_accounts: {
      bank: 'Crédit Agricole',
      iban: 'FR14 2004 1010 0505 0001 3M02 606',
      bic: 'AGRIFRPP840'
    }
  },
  {
    id: 'cession-2',
    reference: 'CES-2024-002',
    status: 'signee',
    company_id: 'demo-company-123',
    repair_order_id: 'repair-order-2',
    bank_account_id: 'bank-1',
    incident_number: 'INC-78901234',
    incident_date: '2024-02-10',
    policy_number: 'POL-987654321',
    report_number: 'EXP-2024-002',
    expert_name: 'Sophie DURAND',
    insurance_company_id: 'insurance-2',
    document_url: 'https://documents.karrosserie.fr/cession-ces-2024-002.pdf',
    oodrive_contract_id: 'ODR-789456123',
    created_at: '2024-02-18T14:20:00.000Z',
    updated_at: '2024-03-05T09:30:00.000Z',
    insurance_companies: {
      name: 'Allianz France'
    },
    repair_orders: {
      reference: 'OR-2024-002',
      created_at: '2024-02-14T00:00:00.000Z',
      amount: 730.00,
      parts_data: null,
      repairs_data: null,
      clients: {
        first_name: 'Pierre',
        last_name: 'Bernard',
        address: '78 Boulevard Saint-Germain',
        city: 'Paris',
        postal_code: '75006',
        email: 'pierre.bernard@email.fr',
        phone: '06 87 65 43 21',
        oodrive_recipient_id: 'ODR-CLIENT-456'
      },
      vehicles: {
        license_plate: 'EF-456-GH',
        vin: 'VF32C5FX6JW123456',
        mileage: 78000,
        car_brands: { name: 'Peugeot' },
        car_models: { name: '208' }
      }
    },
    bank_accounts: {
      bank: 'Crédit Agricole',
      iban: 'FR14 2004 1010 0505 0001 3M02 606',
      bic: 'AGRIFRPP840'
    }
  },
  {
    id: 'cession-3',
    reference: 'CES-2024-003',
    status: 'lettre_recommandee_envoyee',
    company_id: 'demo-company-123',
    repair_order_id: 'repair-order-3',
    bank_account_id: 'bank-2',
    incident_number: 'INC-11223344',
    incident_date: '2024-02-28',
    policy_number: 'POL-456789123',
    report_number: 'EXP-2024-003',
    expert_name: 'Michel LOPEZ',
    insurance_company_id: 'insurance-3',
    document_url: 'https://documents.karrosserie.fr/cession-ces-2024-003.pdf',
    oodrive_contract_id: 'ODR-456789321',
    created_at: '2024-03-05T11:15:00.000Z',
    updated_at: '2024-03-08T16:45:00.000Z',
    insurance_companies: {
      name: 'MAIF'
    },
    repair_orders: {
      reference: 'OR-2024-003',
      created_at: '2024-03-05T00:00:00.000Z',
      amount: 420.00,
      parts_data: null,
      repairs_data: null,
      clients: {
        first_name: 'Sophie',
        last_name: 'Durand',
        address: '12 Place de la Bastille',
        city: 'Paris',
        postal_code: '75004',
        email: 'sophie.durand@email.fr',
        phone: '06 45 78 90 12',
        oodrive_recipient_id: null
      },
      vehicles: {
        license_plate: 'IJ-789-KL',
        vin: 'WVWZZZ1JZYM123456',
        mileage: 32000,
        car_brands: { name: 'Volkswagen' },
        car_models: { name: 'Golf' }
      }
    },
    bank_accounts: {
      bank: 'BNP Paribas',
      iban: 'FR76 3000 3033 5000 0372 8564 505',
      bic: 'BNPAFRPPPOI'
    }
  }
];

export const STATIC_FLEET_VEHICLES = [
  {
    id: 'fleet-1',
    company_id: 'demo-company-123',
    brand_id: 'brand-1',
    model_id: 'model-1',
    license_plate: 'FC-001-KD',
    color: 'Blanc',
    year: 2022,
    vin: 'VF1RG25041H789012',
    engine_number: 'K4M123456',
    mileage: 25000,
    status: 'available',
    registration_front_url: null,
    registration_back_url: null,
    insurance_card_url: null,
    created_at: '2024-01-10T00:00:00.000Z',
    updated_at: '2024-01-10T00:00:00.000Z',
    car_brands: {
      id: 'brand-1',
      name: 'Renault'
    },
    car_models: {
      id: 'model-1',
      name: 'Clio'
    }
  },
  {
    id: 'fleet-2',
    company_id: 'demo-company-123',
    brand_id: 'brand-2',
    model_id: 'model-3',
    license_plate: 'FC-002-KD',
    color: 'Gris',
    year: 2021,
    vin: 'VF32C5FX6JW789123',
    engine_number: 'EB2ADT456789',
    mileage: 35000,
    status: 'on_loan',
    registration_front_url: null,
    registration_back_url: null,
    insurance_card_url: null,
    created_at: '2024-01-10T00:00:00.000Z',
    updated_at: '2024-03-01T10:30:00.000Z',
    car_brands: {
      id: 'brand-2',
      name: 'Peugeot'
    },
    car_models: {
      id: 'model-3',
      name: '208'
    }
  },
  {
    id: 'fleet-3',
    company_id: 'demo-company-123',
    brand_id: 'brand-3',
    model_id: 'model-5',
    license_plate: 'FC-003-KD',
    color: 'Rouge',
    year: 2023,
    vin: 'VF7C4HZ4JGK789234',
    engine_number: 'EB2M456123',
    mileage: 15000,
    status: 'maintenance',
    registration_front_url: null,
    registration_back_url: null,
    insurance_card_url: null,
    created_at: '2024-01-10T00:00:00.000Z',
    updated_at: '2024-03-10T14:20:00.000Z',
    car_brands: {
      id: 'brand-3',
      name: 'Citroën'
    },
    car_models: {
      id: 'model-5',
      name: 'C3'
    }
  },
  {
    id: 'fleet-4',
    company_id: 'demo-company-123',
    brand_id: 'brand-4',
    model_id: 'model-6',
    license_plate: 'FC-004-KD',
    color: 'Bleu',
    year: 2022,
    vin: 'WVWZZZ1JZYM789345',
    engine_number: 'CHZB123789',
    mileage: 28000,
    status: 'available',
    registration_front_url: null,
    registration_back_url: null,
    insurance_card_url: null,
    created_at: '2024-01-10T00:00:00.000Z',
    updated_at: '2024-01-10T00:00:00.000Z',
    car_brands: {
      id: 'brand-4',
      name: 'Volkswagen'
    },
    car_models: {
      id: 'model-6',
      name: 'Golf'
    }
  }
];

export const STATIC_FLEET_RESERVATIONS = [
  {
    id: 'reservation-1',
    company_id: 'demo-company-123',
    client_id: 'client-1',
    fleet_vehicle_id: 'fleet-2',
    start_date: '2024-03-01T09:00:00.000Z',
    expected_return_date: '2024-03-15T18:00:00.000Z',
    actual_return_date: null,
    status: 'active',
    notes: 'Prêt pendant réparation suite collision - Véhicule de remplacement',
    created_at: '2024-02-28T14:30:00.000Z',
    updated_at: '2024-03-01T09:00:00.000Z',
    clients: {
      id: 'client-1',
      first_name: 'Marie',
      last_name: 'Martin',
      email: 'marie.martin@email.fr',
      phone: '06 12 34 56 78',
      address: '45 Rue de la République',
      postal_code: '75011',
      city: 'Paris'
    },
    fleet_vehicles: {
      id: 'fleet-2',
      brand_id: 'brand-2',
      model_id: 'model-3',
      license_plate: 'FC-002-KD',
      color: 'Gris',
      year: 2021,
      registration_front_url: null,
      registration_back_url: null,
      insurance_card_url: null,
      car_brands: {
        id: 'brand-2',
        name: 'Peugeot'
      },
      car_models: {
        id: 'model-3',
        name: '208'
      }
    }
  },
  {
    id: 'reservation-2',
    company_id: 'demo-company-123',
    client_id: 'client-2',
    fleet_vehicle_id: 'fleet-1',
    start_date: '2024-02-10T10:00:00.000Z',
    expected_return_date: '2024-02-25T17:00:00.000Z',
    actual_return_date: '2024-02-24T16:30:00.000Z',
    status: 'returned',
    notes: 'Véhicule de courtoisie pendant réparation portière',
    created_at: '2024-02-09T15:20:00.000Z',
    updated_at: '2024-02-24T16:30:00.000Z',
    clients: {
      id: 'client-2',
      first_name: 'Pierre',
      last_name: 'Bernard',
      email: 'pierre.bernard@email.fr',
      phone: '06 87 65 43 21',
      address: '78 Boulevard Saint-Germain',
      postal_code: '75006',
      city: 'Paris'
    },
    fleet_vehicles: {
      id: 'fleet-1',
      brand_id: 'brand-1',
      model_id: 'model-1',
      license_plate: 'FC-001-KD',
      color: 'Blanc',
      year: 2022,
      registration_front_url: null,
      registration_back_url: null,
      insurance_card_url: null,
      car_brands: {
        id: 'brand-1',
        name: 'Renault'
      },
      car_models: {
        id: 'model-1',
        name: 'Clio'
      }
    }
  },
  {
    id: 'reservation-3',
    company_id: 'demo-company-123',
    client_id: 'client-3',
    fleet_vehicle_id: 'fleet-4',
    start_date: '2024-01-15T11:00:00.000Z',
    expected_return_date: '2024-01-30T16:00:00.000Z',
    actual_return_date: '2024-01-29T15:45:00.000Z',
    status: 'returned',
    notes: 'Prêt longue durée - Réparations importantes suite collision frontale',
    created_at: '2024-01-14T10:15:00.000Z',
    updated_at: '2024-01-29T15:45:00.000Z',
    clients: {
      id: 'client-3',
      first_name: 'Sophie',
      last_name: 'Durand',
      email: 'sophie.durand@email.fr',
      phone: '06 45 78 90 12',
      address: '12 Place de la Bastille',
      postal_code: '75004',
      city: 'Paris'
    },
    fleet_vehicles: {
      id: 'fleet-4',
      brand_id: 'brand-4',
      model_id: 'model-6',
      license_plate: 'FC-004-KD',
      color: 'Bleu',
      year: 2022,
      registration_front_url: null,
      registration_back_url: null,
      insurance_card_url: null,
      car_brands: {
        id: 'brand-4',
        name: 'Volkswagen'
      },
      car_models: {
        id: 'model-6',
        name: 'Golf'
      }
    }
  },
  {
    id: 'reservation-4',
    company_id: 'demo-company-123',
    client_id: 'client-1',
    fleet_vehicle_id: 'fleet-3',
    start_date: '2024-03-20T14:00:00.000Z',
    expected_return_date: '2024-04-05T18:00:00.000Z',
    actual_return_date: null,
    status: 'scheduled',
    notes: 'Réservation future - Révision complète prévue',
    created_at: '2024-03-12T11:30:00.000Z',
    updated_at: '2024-03-12T11:30:00.000Z',
    clients: {
      id: 'client-1',
      first_name: 'Marie',
      last_name: 'Martin',
      email: 'marie.martin@email.fr',
      phone: '06 12 34 56 78',
      address: '45 Rue de la République',
      postal_code: '75011',
      city: 'Paris'
    },
    fleet_vehicles: {
      id: 'fleet-3',
      brand_id: 'brand-3',
      model_id: 'model-5',
      license_plate: 'FC-003-KD',
      color: 'Rouge',
      year: 2023,
      registration_front_url: null,
      registration_back_url: null,
      insurance_card_url: null,
      car_brands: {
        id: 'brand-3',
        name: 'Citroën'
      },
      car_models: {
        id: 'model-5',
        name: 'C3'
      }
    }
  }
];

export const STATIC_FLEET_VIOLATIONS = [
  {
    id: 'violation-1',
    fleet_vehicle_id: 'fleet-2',
    license_plate: 'FC-002-KD',
    violation_date: '2024-03-05',
    violation_time: '14:30:00',
    location: 'Avenue des Champs-Élysées, 75008 Paris',
    violation_type: 'Excès de vitesse',
    fine_amount: 68.00,
    payment_status: 'unpaid',
    reference_number: 'PV-2024-0305001',
    due_date: '2024-04-04',
    points_lost: 1,
    notes: 'Radar automatique - Dépassement de 5 km/h en agglomération',
    document_url: null,
    borrower_name: 'Marie Martin',
    borrower_phone: '06 12 34 56 78',
    borrower_email: 'marie.martin@email.fr',
    company_id: 'demo-company-123',
    created_at: '2024-03-08T10:15:00.000Z',
    updated_at: '2024-03-08T10:15:00.000Z',
    fleet_vehicles: {
      license_plate: 'FC-002-KD',
      car_brands: {
        name: 'Peugeot'
      },
      car_models: {
        name: '208'
      }
    }
  },
  {
    id: 'violation-2',
    fleet_vehicle_id: 'fleet-1',
    license_plate: 'FC-001-KD',
    violation_date: '2024-02-18',
    violation_time: '16:45:00',
    location: 'Rue de Rivoli, 75001 Paris',
    violation_type: 'Stationnement gênant',
    fine_amount: 35.00,
    payment_status: 'paid',
    reference_number: 'PV-2024-0218002',
    due_date: '2024-03-20',
    points_lost: 0,
    notes: 'Stationnement sur passage piéton - Amende payée par l\'emprunteur',
    document_url: 'https://documents.karrosserie.fr/pv-fc-001-kd-20240218.pdf',
    borrower_name: 'Pierre Bernard',
    borrower_phone: '06 87 65 43 21',
    borrower_email: 'pierre.bernard@email.fr',
    company_id: 'demo-company-123',
    created_at: '2024-02-20T09:30:00.000Z',
    updated_at: '2024-03-18T14:20:00.000Z',
    fleet_vehicles: {
      license_plate: 'FC-001-KD',
      car_brands: {
        name: 'Renault'
      },
      car_models: {
        name: 'Clio'
      }
    }
  },
  {
    id: 'violation-3',
    fleet_vehicle_id: 'fleet-4',
    license_plate: 'FC-004-KD',
    violation_date: '2024-01-22',
    violation_time: '11:20:00',
    location: 'Boulevard Saint-Michel, 75006 Paris',
    violation_type: 'Non-respect du stop',
    fine_amount: 135.00,
    payment_status: 'contested',
    reference_number: 'PV-2024-0122003',
    due_date: '2024-02-21',
    points_lost: 4,
    notes: 'Contestation en cours - Photos du radar disponibles',
    document_url: 'https://documents.karrosserie.fr/pv-fc-004-kd-20240122.pdf',
    borrower_name: 'Sophie Durand',
    borrower_phone: '06 45 78 90 12',
    borrower_email: 'sophie.durand@email.fr',
    company_id: 'demo-company-123',
    created_at: '2024-01-25T13:45:00.000Z',
    updated_at: '2024-02-15T16:10:00.000Z',
    fleet_vehicles: {
      license_plate: 'FC-004-KD',
      car_brands: {
        name: 'Volkswagen'
      },
      car_models: {
        name: 'Golf'
      }
    }
  },
  {
    id: 'violation-4',
    fleet_vehicle_id: 'fleet-3',
    license_plate: 'FC-003-KD',
    violation_date: '2024-03-12',
    violation_time: '08:15:00',
    location: 'Périphérique Porte de Bercy, 75012 Paris',
    violation_type: 'Excès de vitesse',
    fine_amount: 135.00,
    payment_status: 'unpaid',
    reference_number: 'PV-2024-0312004',
    due_date: '2024-04-11',
    points_lost: 3,
    notes: 'Dépassement de 20 km/h sur voie rapide - Véhicule en maintenance',
    document_url: null,
    borrower_name: null,
    borrower_phone: null,
    borrower_email: null,
    company_id: 'demo-company-123',
    created_at: '2024-03-15T11:00:00.000Z',
    updated_at: '2024-03-15T11:00:00.000Z',
    fleet_vehicles: {
      license_plate: 'FC-003-KD',
      car_brands: {
        name: 'Citroën'
      },
      car_models: {
        name: 'C3'
      }
    }
  },
  {
    id: 'violation-5',
    fleet_vehicle_id: 'fleet-2',
    license_plate: 'FC-002-KD',
    violation_date: '2024-03-10',
    violation_time: '19:30:00',
    location: 'Place de la République, 75011 Paris',
    violation_type: 'Stationnement payant non acquitté',
    fine_amount: 17.00,
    payment_status: 'unpaid',
    reference_number: 'PV-2024-0310005',
    due_date: '2024-04-09',
    points_lost: 0,
    notes: 'Horodateur non alimenté - Zone payante 19h-21h',
    document_url: null,
    borrower_name: 'Marie Martin',
    borrower_phone: '06 12 34 56 78',
    borrower_email: 'marie.martin@email.fr',
    company_id: 'demo-company-123',
    created_at: '2024-03-13T08:45:00.000Z',
    updated_at: '2024-03-13T08:45:00.000Z',
    fleet_vehicles: {
      license_plate: 'FC-002-KD',
      car_brands: {
        name: 'Peugeot'
      },
      car_models: {
        name: '208'
      }
    }
  }
];

// Fonction utilitaire pour simuler un délai d'API
export const mockApiDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Fonction pour filtrer par company_id
export const filterByCompanyId = <T extends { company_id?: string }>(
  data: T[], 
  companyId: string = 'demo-company-123'
): T[] => {
  return data.filter(item => item.company_id === companyId);
};
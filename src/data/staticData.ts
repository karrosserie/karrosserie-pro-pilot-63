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
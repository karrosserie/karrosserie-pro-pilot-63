// Données fictives complètes pour le mode démonstration
import { addDays, subDays, addMonths, subMonths } from 'date-fns';

// Types de base
export interface DemoClient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  created_at: string;
  updated_at: string;
  company_id: string;
}

export interface DemoVehicle {
  id: string;
  registration_number: string;
  brand: string;
  model: string;
  year: number;
  vin: string;
  color: string;
  mileage: number;
  fuel_type: string;
  client_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  company_id: string;
}

export interface DemoQuote {
  id: string;
  quote_number: string;
  client_id: string;
  vehicle_id: string;
  status: string;
  total_ht: number;
  total_ttc: number;
  vat_amount: number;
  created_at: string;
  valid_until: string;
  repairs_data: any[];
  parts_data: any[];
  company_id: string;
}

export interface DemoRepairOrder {
  id: string;
  order_number: string;
  client_id: string;
  vehicle_id: string;
  quote_id?: string;
  status: string;
  total_ht: number;
  total_ttc: number;
  start_date: string;
  end_date?: string;
  assigned_employee: string;
  created_at: string;
  company_id: string;
}

export interface DemoInvoice {
  id: string;
  invoice_number: string;
  client_id: string;
  vehicle_id: string;
  repair_order_id?: string;
  status: string;
  total_ht: number;
  total_ttc: number;
  vat_amount: number;
  payment_due_date: string;
  created_at: string;
  company_id: string;
}

export interface DemoCredit {
  id: string;
  credit_number: string;
  client_id: string;
  vehicle_id: string;
  invoice_id: string;
  total_ht: number;
  total_ttc: number;
  reason: string;
  created_at: string;
  company_id: string;
}

export interface DemoExpense {
  id: string;
  amount: number;
  description: string;
  category: string;
  supplier: string;
  date: string;
  vehicle_id?: string;
  status: string;
  created_at: string;
  company_id: string;
}

export interface DemoFleetVehicle {
  id: string;
  registration_number: string;
  brand: string;
  model: string;
  year: number;
  status: string;
  mileage: number;
  fuel_level: number;
  created_at: string;
  company_id: string;
}

export interface DemoFleetReservation {
  id: string;
  client_id: string;
  fleet_vehicle_id: string;
  start_date: string;
  end_date: string;
  expected_return_date: string;
  actual_return_date?: string;
  status: string;
  departure_mileage: number;
  return_mileage?: number;
  created_at: string;
  company_id: string;
}

export interface DemoCession {
  id: string;
  client_id: string;
  vehicle_id: string;
  repair_order_id: string;
  insurance_company: string;
  expert_name: string;
  claim_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  company_id: string;
}

const COMPANY_ID = '00000000-0000-4000-8000-000000000002';

// Clients fictifs
export const demoClients: DemoClient[] = [
  {
    id: '00000000-0000-4000-8000-000000000010',
    first_name: 'Marie',
    last_name: 'Martin',
    email: 'marie.martin@email.com',
    phone: '01.23.45.67.89',
    address: '15 rue des Acacias',
    city: 'Paris',
    postal_code: '75015',
    created_at: subMonths(new Date(), 6).toISOString(),
    updated_at: subDays(new Date(), 2).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: '00000000-0000-4000-8000-000000000011',
    first_name: 'Pierre',
    last_name: 'Durand',
    email: 'pierre.durand@gmail.com',
    phone: '01.34.56.78.90',
    address: '42 avenue de la République',
    city: 'Lyon',
    postal_code: '69003',
    created_at: subMonths(new Date(), 4).toISOString(),
    updated_at: subDays(new Date(), 5).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: '00000000-0000-4000-8000-000000000012',
    first_name: 'Sophie',
    last_name: 'Bernard',
    email: 'sophie.bernard@outlook.fr',
    phone: '01.45.67.89.01',
    address: '8 place de la Mairie',
    city: 'Marseille',
    postal_code: '13001',
    created_at: subMonths(new Date(), 8).toISOString(),
    updated_at: subDays(new Date(), 1).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: '00000000-0000-4000-8000-000000000013',
    first_name: 'Antoine',
    last_name: 'Petit',
    email: 'antoine.petit@free.fr',
    phone: '01.56.78.90.12',
    address: '23 boulevard Saint-Michel',
    city: 'Toulouse',
    postal_code: '31000',
    created_at: subMonths(new Date(), 2).toISOString(),
    updated_at: subDays(new Date(), 3).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: '00000000-0000-4000-8000-000000000014',
    first_name: 'Camille',
    last_name: 'Moreau',
    email: 'camille.moreau@wanadoo.fr',
    phone: '01.67.89.01.23',
    address: '56 rue Victor Hugo',
    city: 'Nice',
    postal_code: '06000',
    created_at: subMonths(new Date(), 3).toISOString(),
    updated_at: subDays(new Date(), 7).toISOString(),
    company_id: COMPANY_ID,
  },
];

// Véhicules fictifs
export const demoVehicles: DemoVehicle[] = [
  {
    id: '00000000-0000-4000-8000-000000000020',
    registration_number: 'AB-123-CD',
    brand: 'Renault',
    model: 'Clio',
    year: 2019,
    vin: 'VF1RJ0K0H62123456',
    color: 'Blanc',
    mileage: 45000,
    fuel_type: 'Essence',
    client_id: '00000000-0000-4000-8000-000000000010',
    status: 'en_cours',
    created_at: subMonths(new Date(), 5).toISOString(),
    updated_at: subDays(new Date(), 1).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: '00000000-0000-4000-8000-000000000021',
    registration_number: 'EF-456-GH',
    brand: 'Peugeot',
    model: '308',
    year: 2020,
    vin: 'VF3LC8FZ8LS789012',
    color: 'Gris Métallisé',
    mileage: 32000,
    fuel_type: 'Diesel',
    client_id: '00000000-0000-4000-8000-000000000011',
    status: 'termine',
    created_at: subMonths(new Date(), 4).toISOString(),
    updated_at: subDays(new Date(), 2).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: '00000000-0000-4000-8000-000000000022',
    registration_number: 'IJ-789-KL',
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2021,
    vin: 'WVWZZZ1JZYW345678',
    color: 'Noir',
    mileage: 28000,
    fuel_type: 'Essence',
    client_id: '00000000-0000-4000-8000-000000000012',
    status: 'en_attente',
    created_at: subMonths(new Date(), 3).toISOString(),
    updated_at: subDays(new Date(), 4).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: '00000000-0000-4000-8000-000000000023',
    registration_number: 'MN-012-OP',
    brand: 'Citroën',
    model: 'C4',
    year: 2018,
    vin: 'VF7LC8HZ8JS901234',
    color: 'Rouge',
    mileage: 67000,
    fuel_type: 'Diesel',
    client_id: '00000000-0000-4000-8000-000000000013',
    status: 'reserve',
    created_at: subMonths(new Date(), 2).toISOString(),
    updated_at: subDays(new Date(), 3).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: '00000000-0000-4000-8000-000000000024',
    registration_number: 'QR-345-ST',
    brand: 'BMW',
    model: 'Série 3',
    year: 2022,
    vin: 'WBAVN5107K567890',
    color: 'Bleu Métallisé',
    mileage: 15000,
    fuel_type: 'Hybride',
    client_id: '00000000-0000-4000-8000-000000000014',
    status: 'en_cours',
    created_at: subMonths(new Date(), 1).toISOString(),
    updated_at: subDays(new Date(), 5).toISOString(),
    company_id: COMPANY_ID,
  },
];

// Devis fictifs
export const demoQuotes: DemoQuote[] = [
  {
    id: 'quote-1',
    quote_number: 'DEV-2024-001',
    client_id: 'client-1',
    vehicle_id: 'vehicle-1',
    status: 'valide',
    total_ht: 1250.00,
    total_ttc: 1500.00,
    vat_amount: 250.00,
    created_at: subDays(new Date(), 15).toISOString(),
    valid_until: addDays(new Date(), 15).toISOString(),
    repairs_data: [
      { description: 'Réparation carrosserie arrière', quantity: 3, unit_price: 80, total: 240 },
      { description: 'Peinture complète portière', quantity: 1, unit_price: 350, total: 350 }
    ],
    parts_data: [
      { reference: 'P001', description: 'Feu arrière gauche', quantity: 1, unit_price: 120, total: 120 },
      { reference: 'P002', description: 'Pare-chocs arrière', quantity: 1, unit_price: 540, total: 540 }
    ],
    company_id: COMPANY_ID,
  },
  {
    id: 'quote-2',
    quote_number: 'DEV-2024-002',
    client_id: 'client-2',
    vehicle_id: 'vehicle-2',
    status: 'facture',
    total_ht: 890.00,
    total_ttc: 1068.00,
    vat_amount: 178.00,
    created_at: subDays(new Date(), 25).toISOString(),
    valid_until: addDays(new Date(), 5).toISOString(),
    repairs_data: [
      { description: 'Redressage tôle avant', quantity: 2, unit_price: 95, total: 190 },
      { description: 'Peinture capot', quantity: 1, unit_price: 280, total: 280 }
    ],
    parts_data: [
      { reference: 'P003', description: 'Optique avant droit', quantity: 1, unit_price: 420, total: 420 }
    ],
    company_id: COMPANY_ID,
  },
  {
    id: 'quote-3',
    quote_number: 'DEV-2024-003',
    client_id: 'client-3',
    vehicle_id: 'vehicle-3',
    status: 'en_attente',
    total_ht: 2150.00,
    total_ttc: 2580.00,
    vat_amount: 430.00,
    created_at: subDays(new Date(), 8).toISOString(),
    valid_until: addDays(new Date(), 22).toISOString(),
    repairs_data: [
      { description: 'Réparation carrosserie complète côté droit', quantity: 8, unit_price: 85, total: 680 },
      { description: 'Peinture complète véhicule', quantity: 1, unit_price: 650, total: 650 }
    ],
    parts_data: [
      { reference: 'P004', description: 'Portière avant droite', quantity: 1, unit_price: 820, total: 820 }
    ],
    company_id: COMPANY_ID,
  },
];

// Ordres de réparation fictifs
export const demoRepairOrders: DemoRepairOrder[] = [
  {
    id: 'order-1',
    order_number: 'ORD-2024-001',
    client_id: 'client-1',
    vehicle_id: 'vehicle-1',
    quote_id: 'quote-1',
    status: 'en_cours',
    total_ht: 1250.00,
    total_ttc: 1500.00,
    start_date: subDays(new Date(), 5).toISOString(),
    end_date: addDays(new Date(), 2).toISOString(),
    assigned_employee: 'Michel Leblanc',
    created_at: subDays(new Date(), 8).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'order-2',
    order_number: 'ORD-2024-002',
    client_id: 'client-2',
    vehicle_id: 'vehicle-2',
    quote_id: 'quote-2',
    status: 'termine',
    total_ht: 890.00,
    total_ttc: 1068.00,
    start_date: subDays(new Date(), 15).toISOString(),
    end_date: subDays(new Date(), 3).toISOString(),
    assigned_employee: 'Jean-Paul Rousseau',
    created_at: subDays(new Date(), 18).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'order-3',
    order_number: 'ORD-2024-003',
    client_id: 'client-4',
    vehicle_id: 'vehicle-4',
    status: 'en_attente',
    total_ht: 1680.00,
    total_ttc: 2016.00,
    start_date: addDays(new Date(), 3).toISOString(),
    assigned_employee: 'Patrick Dumont',
    created_at: subDays(new Date(), 2).toISOString(),
    company_id: COMPANY_ID,
  },
];

// Factures fictives
export const demoInvoices: DemoInvoice[] = [
  {
    id: 'invoice-1',
    invoice_number: 'FAC-2024-001',
    client_id: 'client-2',
    vehicle_id: 'vehicle-2',
    repair_order_id: 'order-2',
    status: 'payee',
    total_ht: 890.00,
    total_ttc: 1068.00,
    vat_amount: 178.00,
    payment_due_date: subDays(new Date(), 15).toISOString(),
    created_at: subDays(new Date(), 20).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'invoice-2',
    invoice_number: 'FAC-2024-002',
    client_id: 'client-1',
    vehicle_id: 'vehicle-1',
    repair_order_id: 'order-1',
    status: 'en_attente',
    total_ht: 1250.00,
    total_ttc: 1500.00,
    vat_amount: 250.00,
    payment_due_date: addDays(new Date(), 15).toISOString(),
    created_at: subDays(new Date(), 3).toISOString(),
    company_id: COMPANY_ID,
  },
];

// Avoirs fictifs
export const demoCredits: DemoCredit[] = [
  {
    id: 'credit-1',
    credit_number: 'AVO-2024-001',
    client_id: 'client-2',
    vehicle_id: 'vehicle-2',
    invoice_id: 'invoice-1',
    total_ht: 120.00,
    total_ttc: 144.00,
    reason: 'Geste commercial pour retard de livraison',
    created_at: subDays(new Date(), 10).toISOString(),
    company_id: COMPANY_ID,
  },
];

// Dépenses fictives
export const demoExpenses: DemoExpense[] = [
  {
    id: 'expense-1',
    amount: 485.50,
    description: 'Achat pièces détachées Renault',
    category: 'fournisseurs',
    supplier: 'Autodistribution',
    date: subDays(new Date(), 12).toISOString(),
    vehicle_id: 'vehicle-1',
    status: 'validee',
    created_at: subDays(new Date(), 12).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'expense-2',
    amount: 125.00,
    description: 'Carburant utilitaire',
    category: 'transport',
    supplier: 'Total Energies',
    date: subDays(new Date(), 5).toISOString(),
    status: 'validee',
    created_at: subDays(new Date(), 5).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'expense-3',
    amount: 340.00,
    description: 'Outillage de carrosserie',
    category: 'outillage',
    supplier: 'Facom',
    date: subDays(new Date(), 18).toISOString(),
    status: 'validee',
    created_at: subDays(new Date(), 18).toISOString(),
    company_id: COMPANY_ID,
  },
];

// Véhicules de flotte fictifs
export const demoFleetVehicles: DemoFleetVehicle[] = [
  {
    id: 'fleet-1',
    registration_number: 'FL-001-KP',
    brand: 'Renault',
    model: 'Twingo',
    year: 2020,
    status: 'disponible',
    mileage: 28500,
    fuel_level: 75,
    created_at: subMonths(new Date(), 12).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'fleet-2',
    registration_number: 'FL-002-KP',
    brand: 'Peugeot',
    model: '208',
    year: 2021,
    status: 'prete',
    mileage: 22000,
    fuel_level: 60,
    created_at: subMonths(new Date(), 10).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'fleet-3',
    registration_number: 'FL-003-KP',
    brand: 'Citroën',
    model: 'C3',
    year: 2019,
    status: 'maintenance',
    mileage: 45000,
    fuel_level: 20,
    created_at: subMonths(new Date(), 18).toISOString(),
    company_id: COMPANY_ID,
  },
];

// Réservations de flotte fictives
export const demoFleetReservations: DemoFleetReservation[] = [
  {
    id: 'reservation-1',
    client_id: 'client-1',
    fleet_vehicle_id: 'fleet-2',
    start_date: subDays(new Date(), 3).toISOString(),
    end_date: addDays(new Date(), 4).toISOString(),
    expected_return_date: addDays(new Date(), 4).toISOString(),
    status: 'active',
    departure_mileage: 21850,
    created_at: subDays(new Date(), 5).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'reservation-2',
    client_id: 'client-3',
    fleet_vehicle_id: 'fleet-1',
    start_date: subDays(new Date(), 20).toISOString(),
    end_date: subDays(new Date(), 15).toISOString(),
    expected_return_date: subDays(new Date(), 15).toISOString(),
    actual_return_date: subDays(new Date(), 15).toISOString(),
    status: 'termine',
    departure_mileage: 28200,
    return_mileage: 28500,
    created_at: subDays(new Date(), 25).toISOString(),
    company_id: COMPANY_ID,
  },
];

// Cessions fictives
export const demoCessions: DemoCession[] = [
  {
    id: 'cession-1',
    client_id: 'client-1',
    vehicle_id: 'vehicle-1',
    repair_order_id: 'order-1',
    insurance_company: 'AXA Assurances',
    expert_name: 'Jean-Claude Expertise',
    claim_number: 'SIN-2024-001234',
    total_amount: 1500.00,
    status: 'en_cours',
    created_at: subDays(new Date(), 8).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'cession-2',
    client_id: 'client-5',
    vehicle_id: 'vehicle-5',
    repair_order_id: 'order-1',
    insurance_company: 'Groupama',
    expert_name: 'SAS Expert Auto',
    claim_number: 'SIN-2024-005678',
    total_amount: 2300.00,
    status: 'payee',
    created_at: subDays(new Date(), 35).toISOString(),
    company_id: COMPANY_ID,
  },
];

// Export de toutes les données
export const demoData = {
  clients: demoClients,
  vehicles: demoVehicles,
  quotes: demoQuotes,
  repairOrders: demoRepairOrders,
  invoices: demoInvoices,
  credits: demoCredits,
  expenses: demoExpenses,
  fleetVehicles: demoFleetVehicles,
  fleetReservations: demoFleetReservations,
  cessions: demoCessions,
};
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

export interface DemoExpertiseReport {
  id: string;
  report_number: string;
  client_id: string;
  vehicle_id: string;
  report_date: string;
  claim_number: string;
  incident_date: string;
  incident_description: string;
  policy_number: string;
  insurance_company: string;
  expert_name: string;
  total_estimated: number;
  status: string;
  repairs_data: any[];
  parts_data: any[];
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
    client_id: '00000000-0000-4000-8000-000000000010',
    vehicle_id: '00000000-0000-4000-8000-000000000020',
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
    client_id: '00000000-0000-4000-8000-000000000011',
    vehicle_id: '00000000-0000-4000-8000-000000000021',
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
    client_id: '00000000-0000-4000-8000-000000000012',
    vehicle_id: '00000000-0000-4000-8000-000000000022',
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
  {
    id: 'quote-4',
    quote_number: 'DEV-2024-004',
    client_id: '00000000-0000-4000-8000-000000000013',
    vehicle_id: '00000000-0000-4000-8000-000000000023',
    status: 'refuse',
    total_ht: 3200.00,
    total_ttc: 3840.00,
    vat_amount: 640.00,
    created_at: subDays(new Date(), 45).toISOString(),
    valid_until: subDays(new Date(), 15).toISOString(),
    repairs_data: [
      { description: 'Réparation structurelle châssis', quantity: 12, unit_price: 120, total: 1440 },
      { description: 'Peinture intégrale véhicule', quantity: 1, unit_price: 880, total: 880 },
      { description: 'Démontage/Remontage éléments', quantity: 6, unit_price: 65, total: 390 }
    ],
    parts_data: [
      { reference: 'P005', description: 'Longerons avant', quantity: 2, unit_price: 245, total: 490 }
    ],
    company_id: COMPANY_ID,
  },
  {
    id: 'quote-5',
    quote_number: 'DEV-2024-005',
    client_id: '00000000-0000-4000-8000-000000000014',
    vehicle_id: '00000000-0000-4000-8000-000000000024',
    status: 'valide',
    total_ht: 750.00,
    total_ttc: 900.00,
    vat_amount: 150.00,
    created_at: subDays(new Date(), 3).toISOString(),
    valid_until: addDays(new Date(), 27).toISOString(),
    repairs_data: [
      { description: 'Réparation rayure profonde', quantity: 2, unit_price: 85, total: 170 },
      { description: 'Retouche peinture localisée', quantity: 3, unit_price: 55, total: 165 }
    ],
    parts_data: [
      { reference: 'P006', description: 'Kit retouche peinture BMW', quantity: 1, unit_price: 415, total: 415 }
    ],
    company_id: COMPANY_ID,
  },
  {
    id: 'quote-6',
    quote_number: 'DEV-2024-006',
    client_id: '00000000-0000-4000-8000-000000000010',
    vehicle_id: '00000000-0000-4000-8000-000000000020',
    status: 'expire',
    total_ht: 1800.00,
    total_ttc: 2160.00,
    vat_amount: 360.00,
    created_at: subDays(new Date(), 60).toISOString(),
    valid_until: subDays(new Date(), 30).toISOString(),
    repairs_data: [
      { description: 'Réparation choc latéral', quantity: 5, unit_price: 95, total: 475 },
      { description: 'Peinture 3 panneaux', quantity: 1, unit_price: 420, total: 420 }
    ],
    parts_data: [
      { reference: 'P007', description: 'Rétroviseur électrique gauche', quantity: 1, unit_price: 320, total: 320 },
      { reference: 'P008', description: 'Baguettes de protection', quantity: 2, unit_price: 85, total: 170 },
      { reference: 'P009', description: 'Enjoliveur roue', quantity: 1, unit_price: 415, total: 415 }
    ],
    company_id: COMPANY_ID,
  }
];

// Ordres de réparation fictifs
export const demoRepairOrders: DemoRepairOrder[] = [
  {
    id: 'order-1',
    order_number: 'ORD-2024-001',
    client_id: '00000000-0000-4000-8000-000000000010',
    vehicle_id: '00000000-0000-4000-8000-000000000020',
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
    client_id: '00000000-0000-4000-8000-000000000011',
    vehicle_id: '00000000-0000-4000-8000-000000000021',
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
    client_id: '00000000-0000-4000-8000-000000000012',
    vehicle_id: '00000000-0000-4000-8000-000000000022',
    quote_id: 'quote-3',
    status: 'en_attente',
    total_ht: 2150.00,
    total_ttc: 2580.00,
    start_date: addDays(new Date(), 3).toISOString(),
    assigned_employee: 'Patrick Dumont',
    created_at: subDays(new Date(), 2).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'order-4',
    order_number: 'ORD-2024-004',
    client_id: '00000000-0000-4000-8000-000000000013',
    vehicle_id: '00000000-0000-4000-8000-000000000023',
    status: 'pret',
    total_ht: 1890.00,
    total_ttc: 2268.00,
    start_date: subDays(new Date(), 12).toISOString(),
    end_date: subDays(new Date(), 1).toISOString(),
    assigned_employee: 'Sylvain Martinez',
    created_at: subDays(new Date(), 15).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'order-5',
    order_number: 'ORD-2024-005',
    client_id: '00000000-0000-4000-8000-000000000014',
    vehicle_id: '00000000-0000-4000-8000-000000000024',
    quote_id: 'quote-5',
    status: 'planifie',
    total_ht: 750.00,
    total_ttc: 900.00,
    start_date: addDays(new Date(), 7).toISOString(),
    assigned_employee: 'Antoine Moreau',
    created_at: subDays(new Date(), 1).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'order-6',
    order_number: 'ORD-2024-006',
    client_id: '00000000-0000-4000-8000-000000000010',
    vehicle_id: '00000000-0000-4000-8000-000000000020',
    status: 'annule',
    total_ht: 3200.00,
    total_ttc: 3840.00,
    start_date: subDays(new Date(), 30).toISOString(),
    assigned_employee: 'Michel Leblanc',
    created_at: subDays(new Date(), 35).toISOString(),
    company_id: COMPANY_ID,
  }
];

// Factures fictives
export const demoInvoices: DemoInvoice[] = [
  {
    id: 'invoice-1',
    invoice_number: 'FAC-2024-001',
    client_id: '00000000-0000-4000-8000-000000000011',
    vehicle_id: '00000000-0000-4000-8000-000000000021',
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
    client_id: '00000000-0000-4000-8000-000000000010',
    vehicle_id: '00000000-0000-4000-8000-000000000020',
    repair_order_id: 'order-1',
    status: 'en_attente',
    total_ht: 1250.00,
    total_ttc: 1500.00,
    vat_amount: 250.00,
    payment_due_date: addDays(new Date(), 15).toISOString(),
    created_at: subDays(new Date(), 3).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'invoice-3',
    invoice_number: 'FAC-2024-003',
    client_id: '00000000-0000-4000-8000-000000000013',
    vehicle_id: '00000000-0000-4000-8000-000000000023',
    repair_order_id: 'order-4',
    status: 'payee',
    total_ht: 1890.00,
    total_ttc: 2268.00,
    vat_amount: 378.00,
    payment_due_date: subDays(new Date(), 5).toISOString(),
    created_at: subDays(new Date(), 8).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'invoice-4',
    invoice_number: 'FAC-2024-004',
    client_id: '00000000-0000-4000-8000-000000000012',
    vehicle_id: '00000000-0000-4000-8000-000000000022',
    status: 'en_retard',
    total_ht: 2150.00,
    total_ttc: 2580.00,
    vat_amount: 430.00,
    payment_due_date: subDays(new Date(), 30).toISOString(),
    created_at: subDays(new Date(), 40).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'invoice-5',
    invoice_number: 'FAC-2024-005',
    client_id: '00000000-0000-4000-8000-000000000014',
    vehicle_id: '00000000-0000-4000-8000-000000000024',
    status: 'partiellement_payee',
    total_ht: 750.00,
    total_ttc: 900.00,
    vat_amount: 150.00,
    payment_due_date: subDays(new Date(), 10).toISOString(),
    created_at: subDays(new Date(), 12).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'invoice-6',
    invoice_number: 'FAC-2024-006',
    client_id: '00000000-0000-4000-8000-000000000010',
    vehicle_id: '00000000-0000-4000-8000-000000000020',
    status: 'en_attente',
    total_ht: 680.90,
    total_ttc: 817.08,
    vat_amount: 136.18,
    payment_due_date: addDays(new Date(), 20).toISOString(),
    created_at: subDays(new Date(), 1).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'invoice-7',
    invoice_number: 'FAC-2024-007',
    client_id: '00000000-0000-4000-8000-000000000011',
    vehicle_id: '00000000-0000-4000-8000-000000000021',
    status: 'annulee',
    total_ht: 3200.00,
    total_ttc: 3840.00,
    vat_amount: 640.00,
    payment_due_date: subDays(new Date(), 60).toISOString(),
    created_at: subDays(new Date(), 65).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'invoice-8',
    invoice_number: 'FAC-2024-008',
    client_id: '00000000-0000-4000-8000-000000000012',
    vehicle_id: '00000000-0000-4000-8000-000000000022',
    status: 'payee',
    total_ht: 1520.50,
    total_ttc: 1824.60,
    vat_amount: 304.10,
    payment_due_date: subDays(new Date(), 25).toISOString(),
    created_at: subDays(new Date(), 28).toISOString(),
    company_id: COMPANY_ID,
  }
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

// Rapports d'expertise fictifs
export const demoExpertiseReports: DemoExpertiseReport[] = [
  {
    id: 'expertise-1',
    report_number: 'EXP-2024-001',
    client_id: '00000000-0000-4000-8000-000000000010',
    vehicle_id: '00000000-0000-4000-8000-000000000020',
    report_date: subDays(new Date(), 20).toISOString(),
    claim_number: 'SIN-2024-001234',
    incident_date: subDays(new Date(), 25).toISOString(),
    incident_description: 'Collision par l\'arrière en stationnement. Dégâts mineurs sur le pare-chocs et le coffre.',
    policy_number: 'POL-789456123',
    insurance_company: 'AXA Assurances',
    expert_name: 'Jean-Claude Expertise SARL',
    total_estimated: 1520.50,
    status: 'valide',
    repairs_data: [
      { description: 'Réparation pare-chocs arrière', quantity: 1, unit_price: 280, total: 280 },
      { description: 'Redressage coffre', quantity: 2, unit_price: 120, total: 240 },
      { description: 'Peinture éléments réparés', quantity: 1, unit_price: 350, total: 350 }
    ],
    parts_data: [
      { reference: 'REN-001', description: 'Feu arrière gauche', quantity: 1, unit_price: 145, total: 145 },
      { reference: 'REN-002', description: 'Enjoliveur pare-chocs', quantity: 1, unit_price: 85, total: 85 },
      { reference: 'REN-003', description: 'Joint coffre', quantity: 1, unit_price: 420.50, total: 420.50 }
    ],
    created_at: subDays(new Date(), 22).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'expertise-2',
    report_number: 'EXP-2024-002',
    client_id: '00000000-0000-4000-8000-000000000011',
    vehicle_id: '00000000-0000-4000-8000-000000000021',
    report_date: subDays(new Date(), 35).toISOString(),
    claim_number: 'SIN-2024-005678',
    incident_date: subDays(new Date(), 42).toISOString(),
    incident_description: 'Choc frontal avec véhicule tiers. Dégâts importants sur l\'avant du véhicule.',
    policy_number: 'POL-456789012',
    insurance_company: 'Groupama',
    expert_name: 'SAS Expert Auto',
    total_estimated: 3850.75,
    status: 'accepte',
    repairs_data: [
      { description: 'Réparation structure avant', quantity: 8, unit_price: 150, total: 1200 },
      { description: 'Peinture complète avant', quantity: 1, unit_price: 680, total: 680 },
      { description: 'Géométrie et parallélisme', quantity: 1, unit_price: 120, total: 120 }
    ],
    parts_data: [
      { reference: 'PEU-001', description: 'Optique avant droit', quantity: 1, unit_price: 420, total: 420 },
      { reference: 'PEU-002', description: 'Calandre avant', quantity: 1, unit_price: 280, total: 280 },
      { reference: 'PEU-003', description: 'Pare-chocs avant', quantity: 1, unit_price: 650, total: 650 },
      { reference: 'PEU-004', description: 'Radiateur', quantity: 1, unit_price: 500.75, total: 500.75 }
    ],
    created_at: subDays(new Date(), 38).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'expertise-3',
    report_number: 'EXP-2024-003',
    client_id: '00000000-0000-4000-8000-000000000012',
    vehicle_id: '00000000-0000-4000-8000-000000000022',
    report_date: subDays(new Date(), 12).toISOString(),
    claim_number: 'SIN-2024-009876',
    incident_date: subDays(new Date(), 18).toISOString(),
    incident_description: 'Dégâts causés par grêle. Impacts multiples sur carrosserie et vitres.',
    policy_number: 'POL-987654321',
    insurance_company: 'MAIF',
    expert_name: 'Cabinet d\'Expertise Automobile',
    total_estimated: 2750.25,
    status: 'refuse',
    repairs_data: [
      { description: 'Débosselage sans peinture (PDR)', quantity: 25, unit_price: 35, total: 875 },
      { description: 'Retouches peinture localisées', quantity: 8, unit_price: 45, total: 360 },
      { description: 'Polissage carrosserie', quantity: 1, unit_price: 180, total: 180 }
    ],
    parts_data: [
      { reference: 'VW-001', description: 'Pare-brise avant', quantity: 1, unit_price: 385, total: 385 },
      { reference: 'VW-002', description: 'Lunette arrière', quantity: 1, unit_price: 290, total: 290 },
      { reference: 'VW-003', description: 'Vitre latérale droite', quantity: 2, unit_price: 330.125, total: 660.25 }
    ],
    created_at: subDays(new Date(), 15).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'expertise-4',
    report_number: 'EXP-2024-004',
    client_id: '00000000-0000-4000-8000-000000000013',
    vehicle_id: '00000000-0000-4000-8000-000000000023',
    report_date: subDays(new Date(), 5).toISOString(),
    claim_number: 'SIN-2024-012345',
    incident_date: subDays(new Date(), 8).toISOString(),
    incident_description: 'Rayures profondes sur le côté droit du véhicule causées par acte de vandalisme.',
    policy_number: 'POL-123456789',
    insurance_company: 'Allianz',
    expert_name: 'Expert Conseil Automobile',
    total_estimated: 1890.00,
    status: 'en_cours',
    repairs_data: [
      { description: 'Ponçage et apprêt portières', quantity: 2, unit_price: 95, total: 190 },
      { description: 'Peinture 2 portières droites', quantity: 1, unit_price: 480, total: 480 },
      { description: 'Vernis et finition', quantity: 1, unit_price: 120, total: 120 }
    ],
    parts_data: [
      { reference: 'CIT-001', description: 'Baguettes de protection', quantity: 2, unit_price: 85, total: 170 },
      { reference: 'CIT-002', description: 'Emblèmes latéraux', quantity: 2, unit_price: 45, total: 90 },
      { reference: 'CIT-003', description: 'Kit peinture Citroën Rouge Aden', quantity: 1, unit_price: 840, total: 840 }
    ],
    created_at: subDays(new Date(), 7).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'expertise-5',
    report_number: 'EXP-2024-005',
    client_id: '00000000-0000-4000-8000-000000000014',
    vehicle_id: '00000000-0000-4000-8000-000000000024',
    report_date: subDays(new Date(), 2).toISOString(),
    claim_number: 'SIN-2024-087654',
    incident_date: subDays(new Date(), 4).toISOString(),
    incident_description: 'Dégâts mineurs suite à un accrochage en parking. Impact sur rétroviseur et portière.',
    policy_number: 'POL-567890123',
    insurance_company: 'Generali',
    expert_name: 'Expertise Automobile Conseil',
    total_estimated: 680.90,
    status: 'valide',
    repairs_data: [
      { description: 'Réparation portière avant gauche', quantity: 1, unit_price: 180, total: 180 },
      { description: 'Retouche peinture localisée', quantity: 1, unit_price: 85, total: 85 }
    ],
    parts_data: [
      { reference: 'BMW-001', description: 'Rétroviseur électrique gauche', quantity: 1, unit_price: 315.90, total: 315.90 },
      { reference: 'BMW-002', description: 'Clignotant rétroviseur', quantity: 1, unit_price: 100, total: 100 }
    ],
    created_at: subDays(new Date(), 3).toISOString(),
    company_id: COMPANY_ID,
  }
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
  expertiseReports: demoExpertiseReports,
};
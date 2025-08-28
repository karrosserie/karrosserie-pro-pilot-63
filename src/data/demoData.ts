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
  license_plate: string;
  brand_id: string;
  model_id: string;
  year: number;
  status: string;
  mileage: number;
  fuel_level?: number;
  created_at: string;
  updated_at: string;
  company_id: string;
  user_id: string;
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

export interface DemoFleetReturn {
  id: string;
  fleet_reservation_id: string;
  fleet_vehicle_id: string;
  client_id: string;
  return_date: string;
  return_mileage: number;
  fuel_level_return: number;
  notes?: string;
  status: string;
  vehicle_images: string[];
  damages: Array<{
    type: string;
    description: string;
    severity: string;
    location: string;
    estimated_cost?: number;
  }>;
  attestation_accepted: boolean;
  client_signature?: string;
  client_name: string;
  created_at: string;
  company_id: string;
}

export interface DemoFleetViolation {
  id: string;
  fleet_reservation_id: string;
  fleet_vehicle_id: string;
  client_id: string;
  violation_type: string;
  violation_date: string;
  amount: number;
  fine_number: string;
  location: string;
  description: string;
  status: string;
  payment_due_date: string;
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

export interface DemoBankAccount {
  id: string;
  name: string;
  bank_name: string;
  account_number: string;
  iban: string;
  bic: string;
  account_type: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  company_id: string;
  user_id: string;
}

export interface DemoInsuranceCompany {
  id: string;
  name: string;
  contact_name: string;
  phone: string;
  email: string;
  address: string;
  postal_code: string;
  city: string;
  website: string;
  siret: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  user_id: string;
}

export interface DemoCession {
  id: string;
  reference: string;
  client_id: string;
  vehicle_id: string;
  repair_order_id: string;
  insurance_company_id: string;
  bank_account_id: string;
  expert_name: string;
  incident_number: string;
  incident_date: string;
  policy_number: string;
  report_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  user_id: string;
}

const COMPANY_ID = '00000000-0000-4000-8000-000000000002';
const USER_ID = '00000000-0000-4000-8000-000000000001';

// Marques de voiture fictives
export const demoCarBrands = [
  { id: 'brand-1', name: 'Renault' },
  { id: 'brand-2', name: 'Peugeot' },
  { id: 'brand-3', name: 'Citroën' },
  { id: 'brand-4', name: 'Volkswagen' },
  { id: 'brand-5', name: 'Ford' },
  { id: 'brand-6', name: 'Opel' },
  { id: 'brand-7', name: 'Dacia' },
];

// Modèles de voiture fictifs
export const demoCarModels = [
  { id: 'model-1', brand_id: 'brand-1', name: 'Twingo' },
  { id: 'model-2', brand_id: 'brand-1', name: 'Clio' },
  { id: 'model-3', brand_id: 'brand-2', name: '208' },
  { id: 'model-4', brand_id: 'brand-2', name: '2008' },
  { id: 'model-5', brand_id: 'brand-3', name: 'C3' },
  { id: 'model-6', brand_id: 'brand-3', name: 'C4' },
  { id: 'model-7', brand_id: 'brand-4', name: 'Polo' },
  { id: 'model-8', brand_id: 'brand-5', name: 'Fiesta' },
  { id: 'model-9', brand_id: 'brand-6', name: 'Corsa' },
  { id: 'model-10', brand_id: 'brand-7', name: 'Sandero' },
];

// Comptes bancaires fictifs
export const demoBankAccounts = [
  {
    id: 'bank-1',
    name: 'Compte Principal',
    bank_name: 'BNP Paribas',
    account_number: 'FR76 3000 3033 1100 0137 5183 B43',
    iban: 'FR76 3000 3033 1100 0137 5183 B43',
    bic: 'BNPAFRPPXXX',
    account_type: 'Compte courant professionnel',
    is_default: true,
    created_at: subMonths(new Date(), 24).toISOString(),
    updated_at: subDays(new Date(), 1).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'bank-2',
    name: 'Compte Épargne',
    bank_name: 'Crédit Agricole',
    account_number: 'FR14 2004 1010 0505 0001 3M02 606',
    iban: 'FR14 2004 1010 0505 0001 3M02 606',
    bic: 'AGRIFRPP841',
    account_type: 'Livret d\'épargne entreprise',
    is_default: false,
    created_at: subMonths(new Date(), 18).toISOString(),
    updated_at: subDays(new Date(), 5).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'bank-3',
    name: 'Compte Cessions',
    bank_name: 'Société Générale',
    account_number: 'FR76 3000 3014 5200 0137 8901 234',
    iban: 'FR76 3000 3014 5200 0137 8901 234',
    bic: 'SOGEFRPP',
    account_type: 'Compte dédié aux cessions',
    is_default: false,
    created_at: subMonths(new Date(), 12).toISOString(),
    updated_at: subDays(new Date(), 3).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'bank-4',
    name: 'Compte Investissement',
    bank_name: 'La Banque Postale',
    account_number: 'FR13 2001 2345 6789 0123 4567 890',
    iban: 'FR13 2001 2345 6789 0123 4567 890',
    bic: 'PSSTFRPPXXX',
    account_type: 'Compte terme à terme',
    is_default: false,
    created_at: subMonths(new Date(), 6).toISOString(),
    updated_at: subDays(new Date(), 10).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
];

// Compagnies d'assurance fictives
export const demoInsuranceCompanies = [
  {
    id: 'insurance-1',
    name: 'AXA Assurances',
    contact_name: 'Service Sinistres AXA',
    phone: '01.55.92.82.00',
    email: 'sinistres.auto@axa.fr',
    address: '25 Avenue Matignon',
    postal_code: '75008',
    city: 'Paris',
    website: 'www.axa.fr',
    siret: '55212548000170',
    created_at: subMonths(new Date(), 36).toISOString(),
    updated_at: subDays(new Date(), 15).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'insurance-2',
    name: 'Groupama',
    contact_name: 'Direction Sinistres Groupama',
    phone: '09.69.36.20.30',
    email: 'gestion.sinistres@groupama.fr',
    address: '8-10 Rue d\'Astorg',
    postal_code: '75008',
    city: 'Paris',
    website: 'www.groupama.fr',
    siret: '77556503245017',
    created_at: subMonths(new Date(), 30).toISOString(),
    updated_at: subDays(new Date(), 8).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'insurance-3',
    name: 'MAIF',
    contact_name: 'Centre de Gestion MAIF',
    phone: '05.49.73.73.73',
    email: 'sinistres.automobile@maif.fr',
    address: '200 Avenue Salvador Allende',
    postal_code: '79031',
    city: 'Niort',
    website: 'www.maif.fr',
    siret: '77567227000185',
    created_at: subMonths(new Date(), 42).toISOString(),
    updated_at: subDays(new Date(), 12).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'insurance-4',
    name: 'Allianz',
    contact_name: 'Allianz Sinistres France',
    phone: '09.69.39.99.99',
    email: 'sinistres@allianz.fr',
    address: '87 Rue de Richelieu',
    postal_code: '75002',
    city: 'Paris',
    website: 'www.allianz.fr',
    siret: '54208741200156',
    created_at: subMonths(new Date(), 28).toISOString(),
    updated_at: subDays(new Date(), 6).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'insurance-5',
    name: 'Generali',
    contact_name: 'Service Expertise Generali',
    phone: '01.58.38.33.00',
    email: 'sinistres.iard@generali.fr',
    address: '7 Boulevard Haussmann',
    postal_code: '75009',
    city: 'Paris',
    website: 'www.generali.fr',
    siret: '39206120000125',
    created_at: subMonths(new Date(), 22).toISOString(),
    updated_at: subDays(new Date(), 4).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'insurance-6',
    name: 'Matmut',
    contact_name: 'Matmut Gestion Sinistres',
    phone: '02.35.03.68.68',
    email: 'sinistres.auto@matmut.fr',
    address: '66 Rue de Sotteville',
    postal_code: '76100',
    city: 'Rouen',
    website: 'www.matmut.fr',
    siret: '77566951000178',
    created_at: subMonths(new Date(), 26).toISOString(),
    updated_at: subDays(new Date(), 9).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'insurance-7',
    name: 'MACSF',
    contact_name: 'MACSF Sinistres',
    phone: '02.98.62.27.27',
    email: 'sinistres@macsf.fr',
    address: 'Cours du Triangle de l\'Arche',
    postal_code: '92919',
    city: 'Paris La Défense',
    website: 'www.macsf.fr',
    siret: '77592503200189',
    created_at: subMonths(new Date(), 20).toISOString(),
    updated_at: subDays(new Date(), 7).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'insurance-8',
    name: 'GMF',
    contact_name: 'GMF Expertise Sinistres',
    phone: '09.77.40.50.50',
    email: 'sinistres.particuliers@gmf.fr',
    address: '148 Rue Anatole France',
    postal_code: '92300',
    city: 'Levallois-Perret',
    website: 'www.gmf.fr',
    siret: '77567499000234',
    created_at: subMonths(new Date(), 16).toISOString(),
    updated_at: subDays(new Date(), 11).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
];

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
    license_plate: 'FL-001-KP',
    brand_id: 'brand-1',
    model_id: 'model-1',
    year: 2020,
    status: 'disponible',
    mileage: 28500,
    fuel_level: 85,
    created_at: subMonths(new Date(), 12).toISOString(),
    updated_at: subDays(new Date(), 2).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'fleet-2',
    license_plate: 'FL-002-KP',
    brand_id: 'brand-2',
    model_id: 'model-3',
    year: 2021,
    status: 'prete',
    mileage: 22150,
    fuel_level: 45,
    created_at: subMonths(new Date(), 10).toISOString(),
    updated_at: subDays(new Date(), 1).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'fleet-3',
    license_plate: 'FL-003-KP',
    brand_id: 'brand-3',
    model_id: 'model-5',
    year: 2019,
    status: 'maintenance',
    mileage: 45200,
    fuel_level: 20,
    created_at: subMonths(new Date(), 18).toISOString(),
    updated_at: subDays(new Date(), 3).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'fleet-4',
    license_plate: 'FL-004-KP',
    brand_id: 'brand-1',
    model_id: 'model-2',
    year: 2022,
    status: 'disponible',
    mileage: 15800,
    fuel_level: 90,
    created_at: subMonths(new Date(), 6).toISOString(),
    updated_at: subDays(new Date(), 1).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'fleet-5',
    license_plate: 'FL-005-KP',
    brand_id: 'brand-2',
    model_id: 'model-4',
    year: 2021,
    status: 'prete',
    mileage: 32450,
    fuel_level: 65,
    created_at: subMonths(new Date(), 8).toISOString(),
    updated_at: subDays(new Date(), 1).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'fleet-6',
    license_plate: 'FL-006-KP',
    brand_id: 'brand-4',
    model_id: 'model-7',
    year: 2020,
    status: 'disponible',
    mileage: 38750,
    fuel_level: 70,
    created_at: subMonths(new Date(), 14).toISOString(),
    updated_at: subDays(new Date(), 5).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'fleet-7',
    license_plate: 'FL-007-KP',
    brand_id: 'brand-3',
    model_id: 'model-6',
    year: 2023,
    status: 'indisponible',
    mileage: 8200,
    fuel_level: 95,
    created_at: subMonths(new Date(), 3).toISOString(),
    updated_at: subDays(new Date(), 1).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'fleet-8',
    license_plate: 'FL-008-KP',
    brand_id: 'brand-5',
    model_id: 'model-8',
    year: 2019,
    status: 'maintenance',
    mileage: 52300,
    fuel_level: 25,
    created_at: subMonths(new Date(), 20).toISOString(),
    updated_at: subDays(new Date(), 2).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'fleet-9',
    license_plate: 'FL-009-KP',
    brand_id: 'brand-6',
    model_id: 'model-9',
    year: 2021,
    status: 'prete',
    mileage: 26890,
    fuel_level: 40,
    created_at: subMonths(new Date(), 9).toISOString(),
    updated_at: subDays(new Date(), 1).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'fleet-10',
    license_plate: 'FL-010-KP',
    brand_id: 'brand-7',
    model_id: 'model-10',
    year: 2022,
    status: 'disponible',
    mileage: 18950,
    fuel_level: 80,
    created_at: subMonths(new Date(), 5).toISOString(),
    updated_at: subDays(new Date(), 3).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
];

// Réservations de flotte fictives
export const demoFleetReservations: DemoFleetReservation[] = [
  {
    id: 'reservation-1',
    client_id: '00000000-0000-4000-8000-000000000010',
    fleet_vehicle_id: 'fleet-2',
    start_date: subDays(new Date(), 3).toISOString(),
    end_date: addDays(new Date(), 4).toISOString(),
    expected_return_date: addDays(new Date(), 4).toISOString(),
    status: 'active',
    departure_mileage: 22000,
    created_at: subDays(new Date(), 5).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'reservation-2',
    client_id: '00000000-0000-4000-8000-000000000012',
    fleet_vehicle_id: 'fleet-1',
    start_date: subDays(new Date(), 20).toISOString(),
    end_date: subDays(new Date(), 15).toISOString(),
    expected_return_date: subDays(new Date(), 15).toISOString(),
    actual_return_date: subDays(new Date(), 15).toISOString(),
    status: 'completed',
    departure_mileage: 28200,
    return_mileage: 28500,
    created_at: subDays(new Date(), 25).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'reservation-3',
    client_id: '00000000-0000-4000-8000-000000000011',
    fleet_vehicle_id: 'fleet-5',
    start_date: subDays(new Date(), 8).toISOString(),
    end_date: addDays(new Date(), 2).toISOString(),
    expected_return_date: addDays(new Date(), 2).toISOString(),
    status: 'active',
    departure_mileage: 32200,
    created_at: subDays(new Date(), 10).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'reservation-4',
    client_id: '00000000-0000-4000-8000-000000000013',
    fleet_vehicle_id: 'fleet-9',
    start_date: subDays(new Date(), 12).toISOString(),
    end_date: subDays(new Date(), 5).toISOString(),
    expected_return_date: subDays(new Date(), 5).toISOString(),
    actual_return_date: subDays(new Date(), 4).toISOString(),
    status: 'completed',
    departure_mileage: 26500,
    return_mileage: 26890,
    created_at: subDays(new Date(), 15).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'reservation-5',
    client_id: '00000000-0000-4000-8000-000000000014',
    fleet_vehicle_id: 'fleet-4',
    start_date: addDays(new Date(), 2).toISOString(),
    end_date: addDays(new Date(), 10).toISOString(),
    expected_return_date: addDays(new Date(), 10).toISOString(),
    status: 'cancelled',
    departure_mileage: 15800,
    created_at: subDays(new Date(), 1).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'reservation-6',
    client_id: '00000000-0000-4000-8000-000000000010',
    fleet_vehicle_id: 'fleet-6',
    start_date: subDays(new Date(), 35).toISOString(),
    end_date: subDays(new Date(), 28).toISOString(),
    expected_return_date: subDays(new Date(), 28).toISOString(),
    actual_return_date: subDays(new Date(), 27).toISOString(),
    status: 'completed',
    departure_mileage: 38200,
    return_mileage: 38750,
    created_at: subDays(new Date(), 40).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'reservation-7',
    client_id: '00000000-0000-4000-8000-000000000011',
    fleet_vehicle_id: 'fleet-8',
    start_date: subDays(new Date(), 60).toISOString(),
    end_date: subDays(new Date(), 45).toISOString(),
    expected_return_date: subDays(new Date(), 45).toISOString(),
    actual_return_date: subDays(new Date(), 44).toISOString(),
    status: 'completed',
    departure_mileage: 51800,
    return_mileage: 52300,
    created_at: subDays(new Date(), 65).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'reservation-8',
    client_id: '00000000-0000-4000-8000-000000000012',
    fleet_vehicle_id: 'fleet-10',
    start_date: addDays(new Date(), 5).toISOString(),
    end_date: addDays(new Date(), 12).toISOString(),
    expected_return_date: addDays(new Date(), 12).toISOString(),
    status: 'active',
    departure_mileage: 18800,
    created_at: subDays(new Date(), 2).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'reservation-9',
    client_id: '00000000-0000-4000-8000-000000000013',
    fleet_vehicle_id: 'fleet-3',
    start_date: subDays(new Date(), 42).toISOString(),
    end_date: subDays(new Date(), 35).toISOString(),
    expected_return_date: subDays(new Date(), 35).toISOString(),
    actual_return_date: subDays(new Date(), 33).toISOString(),
    status: 'completed',
    departure_mileage: 44800,
    return_mileage: 45200,
    created_at: subDays(new Date(), 45).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'reservation-10',
    client_id: '00000000-0000-4000-8000-000000000014',
    fleet_vehicle_id: 'fleet-7',
    start_date: subDays(new Date(), 7).toISOString(),
    end_date: addDays(new Date(), 8).toISOString(),
    expected_return_date: addDays(new Date(), 8).toISOString(),
    status: 'active',
    departure_mileage: 62800,
    created_at: subDays(new Date(), 9).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'reservation-11',
    client_id: '00000000-0000-4000-8000-000000000010',
    fleet_vehicle_id: 'fleet-1',
    start_date: addDays(new Date(), 7).toISOString(),
    end_date: addDays(new Date(), 15).toISOString(),
    expected_return_date: addDays(new Date(), 15).toISOString(),
    status: 'pending',
    departure_mileage: 28500,
    created_at: addDays(new Date(), 1).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'reservation-12',
    client_id: '00000000-0000-4000-8000-000000000011',
    fleet_vehicle_id: 'fleet-4',
    start_date: subDays(new Date(), 28).toISOString(),
    end_date: subDays(new Date(), 21).toISOString(),
    expected_return_date: subDays(new Date(), 21).toISOString(),
    actual_return_date: subDays(new Date(), 19).toISOString(),
    status: 'completed',
    departure_mileage: 15600,
    return_mileage: 15800,
    created_at: subDays(new Date(), 32).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'reservation-13',
    client_id: '00000000-0000-4000-8000-000000000012',
    fleet_vehicle_id: 'fleet-9',
    start_date: addDays(new Date(), 3).toISOString(),
    end_date: addDays(new Date(), 14).toISOString(),
    expected_return_date: addDays(new Date(), 14).toISOString(),
    status: 'confirmed',
    departure_mileage: 26890,
    created_at: subDays(new Date(), 1).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'reservation-14',
    client_id: '00000000-0000-4000-8000-000000000013',
    fleet_vehicle_id: 'fleet-6',
    start_date: subDays(new Date(), 14).toISOString(),
    end_date: subDays(new Date(), 8).toISOString(),
    expected_return_date: subDays(new Date(), 8).toISOString(),
    actual_return_date: subDays(new Date(), 6).toISOString(),
    status: 'completed',
    departure_mileage: 38750,
    return_mileage: 39200,
    created_at: subDays(new Date(), 18).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'reservation-15',
    client_id: '00000000-0000-4000-8000-000000000014',
    fleet_vehicle_id: 'fleet-8',
    start_date: subDays(new Date(), 1).toISOString(),
    end_date: addDays(new Date(), 6).toISOString(),
    expected_return_date: addDays(new Date(), 6).toISOString(),
    status: 'active',
    departure_mileage: 52300,
    created_at: subDays(new Date(), 3).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'reservation-16',
    client_id: '00000000-0000-4000-8000-000000000010',
    fleet_vehicle_id: 'fleet-5',
    start_date: addDays(new Date(), 10).toISOString(),
    end_date: addDays(new Date(), 18).toISOString(),
    expected_return_date: addDays(new Date(), 18).toISOString(),
    status: 'pending',
    departure_mileage: 32200,
    created_at: addDays(new Date(), 2).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'reservation-17',
    client_id: '00000000-0000-4000-8000-000000000011',
    fleet_vehicle_id: 'fleet-2',
    start_date: subDays(new Date(), 50).toISOString(),
    end_date: subDays(new Date(), 43).toISOString(),
    expected_return_date: subDays(new Date(), 43).toISOString(),
    actual_return_date: subDays(new Date(), 41).toISOString(),
    status: 'completed',
    departure_mileage: 21800,
    return_mileage: 22150,
    created_at: subDays(new Date(), 55).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'reservation-18',
    client_id: '00000000-0000-4000-8000-000000000012',
    fleet_vehicle_id: 'fleet-10',
    start_date: subDays(new Date(), 25).toISOString(),
    end_date: subDays(new Date(), 18).toISOString(),
    expected_return_date: subDays(new Date(), 18).toISOString(),
    status: 'cancelled',
    departure_mileage: 18500,
    created_at: subDays(new Date(), 30).toISOString(),
    company_id: COMPANY_ID,
  }
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
    reference: 'CESS-2024-001',
    client_id: '00000000-0000-4000-8000-000000000010',
    vehicle_id: '00000000-0000-4000-8000-000000000020',
    repair_order_id: 'order-1',
    insurance_company_id: 'insurance-1',
    bank_account_id: 'bank-3',
    expert_name: 'Jean-Claude Expertise SARL',
    incident_number: 'SIN-2024-001234',
    incident_date: subDays(new Date(), 25).toISOString(),
    policy_number: 'POL-789456123',
    report_number: 'EXP-2024-001',
    total_amount: 1520.50,
    status: 'en_attente_signature',
    created_at: subDays(new Date(), 8).toISOString(),
    updated_at: subDays(new Date(), 2).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'cession-2',
    reference: 'CESS-2024-002',
    client_id: '00000000-0000-4000-8000-000000000011',
    vehicle_id: '00000000-0000-4000-8000-000000000021',
    repair_order_id: 'order-2',
    insurance_company_id: 'insurance-2',
    bank_account_id: 'bank-1',
    expert_name: 'SAS Expert Auto',
    incident_number: 'SIN-2024-005678',
    incident_date: subDays(new Date(), 42).toISOString(),
    policy_number: 'POL-456789012',
    report_number: 'EXP-2024-002',
    total_amount: 3850.75,
    status: 'signee',
    created_at: subDays(new Date(), 35).toISOString(),
    updated_at: subDays(new Date(), 20).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'cession-3',
    reference: 'CESS-2024-003',
    client_id: '00000000-0000-4000-8000-000000000012',
    vehicle_id: '00000000-0000-4000-8000-000000000022',
    repair_order_id: 'order-3',
    insurance_company_id: 'insurance-3',
    bank_account_id: 'bank-3',
    expert_name: 'Cabinet d\'Expertise Automobile',
    incident_number: 'SIN-2024-009876',
    incident_date: subDays(new Date(), 18).toISOString(),
    policy_number: 'POL-987654321',
    report_number: 'EXP-2024-003',
    total_amount: 2750.25,
    status: 'lettre_recommandee_envoyee',
    created_at: subDays(new Date(), 12).toISOString(),
    updated_at: subDays(new Date(), 5).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'cession-4',
    reference: 'CESS-2024-004',
    client_id: '00000000-0000-4000-8000-000000000013',
    vehicle_id: '00000000-0000-4000-8000-000000000023',
    repair_order_id: 'order-4',
    insurance_company_id: 'insurance-4',
    bank_account_id: 'bank-1',
    expert_name: 'Expert Conseil Automobile',
    incident_number: 'SIN-2024-012345',
    incident_date: subDays(new Date(), 8).toISOString(),
    policy_number: 'POL-123456789',
    report_number: 'EXP-2024-004',
    total_amount: 1890.00,
    status: 'lettre_recommandee_recue',
    created_at: subDays(new Date(), 15).toISOString(),
    updated_at: subDays(new Date(), 8).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'cession-5',
    reference: 'CESS-2024-005',
    client_id: '00000000-0000-4000-8000-000000000014',
    vehicle_id: '00000000-0000-4000-8000-000000000024',
    repair_order_id: 'order-5',
    insurance_company_id: 'insurance-5',
    bank_account_id: 'bank-1',
    expert_name: 'Expertise Automobile Conseil',
    incident_number: 'SIN-2024-087654',
    incident_date: subDays(new Date(), 4).toISOString(),
    policy_number: 'POL-567890123',
    report_number: 'EXP-2024-005',
    total_amount: 680.90,
    status: 'payee',
    created_at: subDays(new Date(), 3).toISOString(),
    updated_at: subDays(new Date(), 1).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'cession-6',
    reference: 'CESS-2024-006',
    client_id: '00000000-0000-4000-8000-000000000010',
    vehicle_id: '00000000-0000-4000-8000-000000000020',
    repair_order_id: 'order-6',
    insurance_company_id: 'insurance-6',
    bank_account_id: 'bank-2',
    expert_name: 'Auto Expertise Plus',
    incident_number: 'SIN-2024-045123',
    incident_date: subDays(new Date(), 50).toISOString(),
    policy_number: 'POL-345678901',
    report_number: 'EXP-2024-006',
    total_amount: 2890.00,
    status: 'signature_refusee',
    created_at: subDays(new Date(), 45).toISOString(),
    updated_at: subDays(new Date(), 30).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'cession-7',
    reference: 'CESS-2024-007',
    client_id: '00000000-0000-4000-8000-000000000011',
    vehicle_id: '00000000-0000-4000-8000-000000000021',
    repair_order_id: 'order-1',
    insurance_company_id: 'insurance-7',
    bank_account_id: 'bank-3',
    expert_name: 'Expertise Rapide SARL',
    incident_number: 'SIN-2024-098765',
    incident_date: subDays(new Date(), 35).toISOString(),
    policy_number: 'POL-234567890',
    report_number: 'EXP-2024-007',
    total_amount: 1245.75,
    status: 'lettre_recommandee_presentee',
    created_at: subDays(new Date(), 28).toISOString(),
    updated_at: subDays(new Date(), 15).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
  {
    id: 'cession-8',
    reference: 'CESS-2024-008',
    client_id: '00000000-0000-4000-8000-000000000012',
    vehicle_id: '00000000-0000-4000-8000-000000000022',
    repair_order_id: 'order-2',
    insurance_company_id: 'insurance-8',
    bank_account_id: 'bank-1',
    expert_name: 'Cabinet Expertise Pro',
    incident_number: 'SIN-2024-135792',
    incident_date: subDays(new Date(), 70).toISOString(),
    policy_number: 'POL-678901234',
    report_number: 'EXP-2024-008',
    total_amount: 3250.00,
    status: 'lettre_recommandee_non_recuperee',
    created_at: subDays(new Date(), 62).toISOString(),
    updated_at: subDays(new Date(), 45).toISOString(),
    company_id: COMPANY_ID,
    user_id: USER_ID,
  },
];

// Retours de véhicules de flotte fictifs
export const demoFleetReturns: DemoFleetReturn[] = [
  {
    id: 'return-1',
    fleet_reservation_id: 'reservation-2',
    fleet_vehicle_id: 'fleet-1',
    client_id: '00000000-0000-4000-8000-000000000012',
    return_date: subDays(new Date(), 15).toISOString(),
    return_mileage: 28500,
    fuel_level_return: 85,
    notes: 'Véhicule rendu en parfait état, aucun dommage constaté.',
    status: 'completed',
    vehicle_images: [
      'https://example.com/images/fleet-return-1-front.jpg',
      'https://example.com/images/fleet-return-1-back.jpg',
      'https://example.com/images/fleet-return-1-interior.jpg'
    ],
    damages: [],
    attestation_accepted: true,
    client_signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    client_name: 'Sophie Bernard',
    created_at: subDays(new Date(), 15).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'return-2',
    fleet_reservation_id: 'reservation-4',
    fleet_vehicle_id: 'fleet-9',
    client_id: '00000000-0000-4000-8000-000000000013',
    return_date: subDays(new Date(), 4).toISOString(),
    return_mileage: 26890,
    fuel_level_return: 40,
    notes: 'Rayure mineure sur la portière droite, réparation nécessaire.',
    status: 'damaged',
    vehicle_images: [
      'https://example.com/images/fleet-return-2-damage1.jpg',
      'https://example.com/images/fleet-return-2-damage2.jpg'
    ],
    damages: [
      {
        type: 'rayure',
        description: 'Rayure sur portière avant droite',
        severity: 'mineur',
        location: 'portière avant droite',
        estimated_cost: 180
      }
    ],
    attestation_accepted: true,
    client_signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    client_name: 'Antoine Petit',
    created_at: subDays(new Date(), 4).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'return-3',
    fleet_reservation_id: 'reservation-6',
    fleet_vehicle_id: 'fleet-6',
    client_id: '00000000-0000-4000-8000-000000000010',
    return_date: subDays(new Date(), 27).toISOString(),
    return_mileage: 38750,
    fuel_level_return: 70,
    notes: 'Véhicule rendu avec quelques traces d\'usure normale.',
    status: 'completed',
    vehicle_images: [
      'https://example.com/images/fleet-return-3-front.jpg',
      'https://example.com/images/fleet-return-3-interior.jpg'
    ],
    damages: [],
    attestation_accepted: true,
    client_signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    client_name: 'Marie Martin',
    created_at: subDays(new Date(), 27).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'return-4',
    fleet_reservation_id: 'reservation-7',
    fleet_vehicle_id: 'fleet-8',
    client_id: '00000000-0000-4000-8000-000000000011',
    return_date: subDays(new Date(), 44).toISOString(),
    return_mileage: 52300,
    fuel_level_return: 25,
    notes: 'Éclat sur pare-brise avant, doit être réparé avant remise en service.',
    status: 'pending_review',
    vehicle_images: [
      'https://example.com/images/fleet-return-4-windshield.jpg',
      'https://example.com/images/fleet-return-4-exterior.jpg'
    ],
    damages: [
      {
        type: 'éclat',
        description: 'Éclat sur pare-brise avant côté conducteur',
        severity: 'moyen',
        location: 'pare-brise avant',
        estimated_cost: 320
      }
    ],
    attestation_accepted: true,
    client_signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    client_name: 'Pierre Durand',
    created_at: subDays(new Date(), 44).toISOString(),
    company_id: COMPANY_ID,
  },
];

// Violations de véhicules de flotte fictives
export const demoFleetViolations: DemoFleetViolation[] = [
  {
    id: 'violation-1',
    fleet_reservation_id: 'reservation-2',
    fleet_vehicle_id: 'fleet-1',
    client_id: '00000000-0000-4000-8000-000000000012',
    violation_type: 'excès de vitesse',
    violation_date: subDays(new Date(), 18).toISOString(),
    amount: 68.00,
    fine_number: 'PV-2024-789123',
    location: 'Avenue des Champs-Élysées, Paris 8e',
    description: 'Excès de vitesse de 10 km/h en agglomération (60 km/h au lieu de 50 km/h)',
    status: 'en_attente_paiement',
    payment_due_date: addDays(new Date(), 30).toISOString(),
    created_at: subDays(new Date(), 10).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'violation-2',
    fleet_reservation_id: 'reservation-4',
    fleet_vehicle_id: 'fleet-9',
    client_id: '00000000-0000-4000-8000-000000000013',
    violation_type: 'stationnement interdit',
    violation_date: subDays(new Date(), 8).toISOString(),
    amount: 35.00,
    fine_number: 'PV-2024-456789',
    location: 'Rue de Rivoli, Paris 1er',
    description: 'Stationnement gênant devant un passage piéton',
    status: 'payee',
    payment_due_date: subDays(new Date(), 15).toISOString(),
    created_at: subDays(new Date(), 5).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'violation-3',
    fleet_reservation_id: 'reservation-6',
    fleet_vehicle_id: 'fleet-6',
    client_id: '00000000-0000-4000-8000-000000000010',
    violation_type: 'feu rouge',
    violation_date: subDays(new Date(), 32).toISOString(),
    amount: 135.00,
    fine_number: 'PV-2024-321654',
    location: 'Boulevard Saint-Germain, Paris 6e',
    description: 'Non-respect du feu rouge à un carrefour',
    status: 'contestee',
    payment_due_date: addDays(new Date(), 45).toISOString(),
    created_at: subDays(new Date(), 25).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'violation-4',
    fleet_reservation_id: 'reservation-7',
    fleet_vehicle_id: 'fleet-8',
    client_id: '00000000-0000-4000-8000-000000000011',
    violation_type: 'zone de stationnement payant',
    violation_date: subDays(new Date(), 48).toISOString(),
    amount: 17.00,
    fine_number: 'PV-2024-987654',
    location: 'Place Vendôme, Paris 1er',
    description: 'Défaut de paiement du stationnement en zone payante',
    status: 'payee',
    payment_due_date: subDays(new Date(), 25).toISOString(),
    created_at: subDays(new Date(), 40).toISOString(),
    company_id: COMPANY_ID,
  },
  {
    id: 'violation-5',
    fleet_reservation_id: 'reservation-1',
    fleet_vehicle_id: 'fleet-2',
    client_id: '00000000-0000-4000-8000-000000000010',
    violation_type: 'excès de vitesse',
    violation_date: subDays(new Date(), 1).toISOString(),
    amount: 90.00,
    fine_number: 'PV-2024-159753',
    location: 'A6 - Sens Paris-Lyon, km 25',
    description: 'Excès de vitesse de 20 km/h sur autoroute (150 km/h au lieu de 130 km/h)',
    status: 'en_attente_paiement',
    payment_due_date: addDays(new Date(), 42).toISOString(),
    created_at: new Date().toISOString(),
    company_id: COMPANY_ID,
  },
];

// Export de toutes les données avec les nouvelles données de flotte et cessions
export const demoData = {
  clients: demoClients,
  vehicles: demoVehicles,
  quotes: demoQuotes,
  repairOrders: demoRepairOrders,
  invoices: demoInvoices,
  credits: demoCredits,
  expenses: demoExpenses,
  carBrands: demoCarBrands,
  carModels: demoCarModels,
  bankAccounts: demoBankAccounts,
  insuranceCompanies: demoInsuranceCompanies,
  fleetVehicles: demoFleetVehicles,
  fleetReservations: demoFleetReservations,
  fleetReturns: demoFleetReturns,
  fleetViolations: demoFleetViolations,
  cessions: demoCessions,
  expertiseReports: demoExpertiseReports,
};
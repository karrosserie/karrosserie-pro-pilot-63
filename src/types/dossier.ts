import type { Database } from '@/integrations/supabase/types';

// Base type from database
export type DossierRow = Database['public']['Tables']['dossiers']['Row'];
export type DossierInsert = Database['public']['Tables']['dossiers']['Insert'];
export type DossierUpdate = Database['public']['Tables']['dossiers']['Update'];

// Overall status enum values
export type DossierOverallStatus = 
  | 'ouvert' 
  | 'en_cours' 
  | 'expertise' 
  | 'devis' 
  | 'reparation' 
  | 'facturation' 
  | 'cloture' 
  | 'archive';

// Status configuration for UI display
export const DOSSIER_STATUS_CONFIG: Record<DossierOverallStatus, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  ouvert: { 
    label: 'Ouvert', 
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-100 dark:bg-blue-900/50'
  },
  en_cours: { 
    label: 'En cours', 
    color: 'text-amber-700 dark:text-amber-300',
    bgColor: 'bg-amber-100 dark:bg-amber-900/50'
  },
  expertise: { 
    label: 'Expertise', 
    color: 'text-purple-700 dark:text-purple-300',
    bgColor: 'bg-purple-100 dark:bg-purple-900/50'
  },
  devis: { 
    label: 'Devis', 
    color: 'text-indigo-700 dark:text-indigo-300',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/50'
  },
  reparation: { 
    label: 'Réparation', 
    color: 'text-green-700 dark:text-green-300',
    bgColor: 'bg-green-100 dark:bg-green-900/50'
  },
  facturation: { 
    label: 'Facturation', 
    color: 'text-cyan-700 dark:text-cyan-300',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/50'
  },
  cloture: { 
    label: 'Clôturé', 
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-200 dark:bg-gray-800'
  },
  archive: { 
    label: 'Archivé', 
    color: 'text-gray-500 dark:text-gray-500',
    bgColor: 'bg-gray-100 dark:bg-gray-900'
  },
};

// Extended Dossier type with joined relations
export interface Dossier extends DossierRow {
  overall_status: DossierOverallStatus | null;
  // Joined relations (optional, populated via select)
  clients?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    company_name: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    postal_code: string | null;
  } | null;
  vehicles?: {
    id: string;
    license_plate: string | null;
    vin: string | null;
    mileage: number | null;
    car_brands?: { name: string } | null;
    car_models?: { name: string } | null;
  } | null;
  expertise_reports?: {
    id: string;
    report_number: string | null;
    status: string | null;
    report_date: string | null;
    amount: number | null;
  } | null;
  quotes?: {
    id: string;
    reference: string;
    status: string | null;
    amount: number | null;
    created_at: string;
  } | null;
  repair_orders?: {
    id: string;
    reference: string;
    status: string | null;
    arrival_date: string | null;
    end_date: string | null;
  } | null;
  cessions?: {
    id: string;
    reference: string;
    status: string | null;
    cession_type: string | null;
  } | null;
  fleet_reservations?: {
    id: string;
    status: string | null;
    start_date: string | null;
    end_date: string | null;
  } | null;
  insurance_companies?: {
    id: string;
    name: string;
  } | null;
}

// Dossier with all related entities for detail view
export interface DossierWithDetails extends Dossier {
  // Invoices are fetched via repair_order_id (indirect relation)
  invoices?: Array<{
    id: string;
    reference: string;
    status: string | null;
    amount: number | null;
    issue_date: string | null;
    due_date: string | null;
  }>;
  // Messageries are fetched via dossier_id (direct 1:N relation)
  messageries?: Array<{
    id: string;
    title: string;
    channel: string;
    status: string | null;
    priority: number | null;
    created_at: string;
    is_inbound: boolean | null;
  }>;
}

// Filters for listing dossiers
export interface DossierFilters {
  company_id?: string;
  client_id?: string;
  vehicle_id?: string;
  overall_status?: DossierOverallStatus | DossierOverallStatus[];
  archived?: boolean;
  search?: string;
}

// Create dossier params
export interface CreateDossierParams {
  company_id: string;
  client_id: string;
  vehicle_id?: string;
  claim_number?: string;
  policy_number?: string;
  incident_date?: string;
  incident_number?: string;
  expert_name?: string;
  report_number?: string;
  insurance_company_id?: string;
  notes?: string;
}

// Update dossier params
export interface UpdateDossierParams {
  claim_number?: string | null;
  policy_number?: string | null;
  incident_date?: string | null;
  incident_number?: string | null;
  expert_name?: string | null;
  report_number?: string | null;
  insurance_company_id?: string | null;
  notes?: string | null;
  status?: string | null;
  archived?: boolean | null;
}

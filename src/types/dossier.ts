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

// Status configuration for UI display using CSS variables
export const DOSSIER_STATUS_CONFIG: Record<DossierOverallStatus, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  ouvert: { 
    label: 'Ouvert', 
    color: 'text-[hsl(var(--status-ouvert-text))]',
    bgColor: 'bg-[hsl(var(--status-ouvert-bg))]'
  },
  en_cours: { 
    label: 'En cours', 
    color: 'text-[hsl(var(--status-en-cours-text))]',
    bgColor: 'bg-[hsl(var(--status-en-cours-bg))]'
  },
  expertise: { 
    label: 'Expertise', 
    color: 'text-[hsl(var(--status-expertise-text))]',
    bgColor: 'bg-[hsl(var(--status-expertise-bg))]'
  },
  devis: { 
    label: 'Devis', 
    color: 'text-[hsl(var(--status-devis-text))]',
    bgColor: 'bg-[hsl(var(--status-devis-bg))]'
  },
  reparation: { 
    label: 'Réparation', 
    color: 'text-[hsl(var(--status-reparation-text))]',
    bgColor: 'bg-[hsl(var(--status-reparation-bg))]'
  },
  facturation: { 
    label: 'Facturation', 
    color: 'text-[hsl(var(--status-facturation-text))]',
    bgColor: 'bg-[hsl(var(--status-facturation-bg))]'
  },
  cloture: { 
    label: 'Clôturé', 
    color: 'text-[hsl(var(--status-cloture-text))]',
    bgColor: 'bg-[hsl(var(--status-cloture-bg))]'
  },
  archive: { 
    label: 'Archivé', 
    color: 'text-[hsl(var(--status-archive-text))]',
    bgColor: 'bg-[hsl(var(--status-archive-bg))]'
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

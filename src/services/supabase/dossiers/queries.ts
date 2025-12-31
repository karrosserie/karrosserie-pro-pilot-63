import { supabase } from '@/integrations/supabase/client';
import type { 
  Dossier, 
  DossierWithDetails, 
  DossierFilters,
  DossierOverallStatus 
} from '@/types/dossier';

// Select clause for dossiers with common relations
const DOSSIER_SELECT = `
  *,
  clients (id, first_name, last_name, company_name, email, phone, address, city, postal_code),
  vehicles (id, license_plate, vin, mileage, car_brands(name), car_models(name))
`;

// Full select clause for detail view
const DOSSIER_DETAIL_SELECT = `
  *,
  clients (*),
  vehicles (*, car_brands(*), car_models(*)),
  expertise_reports (id, report_number, status, report_date, amount),
  quotes (id, reference, status, amount, created_at),
  repair_orders (id, reference, status, arrival_date, end_date),
  cessions (id, reference, status, cession_type),
  fleet_reservations (id, status, start_date, expected_return_date),
  insurance_companies (id, name)
`;

export const dossiersQueries = {
  /**
   * Get a dossier by ID with all its direct relations
   */
  async getById(id: string): Promise<DossierWithDetails | null> {
    const { data: dossier, error } = await supabase
      .from('dossiers')
      .select(DOSSIER_DETAIL_SELECT)
      .eq('id', id)
      .single();
    
    if (error || !dossier) {
      console.error('Error fetching dossier:', error);
      return null;
    }
    
    // Fetch invoices via repair_order_id (indirect relation)
    let invoices: DossierWithDetails['invoices'] = [];
    if (dossier.repair_order_id) {
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select('id, reference, status, amount, issue_date, due_date')
        .eq('repair_order_id', dossier.repair_order_id)
        .order('created_at', { ascending: false });
      invoices = (invoicesData || []) as any;
    }
    
    // Fetch messageries via dossier_id (direct 1:N relation)
    const { data: messageries } = await supabase
      .from('messageries')
      .select('id, title, channel, status, priority, created_at, is_inbound')
      .eq('dossier_id', id)
      .order('created_at', { ascending: false });
    
    return { 
      ...dossier, 
      invoices, 
      messageries: messageries || [],
      overall_status: dossier.overall_status as DossierOverallStatus | null
    } as unknown as DossierWithDetails;
  },

  /**
   * List dossiers with filters
   */
  async list(filters?: DossierFilters): Promise<Dossier[]> {
    let query = supabase
      .from('dossiers')
      .select(DOSSIER_SELECT)
      .order('created_at', { ascending: false });
    
    if (filters?.company_id) {
      query = query.eq('company_id', filters.company_id);
    }
    if (filters?.client_id) {
      query = query.eq('client_id', filters.client_id);
    }
    if (filters?.vehicle_id) {
      query = query.eq('vehicle_id', filters.vehicle_id);
    }
    if (filters?.overall_status) {
      if (Array.isArray(filters.overall_status)) {
        query = query.in('overall_status', filters.overall_status);
      } else {
        query = query.eq('overall_status', filters.overall_status);
      }
    }
    if (filters?.archived !== undefined) {
      query = query.eq('archived', filters.archived);
    }
    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      query = query.or(`reference.ilike.${searchTerm},claim_number.ilike.${searchTerm},policy_number.ilike.${searchTerm}`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching dossiers:', error);
      throw error;
    }
    
    return (data || []) as Dossier[];
  },

  /**
   * Get invoices for a dossier (via repair_order_id)
   */
  async getInvoicesForDossier(dossierId: string) {
    const { data: dossier } = await supabase
      .from('dossiers')
      .select('repair_order_id')
      .eq('id', dossierId)
      .single();
    
    if (!dossier?.repair_order_id) return [];
    
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('repair_order_id', dossier.repair_order_id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching dossier invoices:', error);
      throw error;
    }
    
    return data || [];
  },

  /**
   * Get messageries for a dossier (direct 1:N relation)
   */
  async getMessageriesForDossier(dossierId: string) {
    const { data, error } = await supabase
      .from('messageries')
      .select('*')
      .eq('dossier_id', dossierId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching dossier messageries:', error);
      throw error;
    }
    
    return data || [];
  },

  /**
   * Find an existing dossier or return null
   */
  async findByClientAndVehicle(params: {
    company_id: string;
    client_id: string;
    vehicle_id?: string;
    archived?: boolean;
  }): Promise<Dossier | null> {
    let query = supabase
      .from('dossiers')
      .select(DOSSIER_SELECT)
      .eq('company_id', params.company_id)
      .eq('client_id', params.client_id)
      .eq('archived', params.archived ?? false)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (params.vehicle_id) {
      query = query.eq('vehicle_id', params.vehicle_id);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error finding dossier:', error);
      return null;
    }
    
    return (data?.[0] as Dossier) || null;
  },

  /**
   * Get dossier by repair_order_id
   */
  async getByRepairOrderId(repairOrderId: string): Promise<Dossier | null> {
    const { data, error } = await supabase
      .from('dossiers')
      .select(DOSSIER_SELECT)
      .eq('repair_order_id', repairOrderId)
      .single();
    
    if (error) {
      if (error.code !== 'PGRST116') { // Not found is expected
        console.error('Error fetching dossier by repair_order_id:', error);
      }
      return null;
    }
    
    return data as Dossier;
  },

  /**
   * Get dossier by quote_id
   */
  async getByQuoteId(quoteId: string): Promise<Dossier | null> {
    const { data, error } = await supabase
      .from('dossiers')
      .select(DOSSIER_SELECT)
      .eq('quote_id', quoteId)
      .single();
    
    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('Error fetching dossier by quote_id:', error);
      }
      return null;
    }
    
    return data as Dossier;
  },

  /**
   * Get dossiers count by status
   */
  async getCountByStatus(companyId: string): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from('dossiers')
      .select('overall_status')
      .eq('company_id', companyId)
      .eq('archived', false);
    
    if (error) {
      console.error('Error fetching dossiers count:', error);
      throw error;
    }
    
    const counts: Record<string, number> = {};
    (data || []).forEach(d => {
      const status = d.overall_status || 'ouvert';
      counts[status] = (counts[status] || 0) + 1;
    });
    
    return counts;
  }
};

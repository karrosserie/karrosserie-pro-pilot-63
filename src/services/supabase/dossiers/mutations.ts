import { supabase } from '@/integrations/supabase/client';
import type { 
  DossierInsert, 
  DossierUpdate, 
  CreateDossierParams, 
  UpdateDossierParams 
} from '@/types/dossier';

export const dossiersMutations = {
  /**
   * Create a new dossier
   */
  async create(params: CreateDossierParams) {
    const insertData: DossierInsert = {
      company_id: params.company_id,
      client_id: params.client_id,
      vehicle_id: params.vehicle_id,
      claim_number: params.claim_number,
      policy_number: params.policy_number,
      incident_date: params.incident_date,
      incident_number: params.incident_number,
      expert_name: params.expert_name,
      report_number: params.report_number,
      insurance_company_id: params.insurance_company_id,
      notes: params.notes,
      overall_status: 'ouvert',
      archived: false,
    };
    
    const { data, error } = await supabase
      .from('dossiers')
      .insert(insertData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating dossier:', error);
      throw error;
    }
    
    return data;
  },

  /**
   * Update a dossier
   */
  async update(id: string, params: UpdateDossierParams) {
    const updateData: DossierUpdate = {
      ...params,
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('dossiers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating dossier:', error);
      throw error;
    }
    
    return data;
  },

  /**
   * Archive a dossier
   */
  async archive(id: string) {
    return this.update(id, { archived: true });
  },

  /**
   * Unarchive a dossier
   */
  async unarchive(id: string) {
    return this.update(id, { archived: false });
  },

  /**
   * Link an expertise report to a dossier
   */
  async linkExpertiseReport(dossierId: string, expertiseReportId: string) {
    const { data, error } = await supabase
      .from('dossiers')
      .update({ 
        expertise_report_id: expertiseReportId,
        updated_at: new Date().toISOString()
      })
      .eq('id', dossierId)
      .select()
      .single();
    
    if (error) {
      console.error('Error linking expertise report:', error);
      throw error;
    }
    
    return data;
  },

  /**
   * Link a quote to a dossier
   */
  async linkQuote(dossierId: string, quoteId: string) {
    const { data, error } = await supabase
      .from('dossiers')
      .update({ 
        quote_id: quoteId,
        updated_at: new Date().toISOString()
      })
      .eq('id', dossierId)
      .select()
      .single();
    
    if (error) {
      console.error('Error linking quote:', error);
      throw error;
    }
    
    return data;
  },

  /**
   * Link a repair order to a dossier
   */
  async linkRepairOrder(dossierId: string, repairOrderId: string) {
    const { data, error } = await supabase
      .from('dossiers')
      .update({ 
        repair_order_id: repairOrderId,
        updated_at: new Date().toISOString()
      })
      .eq('id', dossierId)
      .select()
      .single();
    
    if (error) {
      console.error('Error linking repair order:', error);
      throw error;
    }
    
    return data;
  },

  /**
   * Link a cession to a dossier
   */
  async linkCession(dossierId: string, cessionId: string) {
    const { data, error } = await supabase
      .from('dossiers')
      .update({ 
        cession_id: cessionId,
        updated_at: new Date().toISOString()
      })
      .eq('id', dossierId)
      .select()
      .single();
    
    if (error) {
      console.error('Error linking cession:', error);
      throw error;
    }
    
    return data;
  },

  /**
   * Link a fleet reservation to a dossier
   */
  async linkFleetReservation(dossierId: string, fleetReservationId: string) {
    const { data, error } = await supabase
      .from('dossiers')
      .update({ 
        fleet_reservation_id: fleetReservationId,
        updated_at: new Date().toISOString()
      })
      .eq('id', dossierId)
      .select()
      .single();
    
    if (error) {
      console.error('Error linking fleet reservation:', error);
      throw error;
    }
    
    return data;
  },

  /**
   * Find or create a dossier for a client/vehicle combination
   */
  async findOrCreate(params: CreateDossierParams) {
    // Try to find existing non-archived dossier
    const { data: existing } = await supabase
      .from('dossiers')
      .select('*')
      .eq('company_id', params.company_id)
      .eq('client_id', params.client_id)
      .eq('archived', false)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (existing && existing.length > 0) {
      // If vehicle matches or no vehicle specified, return existing
      if (!params.vehicle_id || existing[0].vehicle_id === params.vehicle_id) {
        return existing[0];
      }
    }
    
    // Create new dossier
    return this.create(params);
  },

  /**
   * Delete a dossier (soft delete by archiving)
   */
  async delete(id: string) {
    return this.archive(id);
  },

  /**
   * Permanently delete a dossier (use with caution)
   */
  async hardDelete(id: string) {
    const { error } = await supabase
      .from('dossiers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting dossier:', error);
      throw error;
    }
    
    return true;
  }
};

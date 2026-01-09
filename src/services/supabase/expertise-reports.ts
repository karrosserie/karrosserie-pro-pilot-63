
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type ExpertiseReport = Database['public']['Tables']['expertise_reports']['Row'] & {
  report_number?: string | null;
  report_date?: string | null;
  claim_number?: string | null;
  incident_date?: string | null;
  policy_number?: string | null;
  repairs_data?: string | null;
  parts_data?: string | null;
  global_discount_data?: string | null;
  // Add joined relations
  clients?: {
    first_name: string;
    last_name: string;
  } | null;
  vehicles?: {
    id: string;
    license_plate?: string | null;
    car_brands?: {
      name: string;
    } | null;
    car_models?: {
      name: string;
    } | null;
  } | null;
};

export type NewExpertiseReport = Database['public']['Tables']['expertise_reports']['Insert'] & {
  report_number?: string | null;
  report_date?: string | null;
  claim_number?: string | null;
  incident_date?: string | null;
  policy_number?: string | null;
  repairs_data?: string | null;
  parts_data?: string | null;
  global_discount_data?: string | null;
};

export type UpdateExpertiseReport = Database['public']['Tables']['expertise_reports']['Update'] & {
  report_number?: string | null;
  report_date?: string | null;
  claim_number?: string | null;
  incident_date?: string | null;
  policy_number?: string | null;
  repairs_data?: string | null;
  parts_data?: string | null;
  global_discount_data?: string | null;
};

export const expertiseReportsService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('expertise_reports')
      .select(`
        *,
        clients(first_name, last_name),
        vehicles(
          id,
          license_plate,
          car_brands(name),
          car_models(name)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching expertise reports:', error);
      throw new Error(error.message);
    }
    
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('expertise_reports')
      .select(`
        *,
        clients(id, first_name, last_name),
        vehicles(
          id,
          license_plate,
          car_brands(name),
          car_models(name)
        )
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching expertise report with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  create: async (report: NewExpertiseReport) => {
    // Calculer le montant total à partir des données de réparations et pièces
    let totalAmount = 0;
    
    if (report.repairs_data) {
      try {
        const repairs = JSON.parse(report.repairs_data);
        totalAmount += repairs.reduce((sum: number, repair: any) => sum + (repair.total || 0), 0);
      } catch (e) {
        console.error('Error parsing repairs data:', e);
      }
    }
    
    if (report.parts_data) {
      try {
        const parts = JSON.parse(report.parts_data);
        totalAmount += parts.reduce((sum: number, part: any) => sum + (part.total || 0), 0);
      } catch (e) {
        console.error('Error parsing parts data:', e);
      }
    }

    // Soustraire les remises globales du total
    let globalDiscounts = 0;
    if (report.global_discount_data) {
      try {
        const discounts = JSON.parse(report.global_discount_data);
        globalDiscounts = discounts.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
      } catch (e) {
        console.error('Error parsing global_discount_data:', e);
      }
    }

    const reportWithAmount = {
      ...report,
      amount: totalAmount - globalDiscounts,
      status: report.status || 'Importé'
    };

    const { data, error } = await supabase
      .from('expertise_reports')
      .insert([reportWithAmount])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating expertise report:', error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  update: async (id: string, report: UpdateExpertiseReport) => {
    // Calculer le montant total à partir des données de réparations et pièces
    let totalAmount = 0;
    
    if (report.repairs_data) {
      try {
        const repairs = JSON.parse(report.repairs_data);
        totalAmount += repairs.reduce((sum: number, repair: any) => sum + (repair.total || 0), 0);
      } catch (e) {
        console.error('Error parsing repairs data:', e);
      }
    }
    
    if (report.parts_data) {
      try {
        const parts = JSON.parse(report.parts_data);
        totalAmount += parts.reduce((sum: number, part: any) => sum + (part.total || 0), 0);
      } catch (e) {
        console.error('Error parsing parts data:', e);
      }
    }

    // Soustraire les remises globales du total
    let globalDiscounts = 0;
    if (report.global_discount_data) {
      try {
        const discounts = JSON.parse(report.global_discount_data);
        globalDiscounts = discounts.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
      } catch (e) {
        console.error('Error parsing global_discount_data:', e);
      }
    }

    const reportWithAmount = {
      ...report,
      amount: totalAmount - globalDiscounts
    };

    const { data, error } = await supabase
      .from('expertise_reports')
      .update(reportWithAmount)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating expertise report with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('expertise_reports')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting expertise report with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return true;
  }
};

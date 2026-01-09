
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
  },

  // Modifier le document d'un rapport existant
  modifyDocument: async (id: string, newDocumentUrl: string) => {
    const { data, error } = await supabase
      .from('expertise_reports')
      .update({
        document_url: newDocumentUrl,
        status: 'Modifié',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error modifying document for report ${id}:`, error);
      throw new Error(error.message);
    }

    return data;
  },

  // Vérifier les dépendances d'un rapport (quotes et repair_orders)
  checkDependencies: async (reportId: string): Promise<{
    hasSignedRepairOrder: boolean;
    quotes: { id: string; reference: string }[];
    repairOrders: { id: string; reference: string; status: string }[];
  }> => {
    // Vérifier les devis liés
    const { data: quotes, error: quotesError } = await supabase
      .from('quotes')
      .select('id, reference')
      .eq('report_id', reportId);

    if (quotesError) {
      console.error(`Error fetching quotes for report ${reportId}:`, quotesError);
      throw new Error(quotesError.message);
    }

    // Vérifier les ordres de réparation liés via les devis
    let repairOrders: { id: string; reference: string; status: string }[] = [];
    let hasSignedRepairOrder = false;

    if (quotes && quotes.length > 0) {
      const quoteIds = quotes.map(q => q.id);
      
      const { data: ros, error: rosError } = await supabase
        .from('repair_orders')
        .select('id, reference, status')
        .in('quote_id', quoteIds);

      if (rosError) {
        console.error(`Error fetching repair orders for report ${reportId}:`, rosError);
        throw new Error(rosError.message);
      }

      if (ros) {
        repairOrders = ros;
        hasSignedRepairOrder = ros.some(ro => ro.status === 'Signé' || ro.status === 'signed');
      }
    }

    return {
      hasSignedRepairOrder,
      quotes: quotes || [],
      repairOrders
    };
  }
};

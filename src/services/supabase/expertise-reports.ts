
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type ExpertiseReport = Database['public']['Tables']['expertise_reports']['Row'];
export type NewExpertiseReport = Database['public']['Tables']['expertise_reports']['Insert'];
export type UpdateExpertiseReport = Database['public']['Tables']['expertise_reports']['Update'];

export const expertiseReportsService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('expertise_reports')
      .select(`
        *,
        clients(first_name, last_name),
        vehicles(brand, model, license_plate)
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
        vehicles(id, brand, model, license_plate)
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
    const { data, error } = await supabase
      .from('expertise_reports')
      .insert([report])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating expertise report:', error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  update: async (id: string, report: UpdateExpertiseReport) => {
    const { data, error } = await supabase
      .from('expertise_reports')
      .update(report)
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

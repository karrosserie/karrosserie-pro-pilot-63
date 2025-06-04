
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Credit = Database['public']['Tables']['credits']['Row'] & {
  clients?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  vehicles?: {
    id: string;
    brand: string;
    model: string;
    license_plate: string;
  } | null;
  invoices?: {
    id: string;
    reference: string;
    amount: number;
  } | null;
};

export type NewCredit = Database['public']['Tables']['credits']['Insert'];
export type UpdateCredit = Database['public']['Tables']['credits']['Update'];

export const creditsService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('credits')
      .select(`
        *,
        clients (
          id,
          first_name,
          last_name
        ),
        vehicles (
          id,
          brand,
          model,
          license_plate
        ),
        invoices (
          id,
          reference,
          amount
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching credits:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('credits')
      .select(`
        *,
        clients (
          id,
          first_name,
          last_name
        ),
        vehicles (
          id,
          brand,
          model,
          license_plate
        ),
        invoices (
          id,
          reference,
          amount
        )
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching credit with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },

  getLastCreditByUser: async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      throw new Error('User not authenticated');
    }

    const { data: credit, error } = await supabase
      .from('credits')
      .select('reference')
      .eq('user_id', user.id)
      .order('reference', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching last credit:', error);
      throw new Error(error.message);
    }

    return credit;
  },
  
  create: async (credit: NewCredit) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const creditWithUser = {
      ...credit,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('credits')
      .insert([creditWithUser])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating credit:', error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  update: async (id: string, credit: UpdateCredit) => {
    const { data, error } = await supabase
      .from('credits')
      .update(credit)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating credit with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('credits')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting credit with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return true;
  }
};

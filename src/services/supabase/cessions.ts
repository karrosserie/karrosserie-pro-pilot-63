
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Import the status type from the form types
import { CessionStatus } from '@/components/cessions/form/types';

// Extend the base types to include the new columns
type BaseCession = Database['public']['Tables']['cessions']['Row'];
type BaseNewCession = Database['public']['Tables']['cessions']['Insert'];
type BaseUpdateCession = Database['public']['Tables']['cessions']['Update'];

export interface Cession extends BaseCession {
  reference: string;
  status: CessionStatus;
  vehicles?: {
    brand: string;
    model: string;
    license_plate: string;
  };
  repair_orders?: {
    reference: string;
    created_at?: string;
    clients?: {
      first_name: string;
      last_name: string;
    };
    vehicles?: {
      brand: string;
      model: string;
      license_plate: string;
    };
  };
  insurance_companies?: {
    name: string;
  };
}

export interface NewCession extends Omit<BaseNewCession, 'id' | 'created_at' | 'updated_at' | 'user_id'> {
  reference: string;
  status?: CessionStatus;
}

export interface UpdateCession extends BaseUpdateCession {
  reference?: string;
  status?: CessionStatus;
}

export const cessionsService = {
  getAll: async (): Promise<Cession[]> => {
    console.log('Fetching cessions...');
    
    // Get cessions with insurance companies
    const { data: cessions, error } = await supabase
      .from('cessions')
      .select(`
        *,
        insurance_companies(name)
      `)
      .order('sale_date', { ascending: false });

    if (error) {
      console.error('Error fetching cessions:', error);
      throw new Error(error.message);
    }
    
    console.log('Raw cessions data:', cessions);
    
    // Enrich each cession with repair order data
    const enrichedCessions = await Promise.all(
      (cessions || []).map(async (cession) => {
        let repairOrderData = null;
        
        if (cession.repair_order_id) {
          console.log(`Fetching repair order for cession ${cession.id}, repair_order_id: ${cession.repair_order_id}`);
          
          // Get repair order with client and vehicle info
          const { data: repairOrder, error: repairOrderError } = await supabase
            .from('repair_orders')
            .select(`
              reference,
              created_at,
              client_id,
              vehicle_id,
              clients(first_name, last_name),
              vehicles(brand, model, license_plate)
            `)
            .eq('id', cession.repair_order_id)
            .single();
            
          if (repairOrderError) {
            console.error(`Error fetching repair order ${cession.repair_order_id}:`, repairOrderError);
          } else {
            console.log('Repair order data:', repairOrder);
            repairOrderData = repairOrder;
          }
        }
        
        return {
          ...cession,
          reference: cession.reference || '',
          status: cession.status || 'en_attente',
          repair_orders: repairOrderData
        };
      })
    );
    
    console.log('Enriched cessions:', enrichedCessions);
    return enrichedCessions as Cession[];
  },

  getById: async (id: string): Promise<Cession> => {
    // Get basic cession data
    const { data: basicCession, error: basicError } = await supabase
      .from('cessions')
      .select(`
        *,
        vehicles(id, brand, model, license_plate),
        insurance_companies(name)
      `)
      .eq('id', id)
      .single();
      
    if (basicError) {
      console.error(`Error fetching cession with id ${id}:`, basicError);
      throw new Error(basicError.message);
    }
    
    // Enrich with repair order data if exists
    let repairOrderData = null;
    if (basicCession.repair_order_id) {
      const { data: repairOrder } = await supabase
        .from('repair_orders')
        .select(`
          reference,
          created_at,
          clients(first_name, last_name),
          vehicles(brand, model, license_plate)
        `)
        .eq('id', basicCession.repair_order_id)
        .single();
        
      repairOrderData = repairOrder;
    }
    
    // Transform data to match our interface
    return {
      ...basicCession,
      reference: (basicCession as any).reference || '',
      status: (basicCession as any).status || 'en_attente',
      repair_orders: repairOrderData
    } as Cession;
  },
  
  create: async (cession: NewCession): Promise<Cession> => {
    console.log('Creating cession with data:', cession);
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Error getting user:', userError);
      throw new Error('Utilisateur non authentifié');
    }
    
    // Generate a reference if not provided
    const reference = cession.reference || `CC-${new Date().getFullYear()}-${Date.now()}`;
    
    // Ensure insurance_company_id is properly formatted as UUID or null
    const processedCession = {
      ...cession,
      user_id: user.id,
      reference,
      status: cession.status || 'en_attente',
      insurance_company_id: cession.insurance_company_id || null
    };
    
    console.log('Processed cession data:', processedCession);
    
    const { data, error } = await supabase
      .from('cessions')
      .insert([processedCession as any])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating cession:', error);
      throw new Error(error.message);
    }
    
    return {
      ...data,
      reference: (data as any).reference || '',
      status: (data as any).status || 'en_attente'
    } as Cession;
  },
  
  update: async (id: string, cession: UpdateCession): Promise<Cession> => {
    const { data, error } = await supabase
      .from('cessions')
      .update(cession as any)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating cession with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return {
      ...data,
      reference: (data as any).reference || '',
      status: (data as any).status || 'en_attente'
    } as Cession;
  },
  
  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('cessions')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting cession with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return true;
  }
};

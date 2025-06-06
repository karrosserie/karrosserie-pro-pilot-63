
import { supabase } from '@/integrations/supabase/client';
import { Cession, NewCession, UpdateCession } from './types';

export const createCession = async (cession: NewCession): Promise<Cession> => {
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
};

export const updateCession = async (id: string, cession: UpdateCession): Promise<Cession> => {
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
};

export const deleteCession = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('cessions')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error(`Error deleting cession with id ${id}:`, error);
    throw new Error(error.message);
  }
  
  return true;
};

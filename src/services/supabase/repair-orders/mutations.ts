
import { supabase } from '@/integrations/supabase/client';
import { NewRepairOrder, UpdateRepairOrder } from './types';

export const createRepairOrder = async (order: NewRepairOrder, companyId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const orderWithCompany = {
    ...order,
    company_id: companyId
  };

  const { data, error } = await supabase
    .from('repair_orders')
    .insert([orderWithCompany])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating repair order:', error);
    throw new Error(error.message);
  }
  
  return data;
};

export const updateRepairOrder = async (id: string, order: UpdateRepairOrder) => {
  const { data, error } = await supabase
    .from('repair_orders')
    .update(order)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error(`Error updating repair order with id ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const deleteRepairOrder = async (id: string) => {
  const { error } = await supabase
    .from('repair_orders')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error(`Error deleting repair order with id ${id}:`, error);
    throw new Error(error.message);
  }
  
  return true;
};

export const archiveRepairOrder = async (id: string) => {
  // S'assurer que l'utilisateur agit bien sur sa société (meilleure compatibilité avec les politiques RLS)
  const { getCurrentUserCompanyId } = await import('../auth-company');
  let companyId: string | null = null;
  try {
    companyId = await getCurrentUserCompanyId();
  } catch (e) {
    // Si non authentifié ou pas de company, on tente quand même l'update via RLS (cas impersonation)
    console.warn('No company context found, attempting archive with RLS checks only');
  }

  const query = supabase
    .from('repair_orders')
    .update({ archived: true, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (companyId) {
    query.eq('company_id', companyId);
  }

  const { data, error } = await query.select().single();
  
  if (error) {
    console.error(`Error archiving repair order with id ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const restoreRepairOrder = async (id: string) => {
  // S'assurer que l'utilisateur agit bien sur sa société (meilleure compatibilité avec les politiques RLS)
  const { getCurrentUserCompanyId } = await import('../auth-company');
  let companyId: string | null = null;
  try {
    companyId = await getCurrentUserCompanyId();
  } catch (e) {
    // Si non authentifié ou pas de company, on tente quand même l'update via RLS (cas impersonation)
    console.warn('No company context found, attempting restore with RLS checks only');
  }

  const query = supabase
    .from('repair_orders')
    .update({ archived: false, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (companyId) {
    query.eq('company_id', companyId);
  }

  const { data, error } = await query.select().single();
  
  if (error) {
    console.error(`Error restoring repair order with id ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

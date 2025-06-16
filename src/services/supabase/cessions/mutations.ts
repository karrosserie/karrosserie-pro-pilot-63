
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
  
  // Only include fields that exist in the new cessions table structure
  const processedCession = {
    user_id: user.id,
    reference,
    status: cession.status || 'en_attente',
    repair_order_id: cession.repair_order_id || null,
    bank_account_id: cession.bank_account_id || null,
    incident_number: cession.incident_number || null,
    incident_date: cession.incident_date || null,
    policy_number: cession.policy_number || null,
    report_number: cession.report_number || null,
    expert_name: cession.expert_name || null,
    insurance_company_id: cession.insurance_company_id || null,
    // Legacy fields for backward compatibility
    buyer_name: cession.buyer_name || '',
    buyer_contact: cession.buyer_contact || null,
    sale_price: cession.sale_price || 0,
    sale_date: cession.sale_date || new Date().toISOString().split('T')[0],
    notes: cession.notes || null,
    document_url: cession.document_url || null
  };
  
  console.log('Processed cession data:', processedCession);
  
  const { data, error } = await supabase
    .from('cessions')
    .insert([processedCession])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating cession:', error);
    throw new Error(error.message);
  }
  
  return data as Cession;
};

export const updateCession = async (id: string, cession: UpdateCession): Promise<Cession> => {
  // Only include fields that exist in the new cessions table structure
  const processedCession = {
    reference: cession.reference,
    status: cession.status,
    repair_order_id: cession.repair_order_id,
    bank_account_id: cession.bank_account_id,
    incident_number: cession.incident_number,
    incident_date: cession.incident_date,
    policy_number: cession.policy_number,
    report_number: cession.report_number,
    expert_name: cession.expert_name,
    insurance_company_id: cession.insurance_company_id,
    // Legacy fields for backward compatibility
    buyer_name: cession.buyer_name,
    buyer_contact: cession.buyer_contact,
    sale_price: cession.sale_price,
    sale_date: cession.sale_date,
    notes: cession.notes,
    document_url: cession.document_url
  };

  const { data, error } = await supabase
    .from('cessions')
    .update(processedCession)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error(`Error updating cession with id ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data as Cession;
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

import { supabase } from '@/integrations/supabase/client';
import { NewInvoice, UpdateInvoice } from './types';

// Helper pour convertir les chaînes vides en null pour les champs de date
const emptyToNull = (value: any) => (value === '' ? null : value);

export const invoiceMutations = {
  create: async (invoice: NewInvoice) => {
    const { getCurrentUserCompanyId } = await import('../auth-company');
    const companyId = await getCurrentUserCompanyId();

    // Clean the invoice data to only include fields that exist in the database
    const cleanInvoice = {
      reference: invoice.reference,
      repair_order_id: invoice.repair_order_id,
      client_id: invoice.client_id,
      vehicle_id: invoice.vehicle_id,
      status: invoice.status,
      date: invoice.date,
      due_date: invoice.due_date,
      payment_details: invoice.payment_details,
      amount: invoice.amount || 0,
      repairs_data: invoice.repairs_data,
      parts_data: invoice.parts_data,
      discounts_data: invoice.discounts_data,
      claim_number: invoice.claim_number,
      // Ajout des nouveaux champs pour les informations du sinistre
      policy_number: invoice.policy_number,
      report_date: emptyToNull(invoice.report_date),
      expert_name: invoice.expert_name,
      report_number: invoice.report_number,
      incident_date: emptyToNull(invoice.incident_date),
      notes: invoice.notes,
      company_id: companyId
    };

    const { data, error } = await supabase
      .from('invoices')
      .insert([cleanInvoice])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating invoice:', error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  update: async (id: string, invoice: UpdateInvoice) => {
    // Clean the invoice data to only include fields that exist in the database
    const cleanInvoice: any = {};
    
    if (invoice.reference !== undefined) cleanInvoice.reference = invoice.reference;
    if (invoice.repair_order_id !== undefined) cleanInvoice.repair_order_id = invoice.repair_order_id;
    if (invoice.client_id !== undefined) cleanInvoice.client_id = invoice.client_id;
    if (invoice.vehicle_id !== undefined) cleanInvoice.vehicle_id = invoice.vehicle_id;
    if (invoice.status !== undefined) cleanInvoice.status = invoice.status;
    if (invoice.date !== undefined) cleanInvoice.date = invoice.date;
    if (invoice.due_date !== undefined) cleanInvoice.due_date = invoice.due_date;
    if (invoice.payment_details !== undefined) cleanInvoice.payment_details = invoice.payment_details;
    if (invoice.amount !== undefined) cleanInvoice.amount = invoice.amount;
    if (invoice.repairs_data !== undefined) cleanInvoice.repairs_data = invoice.repairs_data;
    if (invoice.parts_data !== undefined) cleanInvoice.parts_data = invoice.parts_data;
    if (invoice.discounts_data !== undefined) cleanInvoice.discounts_data = invoice.discounts_data;
    if (invoice.claim_number !== undefined) cleanInvoice.claim_number = invoice.claim_number;
    // Ajout des nouveaux champs pour les informations du sinistre
    if (invoice.policy_number !== undefined) cleanInvoice.policy_number = invoice.policy_number;
    if (invoice.report_date !== undefined) cleanInvoice.report_date = emptyToNull(invoice.report_date);
    if (invoice.expert_name !== undefined) cleanInvoice.expert_name = invoice.expert_name;
    if (invoice.report_number !== undefined) cleanInvoice.report_number = invoice.report_number;
    if (invoice.incident_date !== undefined) cleanInvoice.incident_date = emptyToNull(invoice.incident_date);
    if (invoice.notes !== undefined) cleanInvoice.notes = invoice.notes;

    const { data, error } = await supabase
      .from('invoices')
      .update(cleanInvoice)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating invoice with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting invoice with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    return true;
  },

  archive: async (id: string) => {
    const { error } = await supabase
      .from('invoices')
      .update({ archived: true })
      .eq('id', id);

    if (error) {
      console.error(`Error archiving invoice with id ${id}:`, error);
      throw new Error(error.message);
    }

    return true;
  },

  restore: async (id: string) => {
    const { error } = await supabase
      .from('invoices')
      .update({ archived: false })
      .eq('id', id);

    if (error) {
      console.error(`Error restoring invoice with id ${id}:`, error);
      throw new Error(error.message);
    }

    return true;
  }
};

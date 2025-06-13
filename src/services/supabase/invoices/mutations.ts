
import { supabase } from '@/integrations/supabase/client';
import { NewInvoice, UpdateInvoice } from './types';

export const invoiceMutations = {
  create: async (invoice: NewInvoice) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Clean the invoice data to only include fields that exist in the database
    const cleanInvoice = {
      reference: invoice.reference,
      repair_order_id: invoice.repair_order_id,
      client_id: invoice.client_id,
      vehicle_id: invoice.vehicle_id,
      status: invoice.status,
      due_date: invoice.due_date,
      payment_due_date: invoice.payment_due_date,
      payment_date: invoice.payment_date,
      payment_details: invoice.payment_details,
      description: invoice.description,
      amount: invoice.amount || 0,
      repairs_data: invoice.repairs_data,
      parts_data: invoice.parts_data,
      discounts_data: invoice.discounts_data,
      claim_number: invoice.claim_number,
      current_mileage: invoice.current_mileage,
      user_id: user.id
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
    if (invoice.due_date !== undefined) cleanInvoice.due_date = invoice.due_date;
    if (invoice.payment_due_date !== undefined) cleanInvoice.payment_due_date = invoice.payment_due_date;
    if (invoice.payment_date !== undefined) cleanInvoice.payment_date = invoice.payment_date;
    if (invoice.payment_details !== undefined) cleanInvoice.payment_details = invoice.payment_details;
    if (invoice.description !== undefined) cleanInvoice.description = invoice.description;
    if (invoice.amount !== undefined) cleanInvoice.amount = invoice.amount;
    if (invoice.repairs_data !== undefined) cleanInvoice.repairs_data = invoice.repairs_data;
    if (invoice.parts_data !== undefined) cleanInvoice.parts_data = invoice.parts_data;
    if (invoice.discounts_data !== undefined) cleanInvoice.discounts_data = invoice.discounts_data;
    if (invoice.claim_number !== undefined) cleanInvoice.claim_number = invoice.claim_number;
    if (invoice.current_mileage !== undefined) cleanInvoice.current_mileage = invoice.current_mileage;

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
  }
};

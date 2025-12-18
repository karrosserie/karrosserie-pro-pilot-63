
import { supabase } from '@/integrations/supabase/client';
import { NewReceipt, UpdateReceipt } from './types';
import { invoicesService } from '../invoices';
import { getCurrentUserCompanyId } from '../auth-company';

// Helper function to calculate and update invoice status based on receipts AND credits
export const updateInvoiceStatus = async (invoiceId: string) => {
  // Get invoice details
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select('id, amount')
    .eq('id', invoiceId)
    .single();
    
  if (invoiceError || !invoice) {
    console.error('Error fetching invoice:', invoiceError);
    return;
  }

  // Get all receipts for this invoice
  const { data: receipts, error: receiptsError } = await supabase
    .from('receipts')
    .select('amount')
    .eq('invoice_id', invoiceId);
    
  if (receiptsError) {
    console.error('Error fetching receipts:', receiptsError);
    return;
  }

  // Get all credits (avoirs) for this invoice
  const { data: credits, error: creditsError } = await supabase
    .from('credits')
    .select('amount')
    .eq('invoice_id', invoiceId);
    
  if (creditsError) {
    console.error('Error fetching credits:', creditsError);
    return;
  }

  // Calculate total amounts (receipts + credits)
  const totalReceiptsAmount = receipts?.reduce((sum, receipt) => sum + (receipt.amount || 0), 0) || 0;
  const totalCreditsAmount = credits?.reduce((sum, credit) => sum + (credit.amount || 0), 0) || 0;
  
  // Arrondir à 2 décimales pour éviter les erreurs de précision JavaScript
  const totalPaidAmount = Math.round((totalReceiptsAmount + totalCreditsAmount) * 100) / 100;
  const invoiceAmount = Math.round((invoice.amount || 0) * 100) / 100;

  // Determine new status
  let newStatus: string;
  if (totalPaidAmount === 0) {
    newStatus = 'En attente de paiement';
  } else if (totalPaidAmount >= invoiceAmount) {
    newStatus = 'Payée';
  } else {
    newStatus = 'Paiement partiel';
  }

  // Update invoice status
  await invoicesService.update(invoiceId, { status: newStatus });
};

export const receiptMutations = {
  create: async (receipt: Omit<NewReceipt, 'company_id'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const companyId = await getCurrentUserCompanyId();

    const receiptWithCompany = {
      ...receipt,
      company_id: companyId
    };

    const { data, error } = await supabase
      .from('receipts')
      .insert([receiptWithCompany])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating receipt:', error);
      throw new Error(error.message);
    }
    
    // Update invoice status after creating receipt
    if (data?.invoice_id) {
      await updateInvoiceStatus(data.invoice_id);
    }
    
    return data;
  },
  
  update: async (id: string, receipt: UpdateReceipt) => {
    // Get the current receipt to know which invoice to update
    const { data: currentReceipt } = await supabase
      .from('receipts')
      .select('invoice_id')
      .eq('id', id)
      .single();

    const { data, error } = await supabase
      .from('receipts')
      .update(receipt)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating receipt with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    // Update invoice status after updating receipt
    const invoiceIdToUpdate = data?.invoice_id || currentReceipt?.invoice_id;
    if (invoiceIdToUpdate) {
      await updateInvoiceStatus(invoiceIdToUpdate);
    }
    
    // If invoice_id changed, also update the old invoice status
    if (currentReceipt?.invoice_id && data?.invoice_id !== currentReceipt.invoice_id) {
      await updateInvoiceStatus(currentReceipt.invoice_id);
    }
    
    return data;
  },
  
  delete: async (id: string) => {
    // Get the receipt to know which invoice to update
    const { data: receiptToDelete } = await supabase
      .from('receipts')
      .select('invoice_id')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('receipts')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting receipt with id ${id}:`, error);
      throw new Error(error.message);
    }
    
    // Update invoice status after deleting receipt
    if (receiptToDelete?.invoice_id) {
      await updateInvoiceStatus(receiptToDelete.invoice_id);
    }
    
    return true;
  }
};

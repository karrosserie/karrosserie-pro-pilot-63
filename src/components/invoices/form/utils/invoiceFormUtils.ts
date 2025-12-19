
import { InvoiceRepairItem, InvoicePartItem, InvoiceDiscountItem } from '../types';
import { invoicesService } from '@/services/supabase/invoices';

export const prepareSubmitData = (
  formData: any,
  description: string,
  claimNumber: string,
  currentMileage: string,
  repairs: InvoiceRepairItem[],
  parts: InvoicePartItem[],
  discounts: InvoiceDiscountItem[]
) => {
  return {
    ...formData,
    description,
    claim_number: claimNumber,
    current_mileage: currentMileage,
    repairs_data: repairs,
    parts_data: parts,
    discounts_data: discounts
  };
};

export const parseInvoiceNotes = (notes: string) => {
  try {
    if (!notes) {
      return {
        description: '',
        claimNumber: '',
        currentMileage: '',
        repairs: [],
        parts: [],
        discounts: []
      };
    }

    const parsed = JSON.parse(notes);
    return {
      description: parsed.description || '',
      claimNumber: parsed.claimNumber || '',
      currentMileage: parsed.currentMileage || '',
      repairs: parsed.repairs || [],
      parts: parsed.parts || [],
      discounts: parsed.discounts || []
    };
  } catch (error) {
    console.error('Erreur lors du parsing des notes de la facture:', error);
    return {
      description: notes,
      claimNumber: '',
      currentMileage: '',
      repairs: [],
      parts: [],
      discounts: []
    };
  }
};

export const generateNextInvoiceNumber = async (): Promise<string> => {
  console.log('[generateNextInvoiceNumber] CALLED - using SQL sequence');
  const start = performance.now();
  try {
    // Utilise la fonction RPC atomique pour garantir l'unicité du numéro
    const nextNumber = await invoicesService.getNextInvoiceNumber();
    console.log('[generateNextInvoiceNumber] Got:', nextNumber, 'in', (performance.now() - start).toFixed(0), 'ms');
    return nextNumber;
  } catch (error) {
    console.error('[generateNextInvoiceNumber] ERROR:', error);
    // Ne PAS retourner "1" - propager l'erreur pour forcer l'utilisateur à réessayer
    throw error;
  }
};

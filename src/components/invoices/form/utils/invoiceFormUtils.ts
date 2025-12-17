
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
  console.log('[generateNextInvoiceNumber] CALLED');
  const start = performance.now();
  try {
    // Utilise getLastInvoiceByUser au lieu de getAll pour éviter de charger toutes les factures
    const lastInvoice = await invoicesService.getLastInvoiceByUser();
    console.log('[generateNextInvoiceNumber] getLastInvoiceByUser returned:', lastInvoice?.reference, 'in', (performance.now() - start).toFixed(0), 'ms');
    
    if (!lastInvoice?.reference) {
      return '1';
    }

    const lastNumber = parseInt(lastInvoice.reference, 10);
    if (isNaN(lastNumber)) {
      return '1';
    }

    return (lastNumber + 1).toString();
  } catch (error) {
    console.error('[generateNextInvoiceNumber] ERROR:', error);
    return '1';
  }
};

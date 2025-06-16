
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
  try {
    const invoices = await invoicesService.getAll();
    
    if (!invoices || invoices.length === 0) {
      return 'F-001';
    }

    // Extraire les numéros de facture et trouver le plus élevé
    const invoiceNumbers = invoices
      .map(invoice => invoice.reference)
      .filter(ref => ref && ref.startsWith('F-'))
      .map(ref => {
        const numberPart = ref.replace('F-', '');
        return parseInt(numberPart, 10);
      })
      .filter(num => !isNaN(num));

    if (invoiceNumbers.length === 0) {
      return 'F-001';
    }

    const maxNumber = Math.max(...invoiceNumbers);
    const nextNumber = maxNumber + 1;
    
    return `F-${nextNumber.toString().padStart(3, '0')}`;
  } catch (error) {
    console.error('Erreur lors de la génération du numéro de facture:', error);
    // Fallback: retourner un numéro basé sur la date
    const now = new Date();
    const timestamp = now.getTime().toString().slice(-6);
    return `F-${timestamp}`;
  }
};


import { invoicesService } from '@/services/supabase/invoices';
import { InvoiceRepairItem, InvoicePartItem, InvoiceDiscountItem } from '../types';

export const generateNextInvoiceNumber = async () => {
  try {
    const lastInvoice = await invoicesService.getLastInvoiceByUser();
    const lastNumber = lastInvoice?.reference ? parseInt(lastInvoice.reference) : 0;
    return (lastNumber + 1).toString();
  } catch (error) {
    console.error('Error generating invoice number:', error);
    return '1';
  }
};

export const prepareSubmitData = (
  formData: any,
  description: string,
  claimNumber: string,
  currentMileage: string,
  repairs: InvoiceRepairItem[],
  parts: InvoicePartItem[],
  discounts: InvoiceDiscountItem[]
) => {
  const notesData = {
    description,
    claimNumber,
    currentMileage,
    repairs,
    parts,
    discounts
  };
  
  return {
    ...formData,
    notes: JSON.stringify(notesData)
  };
};

export const parseInvoiceNotes = (notes: string) => {
  try {
    const noteData = JSON.parse(notes);
    return {
      description: noteData.description || '',
      claimNumber: noteData.claimNumber || '',
      currentMileage: noteData.currentMileage || '',
      repairs: noteData.repairs || [],
      parts: noteData.parts || [],
      discounts: noteData.discounts || []
    };
  } catch (e) {
    console.error('Error parsing invoice notes:', e);
    return {
      description: '',
      claimNumber: '',
      currentMileage: '',
      repairs: [],
      parts: [],
      discounts: []
    };
  }
};

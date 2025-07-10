
import { Quote } from '@/services/supabase/quotes';
import { QuoteRepairItem, QuotePartItem, QuoteDiscountItem } from '../types';

export const prepareSubmitData = (
  formData: Partial<Quote>,
  notes: string,
  claimNumber: string,
  currentMileage: string,
  repairs: QuoteRepairItem[],
  parts: QuotePartItem[],
  discounts: QuoteDiscountItem[]
) => {
  const notesData = {
    notes,
    currentMileage,
    repairs,
    parts,
    discounts
  };
  
  return {
    ...formData,
    claim_number: claimNumber,
    notes: JSON.stringify(notesData),
    // S'assurer que les nouveaux champs sont inclus
    report_number: formData.report_number || '',
    policy_number: formData.policy_number || '',
    report_date: formData.report_date || null,
    expert_name: formData.expert_name || '',
    incident_date: formData.incident_date || null
  };
};

export const parseQuoteNotes = (notesString: string | null) => {
  if (!notesString) {
    return {
      notes: '',
      claimNumber: '',
      currentMileage: '',
      repairs: [],
      parts: [],
      discounts: []
    };
  }

  try {
    const noteData = JSON.parse(notesString);
    return {
      notes: noteData.notes || noteData.description || '',
      claimNumber: noteData.claimNumber || '',
      currentMileage: noteData.currentMileage || '',
      repairs: noteData.repairs || [],
      parts: noteData.parts || [],
      discounts: noteData.discounts || []
    };
  } catch (e) {
    console.error('Error parsing quote notes:', e);
    return {
      notes: '',
      claimNumber: '',
      currentMileage: '',
      repairs: [],
      parts: [],
      discounts: []
    };
  }
};


import { Quote } from '@/services/supabase/quotes';
import { QuoteRepairItem, QuotePartItem, QuoteDiscountItem } from '../types';
import { safeNumber } from '@/lib/utils';

export const prepareSubmitData = (
  formData: Partial<Quote>,
  notes: string,
  claimNumber: string,
  repairs: QuoteRepairItem[],
  parts: QuotePartItem[],
  discounts: QuoteDiscountItem[]
) => {
  // Normaliser les réparations avant sauvegarde
  const normalizedRepairs = repairs.map(repair => ({
    ...repair,
    quantity: safeNumber(repair.quantity),
    unitCost: safeNumber(repair.unitCost),
    discount: safeNumber(repair.discount),
    vat: safeNumber(repair.vat || 20)
  }));

  // Normaliser les pièces avant sauvegarde
  const normalizedParts = parts.map(part => ({
    ...part,
    quantity: safeNumber(part.quantity),
    unitCost: safeNumber(part.unitCost),
    discount: safeNumber(part.discount),
    vat: safeNumber(part.vat || 20)
  }));

  return {
    ...formData,
    claim_number: claimNumber,
    repairs_data: JSON.stringify(normalizedRepairs),
    parts_data: JSON.stringify(normalizedParts),
    discounts_data: JSON.stringify(discounts),
    notes: notes,
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
      repairs: [],
      parts: [],
      discounts: []
    };
  }

  // Si c'est un objet JSON (ancien format), extraire les notes
  try {
    const noteData = JSON.parse(notesString);
    return {
      notes: noteData.notes || noteData.description || '',
      claimNumber: noteData.claimNumber || '',
      repairs: noteData.repairs || [],
      parts: noteData.parts || [],
      discounts: noteData.discounts || [] // Garder pour rétrocompatibilité
    };
  } catch (e) {
    // Si ce n'est pas du JSON, c'est probablement du texte brut (nouveau format)
    return {
      notes: notesString,
      claimNumber: '',
      repairs: [],
      parts: [],
      discounts: []
    };
  }
};

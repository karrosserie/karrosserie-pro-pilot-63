
import { Invoice } from '@/services/supabase/invoices';
import { InvoiceRepairItem, InvoicePartItem, InvoiceDiscountItem } from '../types';
import { safeNumber } from '@/lib/utils';

interface UseInvoiceDataPreparationProps {
  formData: Partial<Invoice>;
  claimNumber: string;
  repairs: InvoiceRepairItem[];
  parts: InvoicePartItem[];
  discounts: InvoiceDiscountItem[];
}

export const useInvoiceDataPreparation = ({
  formData,
  claimNumber,
  repairs,
  parts,
  discounts
}: UseInvoiceDataPreparationProps) => {
  const prepareSubmitData = () => {
    console.log('Preparing submit data with:', {
      formData,
      claimNumber,
      repairs,
      parts,
      discounts
    });

    // Normaliser les réparations avant sauvegarde
    const normalizedRepairs = (repairs || []).map(repair => ({
      ...repair,
      quantity: safeNumber(repair.quantity),
      unitCost: safeNumber(repair.unitCost),
      discount: safeNumber(repair.discount),
      vat: safeNumber(repair.vat || 20)
    }));

    // Normaliser les pièces avant sauvegarde
    const normalizedParts = (parts || []).map(part => ({
      ...part,
      quantity: safeNumber(part.quantity),
      unitCost: safeNumber(part.unitCost),
      discount: safeNumber(part.discount),
      vat: safeNumber(part.vat || 20)
    }));

    // Préparer les données selon le format attendu par la base de données
    const submitData = {
      ...formData,
      claim_number: claimNumber || '',
      repairs_data: normalizedRepairs,
      parts_data: normalizedParts,
      discounts_data: discounts || [],
      // S'assurer que les champs essentiels sont présents
      reference: formData.reference || '',
      client_id: formData.client_id || null,
      vehicle_id: formData.vehicle_id || null,
      status: formData.status || 'En attente de paiement',
      date: formData.date || '',
      due_date: formData.due_date || '',
      payment_details: formData.payment_details || '',
      // Inclure les nouveaux champs de rapport
      report_number: (formData as any).report_number || '',
      policy_number: (formData as any).policy_number || '',
      report_date: (formData as any).report_date || null,
      expert_name: (formData as any).expert_name || '',
      incident_date: (formData as any).incident_date || null
    };

    console.log('Final submit data:', submitData);
    return submitData;
  };

  return {
    prepareSubmitData
  };
};

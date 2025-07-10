
import { Invoice } from '@/services/supabase/invoices';
import { InvoiceRepairItem, InvoicePartItem, InvoiceDiscountItem } from '../types';

interface UseInvoiceDataPreparationProps {
  formData: Partial<Invoice>;
  description: string;
  claimNumber: string;
  currentMileage: string;
  repairs: InvoiceRepairItem[];
  parts: InvoicePartItem[];
  discounts: InvoiceDiscountItem[];
}

export const useInvoiceDataPreparation = ({
  formData,
  description,
  claimNumber,
  currentMileage,
  repairs,
  parts,
  discounts
}: UseInvoiceDataPreparationProps) => {
  const prepareSubmitData = () => {
    console.log('Preparing submit data with:', {
      formData,
      description,
      claimNumber,
      currentMileage,
      repairs,
      parts,
      discounts
    });

    // Préparer les données selon le format attendu par la base de données
    const submitData = {
      ...formData,
      description: description || '',
      claim_number: claimNumber || '',
      current_mileage: currentMileage || '',
      repairs_data: repairs || [],
      parts_data: parts || [],
      discounts_data: discounts || [],
      // S'assurer que les champs essentiels sont présents
      reference: formData.reference || '',
      client_id: formData.client_id || '',
      vehicle_id: formData.vehicle_id || '',
      status: formData.status || 'En attente de paiement',
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

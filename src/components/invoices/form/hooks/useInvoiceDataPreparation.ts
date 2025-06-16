
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
      discounts_data: discounts || []
    };

    console.log('Final submit data:', submitData);
    return submitData;
  };

  return {
    prepareSubmitData
  };
};

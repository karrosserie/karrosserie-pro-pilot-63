
import { RepairOrder } from '@/services/supabase/repair-orders';
import { RepairOrderRepairItem, RepairOrderPartItem, RepairOrderDiscountItem } from '../types';
import { repairOrdersService } from '@/services/supabase/repair-orders';

export const useDataPreparation = () => {
  const prepareSubmitData = (
    formData: Partial<RepairOrder>,
    description: string,
    claimNumber: string,
    currentMileage: string,
    repairs: RepairOrderRepairItem[],
    parts: RepairOrderPartItem[],
    discounts: RepairOrderDiscountItem[]
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

  const generateNextOrderNumber = async () => {
    try {
      const lastOrder = await repairOrdersService.getLastOrderByUser();
      const lastNumber = lastOrder?.reference ? parseInt(lastOrder.reference) : 0;
      return (lastNumber + 1).toString();
    } catch (error) {
      console.error('Error generating order number:', error);
      return '1';
    }
  };

  const parseOrderNotes = (notes: string) => {
    try {
      return JSON.parse(notes);
    } catch (e) {
      console.error('Error parsing order notes:', e);
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

  return {
    prepareSubmitData,
    generateNextOrderNumber,
    parseOrderNotes
  };
};

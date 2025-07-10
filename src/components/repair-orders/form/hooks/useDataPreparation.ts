
import { RepairOrder } from '@/services/supabase/repair-orders';
import { RepairOrderRepairItem, RepairOrderPartItem, RepairOrderDiscountItem } from '../types';
import { repairOrdersService } from '@/services/supabase/repair-orders';

export const useDataPreparation = () => {
  const prepareSubmitData = (
    formData: Partial<RepairOrder>,
    claimNumber: string,
    repairs: RepairOrderRepairItem[],
    parts: RepairOrderPartItem[],
    discounts: RepairOrderDiscountItem[]
  ) => {
    return {
      ...formData,
      claim_number: claimNumber || '',
      repairs_data: JSON.stringify(repairs) || '[]',
      parts_data: JSON.stringify(parts) || '[]',
      discounts_data: JSON.stringify(discounts) || '[]',
      report_number: formData.report_number,
      policy_number: formData.policy_number,
      report_date: formData.report_date,
      expert_name: formData.expert_name,
      incident_date: formData.incident_date
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

  const parseOrderData = (order: any) => {
    try {
      return {
        claimNumber: order.claim_number || '',
        repairs: order.repairs_data ? JSON.parse(order.repairs_data) : [],
        parts: order.parts_data ? JSON.parse(order.parts_data) : [],
        discounts: order.discounts_data ? JSON.parse(order.discounts_data) : []
      };
    } catch (e) {
      console.error('Error parsing order data:', e);
      return {
        claimNumber: '',
        repairs: [],
        parts: [],
        discounts: []
      };
    }
  };

  return {
    prepareSubmitData,
    generateNextOrderNumber,
    parseOrderData
  };
};


import { RepairOrder } from '@/services/supabase/repair-orders';
import { RepairOrderRepairItem, RepairOrderPartItem, RepairOrderDiscountItem } from '../types';

export interface UseRepairOrderFormLogicProps {
  order?: RepairOrder | null;
  prefillData?: any;
}

export interface RepairOrderFormState {
  formData: Partial<RepairOrder>;
  description: string;
  claimNumber: string;
  currentMileage: string;
  repairs: RepairOrderRepairItem[];
  parts: RepairOrderPartItem[];
  discounts: RepairOrderDiscountItem[];
  errors: Record<string, string>;
  isReadOnly: boolean;
}

export interface RepairOrderFormActions {
  setRepairs: (repairs: RepairOrderRepairItem[]) => void;
  setParts: (parts: RepairOrderPartItem[]) => void;
  setDiscounts: (discounts: RepairOrderDiscountItem[]) => void;
  handleChange: (field: string, value: any) => void;
  handleClaimNumberChange: (value: string) => void;
  handleCurrentMileageChange: (value: string) => void;
  validateForm: () => boolean;
  calculateGlobalTotals: () => any;
  prepareSubmitData: () => Partial<RepairOrder>;
}

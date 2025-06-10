
import { useState } from 'react';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { RepairOrderRepairItem, RepairOrderPartItem, RepairOrderDiscountItem } from '../types';

export const useFormState = () => {
  const [formData, setFormData] = useState<Partial<RepairOrder>>({
    reference: '',
    client_id: null,
    vehicle_id: null,
    status: 'En cours',
    start_date: null,
    end_date: null,
    estimated_hours: null,
    notes: ''
  });

  const [description, setDescription] = useState('');
  const [claimNumber, setClaimNumber] = useState('');
  const [currentMileage, setCurrentMileage] = useState('');
  const [repairs, setRepairs] = useState<RepairOrderRepairItem[]>([]);
  const [parts, setParts] = useState<RepairOrderPartItem[]>([]);
  const [discounts, setDiscounts] = useState<RepairOrderDiscountItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isReadOnly = formData.status === 'Terminé' || formData.status === 'Annulé';

  return {
    formData,
    setFormData,
    description,
    setDescription,
    claimNumber,
    setClaimNumber,
    currentMileage,
    setCurrentMileage,
    repairs,
    setRepairs,
    parts,
    setParts,
    discounts,
    setDiscounts,
    errors,
    setErrors,
    isReadOnly
  };
};

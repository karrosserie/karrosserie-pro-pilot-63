
import { useState } from 'react';
import { Invoice } from '@/services/supabase/invoices';
import { InvoiceRepairItem, InvoicePartItem, InvoiceDiscountItem } from '../types';

export const useInvoiceFormData = () => {
  const [formData, setFormData] = useState<Partial<Invoice>>({
    reference: '',
    client_id: '',
    vehicle_id: '',
    status: 'En attente de paiement',
    due_date: '',
    payment_details: ''
  });

  const [description, setDescription] = useState('');
  const [claimNumber, setClaimNumber] = useState('');
  const [currentMileage, setCurrentMileage] = useState('');
  const [repairs, setRepairs] = useState<InvoiceRepairItem[]>([]);
  const [parts, setParts] = useState<InvoicePartItem[]>([]);
  const [discounts, setDiscounts] = useState<InvoiceDiscountItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Déterminer si le formulaire est en lecture seule
  const isReadOnly = formData.status === 'Payée';

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

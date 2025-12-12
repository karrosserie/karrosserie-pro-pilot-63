
import { useState } from 'react';
import { Invoice } from '@/services/supabase/invoices';
import { InvoiceRepairItem, InvoicePartItem, InvoiceDiscountItem } from '../types';

export const useInvoiceFormData = () => {
  const [formData, setFormData] = useState<Partial<Invoice>>({
    reference: '',
    client_id: '',
    vehicle_id: '',
    status: 'En attente de paiement',
    date: '',
    due_date: '',
    payment_details: '',
    notes: ''
  });

  const [claimNumber, setClaimNumber] = useState('');
  const [repairs, setRepairs] = useState<InvoiceRepairItem[]>([]);
  const [parts, setParts] = useState<InvoicePartItem[]>([]);
  const [discounts, setDiscounts] = useState<InvoiceDiscountItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [skipVehicle, setSkipVehicle] = useState(false);

  // Permettre la modification de toutes les factures
  const isReadOnly = false;

  return {
    formData,
    setFormData,
    claimNumber,
    setClaimNumber,
    repairs,
    setRepairs,
    parts,
    setParts,
    discounts,
    setDiscounts,
    errors,
    setErrors,
    isReadOnly,
    skipVehicle,
    setSkipVehicle
  };
};

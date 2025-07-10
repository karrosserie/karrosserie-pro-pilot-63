
import { useState, useEffect } from 'react';
import { Invoice } from '@/services/supabase/invoices';
import { InvoiceRepairItem, InvoicePartItem, InvoiceDiscountItem } from '../types';

interface UseInvoiceFormStateProps {
  invoice?: Invoice | null;
}

export const useInvoiceFormState = ({ invoice }: UseInvoiceFormStateProps) => {
  const [formData, setFormData] = useState<Partial<Invoice>>({
    reference: '',
    client_id: null,
    vehicle_id: null,
    status: 'En attente de paiement',
    date: null,
    due_date: null,
    notes: ''
  });

  const [claimNumber, setClaimNumber] = useState('');
  const [repairs, setRepairs] = useState<InvoiceRepairItem[]>([]);
  const [parts, setParts] = useState<InvoicePartItem[]>([]);
  const [discounts, setDiscounts] = useState<InvoiceDiscountItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Déterminer si le formulaire est en lecture seule
  const isReadOnly = Boolean(invoice && formData.status === 'Envoyé');

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
    isReadOnly
  };
};

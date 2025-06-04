
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
    due_date: null,
    payment_method: null,
    notes: ''
  });

  const [description, setDescription] = useState('');
  const [claimNumber, setClaimNumber] = useState('');
  const [currentMileage, setCurrentMileage] = useState('');
  const [repairs, setRepairs] = useState<InvoiceRepairItem[]>([]);
  const [parts, setParts] = useState<InvoicePartItem[]>([]);
  const [discounts, setDiscounts] = useState<InvoiceDiscountItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Déterminer si le formulaire est en lecture seule
  const isReadOnly = Boolean(invoice && (formData.payment_date !== null || formData.status === 'Envoyé'));

  console.log('isReadOnly calculation:', {
    hasInvoice: !!invoice,
    payment_date: formData.payment_date,
    status: formData.status,
    isReadOnly
  });

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

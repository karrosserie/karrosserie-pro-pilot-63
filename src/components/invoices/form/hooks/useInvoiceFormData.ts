
import { useState, useCallback } from 'react';
import { Invoice } from '@/services/supabase/invoices';
import { InvoiceRepairItem, InvoicePartItem, InvoiceDiscountItem } from '../types';

export const useInvoiceFormData = () => {
  const [formData, setFormDataInternal] = useState<Partial<Invoice>>({
    reference: '',
    client_id: '',
    vehicle_id: '',
    status: 'En attente de paiement',
    date: '',
    due_date: '',
    payment_details: '',
    notes: ''
  });

  const [claimNumber, setClaimNumberInternal] = useState('');
  const [repairs, setRepairsInternal] = useState<InvoiceRepairItem[]>([]);
  const [parts, setPartsInternal] = useState<InvoicePartItem[]>([]);
  const [discounts, setDiscountsInternal] = useState<InvoiceDiscountItem[]>([]);
  const [errors, setErrorsInternal] = useState<Record<string, string>>({});
  const [skipVehicle, setSkipVehicleInternal] = useState(false);

  // Setters stabilisés avec useCallback pour éviter les boucles infinies
  const setFormData = useCallback((value: React.SetStateAction<Partial<Invoice>>) => {
    setFormDataInternal(value);
  }, []);

  const setClaimNumber = useCallback((value: React.SetStateAction<string>) => {
    setClaimNumberInternal(value);
  }, []);

  const setRepairs = useCallback((value: React.SetStateAction<InvoiceRepairItem[]>) => {
    setRepairsInternal(value);
  }, []);

  const setParts = useCallback((value: React.SetStateAction<InvoicePartItem[]>) => {
    setPartsInternal(value);
  }, []);

  const setDiscounts = useCallback((value: React.SetStateAction<InvoiceDiscountItem[]>) => {
    setDiscountsInternal(value);
  }, []);

  const setErrors = useCallback((value: React.SetStateAction<Record<string, string>>) => {
    setErrorsInternal(value);
  }, []);

  const setSkipVehicle = useCallback((value: React.SetStateAction<boolean>) => {
    setSkipVehicleInternal(value);
  }, []);

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

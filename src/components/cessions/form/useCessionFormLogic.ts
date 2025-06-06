
import { useState, useEffect } from 'react';
import { Cession } from '@/services/supabase/cessions';
import { CessionFormData, CessionFormErrors } from './types';

interface UseCessionFormLogicProps {
  cession?: Cession | null;
}

export const useCessionFormLogic = ({ cession }: UseCessionFormLogicProps) => {
  const [formData, setFormData] = useState<CessionFormData>({
    reference: '',
    vehicle_id: null,
    buyer_name: '',
    buyer_contact: '',
    sale_amount: 0,
    sale_date: new Date().toISOString().split('T')[0],
    status: 'en_attente',
    notes: ''
  });

  const [errors, setErrors] = useState<CessionFormErrors>({});

  // Determiner si c'est en lecture seule
  const isReadOnly = cession?.status === 'payee';

  useEffect(() => {
    if (cession) {
      setFormData({
        reference: cession.reference || '',
        vehicle_id: cession.vehicle_id || null,
        buyer_name: cession.buyer_name || '',
        buyer_contact: cession.buyer_contact || '',
        sale_amount: Number(cession.sale_amount) || 0,
        sale_date: cession.sale_date || new Date().toISOString().split('T')[0],
        status: (cession.status as any) || 'en_attente',
        notes: cession.notes || ''
      });
    }
  }, [cession]);

  const handleChange = (field: keyof CessionFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: CessionFormErrors = {};

    if (!formData.reference.trim()) {
      newErrors.reference = 'La référence est obligatoire';
    }

    if (!formData.vehicle_id) {
      newErrors.vehicle_id = 'Le véhicule est obligatoire';
    }

    if (!formData.buyer_name.trim()) {
      newErrors.buyer_name = 'Le nom de l\'acheteur est obligatoire';
    }

    if (!formData.buyer_contact.trim()) {
      newErrors.buyer_contact = 'Le contact de l\'acheteur est obligatoire';
    }

    if (!formData.sale_amount || formData.sale_amount <= 0) {
      newErrors.sale_amount = 'Le montant de vente doit être supérieur à 0';
    }

    if (!formData.sale_date) {
      newErrors.sale_date = 'La date de vente est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const prepareSubmitData = (): Partial<Cession> => {
    return {
      reference: formData.reference,
      vehicle_id: formData.vehicle_id,
      buyer_name: formData.buyer_name,
      buyer_contact: formData.buyer_contact,
      sale_amount: formData.sale_amount,
      sale_date: formData.sale_date,
      status: formData.status,
      notes: formData.notes
    };
  };

  return {
    formData,
    errors,
    isReadOnly,
    handleChange,
    validateForm,
    prepareSubmitData
  };
};

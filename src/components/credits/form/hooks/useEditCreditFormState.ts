
import { useState, useEffect } from 'react';
import { CreditFormData, CreditItem } from '../types';

interface UseEditCreditFormStateProps {
  initialData?: {
    reference: string;
    client_id: string | null;
    vehicle_id: string | null;
    invoice_id: string | null;
    status: 'En attente' | 'Payé';
    notes?: string;
    items?: CreditItem[];
  };
}

export const useEditCreditFormState = ({ initialData }: UseEditCreditFormStateProps) => {
  const [formData, setFormData] = useState<CreditFormData>({
    reference: initialData?.reference || '',
    client_id: initialData?.client_id || null,
    vehicle_id: initialData?.vehicle_id || null,
    invoice_id: initialData?.invoice_id || null,
    status: initialData?.status || 'En attente',
    notes: initialData?.notes || ''
  });

  const [items, setItems] = useState<CreditItem[]>(initialData?.items || []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof CreditFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addItem = () => {
    const newItem: CreditItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unit_price: 0,
      discount: 0,
      vat: 20,
      total: 0
    };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: string, field: keyof CreditItem, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Calculate total with discount and VAT
        const subtotal = updatedItem.quantity * updatedItem.unit_price;
        const discountAmount = subtotal * (updatedItem.discount / 100);
        const afterDiscount = subtotal - discountAmount;
        const vatAmount = afterDiscount * (updatedItem.vat / 100);
        updatedItem.total = afterDiscount + vatAmount;
        return updatedItem;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  return {
    formData,
    items,
    errors,
    handleChange,
    addItem,
    updateItem,
    removeItem,
    calculateTotal,
    setErrors
  };
};

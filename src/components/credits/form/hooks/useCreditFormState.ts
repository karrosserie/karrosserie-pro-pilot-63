
import { useState, useEffect } from 'react';
import { CreditFormData, CreditItem } from '../types';
import { creditsService } from '@/services/supabase/credits';

export const useCreditFormState = () => {
  const [formData, setFormData] = useState<CreditFormData>({
    reference: '',
    invoice_id: null,
    status: 'En attente',
    notes: ''
  });

  const [items, setItems] = useState<CreditItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-générer la référence au chargement
  useEffect(() => {
    const generateReference = async () => {
      try {
        const reference = await creditsService.generateReference();
        setFormData(prev => ({ ...prev, reference }));
      } catch (error) {
        console.error('Error generating reference:', error);
        const currentYear = new Date().getFullYear();
        setFormData(prev => ({ ...prev, reference: `AV${currentYear}-001` }));
      }
    };

    generateReference();
  }, []);

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
    setErrors,
    setFormData
  };
};

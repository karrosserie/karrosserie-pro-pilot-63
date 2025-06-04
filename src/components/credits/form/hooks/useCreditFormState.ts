
import { useState, useEffect } from 'react';
import { CreditFormData, CreditItem } from '../types';
import { creditsService } from '@/services/supabase/credits';

export const useCreditFormState = () => {
  const [formData, setFormData] = useState<CreditFormData>({
    reference: '',
    client_id: null,
    vehicle_id: null,
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
        const lastCredit = await creditsService.getLastCreditByUser();
        let nextNumber = 1;
        
        if (lastCredit && lastCredit.reference) {
          const lastNumber = parseInt(lastCredit.reference);
          if (!isNaN(lastNumber)) {
            nextNumber = lastNumber + 1;
          }
        }
        
        setFormData(prev => ({ ...prev, reference: nextNumber.toString() }));
      } catch (error) {
        console.error('Error generating reference:', error);
        setFormData(prev => ({ ...prev, reference: '1' }));
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
      total: 0
    };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: string, field: keyof CreditItem, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unit_price') {
          updatedItem.total = updatedItem.quantity * updatedItem.unit_price;
        }
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

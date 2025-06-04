
import { useState } from 'react';
import { CreditFormData, CreditItem } from '../types';

export const useCreditFormState = () => {
  const [formData, setFormData] = useState<CreditFormData>({
    reference: '',
    client_id: null,
    vehicle_id: null,
    original_invoice_id: null,
    original_invoice_reference: '',
    amount: 0,
    reason: '',
    status: 'En attente',
    notes: ''
  });

  const [items, setItems] = useState<CreditItem[]>([]);
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

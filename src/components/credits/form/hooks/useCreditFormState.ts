
import { useState, useEffect } from 'react';
import { CreditFormData, CreditItem } from '../types';

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
        // Pour l'instant, on génère une référence simple basée sur la date
        const timestamp = Date.now();
        const reference = (timestamp % 10000).toString();
        setFormData(prev => ({ ...prev, reference }));
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

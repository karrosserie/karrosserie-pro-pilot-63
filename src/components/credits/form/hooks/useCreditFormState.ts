import { useState, useEffect, useCallback, useMemo } from 'react';
import { CreditFormData, CreditItem } from '../types';
import { creditsService } from '@/services/supabase/credits';

export const useCreditFormState = () => {
  const [formData, setFormData] = useState<CreditFormData>({
    reference: '',
    invoice_id: null,
    status: 'En attente',
    notes: '',
    is_franchise_credit: false
  });

  const [items, setItems] = useState<CreditItem[]>([
    {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unit_price: 0,
      discount: 0,
      vat: 20,
      total: 0,
      total_ttc: 0
    }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-générer la référence au chargement
  useEffect(() => {
    const generateReference = async () => {
      try {
        const reference = await creditsService.generateReference();
        setFormData(prev => ({ ...prev, reference }));
      } catch (error) {
        const currentYear = new Date().getFullYear();
        setFormData(prev => ({ ...prev, reference: `AV${currentYear}-001` }));
      }
    };

    generateReference();
  }, []);

  const handleChange = useCallback((field: keyof CreditFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      if (prev[field]) {
        return { ...prev, [field]: '' };
      }
      return prev;
    });
  }, []);

  const addItem = useCallback(() => {
    const newItem: CreditItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unit_price: 0,
      discount: 0,
      vat: 20,
      total: 0,
      total_ttc: 0
    };
    setItems(prev => [...prev, newItem]);
  }, []);

  const updateItem = useCallback((id: string, field: keyof CreditItem, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Calcul inverse : du TTC vers le HT
        // TTC = HT * (1 + TVA/100) après remise
        // HT après remise = TTC / (1 + TVA/100)
        // HT avant remise = HT après remise / (1 - remise/100)
        // Prix unitaire = HT avant remise / quantité
        const ttc = updatedItem.total_ttc;
        const vatMultiplier = 1 + (updatedItem.vat / 100);
        const htAfterDiscount = ttc / vatMultiplier;
        const discountMultiplier = 1 - (updatedItem.discount / 100);
        const htBeforeDiscount = discountMultiplier > 0 ? htAfterDiscount / discountMultiplier : 0;
        const unitPrice = updatedItem.quantity > 0 ? htBeforeDiscount / updatedItem.quantity : 0;
        
        updatedItem.unit_price = unitPrice;
        updatedItem.total = ttc; // Le total est le TTC saisi
        
        return updatedItem;
      }
      return item;
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const calculateTotal = useMemo(() => 
    items.reduce((sum, item) => sum + item.total, 0),
    [items]
  );

  return {
    formData,
    items,
    errors,
    handleChange,
    addItem,
    updateItem,
    removeItem,
    calculateTotal: () => calculateTotal,
    setErrors,
    setFormData
  };
};

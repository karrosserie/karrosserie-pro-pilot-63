
import { useState, useEffect } from 'react';
import { Quote } from '@/services/supabase/quotes';
import { QuoteRepairItem, QuotePartItem, GlobalTotals } from './types';

interface UseQuoteFormLogicProps {
  quote?: Quote | null;
}

export const useQuoteFormLogic = ({ quote }: UseQuoteFormLogicProps) => {
  const [formData, setFormData] = useState<Partial<Quote>>({
    reference: '',
    client_id: '',
    vehicle_id: '',
    status: 'En attente',
    valid_until: '',
    notes: ''
  });

  const [description, setDescription] = useState('');
  const [repairs, setRepairs] = useState<QuoteRepairItem[]>([]);
  const [parts, setParts] = useState<QuotePartItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Déterminer si le formulaire est en lecture seule
  const isReadOnly = formData.status === 'Accepté' || formData.status === 'Refusé';

  // Calculer les totaux globaux
  const calculateGlobalTotals = (): GlobalTotals => {
    const repairTotals = repairs.reduce((acc, repair) => {
      const subtotal = repair.quantity * repair.unitCost;
      const discountAmount = subtotal * (repair.discount / 100);
      const afterDiscount = subtotal - discountAmount;
      const vatAmount = afterDiscount * (repair.vat / 100);
      
      return {
        subTotal: acc.subTotal + subtotal,
        totalVat: acc.totalVat + vatAmount,
        totalDiscount: acc.totalDiscount + discountAmount,
        total: acc.total + repair.total
      };
    }, { subTotal: 0, totalVat: 0, totalDiscount: 0, total: 0 });

    const partTotals = parts.reduce((acc, part) => {
      const subtotal = part.quantity * part.unitCost;
      const discountAmount = subtotal * (part.discount / 100);
      const afterDiscount = subtotal - discountAmount;
      const vatAmount = afterDiscount * (part.vat / 100);
      
      return {
        subTotal: acc.subTotal + subtotal,
        totalVat: acc.totalVat + vatAmount,
        totalDiscount: acc.totalDiscount + discountAmount,
        total: acc.total + part.total
      };
    }, { subTotal: 0, totalVat: 0, totalDiscount: 0, total: 0 });

    return {
      subTotal: repairTotals.subTotal + partTotals.subTotal,
      totalVat: repairTotals.totalVat + partTotals.totalVat,
      totalDiscount: repairTotals.totalDiscount + partTotals.totalDiscount,
      total: repairTotals.total + partTotals.total
    };
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.reference?.trim()) {
      newErrors.reference = 'La référence du devis est obligatoire';
    }
    
    if (!formData.client_id) {
      newErrors.client_id = 'Le client est obligatoire';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    if (isReadOnly && field !== 'status') {
      return; // Empêcher les modifications si en lecture seule
    }
    
    if (field === 'description') {
      setDescription(value);
    } else {
      setFormData(prev => {
        // Si on change de client et qu'on n'est pas en train d'éditer un devis existant
        if (field === 'client_id' && !quote) {
          return { ...prev, [field]: value, vehicle_id: '' };
        }
        return { ...prev, [field]: value };
      });
    }
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Fonction pour préparer les données à soumettre
  const prepareSubmitData = () => {
    const notesData = {
      description,
      repairs,
      parts
    };
    
    return {
      ...formData,
      notes: JSON.stringify(notesData)
    };
  };

  useEffect(() => {
    if (quote) {
      setFormData({
        reference: quote.reference,
        client_id: quote.client_id,
        vehicle_id: quote.vehicle_id || '',
        status: quote.status || 'En attente',
        valid_until: quote.valid_until,
        notes: quote.notes || ''
      });
      
      // Charger les données depuis les notes (format JSON)
      if (quote.notes) {
        try {
          const noteData = JSON.parse(quote.notes);
          setDescription(noteData.description || '');
          if (noteData.repairs) {
            setRepairs(noteData.repairs);
          }
          if (noteData.parts) {
            setParts(noteData.parts);
          }
        } catch (e) {
          console.error('Error parsing quote notes:', e);
          setDescription('');
          setRepairs([]);
          setParts([]);
        }
      } else {
        setDescription('');
        setRepairs([]);
        setParts([]);
      }
    } else {
      // Générer une référence automatique pour un nouveau devis
      const currentYear = new Date().getFullYear();
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      setFormData(prev => ({
        ...prev,
        reference: `D-${currentYear}-${randomNumber}`
      }));
      setDescription('');
    }
  }, [quote]);

  return {
    formData,
    description,
    repairs,
    parts,
    errors,
    isReadOnly,
    setRepairs,
    setParts,
    handleChange,
    validateForm,
    calculateGlobalTotals,
    prepareSubmitData
  };
};

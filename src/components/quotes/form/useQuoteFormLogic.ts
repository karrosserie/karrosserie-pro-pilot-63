import { useState, useEffect } from 'react';
import { Quote } from '@/services/supabase/quotes';
import { QuoteRepairItem, QuotePartItem, QuoteDiscountItem, GlobalTotals } from './types';
import { quotesService } from '@/services/supabase/quotes';

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

  const [notes, setNotes] = useState('');
  const [claimNumber, setClaimNumber] = useState('');
  const [currentMileage, setCurrentMileage] = useState('');
  const [repairs, setRepairs] = useState<QuoteRepairItem[]>([]);
  const [parts, setParts] = useState<QuotePartItem[]>([]);
  const [discounts, setDiscounts] = useState<QuoteDiscountItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Déterminer si le formulaire est en lecture seule
  const isReadOnly = formData.status === 'Facturé' || formData.status === 'Refusé' || formData.status === 'Annulé';

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

    // Calculer le total des remises additionnelles
    const additionalDiscounts = discounts.reduce((sum, discount) => sum + discount.amount, 0);

    return {
      subTotal: repairTotals.subTotal + partTotals.subTotal,
      totalVat: repairTotals.totalVat + partTotals.totalVat,
      totalDiscount: repairTotals.totalDiscount + partTotals.totalDiscount + additionalDiscounts,
      total: repairTotals.total + partTotals.total - additionalDiscounts
    };
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    console.log('Starting validation with:', { formData, claimNumber, currentMileage });
    
    if (!formData.reference?.trim()) {
      newErrors.reference = 'Le numéro du devis est obligatoire';
      console.log('Reference error detected');
    }
    
    if (!formData.client_id) {
      newErrors.client_id = 'Le client est obligatoire';
      console.log('Client error detected');
    }

    if (!formData.valid_until) {
      newErrors.valid_until = 'La date de validité est obligatoire';
      console.log('Valid until error detected');
    }

    // Validation pour les nouveaux champs - ajout de règles plus strictes pour forcer l'erreur
    if (claimNumber && claimNumber.trim().length > 0 && claimNumber.trim().length < 3) {
      newErrors.claim_number = 'Le numéro de sinistre doit contenir au moins 3 caractères';
      console.log('Claim number error detected:', claimNumber);
    }

    if (currentMileage && currentMileage.trim().length > 0) {
      const mileageNum = parseInt(currentMileage);
      if (isNaN(mileageNum) || mileageNum < 0 || mileageNum > 999999) {
        newErrors.current_mileage = 'Le kilométrage doit être un nombre entre 0 et 999999 km';
        console.log('Current mileage error detected:', currentMileage);
      }
    }
    
    console.log('Validation complete. New errors:', newErrors);
    
    // Mettre à jour les erreurs de façon synchrone
    setErrors(newErrors);
    
    // Retourner les erreurs directement pour usage immédiat
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const handleChange = (field: string, value: any) => {
    if (isReadOnly && field !== 'status') {
      return; // Empêcher les modifications si en lecture seule
    }
    
    if (field === 'notes') {
      setNotes(value);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClaimNumberChange = (value: string) => {
    if (!isReadOnly) {
      setClaimNumber(value);
      console.log('Claim number changed to:', value);
      // Effacer l'erreur quand l'utilisateur modifie le champ
      if (errors.claim_number) {
        setErrors(prev => ({ ...prev, claim_number: '' }));
      }
    }
  };

  const handleCurrentMileageChange = (value: string) => {
    if (!isReadOnly) {
      setCurrentMileage(value);
      console.log('Current mileage changed to:', value);
      // Effacer l'erreur quand l'utilisateur modifie le champ
      if (errors.current_mileage) {
        setErrors(prev => ({ ...prev, current_mileage: '' }));
      }
    }
  };

  // Fonction pour préparer les données à soumettre
  const prepareSubmitData = () => {
    const notesData = {
      notes,
      claimNumber,
      currentMileage,
      repairs,
      parts,
      discounts
    };
    
    return {
      ...formData,
      notes: JSON.stringify(notesData)
    };
  };

  // Fonction pour générer le prochain numéro de devis
  const generateNextQuoteNumber = async () => {
    try {
      const lastQuote = await quotesService.getLastQuoteByUser();
      const lastNumber = lastQuote?.reference ? parseInt(lastQuote.reference) : 0;
      return (lastNumber + 1).toString();
    } catch (error) {
      console.error('Error generating quote number:', error);
      return '1';
    }
  };

  useEffect(() => {
    if (quote) {
      setFormData({
        reference: quote.reference,
        client_id: quote.client_id,
        vehicle_id: quote.vehicle_id,
        status: quote.status || 'En attente',
        valid_until: quote.valid_until,
        notes: quote.notes || ''
      });
      
      // Charger les données depuis les notes (format JSON)
      if (quote.notes) {
        try {
          const noteData = JSON.parse(quote.notes);
          setNotes(noteData.notes || noteData.description || '');
          setClaimNumber(noteData.claimNumber || '');
          setCurrentMileage(noteData.currentMileage || '');
          if (noteData.repairs) {
            setRepairs(noteData.repairs);
          }
          if (noteData.parts) {
            setParts(noteData.parts);
          }
          if (noteData.discounts) {
            setDiscounts(noteData.discounts);
          }
        } catch (e) {
          console.error('Error parsing quote notes:', e);
          setNotes('');
          setClaimNumber('');
          setCurrentMileage('');
          setRepairs([]);
          setParts([]);
          setDiscounts([]);
        }
      } else {
        setNotes('');
        setClaimNumber('');
        setCurrentMileage('');
        setRepairs([]);
        setParts([]);
        setDiscounts([]);
      }
    } else {
      // Pour un nouveau devis, définir la date du jour
      const today = new Date().toISOString().split('T')[0];
      
      // Générer un numéro automatique pour un nouveau devis
      generateNextQuoteNumber().then(nextNumber => {
        setFormData(prev => ({
          ...prev,
          reference: nextNumber,
          valid_until: today
        }));
      });
      setNotes('');
      setClaimNumber('');
      setCurrentMileage('');
    }
  }, [quote]);

  return {
    formData,
    notes,
    claimNumber,
    currentMileage,
    repairs,
    parts,
    discounts,
    errors,
    isReadOnly,
    setRepairs,
    setParts,
    setDiscounts,
    handleChange,
    handleClaimNumberChange,
    handleCurrentMileageChange,
    validateForm,
    calculateGlobalTotals,
    prepareSubmitData
  };
};

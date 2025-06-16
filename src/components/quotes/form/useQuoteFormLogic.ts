
import { useState, useEffect } from 'react';
import { Quote } from '@/services/supabase/quotes';
import { QuoteRepairItem, QuotePartItem, QuoteDiscountItem } from './types';
import { validateQuoteForm } from './utils/validation';
import { calculateGlobalTotals } from './utils/calculations';
import { prepareSubmitData, parseQuoteNotes } from './utils/formState';
import { generateNextQuoteNumber } from './utils/quoteNumber';

interface UseQuoteFormLogicProps {
  quote?: Quote | null;
  prefillData?: any;
}

export const useQuoteFormLogic = ({ quote, prefillData }: UseQuoteFormLogicProps) => {
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

  const validateForm = () => {
    const validationResult = validateQuoteForm(formData, claimNumber, currentMileage);
    setErrors(validationResult.errors);
    return validationResult;
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
      const parsedData = parseQuoteNotes(quote.notes);
      setNotes(parsedData.notes);
      setClaimNumber(parsedData.claimNumber);
      setCurrentMileage(parsedData.currentMileage);
      setRepairs(parsedData.repairs);
      setParts(parsedData.parts);
      setDiscounts(parsedData.discounts);
    } else {
      // Pour un nouveau devis, définir la date du jour
      const today = new Date().toISOString().split('T')[0];
      
      // Générer un numéro automatique pour un nouveau devis
      generateNextQuoteNumber().then(nextNumber => {
        setFormData(prev => ({
          ...prev,
          reference: nextNumber,
          valid_until: today,
          // Appliquer les données de pré-remplissage si disponibles
          ...(prefillData && {
            client_id: prefillData.client_id || '',
            vehicle_id: prefillData.vehicle_id || ''
          })
        }));
      });
      setNotes('');
      setClaimNumber('');
      setCurrentMileage('');
    }
  }, [quote, prefillData]);

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
    calculateGlobalTotals: () => calculateGlobalTotals(repairs, parts, discounts),
    prepareSubmitData: () => prepareSubmitData(formData, notes, claimNumber, currentMileage, repairs, parts, discounts)
  };
};

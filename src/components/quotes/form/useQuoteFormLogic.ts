
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
  const [formData, setFormData] = useState<Partial<Quote>>(() => {
    // Initialiser immédiatement avec les données préfillées si disponibles
    const initialData = {
      reference: '',
      client_id: undefined,
      vehicle_id: undefined,
      status: 'En attente',
      valid_until: '',
      notes: ''
    };
    
    // Appliquer les données de pré-remplissage immédiatement
    if (prefillData) {
      return {
        ...initialData,
        client_id: prefillData.client_id || undefined,
        vehicle_id: prefillData.vehicle_id || undefined,
        report_id: prefillData.report_id || undefined,
        report_number: prefillData.report_number || '',
        policy_number: prefillData.policy_number || '',
        report_date: prefillData.report_date || '',
        expert_name: prefillData.expert_name || '',
        incident_date: prefillData.incident_date || ''
      };
    }
    
    return initialData;
  });

  const [notes, setNotes] = useState('');
  const [claimNumber, setClaimNumber] = useState('');
  const [repairs, setRepairs] = useState<QuoteRepairItem[]>([]);
  const [parts, setParts] = useState<QuotePartItem[]>([]);
  const [discounts, setDiscounts] = useState<QuoteDiscountItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Déterminer si le formulaire est en lecture seule
  const isReadOnly = formData.status === 'Facturé' || formData.status === 'Refusé' || formData.status === 'Annulé';

  const validateForm = () => {
    const validationResult = validateQuoteForm(formData, claimNumber);
    setErrors(validationResult.errors);
    return validationResult;
  };

  const handleChange = (field: string, value: any) => {
    if (isReadOnly && field !== 'status') {
      return; // Empêcher les modifications si en lecture seule
    }
    
    console.log(`QuoteFormLogic - handleChange called with field: ${field}, value:`, value);
    
    if (field === 'notes') {
      setNotes(value);
    } else {
      setFormData(prev => {
        const newFormData = { ...prev, [field]: value };
        console.log('QuoteFormLogic - Updated formData:', newFormData);
        return newFormData;
      });
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


  useEffect(() => {
    if (quote) {
      setFormData({
        reference: quote.reference,
        client_id: quote.client_id,
        vehicle_id: quote.vehicle_id,
        status: quote.status || 'En attente',
        valid_until: quote.valid_until,
        notes: quote.notes || '',
        // Inclure les nouveaux champs
        report_id: (quote as any).report_id || '',
        report_number: (quote as any).report_number || '',
        policy_number: (quote as any).policy_number || '',
        report_date: (quote as any).report_date || '',
        expert_name: (quote as any).expert_name || '',
        incident_date: (quote as any).incident_date || ''
      });
      
      // Charger les données depuis les nouveaux champs dédiés
      let repairsData = [];
      let partsData = [];
      
      if ((quote as any).repairs_data) {
        try {
          repairsData = JSON.parse((quote as any).repairs_data);
        } catch (error) {
          console.error('Error parsing repairs_data:', error);
        }
      }
      
      if ((quote as any).parts_data) {
        try {
          partsData = JSON.parse((quote as any).parts_data);
        } catch (error) {
          console.error('Error parsing parts_data:', error);
        }
      }
      
      // Charger les remises depuis le nouveau champ dédié  
      let discountsData = [];
      if ((quote as any).discounts_data) {
        try {
          discountsData = JSON.parse((quote as any).discounts_data);
        } catch (error) {
          console.error('Error parsing discounts_data:', error);
        }
      }
      
      // Charger les données depuis les notes (pour rétrocompatibilité des discounts)
      const parsedData = parseQuoteNotes(quote.notes);
      setNotes(parsedData.notes);
      setClaimNumber((quote as any).claim_number || parsedData.claimNumber || '');
      setRepairs(repairsData.length > 0 ? repairsData : parsedData.repairs);
      setParts(partsData.length > 0 ? partsData : parsedData.parts);
      setDiscounts(discountsData.length > 0 ? discountsData : parsedData.discounts);
    } else {
      // Pour un nouveau devis, définir la date du jour
      const today = new Date().toISOString().split('T')[0];
      
      // Générer un numéro automatique pour un nouveau devis
      generateNextQuoteNumber().then(nextNumber => {
        setFormData(prev => ({
          ...prev,
          reference: nextNumber,
          valid_until: today
          // Les données préfillées sont déjà appliquées à l'initialisation
        }));
      });
      
      // Appliquer également les données de réparations et pièces depuis prefillData
      if (prefillData?.repairs_data) {
        try {
          const repairsData = typeof prefillData.repairs_data === 'string' 
            ? JSON.parse(prefillData.repairs_data) 
            : prefillData.repairs_data;
          setRepairs(repairsData);
        } catch (error) {
          console.error('Error parsing prefilled repairs_data:', error);
        }
      }
      
      if (prefillData?.parts_data) {
        try {
          const partsData = typeof prefillData.parts_data === 'string' 
            ? JSON.parse(prefillData.parts_data) 
            : prefillData.parts_data;
          setParts(partsData);
        } catch (error) {
          console.error('Error parsing prefilled parts_data:', error);
        }
      }

      // Charger les remises globales depuis prefillData
      if (prefillData?.global_discount_data) {
        try {
          const discountsData = typeof prefillData.global_discount_data === 'string' 
            ? JSON.parse(prefillData.global_discount_data) 
            : prefillData.global_discount_data;
          setDiscounts(discountsData);
        } catch (error) {
          console.error('Error parsing prefilled global_discount_data:', error);
        }
      }
      
      if (prefillData?.claim_number) {
        setClaimNumber(prefillData.claim_number);
      }
      
      setNotes('');
      if (!prefillData?.claim_number) {
        setClaimNumber('');
      }
    }
  }, [quote, prefillData]);

  return {
    formData,
    notes,
    claimNumber,
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
    validateForm,
    calculateGlobalTotals: () => calculateGlobalTotals(repairs, parts, discounts),
    prepareSubmitData: () => prepareSubmitData(formData, notes, claimNumber, repairs, parts, discounts)
  };
};

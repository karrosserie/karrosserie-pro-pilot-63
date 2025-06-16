
import { useState, useEffect } from 'react';
import { Invoice } from '@/services/supabase/invoices';
import { InvoiceRepairItem, InvoicePartItem, InvoiceDiscountItem } from './types';
import { validateInvoiceForm } from './utils/validation';
import { calculateGlobalTotals } from './hooks/useInvoiceCalculations';
import { prepareSubmitData, parseInvoiceNotes, generateNextInvoiceNumber } from './utils/invoiceFormUtils';

interface UseInvoiceFormLogicProps {
  invoice?: Invoice | null;
}

export const useInvoiceFormLogic = ({ invoice }: UseInvoiceFormLogicProps) => {
  const [formData, setFormData] = useState<Partial<Invoice>>({
    reference: '',
    client_id: '',
    vehicle_id: '',
    status: 'En attente de paiement',
    due_date: '',
    payment_details: ''
  });

  const [description, setDescription] = useState('');
  const [claimNumber, setClaimNumber] = useState('');
  const [currentMileage, setCurrentMileage] = useState('');
  const [repairs, setRepairs] = useState<InvoiceRepairItem[]>([]);
  const [parts, setParts] = useState<InvoicePartItem[]>([]);
  const [discounts, setDiscounts] = useState<InvoiceDiscountItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Déterminer si le formulaire est en lecture seule
  const isReadOnly = formData.status === 'Payée';

  const validateForm = () => {
    const validationResult = validateInvoiceForm(formData, claimNumber, currentMileage);
    setErrors(validationResult.errors);
    return validationResult.isValid;
  };

  const handleChange = (field: string, value: any) => {
    if (isReadOnly && field !== 'status') {
      return;
    }
    
    if (field === 'description') {
      setDescription(value);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClaimNumberChange = (value: string) => {
    if (!isReadOnly) {
      setClaimNumber(value);
      if (errors.claim_number) {
        setErrors(prev => ({ ...prev, claim_number: '' }));
      }
    }
  };

  const handleCurrentMileageChange = (value: string) => {
    if (!isReadOnly) {
      setCurrentMileage(value);
      if (errors.current_mileage) {
        setErrors(prev => ({ ...prev, current_mileage: '' }));
      }
    }
  };

  // Fonction pour préparer les données de soumission
  const prepareInvoiceSubmitData = () => {
    console.log('Preparing submit data with:', {
      formData,
      description,
      claimNumber,
      currentMileage,
      repairs,
      parts,
      discounts
    });

    return {
      ...formData,
      description,
      claim_number: claimNumber,
      current_mileage: currentMileage,
      repairs_data: repairs,
      parts_data: parts,
      discounts_data: discounts
    };
  };

  useEffect(() => {
    const initializeForm = async () => {
      console.log('Invoice form initializing with invoice:', invoice);
      
      // Vérifier si c'est une facture existante (avec un ID) ou une nouvelle facture
      const isExistingInvoice = invoice && invoice.id;
      
      if (isExistingInvoice) {
        console.log('Existing invoice, setting form data with reference:', invoice.reference);
        setFormData({
          reference: invoice.reference,
          client_id: invoice.client_id,
          vehicle_id: invoice.vehicle_id,
          status: invoice.status || 'En attente de paiement',
          due_date: invoice.due_date,
          payment_details: invoice.payment_details || ''
        });
        
        const parsedData = parseInvoiceNotes(invoice.notes || '');
        setDescription(parsedData.description);
        setClaimNumber(parsedData.claimNumber);
        setCurrentMileage(parsedData.currentMileage);
        setRepairs(parsedData.repairs);
        setParts(parsedData.parts);
        setDiscounts(parsedData.discounts);
      } else {
        console.log('New invoice or prefilled data, generating number...');
        // Pour une nouvelle facture, générer automatiquement le numéro
        const today = new Date().toISOString().split('T')[0];
        
        try {
          const nextNumber = await generateNextInvoiceNumber();
          console.log('Generated invoice number:', nextNumber);
          
          setFormData({
            reference: nextNumber,
            client_id: invoice?.client_id || '',
            vehicle_id: invoice?.vehicle_id || '',
            repair_order_id: invoice?.repair_order_id || null,
            status: 'En attente de paiement',
            due_date: today,
            payment_details: ''
          });
          
          // Si des notes sont fournies (depuis un ordre de réparation), les parser
          if (invoice?.notes) {
            console.log('Parsing notes from repair order:', invoice.notes);
            const parsedData = parseInvoiceNotes(invoice.notes);
            setDescription(parsedData.description || '');
            setClaimNumber(parsedData.claimNumber || '');
            setCurrentMileage(parsedData.currentMileage || '');
            setRepairs(parsedData.repairs || []);
            setParts(parsedData.parts || []);
            setDiscounts(parsedData.discounts || []);
          } else {
            setDescription('');
            setClaimNumber('');
            setCurrentMileage('');
            setRepairs([]);
            setParts([]);
            setDiscounts([]);
          }
          
          console.log('Form data set with generated number:', nextNumber);
        } catch (error) {
          console.error('Erreur lors de la génération du numéro de facture:', error);
          setFormData({
            reference: '1',
            client_id: invoice?.client_id || '',
            vehicle_id: invoice?.vehicle_id || '',
            repair_order_id: invoice?.repair_order_id || null,
            status: 'En attente de paiement',
            due_date: today,
            payment_details: ''
          });
          console.log('Set fallback form data with 1');
        }
      }
    };

    initializeForm();
  }, [invoice]);

  // Log formData changes
  useEffect(() => {
    console.log('FormData updated:', formData);
  }, [formData]);

  return {
    formData,
    description,
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
    prepareSubmitData: prepareInvoiceSubmitData
  };
};

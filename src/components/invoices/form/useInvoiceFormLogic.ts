import { useState, useEffect } from 'react';
import { Invoice } from '@/services/supabase/invoices';
import { InvoiceRepairItem, InvoicePartItem, InvoiceDiscountItem, GlobalTotals } from './types';
import { invoicesService } from '@/services/supabase/invoices';
import { validateInvoiceForm } from './utils/validation';

interface UseInvoiceFormLogicProps {
  invoice?: Invoice | null;
}

export const useInvoiceFormLogic = ({ invoice }: UseInvoiceFormLogicProps) => {
  const [formData, setFormData] = useState<Partial<Invoice>>({
    reference: '',
    client_id: null,
    vehicle_id: null,
    status: 'Brouillon',
    due_date: null,
    payment_method: null,
    notes: ''
  });

  const [description, setDescription] = useState('');
  const [claimNumber, setClaimNumber] = useState('');
  const [currentMileage, setCurrentMileage] = useState('');
  const [repairs, setRepairs] = useState<InvoiceRepairItem[]>([]);
  const [parts, setParts] = useState<InvoicePartItem[]>([]);
  const [discounts, setDiscounts] = useState<InvoiceDiscountItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Déterminer si le formulaire est en lecture seule
  const isReadOnly = Boolean(invoice && (formData.payment_date !== null || formData.status === 'Envoyé'));

  console.log('isReadOnly calculation:', {
    hasInvoice: !!invoice,
    payment_date: formData.payment_date,
    status: formData.status,
    isReadOnly
  });

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

    const globalDiscounts = discounts.reduce((sum, discount) => sum + discount.amount, 0);

    return {
      subTotal: repairTotals.subTotal + partTotals.subTotal,
      totalVat: repairTotals.totalVat + partTotals.totalVat,
      totalDiscount: repairTotals.totalDiscount + partTotals.totalDiscount + globalDiscounts,
      total: repairTotals.total + partTotals.total - globalDiscounts
    };
  };

  const validateForm = () => {
    const validationResult = validateInvoiceForm(formData, claimNumber, currentMileage);
    setErrors(validationResult.errors);
    return validationResult.isValid;
  };

  const handleChange = (field: string, value: any) => {
    console.log('handleChange called with:', { field, value, isReadOnly });
    
    if (isReadOnly && field !== 'payment_method' && field !== 'payment_date') {
      console.log('Blocked change due to readonly mode');
      return; // Empêcher les modifications si en lecture seule
    }
    
    if (field === 'description') {
      setDescription(value);
    } else {
      console.log('Updating formData:', field, value);
      setFormData(prev => {
        const newData = { ...prev, [field]: value };
        console.log('New formData after update:', newData);
        return newData;
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
      description,
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

  // Fonction pour générer le prochain numéro de facture
  const generateNextInvoiceNumber = async () => {
    try {
      const lastInvoice = await invoicesService.getLastInvoiceByUser();
      const lastNumber = lastInvoice?.reference ? parseInt(lastInvoice.reference) : 0;
      return (lastNumber + 1).toString();
    } catch (error) {
      console.error('Error generating invoice number:', error);
      return '1';
    }
  };

  useEffect(() => {
    if (invoice) {
      setFormData({
        reference: invoice.reference,
        client_id: invoice.client_id,
        vehicle_id: invoice.vehicle_id,
        status: invoice.status || 'Brouillon',
        due_date: invoice.due_date,
        payment_method: invoice.payment_method,
        payment_date: invoice.payment_date,
        notes: invoice.notes || ''
      });
      
      // Charger les données depuis les notes (format JSON)
      if (invoice.notes) {
        try {
          const noteData = JSON.parse(invoice.notes);
          setDescription(noteData.description || '');
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
          console.error('Error parsing invoice notes:', e);
          setDescription('');
          setClaimNumber('');
          setCurrentMileage('');
          setRepairs([]);
          setParts([]);
          setDiscounts([]);
        }
      } else {
        setDescription('');
        setClaimNumber('');
        setCurrentMileage('');
        setRepairs([]);
        setParts([]);
        setDiscounts([]);
      }
    } else {
      // Pour une nouvelle facture, définir la date du jour
      const today = new Date().toISOString().split('T')[0];
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30); // 30 jours pour l'échéance
      
      // Générer un numéro automatique pour une nouvelle facture
      generateNextInvoiceNumber().then(nextNumber => {
        setFormData(prev => ({
          ...prev,
          reference: nextNumber,
          due_date: dueDate.toISOString().split('T')[0]
        }));
      });
      setDescription('');
      setClaimNumber('');
      setCurrentMileage('');
    }
  }, [invoice]);

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
    calculateGlobalTotals,
    prepareSubmitData
  };
};

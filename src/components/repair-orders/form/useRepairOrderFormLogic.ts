
import { useState, useEffect } from 'react';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { RepairOrderRepairItem, RepairOrderPartItem, RepairOrderDiscountItem, GlobalTotals } from './types';
import { repairOrdersService } from '@/services/supabase/repair-orders';
import { validateRepairOrderForm } from './utils/validation';

interface UseRepairOrderFormLogicProps {
  order?: RepairOrder | null;
}

export const useRepairOrderFormLogic = ({ order }: UseRepairOrderFormLogicProps) => {
  const [formData, setFormData] = useState<Partial<RepairOrder>>({
    reference: '',
    client_id: null,
    vehicle_id: null,
    status: 'En cours',
    start_date: null,
    end_date: null,
    estimated_hours: null,
    notes: ''
  });

  const [description, setDescription] = useState('');
  const [claimNumber, setClaimNumber] = useState('');
  const [currentMileage, setCurrentMileage] = useState('');
  const [repairs, setRepairs] = useState<RepairOrderRepairItem[]>([]);
  const [parts, setParts] = useState<RepairOrderPartItem[]>([]);
  const [discounts, setDiscounts] = useState<RepairOrderDiscountItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Déterminer si le formulaire est en lecture seule
  const isReadOnly = formData.status === 'Terminé' || formData.status === 'Annulé';

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
    const validationResult = validateRepairOrderForm(formData, claimNumber, currentMileage);
    setErrors(validationResult.errors);
    return validationResult.isValid;
  };

  const handleChange = (field: string, value: any) => {
    if (isReadOnly && field !== 'status') {
      return; // Empêcher les modifications si en lecture seule
    }
    
    if (field === 'description') {
      setDescription(value);
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

  // Fonction pour générer le prochain numéro d'ordre de réparation
  const generateNextOrderNumber = async () => {
    try {
      const lastOrder = await repairOrdersService.getLastOrderByUser();
      const lastNumber = lastOrder?.reference ? parseInt(lastOrder.reference) : 0;
      return (lastNumber + 1).toString();
    } catch (error) {
      console.error('Error generating order number:', error);
      return '1';
    }
  };

  useEffect(() => {
    if (order) {
      console.log('Loading order data:', order);
      setFormData({
        reference: order.reference,
        client_id: order.client_id,
        vehicle_id: order.vehicle_id, // S'assurer que le vehicle_id est bien chargé
        status: order.status || 'En cours',
        start_date: order.start_date,
        end_date: order.end_date,
        estimated_hours: order.estimated_hours,
        notes: order.notes || ''
      });
      
      // Charger les données depuis les notes (format JSON)
      if (order.notes) {
        try {
          const noteData = JSON.parse(order.notes);
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
          console.error('Error parsing order notes:', e);
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
      
      console.log('Form data set to:', {
        reference: order.reference,
        client_id: order.client_id,
        vehicle_id: order.vehicle_id,
        status: order.status || 'En cours'
      });
    } else {
      // Pour un nouvel ordre de réparation, définir la date du jour
      const today = new Date().toISOString().split('T')[0];
      
      // Générer un numéro automatique pour un nouvel ordre
      generateNextOrderNumber().then(nextNumber => {
        setFormData(prev => ({
          ...prev,
          reference: nextNumber,
          start_date: today
        }));
      });
      setDescription('');
      setClaimNumber('');
      setCurrentMileage('');
    }
  }, [order]);

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

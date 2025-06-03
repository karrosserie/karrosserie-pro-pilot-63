
import { useState, useEffect } from 'react';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { RepairOrderRepairItem, RepairOrderPartItem, GlobalTotals } from './types';

interface UseRepairOrderFormLogicProps {
  order?: RepairOrder | null;
}

export const useRepairOrderFormLogic = ({ order }: UseRepairOrderFormLogicProps) => {
  const [formData, setFormData] = useState<Partial<RepairOrder>>({
    reference: '',
    client_id: '',
    vehicle_id: '',
    status: 'En cours',
    start_date: '',
    end_date: '',
    notes: ''
  });

  const [description, setDescription] = useState('');
  const [repairs, setRepairs] = useState<RepairOrderRepairItem[]>([]);
  const [parts, setParts] = useState<RepairOrderPartItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Déterminer si le formulaire est en lecture seule
  const isReadOnly = formData.status === 'Terminé';

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
      newErrors.reference = "La référence de l'ordre de réparation est obligatoire";
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
      setFormData(prev => ({ ...prev, [field]: value }));
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
    if (order) {
      setFormData({
        reference: order.reference,
        client_id: order.client_id,
        vehicle_id: order.vehicle_id,
        status: order.status || 'En cours',
        start_date: order.start_date,
        end_date: order.end_date,
        notes: order.notes || ''
      });
      
      // Charger les données depuis les notes (format JSON)
      if (order.notes) {
        try {
          const noteData = JSON.parse(order.notes);
          setDescription(noteData.description || '');
          if (noteData.repairs) {
            setRepairs(noteData.repairs);
          }
          if (noteData.parts) {
            setParts(noteData.parts);
          }
        } catch (e) {
          console.error('Error parsing order notes:', e);
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
      // Générer une référence automatique pour un nouvel ordre
      const currentYear = new Date().getFullYear();
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      setFormData(prev => ({
        ...prev,
        reference: `OR-${currentYear}-${randomNumber}`
      }));
      setDescription('');
    }
  }, [order]);

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

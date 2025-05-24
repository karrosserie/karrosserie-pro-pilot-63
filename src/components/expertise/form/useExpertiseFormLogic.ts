
import { useState, useEffect } from 'react';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';
import { RepairItem, PartItem, GlobalTotals } from './types';

interface UseExpertiseFormLogicProps {
  report?: ExpertiseReport | null;
}

export const useExpertiseFormLogic = ({ report }: UseExpertiseFormLogicProps) => {
  const [formData, setFormData] = useState<Partial<ExpertiseReport>>({
    reference: '',
    report_date: null,
    client_id: null,
    vehicle_id: null,
    policy_number: '',
    expert_name: '',
    status: 'Importé',
    claim_number: '',
    incident_date: null
  });

  const [repairs, setRepairs] = useState<RepairItem[]>([]);
  const [parts, setParts] = useState<PartItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Déterminer si le formulaire est en lecture seule
  const isReadOnly = formData.status !== 'Importé';

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
      newErrors.reference = 'Le numéro de rapport est obligatoire';
    }
    
    if (!formData.expert_name?.trim()) {
      newErrors.expert_name = 'Le nom de l\'expert est recommandé';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    if (isReadOnly && field !== 'status') {
      return; // Empêcher les modifications si en lecture seule
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  useEffect(() => {
    if (report) {
      setFormData({
        reference: report.reference,
        report_date: report.report_date,
        client_id: report.client_id,
        vehicle_id: report.vehicle_id,
        policy_number: report.policy_number || '',
        expert_name: report.expert_name || '',
        status: report.status || 'Importé',
        claim_number: report.claim_number || '',
        incident_date: report.incident_date,
      });
      
      // Charger les réparations et pièces depuis le rapport
      if (report.repairs_data) {
        try {
          const parsedRepairs = JSON.parse(report.repairs_data);
          setRepairs(parsedRepairs);
        } catch (e) {
          console.error('Error parsing repairs data:', e);
          setRepairs([]);
        }
      }
      
      if (report.parts_data) {
        try {
          const parsedParts = JSON.parse(report.parts_data);
          setParts(parsedParts);
        } catch (e) {
          console.error('Error parsing parts data:', e);
          setParts([]);
        }
      }
    } else {
      // Générer une référence automatique pour un nouveau rapport
      const currentYear = new Date().getFullYear();
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      setFormData(prev => ({
        ...prev,
        reference: `RE-${currentYear}-${randomNumber}`
      }));
    }
  }, [report]);

  return {
    formData,
    repairs,
    parts,
    errors,
    isReadOnly,
    setRepairs,
    setParts,
    handleChange,
    validateForm,
    calculateGlobalTotals
  };
};

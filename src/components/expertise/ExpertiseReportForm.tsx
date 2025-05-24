
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useClients } from '@/hooks/use-clients';
import { useVehicles } from '@/hooks/use-vehicles';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';
import { BasicInfoSection } from './form/BasicInfoSection';
import { AssignmentSection } from './form/AssignmentSection';
import { ExpertiseDetailsSection } from './form/ExpertiseDetailsSection';
import { RepairsSection } from './form/RepairsSection';
import { PartsSection } from './form/PartsSection';
import { FormActions } from './form/FormActions';

interface RepairItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  discount: number;
  vat: number;
  total: number;
}

interface PartItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  discount: number;
  vat: number;
  total: number;
}

interface ExpertiseReportFormProps {
  report?: ExpertiseReport | null;
  onSubmit: (formData: Partial<ExpertiseReport>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ExpertiseReportForm = ({
  report,
  onSubmit,
  onCancel,
  isSubmitting
}: ExpertiseReportFormProps) => {
  const { toast } = useToast();
  const { clients, isLoading: isLoadingClients } = useClients();
  const { vehicles, isLoading: isLoadingVehicles } = useVehicles();
  
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
  const calculateGlobalTotals = () => {
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

  const globalTotals = calculateGlobalTotals();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs dans le formulaire.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Inclure les données de réparations et pièces dans la soumission
      const submitData = {
        ...formData,
        repairs_data: JSON.stringify(repairs),
        parts_data: JSON.stringify(parts)
      };
      
      await onSubmit(submitData);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de ${report ? 'mettre à jour' : 'créer'} le rapport d'expertise: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const clientOptions = clients?.filter(client => !!client) || [];
  const vehicleOptions = vehicles?.filter(vehicle => !!vehicle) || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
      <BasicInfoSection 
        formData={formData}
        errors={errors}
        onFieldChange={handleChange}
      />

      <AssignmentSection 
        formData={formData}
        onFieldChange={handleChange}
        clientOptions={clientOptions}
        vehicleOptions={vehicleOptions}
        isLoadingClients={isLoadingClients}
        isLoadingVehicles={isLoadingVehicles}
      />

      <ExpertiseDetailsSection 
        formData={formData}
        errors={errors}
        onFieldChange={handleChange}
        globalTotals={globalTotals}
      />

      <RepairsSection 
        repairs={repairs}
        onRepairsChange={setRepairs}
        isReadOnly={isReadOnly}
      />

      <PartsSection 
        parts={parts}
        onPartsChange={setParts}
        isReadOnly={isReadOnly}
      />

      <FormActions 
        report={report}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
};

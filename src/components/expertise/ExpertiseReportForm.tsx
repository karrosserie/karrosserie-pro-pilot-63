
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
      // Load repairs and parts from report if available
      // This would need to be implemented in the database schema
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
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
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
      // Include repairs and parts data in the submission
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
      />

      <RepairsSection 
        repairs={repairs}
        onRepairsChange={setRepairs}
      />

      <PartsSection 
        parts={parts}
        onPartsChange={setParts}
      />

      <FormActions 
        report={report}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
};

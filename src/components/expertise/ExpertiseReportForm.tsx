
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useClients } from '@/hooks/use-clients';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';
import { BasicInfoSection } from './form/BasicInfoSection';
import { AssignmentSection } from './form/AssignmentSection';
import { ExpertiseDetailsSection } from './form/ExpertiseDetailsSection';
import { RepairsSection } from './form/RepairsSection';
import { PartsSection } from './form/PartsSection';
import { FormActions } from './form/FormActions';
import { useExpertiseFormLogic } from './form/useExpertiseFormLogic';

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
  
  const {
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
  } = useExpertiseFormLogic({ report });

  const globalTotals = calculateGlobalTotals();

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Élément invisible pour capturer le focus initial */}
      <div 
        tabIndex={0} 
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          width: '1px', 
          height: '1px', 
          opacity: 0 
        }}
        onFocus={(e) => e.target.blur()}
      />
      
      <BasicInfoSection 
        formData={formData}
        errors={errors}
        onFieldChange={handleChange}
      />

      <AssignmentSection 
        formData={formData}
        onFieldChange={handleChange}
        clientOptions={clientOptions}
        vehicleOptions={[]}
        isLoadingClients={isLoadingClients}
        isLoadingVehicles={false}
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

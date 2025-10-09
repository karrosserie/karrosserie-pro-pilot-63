
import { useFleetVehicles } from '@/hooks/use-fleet-vehicles';
import { useAuth } from '@/contexts/AuthContext';
import { useCompanyId } from '@/hooks/use-company-id';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';

interface ValidationData {
  formData: {
    vin: string;
    brand_id: string;
    model_id: string;
    license_plate: string;
  };
  documentsData: {
    registrationFrontUrl: string;
    registrationBackUrl: string;
    insuranceCardUrl: string;
  };
}

interface FormHandlersProps {
  formData: any;
  setFormData: (data: any) => void;
  documentsData: any;
  vehicle?: FleetVehicle | null;
  mode: 'create' | 'edit' | 'view';
  onSuccess: () => void;
  isFormValid: (data: ValidationData) => boolean;
  showValidationError: () => void;
}

export function useFleetVehicleFormHandlers({
  formData,
  setFormData,
  documentsData,
  vehicle,
  mode,
  onSuccess,
  isFormValid,
  showValidationError
}: FormHandlersProps) {
  const { createVehicle, updateVehicle } = useFleetVehicles();
  const { user } = useAuth();
  const { companyId } = useCompanyId();

  const handleBrandSelectChange = (brandId: string) => {
    console.log('Manual brand selection:', brandId);
    setFormData(prev => ({ 
      ...prev, 
      brand_id: brandId,
      model_id: '' // Reset model when brand changes
    }));
  };

  const handleModelSelectChange = (modelId: string) => {
    console.log('Manual model selection:', modelId);
    setFormData(prev => ({ ...prev, model_id: modelId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    const validationData: ValidationData = { formData, documentsData };
    if (!isFormValid(validationData)) {
      showValidationError();
      return;
    }
    
    try {
      const submissionData = {
        vin: formData.vin,
        engine_number: formData.engine_number,
        year: formData.year,
        license_plate: formData.license_plate,
        color: formData.color,
        status: formData.status,
        registration_front_url: documentsData.registrationFrontUrl,
        registration_back_url: documentsData.registrationBackUrl,
        insurance_card_url: documentsData.insuranceCardUrl,
        brand_id: formData.brand_id,
        model_id: formData.model_id
      };

      if (mode === 'edit' && vehicle) {
        await updateVehicle.mutateAsync({
          id: vehicle.id,
          data: submissionData
        });
      } else if (mode === 'create') {
        const createdVehicle = await createVehicle.mutateAsync({
          ...submissionData,
          company_id: companyId
        });
        
        // Onboarding : Véhicule de courtoisie ajouté
        if (createdVehicle?.id) {
          const { onboardingService } = await import('@/services/onboarding/OnboardingService');
          onboardingService.updateOnboardingStep('tunnel3', 'fleetVehicleAdded', { vehicleId: createdVehicle.id });
        }
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving fleet vehicle:', error);
    }
  };

  const isPending = createVehicle.isPending || updateVehicle.isPending;

  return {
    handleBrandSelectChange,
    handleModelSelectChange,
    handleSubmit,
    isPending
  };
}

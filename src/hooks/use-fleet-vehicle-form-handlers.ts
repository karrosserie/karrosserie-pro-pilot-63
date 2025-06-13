
import { useFleetVehicles } from '@/hooks/use-fleet-vehicles';
import { useAuth } from '@/contexts/AuthContext';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';

interface FormHandlersProps {
  formData: any;
  setFormData: (data: any) => void;
  documentsData: any;
  vehicle?: FleetVehicle | null;
  mode: 'create' | 'edit' | 'view';
  onSuccess: () => void;
  isFormValid: (data: any) => boolean;
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

    const validationData = { formData, documentsData };
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
        model_id: formData.model_id,
        brand: '',
        model: ''
      };

      if (mode === 'edit' && vehicle) {
        await updateVehicle.mutateAsync({
          id: vehicle.id,
          data: submissionData
        });
      } else if (mode === 'create') {
        await createVehicle.mutateAsync({
          ...submissionData,
          user_id: user.id
        });
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

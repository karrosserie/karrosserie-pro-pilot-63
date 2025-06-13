
import { useToast } from '@/hooks/use-toast';

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

export function useFleetVehicleFormValidation() {
  const { toast } = useToast();

  const isFormValid = (data: ValidationData) => {
    const basicInfoValid = data.formData.vin && 
                          data.formData.brand_id && 
                          data.formData.model_id && 
                          data.formData.license_plate;
    const documentsValid = data.documentsData.registrationFrontUrl && 
                          data.documentsData.registrationBackUrl && 
                          data.documentsData.insuranceCardUrl;
    
    return basicInfoValid && documentsValid;
  };

  const showValidationError = () => {
    toast({
      title: "Documents manquants",
      description: "Veuillez importer tous les documents obligatoires (certificat d'immatriculation recto/verso et carte verte d'assurance).",
      variant: "destructive"
    });
  };

  return {
    isFormValid,
    showValidationError
  };
}

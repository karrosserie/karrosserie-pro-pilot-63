import { LoanFormData } from '@/components/fleet/FleetLoanForm';
import { useToast } from '@/hooks/use-toast';

export const useTabValidation = () => {
  const { toast } = useToast();

  const validateClientInfoTab = (formData: LoanFormData): boolean => {
    const errors: string[] = [];
    
    if (!formData.clientId) {
      errors.push('Client obligatoire');
    }
    if (!formData.startDate) {
      errors.push('Date de début obligatoire');
    }
    if (!formData.driverLicenseFrontUrl) {
      errors.push('Photo recto du permis obligatoire');
    }
    if (!formData.driverLicenseBackUrl) {
      errors.push('Photo verso du permis obligatoire');
    }
    if (!formData.licenseNumber) {
      errors.push('Numéro de permis obligatoire');
    }
    if (!formData.licenseIssueDate) {
      errors.push('Date de délivrance du permis obligatoire');
    }
    if (!formData.prefecture) {
      errors.push('Préfecture obligatoire');
    }
    if (!formData.holderInfo) {
      errors.push('Titulaire du permis obligatoire');
    }
    if (!formData.dateOfBirth) {
      errors.push('Date de naissance obligatoire');
    }
    if (!formData.placeOfBirth) {
      errors.push('Lieu de naissance obligatoire');
    }

    if (errors.length > 0) {
      toast({
        title: "Informations client incomplètes",
        description: `Veuillez compléter : ${errors.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const validateInsuranceTab = (formData: LoanFormData): boolean => {
    const errors: string[] = [];
    
    // Champs TOUJOURS obligatoires
    if (!formData.insuranceCompanyName) {
      errors.push('Nom de la compagnie d\'assurance');
    }
    if (!formData.insuranceEmail) {
      errors.push('Email de l\'assurance');
    }
    
    // Champs obligatoires UNIQUEMENT si le switch est activé
    if (formData.clientInsurance) {
      if (!formData.insurancePhone) {
        errors.push('Téléphone de l\'assurance');
      }
      if (!formData.insuranceContractNumber) {
        errors.push('Numéro de contrat');
      }
      if (!formData.insuranceAddress) {
        errors.push('Adresse de l\'assurance');
      }
      if (!formData.insuranceCity) {
        errors.push('Ville de l\'assurance');
      }
      if (!formData.insurancePostalCode) {
        errors.push('Code postal de l\'assurance');
      }
    }

    if (errors.length > 0) {
      toast({
        title: "Informations assurance incomplètes",
        description: `Veuillez compléter : ${errors.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const validateDamagesTab = (formData: LoanFormData): boolean => {
    // Onglet des dommages - pas de validation spécifique requise
    return true;
  };

  const validateVehicleDetailsTab = (formData: LoanFormData): boolean => {
    const errors: string[] = [];
    
    if (!formData.mileage || formData.mileage < 0) {
      errors.push('Kilométrage valide obligatoire');
    }
    if (!formData.fuelLevel || formData.fuelLevel < 0 || formData.fuelLevel > 100) {
      errors.push('Niveau de carburant valide (0-100%) obligatoire');
    }

    if (errors.length > 0) {
      toast({
        title: "Détails du véhicule incomplets",
        description: `Veuillez compléter : ${errors.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const validateAttestationTab = (formData: LoanFormData): boolean => {
    const errors: string[] = [];
    
    if (!formData.attestationAccepted) {
      errors.push('Acceptation de l\'attestation obligatoire');
    }
    if (!formData.clientSignature || formData.clientSignature.trim() === '') {
      errors.push('Signature du client obligatoire');
    }

    if (errors.length > 0) {
      toast({
        title: "Attestation incomplète",
        description: `Veuillez compléter : ${errors.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const validateTabByValue = (tabValue: string, formData: LoanFormData): boolean => {
    switch (tabValue) {
      case 'client-info':
        return validateClientInfoTab(formData);
      case 'insurance':
        return validateInsuranceTab(formData);
      case 'damages':
        return validateDamagesTab(formData);
      case 'vehicle-details':
        return validateVehicleDetailsTab(formData);
      case 'attestation':
        return validateAttestationTab(formData);
      default:
        return true;
    }
  };

  return {
    validateClientInfoTab,
    validateInsuranceTab,
    validateDamagesTab,
    validateVehicleDetailsTab,
    validateAttestationTab,
    validateTabByValue
  };
};
import { Database } from '@/integrations/supabase/types';
import { clientDataValidator } from '@/services/clientDataValidator';

type Client = Database['public']['Tables']['clients']['Row'];

export interface ClientValidationResult {
  isComplete: boolean;
  missingFields: string[];
  missingCount: number;
}

export interface ClientDataValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  hasWarnings: boolean;
}

export const useClientValidation = () => {
  const checkMissingClientData = (client: Client): ClientValidationResult => {
    const missingFields: string[] = [];
    
    // Champs critiques pour un prêt de véhicule
    if (!client.email) missingFields.push('Email');
    if (!client.date_of_birth) missingFields.push('Date de naissance');
    if (!client.place_of_birth) missingFields.push('Lieu de naissance');
    if (!client.driver_license_front_url) missingFields.push('Permis (recto)');
    if (!client.driver_license_back_url) missingFields.push('Permis (verso)');
    if (!client.license_number) missingFields.push('Numéro de permis');
    if (!client.license_issue_date) missingFields.push('Date d\'émission du permis');
    if (!client.prefecture) missingFields.push('Préfecture');
    
    return {
      isComplete: missingFields.length === 0,
      missingFields,
      missingCount: missingFields.length
    };
  };

  const validateClientData = async (client: Client): Promise<ClientDataValidationResult> => {
    const validationErrors: string[] = [];
    const warnings: string[] = [];
    
    console.log('🔍 Starting deep validation for client:', client.id);
    
    // Validation de l'email
    if (client.email) {
      const emailValidation = clientDataValidator.validateEmail(client.email);
      if (!emailValidation.isValid) {
        validationErrors.push(`Email : ${emailValidation.error}`);
      }
    }
    
    // Validation du téléphone (avec API)
    if (client.phone) {
      const phoneValidation = await clientDataValidator.validatePhone(client.phone);
      if (!phoneValidation.isValid) {
        validationErrors.push(`Téléphone : ${phoneValidation.error}`);
      } else if (phoneValidation.details) {
        console.log('📞 Phone validation details:', phoneValidation.details);
      }
    }
    
    // Validation de la date de naissance
    if (client.date_of_birth) {
      const dobValidation = clientDataValidator.validateDateOfBirth(client.date_of_birth);
      if (!dobValidation.isValid) {
        validationErrors.push(`Date de naissance : ${dobValidation.error}`);
      } else if (dobValidation.age) {
        console.log(`👤 Client age: ${dobValidation.age} years`);
      }
    }
    
    // Validation du numéro de permis
    if (client.license_number) {
      const licenseValidation = clientDataValidator.validateLicenseNumber(client.license_number);
      if (!licenseValidation.isValid) {
        validationErrors.push(`Numéro de permis : ${licenseValidation.error}`);
      }
    }
    
    // Validation de la date d'émission du permis
    if (client.license_issue_date && client.date_of_birth) {
      const issueValidation = clientDataValidator.validateLicenseIssueDate(
        client.license_issue_date,
        client.date_of_birth
      );
      if (!issueValidation.isValid) {
        validationErrors.push(`Date d'émission du permis : ${issueValidation.error}`);
      }
    }
    
    // Validation de la préfecture (non bloquant, juste avertissement)
    if (client.prefecture) {
      const prefectureValidation = clientDataValidator.validatePrefecture(client.prefecture);
      if (!prefectureValidation.isValid) {
        warnings.push(`Préfecture : ${prefectureValidation.error}`);
      }
    }
    
    console.log('🔍 Validation results:', { 
      errors: validationErrors.length, 
      warnings: warnings.length 
    });
    
    return {
      isValid: validationErrors.length === 0,
      errors: validationErrors,
      warnings,
      hasWarnings: warnings.length > 0
    };
  };
  
  return { 
    checkMissingClientData,
    validateClientData
  };
};

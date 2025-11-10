import { Client } from '@/services/supabase/clients';

export interface ClientValidationResult {
  isComplete: boolean;
  missingFields: string[];
  hasCriticalMissing: boolean;
}

export const useClientValidation = () => {
  const checkMissingClientData = (client: Client | null | undefined): ClientValidationResult => {
    if (!client) {
      return {
        isComplete: false,
        missingFields: [],
        hasCriticalMissing: false
      };
    }

    const missingFields: string[] = [];
    
    if (!client.email) missingFields.push('Email');
    if (!client.date_of_birth) missingFields.push('Date de naissance');
    if (!client.place_of_birth) missingFields.push('Lieu de naissance');
    if (!client.driver_license_front_url) missingFields.push('Permis (recto)');
    if (!client.driver_license_back_url) missingFields.push('Permis (verso)');
    if (!client.license_number) missingFields.push('Numéro de permis');
    if (!client.license_issue_date) missingFields.push('Date d\'émission du permis');
    
    return {
      isComplete: missingFields.length === 0,
      missingFields,
      hasCriticalMissing: missingFields.length > 0
    };
  };
  
  return { checkMissingClientData };
};

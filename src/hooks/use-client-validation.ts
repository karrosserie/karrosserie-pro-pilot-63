import { Database } from '@/integrations/supabase/types';

type Client = Database['public']['Tables']['clients']['Row'];

export interface ClientValidationResult {
  isComplete: boolean;
  missingFields: string[];
  missingCount: number;
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
  
  return { checkMissingClientData };
};

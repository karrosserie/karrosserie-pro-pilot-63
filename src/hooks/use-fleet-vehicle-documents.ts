
import { useState } from 'react';

interface FleetVehicle {
  registration_front_url?: string;
  registration_back_url?: string;
  insurance_card_url?: string;
}

export function useFleetVehicleDocuments(vehicle?: FleetVehicle | null) {
  const [documentsData, setDocumentsData] = useState({
    registrationFrontUrl: vehicle?.registration_front_url || '',
    registrationBackUrl: vehicle?.registration_back_url || '',
    insuranceCardUrl: vehicle?.insurance_card_url || ''
  });

  const handleRegistrationFrontUpload = (url: string) => {
    setDocumentsData(prev => ({ ...prev, registrationFrontUrl: url }));
  };

  const handleRegistrationBackUpload = (url: string) => {
    setDocumentsData(prev => ({ ...prev, registrationBackUrl: url }));
  };

  const handleInsuranceCardUpload = (url: string) => {
    setDocumentsData(prev => ({ ...prev, insuranceCardUrl: url }));
  };

  return {
    documentsData,
    handleRegistrationFrontUpload,
    handleRegistrationBackUpload,
    handleInsuranceCardUpload
  };
}

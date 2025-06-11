
export interface FleetReturnFormData {
  reservationId: string;
  vehicleId: string;
  clientId: string;
  returnDate: string;
  returnMileage: number;
  fuelLevelReturn: number;
  vehicleImages: string[];
  damages: ReturnDamageItem[];
  notes: string;
  attestationAccepted: boolean;
  clientSignature: string;
  clientName: string;
}

// Type pour les dommages dans le retour (compatible avec DamageAssessmentTab)
export interface ReturnDamageItem {
  id: string;
  name: string;
  type: 'none' | 'rayure' | 'choc' | 'hs';
}

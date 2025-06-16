
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import SignaturePad from '@/components/shared/SignaturePad';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';

interface AttestationTabProps {
  formData: {
    clientId: string;
    clientName: string;
    startDate: string;
    expectedReturnDate: string;
    attestationAccepted?: boolean;
    clientSignature?: string;
  };
  vehicle: FleetVehicle;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSignatureChange: (signature: string) => void;
  isViewMode?: boolean;
}

const AttestationTab: React.FC<AttestationTabProps> = ({
  formData,
  vehicle,
  onInputChange,
  onSignatureChange,
  isViewMode = false
}) => {
  const getVehicleDisplayName = () => {
    if (vehicle.car_brands?.name && vehicle.car_models?.name) {
      return `${vehicle.car_brands.name} ${vehicle.car_models.name}`;
    }
    return 'Véhicule';
  };

  const handleAttestationChange = (checked: boolean) => {
    const syntheticEvent = {
      target: {
        name: 'attestationAccepted',
        value: checked,
        type: 'checkbox',
        checked: checked
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    onInputChange(syntheticEvent);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Attestation de prêt de véhicule</h3>
        
        <div className="space-y-4 text-sm">
          <p>
            Je soussigné(e) <strong>{formData.clientName}</strong>, 
            reconnais avoir reçu en prêt le véhicule <strong>{getVehicleDisplayName()}</strong> 
            immatriculé <strong>{vehicle.license_plate}</strong>.
          </p>
          
          <p>
            <strong>Période de prêt :</strong><br />
            Du {new Date(formData.startDate).toLocaleDateString('fr-FR')} 
            au {new Date(formData.expectedReturnDate).toLocaleDateString('fr-FR')}
          </p>
          
          <div className="space-y-2">
            <p><strong>Je m'engage à :</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Utiliser le véhicule de manière responsable et conforme au code de la route</li>
              <li>Restituer le véhicule dans l'état où je l'ai reçu</li>
              <li>Signaler immédiatement tout sinistre ou problème technique</li>
              <li>Prendre en charge les éventuels dommages causés pendant la période de prêt</li>
              <li>Restituer le véhicule à la date convenue avec le plein de carburant</li>
            </ul>
          </div>
          
          <p className="text-xs text-gray-600 mt-4">
            Cette attestation fait foi entre les parties et engage ma responsabilité 
            pendant toute la durée du prêt.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="attestationAccepted"
            checked={formData.attestationAccepted || false}
            onCheckedChange={handleAttestationChange}
            disabled={isViewMode}
            className="data-[state=checked]:bg-karrosserie-orange data-[state=checked]:border-karrosserie-orange"
          />
          <Label htmlFor="attestationAccepted" className="text-sm font-medium">
            J'ai lu et j'accepte les conditions de prêt ci-dessus
          </Label>
        </div>

        <div className="space-y-2">
          <Label>Signature du client</Label>
          <div className="border rounded-lg p-4 bg-white">
            <SignaturePad
              value={formData.clientSignature || ''}
              onSignatureChange={onSignatureChange}
              disabled={isViewMode}
            />
          </div>
          {!isViewMode && (
            <p className="text-xs text-gray-500">
              Signez dans la zone ci-dessus avec votre souris ou votre doigt
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttestationTab;

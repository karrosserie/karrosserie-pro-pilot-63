
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { SignaturePad } from '@/components/shared/SignaturePad';
import { FleetReturnFormData } from '@/components/fleet/FleetReturnForm.types';

interface ReturnAttestationTabProps {
  formData: Pick<FleetReturnFormData, 'clientId' | 'clientName' | 'returnDate' | 'attestationAccepted' | 'clientSignature'>;
  vehicle: FleetVehicle;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSignatureChange: (field: string, value: any) => void;
  isViewMode?: boolean;
}

const ReturnAttestationTab: React.FC<ReturnAttestationTabProps> = ({
  formData,
  vehicle,
  onInputChange,
  onSignatureChange,
  isViewMode = false
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Client Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Informations du client</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Nom du client *</Label>
            <Input
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={onInputChange}
              placeholder="Nom complet du client"
              disabled={isViewMode}
              required
            />
          </div>
        </div>
      </div>

      {/* Return Attestation */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Attestation de retour de véhicule</h3>
        <div className="prose max-w-none text-sm text-gray-700 space-y-4">
          <p>
            Je soussigné(e), <strong>{formData.clientName || "_______________"}</strong>, 
            certifie avoir restitué le véhicule <strong>{vehicle.brand} {vehicle.model}</strong> 
            immatriculé <strong>{vehicle.license_plate}</strong>.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div>
              <p><strong>Date de retour :</strong> {formatDate(formData.returnDate)}</p>
            </div>
            <div>
              <p><strong>Heure de retour :</strong> {formatTime(formData.returnDate)}</p>
            </div>
          </div>

          <p>
            Je confirme que le véhicule a été restitué dans l'état décrit dans le présent formulaire 
            et je déclare avoir pris connaissance des éventuels dommages constatés.
          </p>
          
          <p>
            Je m'engage à assumer les responsabilités découlant de l'utilisation du véhicule 
            pendant la période de prêt.
          </p>
        </div>
      </Card>

      {/* Signature Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Signature du client</h3>
        
        <div className="space-y-4">
          <SignaturePad
            value={formData.clientSignature}
            onChange={(signature) => onSignatureChange('clientSignature', signature)}
            disabled={isViewMode}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="attestationAccepted"
            checked={formData.attestationAccepted}
            onCheckedChange={(checked) => onSignatureChange('attestationAccepted', checked)}
            disabled={isViewMode}
          />
          <Label htmlFor="attestationAccepted" className="text-sm">
            J'accepte les termes de cette attestation de retour et confirme l'exactitude des informations fournies *
          </Label>
        </div>
      </div>
    </div>
  );
};

export default ReturnAttestationTab;

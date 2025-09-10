
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SignaturePad from '@/components/shared/SignaturePad';
import { FleetReturnFormData } from '@/components/fleet/FleetReturnForm.types';
import { useCompany } from '@/hooks/use-company';
import { useClient } from '@/hooks/use-clients';

interface ReturnAttestationTabProps {
  formData: Pick<FleetReturnFormData, 'clientId' | 'clientName' | 'returnDate' | 'returnMileage' | 'attestationAccepted' | 'clientSignature'>;
  vehicle: any;
  reservation?: any;
  clientData?: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSignatureChange: (field: string, value: any) => void;
  isViewMode?: boolean;
}

const ReturnAttestationTab: React.FC<ReturnAttestationTabProps> = ({
  formData,
  vehicle,
  reservation,
  clientData,
  onInputChange,
  onSignatureChange,
  isViewMode = false
}) => {
  const { companyData } = useCompany();
  const { client } = useClient(formData.clientId);

  // Show loading state if client is being fetched - MUST BE BEFORE HOOKS
  if (formData.clientId && !client) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p>Chargement des informations du client...</p>
        </div>
      </div>
    );
  }

  // Format date and time to French format
  const formatDateTimeToFrench = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR') + ' à ' + date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Automatically fill client name when client is selected
  React.useEffect(() => {
    if (client && (!formData.clientName || formData.clientName.trim() === '')) {
      onSignatureChange('clientName', `${client.firstName} ${client.lastName}`);
    }
  }, [client, formData.clientName, onSignatureChange]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-lg font-bold">
            Attestation de retour de véhicule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company and Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">De :</Label>
                <div className="mt-2 space-y-1">
                  <div>{companyData?.name}</div>
                  <div>{companyData?.address}</div>
                  <div>{companyData?.zipcode} {companyData?.city}</div>
                  <div>{companyData?.phone}</div>
                  <div>{companyData?.email}</div>
                  <div>{companyData?.siren}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Du Client:</Label>
                <div className="mt-2 space-y-1">
                  <div>{client?.firstName} {client?.lastName}</div>
                  <div>{client?.address}</div>
                  <div>{client?.zipCode} {client?.city}</div>
                  <div>{client?.phone}</div>
                  {client?.email && <div>{client.email}</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Information and Loan Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Désignation du véhicule retourné:</Label>
                <div className="mt-2 space-y-1">
                  <div>Marque : {vehicle?.brand}</div>
                  <div>Model : {vehicle?.model}</div>
                  <div>N° Immatriculation : {vehicle?.license_plate}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Départ:</Label>
                <div className="mt-2 space-y-1">
                  <div>Le : {reservation?.start_date ? formatDateTimeToFrench(reservation.start_date) : 'N/A'}</div>
                  <div>Kilométrage : {reservation?.start_mileage || 0} Km</div>
                </div>
              </div>
              
              <div>
                <Label className="font-semibold">Retour:</Label>
                <div className="mt-2 space-y-1">
                  <div>Le : {formatDateTimeToFrench(formData.returnDate)}</div>
                  <div>Kilométrage : {formData.returnMileage} Km</div>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clientName" className="font-semibold">Nom et prénom</Label>
                  <Input
                    id="clientName"
                    name="clientName"
                    value={formData.clientName || (client ? `${client.firstName} ${client.lastName}` : '')}
                    onChange={onInputChange}
                    disabled={isViewMode}
                    className="mt-2"
                  />
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="attestationAccepted"
                    className="data-[state=checked]:bg-karrosserie-orange data-[state=checked]:border-karrosserie-orange"
                    checked={formData.attestationAccepted || false}
                    onCheckedChange={(checked) => onSignatureChange('attestationAccepted', checked)}
                    disabled={isViewMode}
                  />
                  <Label htmlFor="attestationAccepted" className="text-sm leading-relaxed font-normal">
                    Je certifie avoir rendu le véhicule dans l'état décrit dans ce formulaire et reconnais que ma signature apposée électroniquement sur la présente tablette vaut engagement ferme et personnel. Je confirme que cette signature constitue l'expression de mon consentement libre et éclairé, et engage ma pleine responsabilité juridique.
                  </Label>
                </div>
              </div>

              <div className="space-y-4">
                {/* Electronic Signature */}
                <SignaturePad
                  value={formData.clientSignature || ''}
                  onSignatureChange={(signature) => onSignatureChange('clientSignature', signature)}
                  disabled={isViewMode}
                />

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    La signature électronique a la même valeur légale qu'une signature manuscrite.
                    Exigence issue du Règlement eIDAS et du Code civil français, art. 1366-1367).
                    Toute modification du présent document nécessitera une nouvelle signature du client
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReturnAttestationTab;

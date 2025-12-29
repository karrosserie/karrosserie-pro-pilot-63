
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

  // Automatically fill client name when client is selected - MUST BE BEFORE ANY CONDITIONAL RETURNS
  React.useEffect(() => {
    if (client && (!formData.clientName || formData.clientName.trim() === '')) {
      onSignatureChange('clientName', `${client.firstName} ${client.lastName}`);
    }
  }, [client, formData.clientName, onSignatureChange]);

  // Format date and time to French format
  const formatDateTimeToFrench = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR') + ' à ' + date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Show loading state if client is being fetched - NOW AFTER ALL HOOKS
  if (formData.clientId && !client) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p>Chargement des informations du client...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-center text-base sm:text-lg font-bold">
            Attestation de retour de véhicule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Company and Client Information */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            <div className="space-y-2 sm:space-y-4 p-3 bg-muted/30 rounded-lg">
              <Label className="font-semibold text-sm">De :</Label>
              <div className="space-y-0.5 text-sm">
                <div className="font-medium">{companyData?.name}</div>
                <div className="text-muted-foreground">{companyData?.address}</div>
                <div className="text-muted-foreground">{companyData?.zipcode} {companyData?.city}</div>
                <div className="text-muted-foreground">{companyData?.phone}</div>
                <div className="text-muted-foreground">{companyData?.email}</div>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-4 p-3 bg-muted/30 rounded-lg">
              <Label className="font-semibold text-sm">Du Client :</Label>
              <div className="space-y-0.5 text-sm">
                <div className="font-medium">{client?.firstName} {client?.lastName}</div>
                <div className="text-muted-foreground">{client?.address}</div>
                <div className="text-muted-foreground">{client?.zipCode} {client?.city}</div>
                <div className="text-muted-foreground">{client?.phone}</div>
                {client?.email && <div className="text-muted-foreground">{client.email}</div>}
              </div>
            </div>
          </div>

          {/* Vehicle Information and Loan Details */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            <div className="space-y-2 sm:space-y-4 p-3 bg-muted/30 rounded-lg">
              <Label className="font-semibold text-sm">Véhicule retourné :</Label>
              <div className="space-y-0.5 text-sm">
                <div><span className="text-muted-foreground">Marque :</span> {vehicle?.brand}</div>
                <div><span className="text-muted-foreground">Modèle :</span> {vehicle?.model}</div>
                <div><span className="text-muted-foreground">Immat. :</span> {vehicle?.license_plate}</div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 p-3 bg-muted/30 rounded-lg">
              <div>
                <Label className="font-semibold text-sm">Départ :</Label>
                <div className="space-y-0.5 text-sm mt-1">
                  <div><span className="text-muted-foreground">Le :</span> {reservation?.start_date ? formatDateTimeToFrench(reservation.start_date) : 'N/A'}</div>
                  <div><span className="text-muted-foreground">Km :</span> {reservation?.start_mileage || 0}</div>
                </div>
              </div>
              
              <div>
                <Label className="font-semibold text-sm">Retour :</Label>
                <div className="space-y-0.5 text-sm mt-1">
                  <div><span className="text-muted-foreground">Le :</span> {formatDateTimeToFrench(formData.returnDate)}</div>
                  <div><span className="text-muted-foreground">Km :</span> {formData.returnMileage}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="border-t pt-4 sm:pt-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Client Name Input */}
              <div>
                <Label htmlFor="clientName" className="font-semibold text-sm">Nom et prénom</Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={formData.clientName || (client ? `${client.firstName} ${client.lastName}` : '')}
                  onChange={onInputChange}
                  disabled={isViewMode}
                  className="mt-2"
                />
              </div>
              
              {/* Attestation Checkbox */}
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <Checkbox
                  id="attestationAccepted"
                  className="data-[state=checked]:bg-karrosserie-orange data-[state=checked]:border-karrosserie-orange mt-0.5 shrink-0"
                  checked={formData.attestationAccepted || false}
                  onCheckedChange={(checked) => onSignatureChange('attestationAccepted', checked)}
                  disabled={isViewMode}
                />
                <Label htmlFor="attestationAccepted" className="text-xs sm:text-sm leading-relaxed font-normal cursor-pointer">
                  Je certifie avoir rendu le véhicule dans l'état décrit et reconnais que ma signature électronique vaut engagement ferme et personnel.
                </Label>
              </div>

              {/* Electronic Signature */}
              <div className="space-y-3">
                <SignaturePad
                  value={formData.clientSignature || ''}
                  onSignatureChange={(signature) => onSignatureChange('clientSignature', signature)}
                  disabled={isViewMode}
                />

                <div className="text-xs text-muted-foreground leading-relaxed">
                  La signature électronique a la même valeur légale qu'une signature manuscrite (Règlement eIDAS, Code civil art. 1366-1367).
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

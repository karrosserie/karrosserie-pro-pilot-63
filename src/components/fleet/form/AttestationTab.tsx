
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SignaturePad from '@/components/shared/SignaturePad';
import { LoanFormData } from '../FleetLoanForm';
import { useCompany } from '@/hooks/use-company';
import { useClient } from '@/hooks/use-clients';

interface AttestationTabProps {
  formData: LoanFormData;
  vehicle: any;
  clientData?: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSignatureChange: (field: string, value: any) => void;
  isViewMode?: boolean;
}

const AttestationTab: React.FC<AttestationTabProps> = ({
  formData,
  vehicle,
  clientData,
  onInputChange,
  onSignatureChange,
  isViewMode = false
}) => {
  const { companyData } = useCompany();
  const { client } = useClient(formData.clientId);

  // Format date to French format
  const formatDateToFrench = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
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
            Attestation de Prêt de Véhicule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company and Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">De :</Label>
                <div className="mt-2 space-y-1">
                  <div>{companyData?.name || 'KORPORATE'}</div>
                  <div>{companyData?.address || '25 COURS PIERRE PUGET'}</div>
                  <div>{companyData?.zipCode} {companyData?.city || '13006 MARSEILLE'}</div>
                  <div>{companyData?.phone || '+33646465242'}</div>
                  <div>{companyData?.email || 'ggobeyn@outlook.fr'}</div>
                  <div>{companyData?.siren || '917 775 835'}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Au Client:</Label>
                <div className="mt-2 space-y-1">
                  <div>{client ? `${client.firstName} ${client.lastName}` : 'Nom du client'}</div>
                  <div>{client?.address} {client?.zipCode} {client?.city}</div>
                  <div>{client?.phone || 'Téléphone'}</div>
                  {client?.email && <div>{client.email}</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Désignation du véhicule d'emprunt:</Label>
                <div className="mt-2 space-y-1">
                  <div>Marque : {vehicle?.brand || 'AUDI'}</div>
                  <div>Model : {vehicle?.model || 'Q2'}</div>
                  <div>N° Immatriculation : {vehicle?.license_plate || 'AC-426-FB'}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Départ:</Label>
                <div className="mt-2 space-y-1">
                  <div>Le : {formatDateToFrench(formData.startDate)}</div>
                  <div>Kilométrage : {formData.mileage}Km</div>
                </div>
              </div>
              
              <div>
                <Label className="font-semibold">Retour:</Label>
                <div className="mt-2 space-y-1">
                  <div>Le : {formatDateToFrench(formData.expectedReturnDate)}</div>
                  <div>Kilométrage : - - - Km</div>
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
                    checked={formData.attestationAccepted || false}
                    onCheckedChange={(checked) => onSignatureChange('attestationAccepted', checked)}
                    disabled={isViewMode}
                  />
                  <Label htmlFor="attestationAccepted" className="text-sm leading-relaxed font-normal">
                    Je certifie avoir pris connaissance de l'intégralité du document présent, et reconnais que ma signature apposée électroniquement sur la présente tablette vaut engagement ferme et personnel. Je confirme que cette signature constitue l'expression de mon consentement libre et éclairé, et engage ma pleine responsabilité juridique.
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

                <div className="text-right space-y-2">
                  <div className="text-sm text-muted-foreground">
                    La signature électronique a la même valeur légale qu'une signature manuscrite.
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Exigence issue du Règlement eIDAS et du Code civil français, art. 1366-1367).
                  </div>
                  <div className="text-sm text-muted-foreground">
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

export default AttestationTab;

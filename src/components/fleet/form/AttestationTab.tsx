
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SignaturePad from '@/components/shared/SignaturePad';
import { LoanFormData } from '../FleetLoanForm';

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
                  <div>KORPORATE</div>
                  <div>25 COURS PIERRE PUGET 13006 MARSEILLE</div>
                  <div>+33646465242</div>
                  <div>ggobeyn@outlook.fr</div>
                  <div>917 775 835</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Au Client:</Label>
                <div className="mt-2 space-y-1">
                  <div>{formData.holderInfo || 'Nom du client'}</div>
                  <div>{formData.insurancePhone || 'Téléphone'}</div>
                  <div>{formData.insuranceEmail || 'Email'}</div>
                  <div>{formData.insuranceAddress || 'Adresse'}</div>
                  <div>{formData.insuranceCity} {formData.insurancePostalCode}</div>
                  <div>N° :</div>
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
                  <div>Le : {formData.startDate}</div>
                  <div>Kilométrage : {formData.mileage}Km</div>
                </div>
              </div>
              
              <div>
                <Label className="font-semibold">Retour:</Label>
                <div className="mt-2 space-y-1">
                  <div>Le : {formData.expectedReturnDate}</div>
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
                    value={formData.holderInfo || ''}
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
                  <Label htmlFor="attestationAccepted" className="text-sm leading-relaxed">
                    Je certifie avoir pris connaissance de l'intégralité du document présent, et reconnais que ma signature apposée électroniquement sur la présente tablette vaut engagement ferme et personnel. Je confirme que cette signature constitue l'expression de mon consentement libre et éclairé, et engage ma pleine responsabilité juridique.
                  </Label>
                </div>
              </div>

              <div className="space-y-4">
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

                {/* Electronic Signature */}
                <SignaturePad
                  value={formData.clientSignature || ''}
                  onSignatureChange={(signature) => onSignatureChange('clientSignature', signature)}
                  disabled={isViewMode}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttestationTab;

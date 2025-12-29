import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SignaturePad from '@/components/shared/SignaturePad';
import { LoanFormData } from '../FleetLoanForm';
import { useCompany } from '@/hooks/use-company';
import { useClient } from '@/hooks/use-clients';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AttestationTabProps {
  formData: LoanFormData;
  vehicle: any;
  clientData?: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSignatureChange: (field: string, value: string | boolean) => void;
  isViewMode?: boolean;
}

const AttestationTab: React.FC<AttestationTabProps> = ({
  formData,
  vehicle,
  clientData: propClientData,
  onInputChange,
  onSignatureChange,
  isViewMode = false
}) => {
  const { companyInfo } = useCompany();
  const { client: fetchedClientData, isLoading: isLoadingClient } = useClient(formData.clientId);
  
  // Use prop data if provided, otherwise use fetched data
  const clientData = propClientData || fetchedClientData;

  // Auto-populate client name
  React.useEffect(() => {
    if (clientData && !formData.clientName) {
      const fullName = clientData.company_name || 
        `${clientData.first_name || ''} ${clientData.last_name || ''}`.trim();
      if (fullName) {
        onSignatureChange('clientName', fullName);
      }
    }
  }, [clientData, formData.clientName]);

  const formatDateTimeToFrench = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, "d MMMM yyyy 'à' HH:mm", { locale: fr });
    } catch {
      return dateString;
    }
  };

  if (isLoadingClient && !propClientData) {
    return <div className="text-center py-8 text-muted-foreground">Chargement des informations client...</div>;
  }

  return (
    <Card className="border-0 shadow-none" data-tour="attestation">
      <CardHeader className="px-0 pt-0 pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg">Attestation de prêt de véhicule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-0">
        {/* Company & Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Info */}
          <div className="p-3 sm:p-4 bg-muted/30 rounded-lg space-y-1.5">
            <Label className="font-semibold text-xs sm:text-sm text-muted-foreground">De :</Label>
            <div className="text-sm sm:text-base space-y-0.5">
              <p className="font-medium">{companyInfo?.name || 'Entreprise'}</p>
              <p className="text-muted-foreground text-xs sm:text-sm">{companyInfo?.address}</p>
              <p className="text-muted-foreground text-xs sm:text-sm">{companyInfo?.zipcode} {companyInfo?.city}</p>
            </div>
          </div>

          {/* Client Info */}
          <div className="p-3 sm:p-4 bg-muted/30 rounded-lg space-y-1.5">
            <Label className="font-semibold text-xs sm:text-sm text-muted-foreground">À :</Label>
            <div className="text-sm sm:text-base space-y-0.5">
              <p className="font-medium">
                {clientData?.company_name || 
                  `${clientData?.first_name || ''} ${clientData?.last_name || ''}`.trim() ||
                  formData.clientName || 'Client'}
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm">{clientData?.address}</p>
              <p className="text-muted-foreground text-xs sm:text-sm">
                {clientData?.postal_code} {clientData?.city}
              </p>
            </div>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="p-3 sm:p-4 bg-muted/30 rounded-lg space-y-2">
          <Label className="font-semibold text-xs sm:text-sm text-muted-foreground">Véhicule :</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground text-xs">Marque</span>
              <p className="font-medium">{vehicle?.car_brands?.name || '-'}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Modèle</span>
              <p className="font-medium">{vehicle?.car_models?.name || '-'}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Immatriculation</span>
              <p className="font-medium">{vehicle?.license_plate || '-'}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Kilométrage</span>
              <p className="font-medium">{formData.mileage?.toLocaleString('fr-FR') || 0} km</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-3 bg-muted/20 rounded-lg">
            <span className="text-muted-foreground text-xs">Départ</span>
            <p className="font-medium text-sm">{formatDateTimeToFrench(formData.startDate)}</p>
          </div>
          <div className="p-3 bg-muted/20 rounded-lg">
            <span className="text-muted-foreground text-xs">Retour prévu</span>
            <p className="font-medium text-sm">{formatDateTimeToFrench(formData.expectedReturnDate)}</p>
          </div>
        </div>

        {/* Attestation Text */}
        <div className="p-3 sm:p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-xs sm:text-sm leading-relaxed text-foreground">
            <span className="hidden sm:inline">
              Je soussigné(e), reconnais avoir pris connaissance de l'état du véhicule décrit ci-dessus et 
              m'engage à le restituer dans le même état. Je m'engage à respecter le code de la route et 
              à signaler immédiatement tout incident ou dommage survenu pendant la durée du prêt.
            </span>
            <span className="sm:hidden">
              Je reconnais l'état du véhicule et m'engage à le restituer identique, respecter le code de la route et signaler tout incident.
            </span>
          </p>
        </div>

        {/* Signature Section */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="space-y-2">
            <Label htmlFor="signatureName" className="text-sm">
              Nom et prénom du signataire <span className="text-destructive">*</span>
            </Label>
            <Input
              id="signatureName"
              name="clientName"
              value={formData.clientName || ''}
              onChange={onInputChange}
              placeholder="Entrez votre nom complet"
              disabled={isViewMode}
              className="max-w-md"
            />
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="attestationAccepted"
              checked={formData.attestationAccepted || false}
              onCheckedChange={(checked) => onSignatureChange('attestationAccepted', checked as boolean)}
              disabled={isViewMode}
              className="mt-0.5"
            />
            <Label htmlFor="attestationAccepted" className="text-xs sm:text-sm leading-relaxed cursor-pointer">
              J'atteste avoir lu et accepté les conditions de prêt du véhicule
            </Label>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Signature électronique <span className="text-destructive">*</span></Label>
            <div className="max-w-md">
              <SignaturePad
                value={formData.clientSignature || ''}
                onSignatureChange={(value) => onSignatureChange('clientSignature', value)}
                disabled={isViewMode}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttestationTab;

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCompany } from '@/hooks/use-company';
import { formatDate } from '@/utils/date-formatter';

interface FleetAttestationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loanId: string | null;
  loanData?: {
    vehicle: string;
    client: string;
    startDate: string;
    expectedReturnDate: string;
  };
}

const FleetAttestationDialog: React.FC<FleetAttestationDialogProps> = ({
  open,
  onOpenChange,
  loanId,
  loanData
}) => {
  const { companyData } = useCompany();

  const currentDate = formatDate(new Date().toISOString());

  if (!loanData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aperçu de l'attestation de prêt</DialogTitle>
        </DialogHeader>
        
        <div className="bg-white p-8 text-black text-sm leading-relaxed">
          {/* En-tête de l'entreprise */}
          <div className="text-center mb-8">
            <div className="font-bold text-lg mb-2">{companyData.name?.toUpperCase() || ''}</div>
            <div>{companyData.address || ''}</div>
            <div>{companyData.zipcode || ''} {companyData.city || ''}</div>
            <div>{companyData.phone || ''}</div>
            <div>{companyData.email || ''}</div>
            {companyData.siret && <div>SIRET: {companyData.siret}</div>}
          </div>

          {/* Titre du document */}
          <div className="text-center mb-8">
            <h2 className="font-bold text-xl border-b-2 border-black inline-block pb-2">
              ATTESTATION DE PRÊT DE VÉHICULE
            </h2>
          </div>

          {/* Date et lieu */}
          <div className="mb-8 text-right">
            {companyData.city}, le {currentDate}
          </div>

          {/* Corps de l'attestation */}
          <div className="mb-8 space-y-6">
            <div className="text-justify">
              Je soussigné(e), {companyData.name || ''}, représenté(e) par son dirigeant, 
              atteste par la présente que nous avons mis à disposition de :
            </div>

            {/* Informations du bénéficiaire */}
            <div className="bg-gray-50 p-4 rounded border">
              <div className="font-bold text-center mb-3">BÉNÉFICIAIRE DU PRÊT</div>
              <div className="font-bold">{loanData.client.toUpperCase()}</div>
              {/* TODO: Ajouter plus d'informations client si disponibles */}
            </div>

            {/* Informations du véhicule */}
            <div className="bg-gray-50 p-4 rounded border">
              <div className="font-bold text-center mb-3">VÉHICULE PRÊTÉ</div>
              <div>{loanData.vehicle}</div>
              {/* TODO: Ajouter plus d'informations véhicule si disponibles */}
            </div>

            {/* Période de prêt */}
            <div className="text-justify">
              Ce véhicule a été mis à disposition pour la période suivante :
            </div>

            <div className="bg-gray-50 p-4 rounded border text-center">
              <div className="font-bold">PÉRIODE DE PRÊT</div>
              <div className="mt-2">
                Du <span className="font-bold">{formatDate(loanData.startDate)}</span> 
                {' '}au <span className="font-bold">{formatDate(loanData.expectedReturnDate)}</span>
              </div>
            </div>

            {/* Conditions du prêt */}
            <div className="text-justify">
              Ce prêt de véhicule est effectué à titre gratuit dans le cadre de nos prestations de service. 
              Le bénéficiaire s'engage à :
            </div>

            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Utiliser le véhicule avec soin et en bon père de famille</li>
              <li>Respecter le Code de la route et toutes les réglementations en vigueur</li>
              <li>Restituer le véhicule dans l'état où il a été confié</li>
              <li>Signaler immédiatement tout sinistre ou dommage</li>
              <li>Ne pas sous-louer ou prêter le véhicule à un tiers</li>
            </ul>

            {/* Assurance */}
            <div className="text-justify">
              Le véhicule est assuré par nos soins pour la durée du prêt. 
              Toute franchise éventuelle reste à la charge du bénéficiaire en cas de sinistre responsable.
            </div>

            {/* Finalisation */}
            <div className="text-justify">
              Cette attestation est établie pour servir et valoir ce que de droit.
            </div>
          </div>

          {/* Signature */}
          <div className="mt-12">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="mb-4">Le bénéficiaire</div>
                <div className="font-bold">{loanData.client.toUpperCase()}</div>
                <div className="mt-8 border-t border-gray-400 pt-2">Signature</div>
              </div>
              
              <div className="text-center">
                <div className="mb-4">Le prêteur</div>
                <div className="font-bold">{companyData.name?.toUpperCase() || ''}</div>
                <div className="mt-8 border-t border-gray-400 pt-2">Signature et cachet</div>
              </div>
            </div>
          </div>

          {/* Mentions légales */}
          <div className="mt-8 text-xs text-gray-600 border-t pt-4">
            <div className="text-center">
              Document établi le {currentDate} - Référence: PRET-{loanId}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FleetAttestationDialog;
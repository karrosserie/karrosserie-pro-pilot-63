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
          {/* Titre du document */}
          <div className="text-center mb-8">
            <h1 className="text-blue-600 font-bold text-xl mb-2">
              CONTRAT DE PRÊT DE VÉHICULE DE COURTOISIE
            </h1>
            <div className="text-blue-600 text-sm italic">
              (Version amendée, complétée et renforcée)
            </div>
          </div>

          {/* ENTRE LES SOUSSIGNÉS */}
          <div className="mb-6">
            <h2 className="text-blue-600 font-bold text-lg mb-4">ENTRE LES SOUSSIGNÉS :</h2>
            
            <div className="mb-4">
              <div className="font-bold">Le Prêteur :</div>
              <div>Nom du garage : {companyData.name?.toUpperCase() || "KORPORATE"}</div>
              <div>Adresse : {companyData.address || "25 COURS PIERRE PUGET 13006"}</div>
              <div>N° SIRET : {companyData.siret || "917 775 835 00015"}</div>
              <div>Représenté par : {companyData.name?.toUpperCase() || "KORPORATE"}</div>
            </div>

            <div className="font-bold mb-2">ET</div>

            <div className="mb-4">
              <div className="font-bold">L'Emprunteur :</div>
              <div>Raison sociale : {loanData.client}</div>
              <div>Adresse : 36 AV DE FRAIS VALLON 13013 MARSEILLE 13</div>
              <div>Nom et prénom de l'employeur : Monsieur BOUCIE Ahmad</div>
              <div>Téléphone : +33646465242</div>
            </div>
          </div>

          {/* PRÉAMBULE */}
          <div className="mb-6">
            <h2 className="text-blue-600 font-bold text-lg mb-4">PRÉAMBULE</h2>
            <div className="text-justify">
              Le présent contrat est conclu à titre exceptionnel et gracieux, dans le seul but de faciliter la mobilité temporaire de l'Emprunteur pendant l'immobilisation de son véhicule. Cette mise à disposition n'entraine aucune relation commerciale de location et ne saurait créer une quelconque obligation de résultat à l'égard du Prêteur quant aux performances, au confort ou à l'adaptation du véhicule aux besoins spécifiques de l'Emprunteur.
            </div>
          </div>

          {/* 1. OBJET DU CONTRAT */}
          <div className="mb-6">
            <h2 className="text-blue-600 font-bold text-lg mb-4">1. OBJET DU CONTRAT</h2>
            <div className="mb-2">
              Le garage met gratuitement à disposition de l'Emprunteur le véhicule suivant :
            </div>
            <div className="ml-4">
              <div>Marque : {loanData.vehicle.split(' ')[0] || "AUDI"}</div>
              <div>Modèle : {loanData.vehicle.split(' ').slice(1).join(' ') || "Q2"}</div>
              <div>N° d'immatriculation : AC-426-FB</div>
              <div>Carburant : 92 %</div>
              <div>Kilométrage : 234567 Km</div>
            </div>
          </div>

          {/* 2. DURÉE DU PRÊT */}
          <div className="mb-6">
            <h2 className="text-blue-600 font-bold text-lg mb-4">2. DURÉE DU PRÊT</h2>
            <div>Période initiale : du {formatDate(loanData.startDate)} au {formatDate(loanData.expectedReturnDate)}</div>
            <div className="font-bold mt-2">Restitution anticipée obligatoire.</div>
            <div className="mt-2">
              L'emprunteur s'engage expressément à restituer le véhicule sans délai dès que son véhicule personnel est prêt, même si cette disponibilité intervient avant la date de fin prévue initialement.
            </div>
            
            <div className="mt-4">
              <div className="font-bold">2.3. Prolongation</div>
              <div>
                Toute demande de prolongation doit être formulée par écrit 24 heures avant l'échéance et reste soumise à l'acceptation discrétionnaire du Prêteur qui se réserve le droit de refuser sans avoir à justifier sa décision.
              </div>
            </div>

            <div className="mt-4">
              <div className="font-bold">2.4. Pénalités de retard</div>
              <div>
                Tout retard non justifié et préalablement accepté par écrit par le Prêteur entraînera une pénalité forfaitaire de 150€ par jour de retard entamé, sans préjudice de toute action en justice que le Prêteur pourrait intenter pour obtenir la restitution du véhicule.
              </div>
            </div>
          </div>

          {/* 3. UTILISATION DU VÉHICULE */}
          <div className="mb-6">
            <h2 className="text-blue-600 font-bold text-lg mb-4">3. UTILISATION DU VÉHICULE</h2>
            
            <div className="mb-4">
              <div className="font-bold">3.1. Conducteurs autorisés</div>
              <div>L'utilisation du véhicule est strictement limitée à :</div>
              <div className="ml-4 mt-2">
                <div>L'Emprunteur nommément désigné dans ce contrat</div>
                <div>Les employés de l'Emprunteur expressément listés dans l'annexe, titulaires d'un permis de conduire valide depuis plus de 3 ans, et dont copie du permis a été fournie au Prêteur avant la signature du présent contrat</div>
                <div>Tout prêt, cession ou mise à disposition du véhicule à une tierce personne entraîne:</div>
              </div>
            </div>

            <div className="font-bold">1. La résiliation immédiate du contrat</div>
          </div>

          {/* Signature */}
          <div className="mt-12">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="mb-4">L'Emprunteur</div>
                <div className="font-bold">{loanData.client.toUpperCase()}</div>
                <div className="mt-8 border-t border-gray-400 pt-2">Signature</div>
              </div>
              
              <div className="text-center">
                <div className="mb-4">Le Prêteur</div>
                <div className="font-bold">{companyData.name?.toUpperCase() || "KORPORATE"}</div>
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
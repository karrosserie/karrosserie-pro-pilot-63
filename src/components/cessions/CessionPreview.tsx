import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Cession } from '@/services/supabase/cessions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CessionPreviewProps {
  cession: Cession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CessionPreview = ({ cession, open, onOpenChange }: CessionPreviewProps) => {
  if (!cession) return null;

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: fr });
  };

  const clientName = cession.repair_orders?.clients 
    ? `${cession.repair_orders.clients.first_name} ${cession.repair_orders.clients.last_name}`
    : 'Client non assigné';

  const vehicleInfo = cession.repair_orders?.vehicles 
    ? `${cession.repair_orders.vehicles.car_brands?.name || 'Marque inconnue'} ${cession.repair_orders.vehicles.car_models?.name || 'Modèle inconnu'} - ${cession.repair_orders.vehicles.license_plate}`
    : 'Véhicule non assigné';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aperçu du document de cession</DialogTitle>
        </DialogHeader>
        
        <div className="bg-white p-8 text-black font-serif text-sm leading-relaxed">
          {/* Header text */}
          <p className="mb-8 text-justify">
            Conformément à l'article 1369-4 du Code civil, cette notification est également valablement effectuée par 
            courrier à l'adresse suivante : ffc@clearbus.fr, avec accusé de réception électronique.
          </p>

          {/* Company info and destination */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <div className="font-bold mb-2">KORPORATE</div>
              <div>25 COURS PIERRE PUGET</div>
              <div>13006 MARSEILLE</div>
              <div>ggobeyn@outlook.fr</div>
              <div>+33646465242</div>
            </div>
            
            <div className="text-right">
              <div className="font-bold mb-2">
                {cession.insurance_companies?.name || 'ASSURANCE'}
              </div>
              <div>8-10 RUE DE LA FERME</div>
              <div>92100 BOULOGNE-BILLANCOURT</div>
            </div>
          </div>

          {/* Document details */}
          <div className="mb-8">
            <div className="mb-4">
              <strong>Objet :</strong> Notification de cession de créance (Article 1324 du Code civil)
            </div>
            <div className="mb-2">
              <strong>N° sinistre :</strong> {cession.incident_number || 'N/A'}
            </div>
            <div className="mb-2">
              <strong>N° contrat :</strong> {cession.policy_number || 'N/A'}
            </div>
            <div className="mb-2">
              <strong>PV expertise :</strong> {cession.report_number || 'N/A'}
            </div>
          </div>

          {/* Date and place */}
          <div className="mb-8">
            <strong>MARSEILLE</strong>, le {formatDate(cession.created_at)}
          </div>

          {/* Greeting */}
          <div className="mb-6">
            Madame, Monsieur,
          </div>

          {/* Main text */}
          <div className="mb-8 text-justify">
            Conformément aux dispositions des articles 1321 et suivants du Code civil et L.121-13 du Code des 
            assurances, nous vous notifions par la présente la cession de créance intervenue ce jour entre :
          </div>

          {/* Cedant info */}
          <div className="mb-8">
            <div className="font-bold mb-2">CÉDANT</div>
            <div className="font-bold">{clientName.toUpperCase()}</div>
            <div>6 B PLACE FONTAINE DU TEMPLE RESIDENCE LES SYLPHIDES</div>
            <div>06100 NICE</div>
            <div>ggobeyn@outlook.fr</div>
            <div>0646465242</div>
          </div>

          {/* Au profit de */}
          <div className="mb-6">
            Au profit de :
          </div>

          {/* Cessionnaire info */}
          <div className="mb-8">
            <div className="font-bold mb-2">CESSIONNAIRE</div>
            <div className="font-bold">KORPORATE</div>
            <div>25 COURS PIERRE PUGET</div>
            <div>13006 MARSEILLE</div>
            <div>ggobeyn@outlook.fr</div>
            <div>+33646465242</div>
          </div>

          {/* Vehicle details section */}
          <div className="mb-8">
            <div className="mb-4">
              <strong>Concernant l'indemnisation des réparations du véhicule :</strong>
            </div>
            <div className="mb-2">
              <strong>{cession.repair_orders?.vehicles?.car_brands?.name?.toUpperCase() || 'VÉHICULE'} {cession.repair_orders?.vehicles?.car_models?.name || ''}</strong>
            </div>
            <div className="mb-2">
              Immatriculation : {cession.repair_orders?.vehicles?.license_plate || 'N/A'}
            </div>
            <div className="mb-2">
              N° Série :
            </div>
          </div>

          {/* Incident date */}
          <div className="mb-8">
            Suite au sinistre survenu le {cession.incident_date ? formatDate(cession.incident_date) : 'N/A'}.
          </div>

          {/* Legal basis */}
          <div className="mb-8">
            <div className="mb-4">
              <strong>Cette cession est effectuée en vertu :</strong>
            </div>
            <div className="mb-2">- De l'article L.121-13 du Code des assurances</div>
            <div className="mb-2">- Des articles 1321 à 1326 du Code civil</div>
            <div className="mb-2">- Du PV d'expertise n°{cession.report_number || 'N/A'}</div>
            <div className="mb-2">- Du privilège du garagiste (article 2332, 3° du Code civil)</div>
          </div>

          {/* Payment request */}
          <div className="mb-8 text-justify">
            En conséquence, nous vous demandons de procéder au règlement de l'indemnité d'un montant de 1 094,79 € TTC directement sur notre compte bancaire :
          </div>

          {/* Bank details */}
          <div className="mb-8">
            <div className="mb-2"><strong>BANQUE : CIC</strong></div>
            <div className="mb-2"><strong>IBAN : FR76 0123 4567 8901 2345 6789 123</strong></div>
            <div className="mb-2"><strong>BIC : CICFRPP</strong></div>
          </div>

          {/* Attachments */}
          <div className="mb-8">
            <div className="mb-4"><strong>Vous trouverez ci-joint :</strong></div>
            <div className="mb-2">1. Le contrat de cession de créance original</div>
            <div className="mb-2">2. L'ordre de réparation n°72</div>
          </div>

          {/* Closing text */}
          <div className="mb-8 text-justify">
            Dans l'attente du règlement dans les délais légaux prescrits par l'article L.211-5-1 du Code des assurances, nous vous prions d'agréer, Madame, Monsieur, l'expression de notre considération distinguée.
          </div>

          {/* Signature */}
          <div className="mb-8">
            <div className="font-bold mb-4">KORPORATE</div>
            <div className="mt-16 mb-4">
              <div className="font-bold text-2xl mb-2" style={{ fontFamily: 'cursive' }}>MUSSO DORIAN</div>
            </div>
            <div className="text-sm">Approuvé par MUSSO DORIAN</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
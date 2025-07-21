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

          {/* Additional vehicle info */}
          <div className="mt-8 pt-8 border-t border-gray-300 text-xs text-gray-600">
            <div><strong>Véhicule concerné :</strong> {vehicleInfo}</div>
            <div><strong>Date de l'incident :</strong> {cession.incident_date ? formatDate(cession.incident_date) : 'N/A'}</div>
            <div><strong>Expert :</strong> {cession.expert_name || 'N/A'}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
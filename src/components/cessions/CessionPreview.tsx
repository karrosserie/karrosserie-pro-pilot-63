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
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CessionPreview = ({ cession, isOpen, onOpenChange }: CessionPreviewProps) => {
  if (!cession) return null;

  const getClientInfo = () => {
    if (cession.repair_orders?.clients) {
      const client = cession.repair_orders.clients as any;
      return {
        name: `${client.first_name} ${client.last_name}`,
        address: client.address || '',
        city: client.city || '',
        postal_code: client.postal_code || '',
        email: client.email || '',
        phone: client.phone || ''
      };
    }
    return {
      name: 'MUSSO DORIAN',
      address: '6 B PLACE FONTAINE DU TEMPLE RESIDENCE LES SYLPHIDES',
      city: 'NICE',
      postal_code: '06100',
      email: 'ggobeyn@outlook.fr',
      phone: '0646465242'
    };
  };

  const getVehicleInfo = () => {
    if (cession.repair_orders?.vehicles) {
      const vehicle = cession.repair_orders.vehicles;
      return {
        brand: vehicle.car_brands?.name || 'PEUGEOT',
        model: vehicle.car_models?.name || '308',
        license_plate: vehicle.license_plate || 'ED-684-JH',
        mileage: '94090 Km'
      };
    }
    return {
      brand: 'PEUGEOT',
      model: '308',
      license_plate: 'ED-684-JH',
      mileage: '94090 Km'
    };
  };

  const clientInfo = getClientInfo();
  const vehicleInfo = getVehicleInfo();
  const currentDate = format(new Date(), 'dd/MM/yyyy', { locale: fr });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aperçu du document de cession</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8 p-6 bg-white text-black">
          {/* Page 1: Convention de cession */}
          <div className="border-b-2 border-black pb-8">
            <div className="text-center mb-8">
              <h1 className="text-xl font-bold border-t-2 border-b-2 border-black py-2 px-4">
                CONVENTION DE CESSION DE CRÉANCE D'INDEMNITÉ D'ASSURANCE
              </h1>
            </div>
            
            <div className="mb-6">
              <p className="text-sm mb-2">(Articles 1321 et suivants du Code Civil)</p>
              <p className="text-sm">(Article L.121-13 du Code des assurances)</p>
            </div>

            <div className="mb-6">
              <p className="font-semibold mb-2">Entre les soussignés:</p>
              
              <div className="mb-4">
                <p className="font-semibold">LE CÉDANT</p>
                <p className="font-semibold">{clientInfo.name}</p>
                <p>{clientInfo.address}</p>
                <p>{clientInfo.postal_code} {clientInfo.city}</p>
                <p>{clientInfo.email}</p>
                <p>{clientInfo.phone}</p>
                <p className="text-sm italic mt-2">Ci-après dénommé "Le Client/Assuré"</p>
              </div>

              <p className="font-semibold mb-2">ET</p>

              <div className="mb-4">
                <p className="font-semibold">LE CESSIONNAIRE</p>
                <p className="font-semibold">KORPORATE</p>
                <p>25 COURS PIERRE PUGET</p>
                <p>13006 MARSEILLE</p>
                <p>ggobeyn@outlook.fr</p>
                <p>+33646465242</p>
                <p className="text-sm italic mt-2">Ci-après dénommé "Le Réparateur professionnel"</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-4">EXPOSÉ PRÉALABLE</h2>
              <p className="mb-2">Conformément aux dispositions :</p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li>De l'article 1321 du Code civil établissant le principe et les effets de la cession de créance</li>
                <li>De l'article L.121-13 du Code des assurances imposant le versement de l'indemnité pour la remise en état effectif du bien assuré</li>
                <li>De l'article R.121-5 du Code des assurances relatif aux modalités de règlement des indemnités d'assurance</li>
                <li>De l'arrêt de la Cour de cassation du 13 juin 2019 (n°18-17.907) confirmant l'opposabilité de la cession de créance d'indemnité d'assurance</li>
                <li>De l'arrêt de la Cour de cassation du 17 février 2015 (n°13-27.080) sur l'obligation de l'assureur de régler l'indemnité au réparateur cessionnaire</li>
              </ul>
              <p className="mt-4">Le Client/Assuré entend céder sa créance d'indemnité d'assurance au Réparateur professionnel.</p>
            </div>

            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-4">IDENTIFICATION DU SINISTRE</h2>
              <div className="space-y-1">
                <p><span className="font-semibold">Compagnie d'assurance :</span> {cession.insurance_companies?.name || 'ACTIVE ASSURANCES'}</p>
                <p><span className="font-semibold">N° de contrat :</span> {cession.policy_number || '7718265A'}</p>
                <p><span className="font-semibold">Référence sinistre :</span> {cession.report_number || '00125A'} du {format(cession.incident_date ? new Date(cession.incident_date) : new Date(), 'dd/MM/yyyy', { locale: fr })}</p>
                <p><span className="font-semibold">Expert mandaté :</span> {cession.expert_name || 'DEVAUX MATTHIEU'}</p>
                <p><span className="font-semibold">Rapport d'expertise n° :</span> AE25008924</p>
                <p><span className="font-semibold">Montant validé :</span> 1 094,79 € TTC</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-4">IDENTIFICATION DU VÉHICULE</h2>
              <div className="space-y-1">
                <p><span className="font-semibold">Véhicule</span> {vehicleInfo.brand} {vehicleInfo.model}</p>
                <p><span className="font-semibold">N° d'enregistrement</span> {vehicleInfo.license_plate}</p>
                <p><span className="font-semibold">Kilométrage</span> {vehicleInfo.mileage}</p>
              </div>
            </div>
          </div>

          {/* Page 2: Convention suite */}
          <div className="border-b-2 border-black pb-8">
            <h2 className="font-semibold text-lg mb-4">CONVENTION</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Article 1 : Objet et portée de la cession</h3>
                <p className="text-sm mb-2">1.1 Le Client/Assuré déclare céder, sans réserve et de manière irrévocable, au Réparateur professionnel qui accepte, la créance d'indemnisation qu'il détient sur la compagnie d'assurance susvisée.</p>
                <p className="text-sm mb-2">1.2 Cette cession est consentie en application des articles 1321 et suivants du Code civil et L.121-13 du Code des assurances, pour garantir le paiement des réparations conformes au rapport d'expertise n°AE25008924.</p>
                <p className="text-sm">1.3 Le Réparateur professionnel est subrogé dans tous les droits, actions et privilèges du Cédant vis-à-vis de la compagnie d'assurance.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Article 2 : Montant et composition de la créance cédée</h3>
                <p className="text-sm mb-2">La créance cédée correspond au montant total de 1 094,79 € TTC, comprenant :</p>
                <ul className="list-disc list-inside text-sm ml-4 space-y-1">
                  <li>Pièces détachées : 24,50 € HT</li>
                  <li>Main d'œuvre : 443,94 € HT</li>
                  <li>Peinture et ingrédients : 443,88 € HT</li>
                  <li>TVA : 182,47 € HT</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Article 3 : Garanties du Cédant</h3>
                <p className="text-sm mb-1">Le Cédant garantit expressément, sous sa responsabilité :</p>
                <ul className="list-disc list-inside text-sm ml-4 space-y-1">
                  <li>3.1 L'existence et la disponibilité de la créance cédée</li>
                  <li>3.2 Sa qualité de titulaire légitime du contrat d'assurance</li>
                  <li>3.3 L'absence de toute cession ou délégation antérieure</li>
                  <li>3.4 L'absence de cause de déchéance de garantie</li>
                  <li>3.5 La validité et le maintien des garanties d'assurance</li>
                  <li>3.6 L'absence de contestation sur le montant de l'indemnité</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Page 3: Notification et signatures */}
          <div>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Article 5 : Notification et opposabilité</h3>
              <p className="text-sm mb-2">5.1 La présente cession sera notifiée à la compagnie d'assurance par :</p>
              <ul className="list-disc list-inside text-sm ml-4 space-y-1">
                <li>Lettre recommandée avec accusé de réception</li>
                <li>Courrier avec accusé de réception</li>
                <li>Télécopie avec accusé de réception</li>
              </ul>
              <p className="text-sm mt-2">5.2 Le Réparateur professionnel est expressément mandaté pour effectuer cette notification.</p>
            </div>

            <div className="mb-8">
              <p className="text-sm mb-4">Fait à MARSEILLE, le {currentDate}</p>
              <p className="text-sm mb-4">En trois exemplaires originaux</p>
              
              <div className="flex justify-between mt-8">
                <div className="text-center">
                  <p className="font-semibold mb-4">Le Cédant</p>
                  <div className="mb-4">
                    <div className="w-16 h-16 rounded-full border-2 border-black mx-auto mb-2 flex items-center justify-center bg-red-500">
                      <span className="text-white font-bold text-xs">∞</span>
                    </div>
                    <p className="text-xs">Approuvé par KORPORATE Entreprise</p>
                  </div>
                  <p className="text-sm">Lu et approuvé,</p>
                  <p className="text-sm">Bon pour cession irrévocable de créance</p>
                  <p className="text-sm">d'un montant de 1 094,79 € TTC</p>
                </div>
                
                <div className="text-center">
                  <p className="font-semibold mb-4">Le Cessionnaire</p>
                  <div className="mb-4">
                    <div className="text-2xl mb-2" style={{ fontFamily: 'cursive' }}>
                      MUSSO DORIAN
                    </div>
                    <p className="text-xs">Approuvé par MUSSO DORIAN</p>
                  </div>
                  <p className="text-sm">Bon pour acceptation de cession</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-semibold mb-2">Vous trouverez ci-joint :</p>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>La copie du rapport d'expertise</li>
                <li>La copie de la carte grise du véhicule 72</li>
                <li>La copie du permis de conduire de l'assuré 72</li>
              </ol>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
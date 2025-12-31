import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { useCompany } from '@/hooks/use-company';
import { formatDate } from '@/utils/date-formatter';
import { getCurrentPosition } from '@/utils/geolocation';
import { useFleetReservation } from '@/hooks/use-fleet-reservations';
import { Loader2 } from 'lucide-react';

interface FleetAttestationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loanId: string | null;
}

const BODY_PARTS_SIMPLIFIED = [
  'Extérieur (carrosserie)',
  'Intérieur (habitacle)',
  'Jantes / Pneus',
  'Vitrage',
  'Accessoires (clés, docs)',
];

const FleetAttestationDialog: React.FC<FleetAttestationDialogProps> = ({
  open,
  onOpenChange,
  loanId,
}) => {
  const { companyData } = useCompany();
  const [userPosition, setUserPosition] = useState<string>('[position en cours...]');
  
  const { reservation: loanData, isLoading } = useFleetReservation(open && loanId ? loanId : undefined);

  const contractDate = formatDate(new Date().toISOString());
  const contractNumber = `CPV-${new Date().getFullYear()}-${loanData?.id?.substring(0, 6) || '000000'}`;

  useEffect(() => {
    const getUserPosition = async () => {
      try {
        const position = await getCurrentPosition();
        setUserPosition(`${position.latitude.toFixed(6)},${position.longitude.toFixed(6)}`);
      } catch (error) {
        console.error('Erreur de géolocalisation:', error);
        setUserPosition('[position non disponible]');
      }
    };

    if (open) {
      getUserPosition();
    }
  }, [open]);

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!loanData) return null;

  const damagedVehicle = loanData?.quotes?.vehicles;
  const clientName = `${loanData?.clients?.first_name || ''} ${loanData?.clients?.last_name || ''}`.trim();
  const insurerName = loanData?.insurance_company_name || '[Assureur]';
  const assisteurName = (loanData as any)?.assistance_name || '[Assisteur]';
  const companyName = companyData?.name || '[Carrossier]';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-white text-black text-sm leading-relaxed p-4">
          {/* En-tête */}
          <div className="text-center mb-6">
            <h1 className="font-bold text-xl mb-1">
              CONTRAT DE MISE À DISPOSITION DE VÉHICULE DE PRÊT
            </h1>
            <p className="text-sm italic mb-1">
              (Articles 1875 à 1891 du Code civil - Prêt à usage)
            </p>
            <p className="text-sm italic">
              Avec autorisation de paiement direct à l'assisteur
            </p>
          </div>

          <div className="flex justify-between mb-6 text-sm">
            <span>N° Contrat : {contractNumber}</span>
            <span>Date : {contractDate}</span>
          </div>

          {/* Article 1 - Identification des parties */}
          <div className="mb-4">
            <h2 className="font-bold text-base bg-gray-200 p-1 mb-3">ARTICLE 1 - IDENTIFICATION DES PARTIES</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold underline mb-2">LE PRÊTEUR (ci-après "le Prêteur")</h3>
                <p>{companyData?.name || ''}</p>
                <p>{companyData?.address || ''}</p>
                <p>{companyData?.zipcode || ''} {companyData?.city || ''}</p>
                <p>Tél : {companyData?.phone || ''}</p>
                <p>Email : {companyData?.email || ''}</p>
                <p>SIRET : {companyData?.siret || ''}</p>
              </div>
              <div>
                <h3 className="font-bold underline mb-2">L'EMPRUNTEUR (ci-après "l'Emprunteur")</h3>
                <p>{clientName}</p>
                <p>{loanData?.clients?.address || ''}</p>
                <p>{loanData?.clients?.postal_code || ''} {loanData?.clients?.city || ''}</p>
                <p>Tél : {loanData?.clients?.phone || ''}</p>
                <p>Email : {loanData?.clients?.email || ''}</p>
                <p>N° Permis : {loanData?.clients?.license_number || '[Non renseigné]'}</p>
                <p>Délivré le : {loanData?.clients?.license_issue_date ? formatDate(loanData.clients.license_issue_date) : '[Non renseigné]'}</p>
              </div>
            </div>
          </div>

          {/* Article 2 - Assurance et Assistance */}
          <div className="mb-4">
            <h2 className="font-bold text-base bg-gray-200 p-1 mb-3">ARTICLE 2 - ASSURANCE ET ASSISTANCE</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-2">ASSUREUR</h3>
                <p>Compagnie : {insurerName}</p>
                <p>N° contrat : {loanData?.insurance_contract_number || ''}</p>
                <p>N° sinistre : {loanData?.quotes?.claim_number || ''}</p>
                <p>Email : {loanData?.insurance_email || ''}</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">ASSISTEUR</h3>
                <p>Société : {assisteurName}</p>
                <p>N° dossier : {loanData?.assistance_case_number || ''}</p>
                <p>Email : {loanData?.assistance_email || ''}</p>
                <p>Formule : {(loanData as any)?.assistance_formula || ''}</p>
              </div>
            </div>
          </div>

          {/* Article 3 - Véhicules */}
          <div className="mb-4">
            <h2 className="font-bold text-base bg-gray-200 p-1 mb-3">ARTICLE 3 - VÉHICULES</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-400 p-3">
                <h3 className="font-bold text-center mb-2">VÉHICULE SINISTRÉ</h3>
                <p><span className="inline-block w-24">Marque :</span> {damagedVehicle?.car_brands?.name || ''}</p>
                <p><span className="inline-block w-24">Modèle :</span> {damagedVehicle?.car_models?.name || ''}</p>
                <p><span className="inline-block w-24">Immatriculation :</span> {damagedVehicle?.license_plate || ''}</p>
                <p><span className="inline-block w-24">N° VIN :</span> {damagedVehicle?.vin || ''}</p>
              </div>
              <div className="border border-gray-400 p-3">
                <h3 className="font-bold text-center mb-2">VÉHICULE DE PRÊT</h3>
                <p><span className="inline-block w-24">Marque :</span> {loanData?.fleet_vehicles?.car_brands?.name || ''}</p>
                <p><span className="inline-block w-24">Modèle :</span> {loanData?.fleet_vehicles?.car_models?.name || ''}</p>
                <p><span className="inline-block w-24">Immatriculation :</span> {loanData?.fleet_vehicles?.license_plate || ''}</p>
                <p><span className="inline-block w-24">N° VIN :</span> {loanData?.fleet_vehicles?.vin || ''}</p>
              </div>
            </div>
          </div>

          {/* Article 4 - Durée du prêt */}
          <div className="mb-4">
            <h2 className="font-bold text-base bg-gray-200 p-1 mb-3">ARTICLE 4 - DURÉE DU PRÊT</h2>
            
            <h3 className="font-bold mb-2">4.1 Période de mise à disposition</h3>
            <div className="border border-black mb-3">
              <div className="flex border-b border-black">
                <div className="flex-1 p-1 font-bold border-r border-black">Mise à disposition</div>
                <div className="flex-1 p-1">{loanData?.start_date ? formatDate(loanData.start_date) : ''}</div>
              </div>
              <div className="flex border-b border-black">
                <div className="flex-1 p-1 font-bold border-r border-black">Restitution prévue</div>
                <div className="flex-1 p-1">{loanData?.expected_return_date ? formatDate(loanData.expected_return_date) : ''}</div>
              </div>
              <div className="flex">
                <div className="flex-1 p-1 font-bold border-r border-black">Durée garantie</div>
                <div className="flex-1 p-1">{(loanData as any)?.assistance_formula || ''}</div>
              </div>
            </div>

            <h3 className="font-bold mb-1">4.2 Restitution anticipée</h3>
            <p className="mb-2 text-justify">
              L'Emprunteur s'engage à restituer le véhicule dès que son véhicule personnel sera disponible, 
              même si cette date intervient avant la fin de la période prévue.
            </p>

            <h3 className="font-bold mb-1">4.3 Prolongation</h3>
            <p className="mb-2 text-justify">
              Toute prolongation doit faire l'objet d'une demande écrite au moins 24 heures avant la fin de la période initiale, 
              et nécessite l'accord préalable du Prêteur et de l'assisteur.
            </p>

            <h3 className="font-bold mb-1">4.4 Pénalités de retard</h3>
            <p className="text-justify">
              Tout retard non autorisé dans la restitution entraînera une facturation de 45 € HT par jour de retard, 
              sans préjudice des éventuelles poursuites pour abus de confiance.
            </p>
          </div>

          {/* Article 5 - Conducteur autorisé */}
          <div className="mb-4">
            <h2 className="font-bold text-base bg-gray-200 p-1 mb-3">ARTICLE 5 - CONDUCTEUR AUTORISÉ</h2>
            
            <h3 className="font-bold mb-1">5.1 Conducteur unique</h3>
            <p className="mb-2 text-justify">
              Seul l'Emprunteur désigné ci-dessus est autorisé à conduire le véhicule de prêt. 
              Le conducteur doit être titulaire d'un permis de conduire valide depuis plus de 2 ans.
            </p>
            <div className="mb-3">
              <p><span className="inline-block w-40">N° permis de conduire :</span> {loanData?.clients?.license_number || ''}</p>
              <p><span className="inline-block w-40">Date de délivrance :</span> {loanData?.clients?.license_issue_date ? formatDate(loanData.clients.license_issue_date) : ''}</p>
              <p><span className="inline-block w-40">Préfecture :</span> {loanData?.clients?.prefecture || ''}</p>
            </div>

            <h3 className="font-bold mb-1">5.2 Interdiction de prêt à tiers</h3>
            <p className="mb-2 text-justify">
              Il est formellement interdit à l'Emprunteur de prêter le véhicule à un tiers. 
              Toute infraction à cette règle entraînera une pénalité de 500 € et la résiliation immédiate du contrat.
            </p>

            <h3 className="font-bold mb-1">5.3 Conducteur secondaire (optionnel)</h3>
            <div>
              <p><span className="inline-block w-40">Nom :</span> ________________________________________</p>
              <p><span className="inline-block w-40">N° permis :</span> ________________________________________</p>
            </div>
          </div>

          {/* Article 6 - Conditions d'utilisation */}
          <div className="mb-4">
            <h2 className="font-bold text-base bg-gray-200 p-1 mb-3">ARTICLE 6 - CONDITIONS D'UTILISATION</h2>
            
            <h3 className="font-bold mb-1">6.1 Cadre autorisé</h3>
            <p className="mb-2 text-justify">
              Le véhicule est destiné à un usage personnel en France métropolitaine uniquement. 
              Le kilométrage est limité à 150 km par jour. Tout dépassement sera facturé 0,30 € HT/km.
            </p>

            <h3 className="font-bold mb-1">6.2 Usages interdits</h3>
            <ul className="list-none ml-4 mb-2">
              <li>• Transport de personnes à titre onéreux (VTC, taxi)</li>
              <li>• Remorquage ou poussée d'un autre véhicule</li>
              <li>• Apprentissage de la conduite</li>
              <li>• Compétitions sportives ou essais de vitesse</li>
              <li>• Transport de marchandises dangereuses, illicites ou malodorantes</li>
              <li>• Usage en dehors du territoire français sans autorisation écrite</li>
            </ul>

            <h3 className="font-bold mb-1">6.3 Obligations de sécurité</h3>
            <ul className="list-none ml-4 mb-2">
              <li>• Taux d'alcoolémie : 0,0 g/l (tolérance zéro)</li>
              <li>• Interdiction d'usage du téléphone au volant</li>
              <li>• Port de la ceinture obligatoire pour tous les passagers</li>
              <li>• Respect strict du Code de la route</li>
              <li>• Interdiction de fumer dans le véhicule</li>
            </ul>

            <h3 className="font-bold mb-1">6.4 Entretien courant</h3>
            <p className="mb-1 text-justify">L'Emprunteur prend à sa charge pendant la durée du prêt :</p>
            <ul className="list-none ml-4">
              <li>• Le carburant</li>
              <li>• Les frais de péage et de stationnement</li>
              <li>• La vérification régulière des niveaux (huile, liquide de refroidissement, lave-glace)</li>
              <li>• Le gonflage des pneumatiques</li>
            </ul>
          </div>

          {/* Article 7 - Assurance du véhicule de prêt */}
          <div className="mb-4">
            <h2 className="font-bold text-base bg-gray-200 p-1 mb-3">ARTICLE 7 - ASSURANCE DU VÉHICULE DE PRÊT</h2>
            
            <h3 className="font-bold mb-1">7.1 Couverture</h3>
            <p className="mb-2">Le véhicule de prêt est assuré par le Prêteur. Les garanties applicables sont :</p>
            <ul className="list-none ml-4 mb-2">
              <li>☐ Responsabilité civile</li>
              <li>☐ Dommages tous accidents</li>
              <li>☐ Vol / Incendie</li>
              <li>☐ Bris de glace</li>
            </ul>

            <h3 className="font-bold mb-1">7.2 Franchise</h3>
            <p className="mb-2 text-justify">
              En cas de sinistre responsable ou sans tiers identifié, la franchise reste à la charge de l'Emprunteur.
              Montant de la franchise : ____________ €
            </p>

            <h3 className="font-bold mb-1">7.3 Exclusions de garantie</h3>
            <p className="mb-1">L'assurance ne couvre pas les sinistres survenus dans les cas suivants :</p>
            <ul className="list-none ml-4">
              <li>• Conduite sous l'emprise de l'alcool ou de stupéfiants</li>
              <li>• Conducteur non autorisé au présent contrat</li>
              <li>• Usage non conforme aux conditions du contrat</li>
              <li>• Vol avec les clés laissées dans le véhicule</li>
            </ul>
          </div>

          {/* Article 8 - Procédure en cas de sinistre */}
          <div className="mb-4">
            <h2 className="font-bold text-base bg-gray-200 p-1 mb-3">ARTICLE 8 - PROCÉDURE EN CAS DE SINISTRE</h2>
            
            <h3 className="font-bold mb-1">8.1 Obligations immédiates</h3>
            <p className="mb-1">En cas d'accident ou de sinistre, l'Emprunteur doit impérativement :</p>
            <ol className="list-decimal ml-8 mb-2">
              <li>Prévenir immédiatement le Prêteur par téléphone au {companyData?.phone || ''}</li>
              <li>Remplir un constat amiable avec le tiers (le cas échéant)</li>
              <li>Relever l'identité et les coordonnées des témoins éventuels</li>
              <li>Prendre des photos des dégâts et de la scène</li>
              <li>Déposer plainte en cas de vol, vandalisme ou délit de fuite</li>
              <li>Transmettre tous les documents au Prêteur dans les 48 heures</li>
            </ol>

            <h3 className="font-bold mb-1">8.2 Informations à recueillir</h3>
            <p className="mb-2 text-justify">
              En cas d'accident avec un tiers, relever : nom, adresse, téléphone, assurance, n° de police, 
              immatriculation du véhicule adverse.
            </p>

            <h3 className="font-bold mb-1">8.3 Interdictions</h3>
            <ul className="list-none ml-4">
              <li>• Ne jamais reconnaître sa responsabilité sur place</li>
              <li>• Ne pas faire réparer le véhicule sans accord du Prêteur</li>
              <li>• Ne signer aucun document engageant la responsabilité du Prêteur</li>
            </ul>
          </div>

          {/* Article 9 - Infractions */}
          <div className="mb-4">
            <h2 className="font-bold text-base bg-gray-200 p-1 mb-3">ARTICLE 9 - INFRACTIONS AU CODE DE LA ROUTE</h2>
            <p className="mb-2 text-justify">
              L'Emprunteur est seul responsable des infractions commises pendant la durée du prêt. 
              Il s'engage à régler directement les amendes et contraventions.
            </p>
            <p className="mb-2 text-justify">
              En cas de réception d'un avis de contravention par le Prêteur, les coordonnées de l'Emprunteur 
              seront transmises à l'autorité compétente.
            </p>
            <p className="text-justify">
              Frais administratifs : 30 € par infraction + frais de fourrière éventuels.
            </p>
          </div>

          {/* Article 10 - Restitution */}
          <div className="mb-4">
            <h2 className="font-bold text-base bg-gray-200 p-1 mb-3">ARTICLE 10 - RESTITUTION DU VÉHICULE</h2>
            
            <h3 className="font-bold mb-1">10.1 État de restitution</h3>
            <p className="mb-1">Le véhicule doit être restitué :</p>
            <ul className="list-none ml-4 mb-2">
              <li>• Propre intérieurement et extérieurement</li>
              <li>• Avec le même niveau de carburant qu'au départ</li>
              <li>• Avec tous les documents et accessoires (clés, carte grise, carte verte)</li>
              <li>• Sans nouveaux dommages non signalés</li>
            </ul>

            <h3 className="font-bold mb-1">10.2 Frais de remise en état</h3>
            <div className="border border-black mb-2">
              <div className="flex bg-gray-200 border-b border-black">
                <div className="flex-1 p-1 font-bold border-r border-black">Prestation</div>
                <div className="flex-1 p-1 font-bold">Tarif HT</div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="flex-1 p-1 border-r border-gray-300">Nettoyage extérieur</div>
                <div className="flex-1 p-1">30 €</div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="flex-1 p-1 border-r border-gray-300">Nettoyage intérieur</div>
                <div className="flex-1 p-1">80 €</div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="flex-1 p-1 border-r border-gray-300">Désodorisation (tabac, animaux)</div>
                <div className="flex-1 p-1">150 €</div>
              </div>
              <div className="flex">
                <div className="flex-1 p-1 border-r border-gray-300">Complément carburant</div>
                <div className="flex-1 p-1">Prix station + 20%</div>
              </div>
            </div>
          </div>

          {/* Article 11 - Tarification */}
          <div className="mb-4">
            <h2 className="font-bold text-base bg-gray-200 p-1 mb-3">ARTICLE 11 - TARIFICATION</h2>
            <p className="mb-2 text-justify">
              Le prêt du véhicule est consenti dans le cadre de la prise en charge par l'assisteur.
            </p>
            <div className="border border-black mb-2">
              <div className="flex bg-gray-200 border-b border-black">
                <div className="flex-1 p-1 font-bold border-r border-black">Formule</div>
                <div className="flex-1 p-1 font-bold">Tarif HT / jour</div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="flex-1 p-1 border-r border-gray-300">Tarif journalier standard</div>
                <div className="flex-1 p-1">45 €</div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="flex-1 p-1 border-r border-gray-300">Forfait 7 jours</div>
                <div className="flex-1 p-1">280 €</div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="flex-1 p-1 border-r border-gray-300">Forfait 14 jours</div>
                <div className="flex-1 p-1">490 €</div>
              </div>
              <div className="flex">
                <div className="flex-1 p-1 border-r border-gray-300">Forfait 21 jours</div>
                <div className="flex-1 p-1">650 €</div>
              </div>
            </div>
            <p className="text-justify">
              Au-delà de la durée couverte par l'assisteur, le tarif journalier sera facturé à l'Emprunteur.
            </p>
          </div>

          {/* Article 12 - Délégation de paiement */}
          <div className="mb-4">
            <h2 className="font-bold text-base bg-gray-200 p-1 mb-3">ARTICLE 12 - DÉLÉGATION DE PAIEMENT</h2>
            <div className="border border-black p-3 bg-gray-50">
              <p className="mb-2 text-justify">
                Conformément aux dispositions de l'article 1336 du Code civil, l'Emprunteur, en sa qualité de délégant, 
                délègue par les présentes au Prêteur, en sa qualité de délégataire, le paiement des frais de mise à 
                disposition du véhicule de prêt par :
              </p>
              <p className="mb-1">• L'assureur : {insurerName}</p>
              <p className="mb-2">• Et/ou l'assisteur : {assisteurName}</p>
              <p className="mb-2 text-justify">
                Cette délégation est consentie dans la limite du montant des garanties prévues au contrat d'assurance 
                et/ou d'assistance de l'Emprunteur.
              </p>
              <p className="mb-2 font-bold text-justify">
                L'Emprunteur, {clientName}, AUTORISE EXPRESSÉMENT ET IRRÉVOCABLEMENT le carrossier {companyName} 
                à percevoir directement les indemnités dues au titre du véhicule de remplacement.
              </p>
              <p className="text-justify">
                En cas de refus de prise en charge ou de prise en charge partielle par l'assureur ou l'assisteur, 
                l'Emprunteur s'engage à régler personnellement le solde restant dû.
              </p>
            </div>
          </div>

          {/* Article 13 - État des lieux */}
          <div className="mb-4">
            <h2 className="font-bold text-base bg-gray-200 p-1 mb-3">ARTICLE 13 - ÉTAT DES LIEUX</h2>
            <div className="border border-black mb-2">
              <div className="flex bg-gray-200 border-b border-black">
                <div className="flex-[2] p-1 font-bold border-r border-black">Élément</div>
                <div className="flex-1 p-1 font-bold text-center border-r border-black">RAS</div>
                <div className="flex-1 p-1 font-bold text-center">Dégâts</div>
              </div>
              {BODY_PARTS_SIMPLIFIED.map((part, index) => (
                <div key={index} className="flex border-b border-gray-300 last:border-b-0">
                  <div className="flex-[2] p-1 border-r border-gray-300">{part}</div>
                  <div className="flex-1 p-1 text-center border-r border-gray-300">☐</div>
                  <div className="flex-1 p-1 text-center">☐</div>
                </div>
              ))}
            </div>
            <div className="mb-2">
              <p><span className="inline-block w-40">Kilométrage départ :</span> {loanData?.start_mileage || '________'} km</p>
              <p><span className="inline-block w-40">Carburant départ :</span> {loanData?.fuel_level_start || '____'}%</p>
            </div>
          </div>

          {/* Article 14 - Fondements juridiques */}
          <div className="mb-4">
            <h2 className="font-bold text-base bg-gray-200 p-1 mb-3">ARTICLE 14 - FONDEMENTS JURIDIQUES</h2>
            <ul className="list-none text-xs">
              <li>• Art. 1875-1891 Code civil : prêt à usage (commodat)</li>
              <li>• Art. 1336-1340 Code civil : délégation de paiement</li>
              <li>• Art. 1231-1 Code civil : responsabilité contractuelle</li>
              <li>• Art. L.211-1 et suivants Code des assurances : assurance automobile</li>
              <li>• Art. L.211-10 Code des assurances : garantie assistance</li>
              <li>• Art. L.211-5-1 Code des assurances : libre choix du réparateur</li>
            </ul>
          </div>

          {/* Article 15 - Signatures */}
          <div className="mb-4">
            <h2 className="font-bold text-base bg-gray-200 p-1 mb-3">ARTICLE 15 - ACCEPTATION ET SIGNATURES</h2>
            <p className="mb-3 text-justify">
              L'Emprunteur déclare avoir pris connaissance de l'ensemble des conditions du présent contrat et les accepter sans réserve.
            </p>
            <p className="mb-4">
              Fait à {companyData?.city || '________________'}, le {contractDate}, en deux exemplaires.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="border border-gray-400 p-4 min-h-[100px]">
                <h3 className="font-bold text-center mb-2">LE PRÊTEUR</h3>
                <p className="text-center text-sm">{companyData?.name || ''}</p>
                <p className="text-center text-xs mt-1">Cachet et signature</p>
              </div>
              <div className="border border-gray-400 p-4 min-h-[100px]">
                <h3 className="font-bold text-center mb-2">L'EMPRUNTEUR</h3>
                <p className="text-center text-sm">{clientName}</p>
                {loanData?.client_signature && (
                  <img src={loanData.client_signature} alt="Signature du client" className="max-w-[100px] h-auto mx-auto my-2" />
                )}
                <p className="text-center text-xs italic mt-2">
                  "Lu et approuvé, bon pour prêt et autorisation de paiement direct"
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-600 mt-6 pt-4 border-t">
            <p>Contrat généré le {contractDate} - Document ayant valeur contractuelle entre les parties</p>
            {userPosition !== '[position en cours...]' && (
              <p className="mt-1">Position : {userPosition}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FleetAttestationDialog;

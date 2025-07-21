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
import { useCompany } from '@/hooks/use-company';
import { useInsuranceCompanies } from '@/hooks/use-insurance-companies';

interface CessionPreviewProps {
  cession: Cession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CessionPreview = ({ cession, open, onOpenChange }: CessionPreviewProps) => {
  if (!cession) return null;

  const { companyData } = useCompany();
  const { insuranceCompanies } = useInsuranceCompanies();
  
  const selectedInsuranceCompany = insuranceCompanies.find(
    company => company.id === cession.insurance_company_id
  );

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: fr });
  };

  const clientName = cession.repair_orders?.clients 
    ? `${cession.repair_orders.clients.first_name} ${cession.repair_orders.clients.last_name}`
    : 'Client non assigné';

  const vehicleInfo = cession.repair_orders?.vehicles 
    ? `${cession.repair_orders.vehicles.car_brands?.name || 'Marque inconnue'} ${cession.repair_orders.vehicles.car_models?.name || 'Modèle inconnu'} - ${cession.repair_orders.vehicles.license_plate}`
    : 'Véhicule non assigné';

  const clientData = cession.repair_orders?.clients;
  const vehicleData = cession.repair_orders?.vehicles;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aperçu du document de cession</DialogTitle>
        </DialogHeader>
        
        <div className="bg-white p-8 text-black text-sm leading-relaxed">
          {/* Header text */}
          <p className="mb-8 text-justify">
            Conformément à l'article 1369-4 du Code civil, cette notification est également valablement effectuée par 
            courrier à l'adresse suivante : {selectedInsuranceCompany?.email || ''}, avec accusé de réception électronique.
          </p>

          {/* Company info and destination */}
          <div className="mb-2">
            <div className="font-bold">{companyData.name?.toUpperCase() || ''}</div>
            <div>{companyData.address || ''}</div>
            <div>{companyData.zipcode || ''} {companyData.city || ''}</div>
            <div>{companyData.email || ''}</div>
            <div>{companyData.phone || ''}</div>
          </div>
                
          <div className="ml-64 mb-8">
            <div className="font-bold">
              {selectedInsuranceCompany?.name || ''}
            </div>
            {selectedInsuranceCompany?.address && <div>{selectedInsuranceCompany.address}</div>}
            {selectedInsuranceCompany?.address2 && <div>{selectedInsuranceCompany.address2}</div>}
            <div>{selectedInsuranceCompany?.zipcode || ''} {selectedInsuranceCompany?.city || ''}</div>
          </div>

          {/* Document details */}
          <div className="mb-8">
            <div className="mb-4">
              <strong>Objet :</strong> Notification de cession de créance (Article 1324 du Code civil)
            </div>
            <div>
              <strong>N° sinistre :</strong> {cession.incident_number || 'N/A'}
            </div>
            <div>
              <strong>N° contrat :</strong> {cession.policy_number || 'N/A'}
            </div>
            <div>
              <strong>PV expertise :</strong> {cession.report_number || 'N/A'}
            </div>
          </div>

          {/* Date and place */}
          <div className="mb-8">
            MARSEILLE, le {formatDate(cession.created_at)}
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
            <div>CÉDANT</div>
            <div className="font-bold">{clientName.toUpperCase()}</div>
            {clientData?.address && <div>{clientData.address}</div>}
            {clientData?.postal_code && clientData?.city && <div>{clientData.postal_code} {clientData.city}</div>}
            {clientData?.email && <div>{clientData.email}</div>}
            {clientData?.phone && <div>{clientData.phone}</div>}
          </div>

          {/* Au profit de */}
          <div className="mb-6">
            Au profit de :
          </div>

          {/* Cessionnaire info */}
          <div className="mb-8">
            <div>CESSIONNAIRE</div>
            <div className="font-bold">{companyData.name?.toUpperCase() || ''}</div>
            <div>{companyData.address || ''}</div>
            <div>{companyData.zipcode || ''} {companyData.city || ''}</div>
            <div>{companyData.email || ''}</div>
            <div>{companyData.phone || ''}</div>
          </div>

          {/* Vehicle details section */}
          <div className="mb-8">
            <div className="mb-2">
              Concernant l'indemnisation des réparations du véhicule :
            </div>
            <div>
              <strong>{cession.repair_orders?.vehicles?.car_brands?.name?.toUpperCase() || ''} {cession.repair_orders?.vehicles?.car_models?.name || ''}</strong>
            </div>
            <div>
              Immatriculation : {cession.repair_orders?.vehicles?.license_plate || 'N/A'}
            </div>
            <div>
              N° Série : {vehicleData?.vin || 'N/A'}
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
            En conséquence, nous vous demandons de procéder au règlement de l'indemnité d'un montant de {cession.repair_orders?.amount ? `${cession.repair_orders.amount.toFixed(2)} €` : '0,00 €'} TTC directement sur notre compte bancaire :
          </div>

          {/* Bank details */}
          <div className="mb-8">
            <div><strong>BANQUE : {cession.bank_accounts?.bank || ''}</strong></div>
            <div><strong>IBAN : {cession.bank_accounts?.iban || ''}</strong></div>
            <div><strong>BIC : {cession.bank_accounts?.bic || ''}</strong></div>
          </div>

          {/* Attachments */}
          <div className="mb-8">
            <div className="mb-4"><strong>Vous trouverez ci-joint :</strong></div>
            <div>1. Le contrat de cession de créance original</div>
            <div className="mb-2">2. L'ordre de réparation</div>
          </div>

          {/* Closing text */}
          <div className="mb-8 text-justify">
            Dans l'attente du règlement dans les délais légaux prescrits par l'article L.211-5-1 du Code des assurances, nous vous prions d'agréer, Madame, Monsieur, l'expression de notre considération distinguée.
          </div>

          {/* Additional cession confirmation section */}
          <div className="mb-8 border-t border-gray-300 pt-8">
            {/* Cedant and Insurance details */}
            <div>
              <div className="font-bold">{clientName.toUpperCase()}</div>
              {clientData?.address && <div>{clientData.address}</div>}
              {clientData?.postal_code && clientData?.city && <div>{clientData.postal_code} {clientData.city}</div>}
              {clientData?.email && <div>{clientData.email}</div>}
              {clientData?.phone && <div>{clientData.phone}</div>}
            </div>
              
            <div className="text-right mb-8">
              <div className="font-bold">{selectedInsuranceCompany?.name || ''}</div>
              {selectedInsuranceCompany?.address && <div>{selectedInsuranceCompany.address}</div>}
              {selectedInsuranceCompany?.address2 && <div>{selectedInsuranceCompany.address2}</div>}
              <div>{selectedInsuranceCompany?.zipcode || ''} {selectedInsuranceCompany?.city || ''}</div>
            </div>

            {/* Subject */}
            <div className="mb-6">
              <strong>Objet :</strong> Confirmation de cession de créance - Dossier sinistre n°{cession.incident_number || ''}
            </div>

            {/* Greeting */}
            <div className="mb-4">
              Madame, Monsieur,
            </div>

            {/* Main confirmation text */}
            <div className="mb-6 text-justify">
              Je soussigné(e) {clientName.toUpperCase()}, assuré(e) sous le contrat n°{cession.policy_number || ''}, vous confirme avoir cédé ma 
              créance d'indemnisation à {companyData.name?.toUpperCase() || ''} concernant les réparations de mon véhicule {cession.repair_orders?.vehicles?.car_brands?.name || ''} {cession.repair_orders?.vehicles?.car_models?.name || ''} 
              immatriculé {cession.repair_orders?.vehicles?.license_plate || ''}.
            </div>

            {/* Legal reference */}
            <div className="mb-6 text-justify">
              En application de l'article L.121-13 du Code des assurances, je vous demande expressément de verser 
              l'indemnité directement au réparateur.
            </div>

            <div className="mb-8 text-justify">
              Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.
            </div>

            {/* Date and place */}
            <div className="mb-8">
              Fait à MARSEILLE, le {formatDate(cession.created_at)}
            </div>

            {/* Signature section */}
            <div className="flex justify-center items-center mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <div className="text-white text-xs font-bold">∞</div>
                </div>
                <div className="text-xs">Approuvé par {companyData.name || ''} Entreprise</div>
              </div>
            </div>
          </div>
          
          {/* Convention de cession section */}
          <div className="mb-8 border-t-2 border-black pt-8">
            {/* Title */}
            <div className="text-center mb-6">
              <div className="border-t-2 border-black pt-4 pb-4 border-b-2">
                <h2 className="font-bold text-lg">CONVENTION DE CESSION DE CRÉANCE D'INDEMNITÉ D'ASSURANCE</h2>
              </div>
            </div>

            {/* Legal references */}
            <div className="mb-6">
              <div>(Articles 1321 et suivants du Code Civil)</div>
              <div>(Article L.121-13 du Code des assurances)</div>
            </div>

            <div className="mb-4">
              Entre les soussignés:
            </div>

            {/* Le Cédant */}
            <div className="mb-6">
              <div className="font-bold mb-2">LE CÉDANT</div>
              <div className="font-bold">{clientName.toUpperCase()}</div>
              {clientData?.address && <div>{clientData.address}</div>}
              {clientData?.postal_code && clientData?.city && <div>{clientData.postal_code} {clientData.city}</div>}
              {clientData?.email && <div>{clientData.email}</div>}
              {clientData?.phone && <div>{clientData.phone}</div>}
              <div className="mt-2">Ci-après dénommé "Le Client/Assuré"</div>
            </div>

            <div className="mb-4 font-bold">ET</div>

            {/* Le Cessionnaire */}
            <div className="mb-8">
              <div className="font-bold mb-2">LE CESSIONNAIRE</div>
              <div className="font-bold">{companyData.name?.toUpperCase() || ''}</div>
              <div>{companyData.address || ''}</div>
              <div>{companyData.zipcode || ''} {companyData.city || ''}</div>
              <div>{companyData.email || ''}</div>
              <div>{companyData.phone || ''}</div>
              <div className="mt-2">Ci-après dénommé "Le Réparateur professionnel"</div>
            </div>

            {/* Exposé préalable */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4">EXPOSÉ PRÉALABLE</h3>
              
              <div className="mb-4">Conformément aux dispositions :</div>
              
              <div className="mb-2">- De l'article 1321 du Code civil établissant le principe et les effets de la cession de créance</div>
              <div className="mb-2">- De l'article L.121-13 du Code des assurances imposant le versement de l'indemnité pour la remise en état effective du bien assuré</div>
              <div className="mb-2">- De l'article R.121-5 du Code des assurances relatif aux modalités de règlement des indemnités d'assurance</div>
              <div className="mb-2">- De l'arrêt de la Cour de cassation du 13 juin 2019 (n°18-17.907) confirmant l'opposabilité de la cession de créance d'indemnité d'assurance</div>
              <div className="mb-6">- De l'arrêt de la Cour de cassation du 17 février 2015 (n°13-27.080) sur l'obligation de l'assureur de régler l'indemnité au réparateur cessionnaire</div>
              
              <div className="mb-8">Le Client/Assuré entend céder sa créance d'indemnité d'assurance au Réparateur professionnel.</div>
            </div>

            {/* Identification du sinistre */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4">IDENTIFICATION DU SINISTRE</h3>
              
              <div className="mb-2"><strong>Compagnie d'assurance :</strong> {selectedInsuranceCompany?.name || 'ASSURANCE'}</div>
              <div className="mb-2"><strong>N° de contrat :</strong> {cession.policy_number || '7718265A'}</div>
              <div className="mb-2"><strong>Référence sinistre :</strong> {cession.incident_number || '00125A'} du {cession.incident_date ? formatDate(cession.incident_date) : '17/07/2025'}</div>
              <div className="mb-2"><strong>Expert mandaté :</strong> {cession.expert_name || 'DEVAUX MATTHIEU'}</div>
              <div className="mb-2"><strong>Rapport d'expertise n° :</strong> {cession.report_number || 'AE25008924'}</div>
              <div className="mb-2"><strong>Montant validé :</strong> {cession.repair_orders?.amount ? `${cession.repair_orders.amount.toFixed(2)} €` : '0,00 €'} TTC</div>
            </div>

            {/* Identification du véhicule */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4">IDENTIFICATION DU VÉHICULE</h3>
              
              <div className="mb-2"><strong>Véhicule</strong> {cession.repair_orders?.vehicles?.car_brands?.name || 'PEUGEOT'} {cession.repair_orders?.vehicles?.car_models?.name || '308'}</div>
              <div className="mb-2"><strong>N° d'enregistrement</strong> {cession.repair_orders?.vehicles?.license_plate || 'ED-684-JH'}</div>
              <div className="mb-2"><strong>Kilométrage</strong> 94090 Km</div>
            </div>

            {/* Convention */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-6">CONVENTION</h3>
              
              {/* Article 1 */}
              <div className="mb-6">
                <div className="font-bold mb-2">Article 1 : Objet et portée de la cession</div>
                
                <div className="mb-2">1.1 Le Client/Assuré déclare céder, sans réserve et de manière irrévocable, au Réparateur professionnel qui accepte, la créance d'indemnisation qu'il détient sur la compagnie d'assurance susvisée.</div>
                
                <div className="mb-2">1.2 Cette cession est consentie en application des articles 1321 et suivants du Code civil et L.121-13 du Code des assurances, pour garantir le paiement des réparations conformes au rapport d'expertise n°{cession.report_number || 'AE25008924'}.</div>
                
                <div className="mb-2">1.3 Le Réparateur professionnel est subrogé dans tous les droits, actions et privilèges du Cédant vis-à-vis de la compagnie d'assurance.</div>
              </div>

              {/* Article 2 */}
              <div className="mb-6">
                <div className="font-bold mb-2">Article 2 : Montant et composition de la créance cédée</div>
                
                <div className="mb-2">La créance cédée correspond au montant total de {cession.repair_orders?.amount ? `${cession.repair_orders.amount.toFixed(2)} €` : '0,00 €'} TTC, comprenant :</div>
                <div className="mb-1">- Pièces détachées : 24,50 € HT</div>
                <div className="mb-1">- Main d'œuvre : 443,94 € HT</div>
                <div className="mb-1">- Peinture et ingrédients : 443,88 € HT</div>
                <div className="mb-2">- TVA : 182,47 € HT</div>
              </div>

              {/* Article 3 */}
              <div className="mb-6">
                <div className="font-bold mb-2">Article 3 : Garanties du Cédant</div>
                
                <div className="mb-2">Le Cédant garantit expressément, sous sa responsabilité :</div>
                <div className="mb-1">3.1 L'existence et la disponibilité de la créance cédée</div>
                <div className="mb-1">3.2 Sa qualité de titulaire légitime du contrat d'assurance</div>
                <div className="mb-1">3.3 L'absence de toute cession ou délégation antérieure</div>
                <div className="mb-1">3.4 L'absence de cause de déchéance de garantie</div>
                <div className="mb-1">3.5 La validité et le maintien des garanties d'assurance</div>
                <div className="mb-2">3.6 L'absence de contestation sur le montant de l'indemnité</div>
              </div>

              {/* Article 4 */}
              <div className="mb-6">
                <div className="font-bold mb-2">Article 4 : Obligations spécifiques de l'Assuré</div>
                
                <div className="mb-2">Le Client/Assuré s'engage irrévocablement à :</div>
                <div className="mb-1">4.1 Ne pas révoquer la présente cession</div>
                <div className="mb-1">4.2 Ne pas percevoir directement l'indemnité d'assurance</div>
                <div className="mb-1">4.3 Informer immédiatement le Réparateur de toute notification de l'assurance</div>
                <div className="mb-2">4.4 Coopérer pour la bonne exécution de la présente convention</div>
              </div>

              {/* Article 5 */}
              <div className="mb-6">
                <div className="font-bold mb-2">Article 5 : Notification et opposabilité</div>
                
                <div className="mb-2">5.1 La présente cession sera notifiée à la compagnie d'assurance par :</div>
                <div className="mb-1">- Lettre recommandée avec accusé de réception</div>
                <div className="mb-1">- Courriel avec accusé de réception</div>
                <div className="mb-1">- Télécopie avec accusé de réception</div>
                
                <div className="mb-2">5.2 Le Réparateur professionnel est expressément mandaté pour effectuer cette notification.</div>
                
                <div className="mb-2">5.3 La notification mentionnera :</div>
                <div className="mb-1">- La référence du sinistre</div>
                <div className="mb-1">- Le montant de la créance cédée</div>
                <div className="mb-1">- Les coordonnées bancaires du Réparateur</div>
                <div className="mb-2">- La mention expresse de l'article L.121-13 du Code des assurances</div>
              </div>

              {/* Article 6 */}
              <div className="mb-6">
                <div className="font-bold mb-2">Article 6 : Privilège et droit de rétention</div>
                
                <div className="mb-1">6.1 Le Réparateur bénéficie du privilège spécial mobilier prévu par l'article 2332 3° du Code civil.</div>
                <div className="mb-2">6.2 Le Réparateur pourra exercer son droit de rétention jusqu'au complet paiement.</div>
              </div>

              {/* Article 7 */}
              <div className="mb-6">
                <div className="font-bold mb-2">Article 7 : Clause de substitution</div>
                
                <div className="mb-2">En cas d'invalidité d'une clause, celle-ci sera réputée non écrite sans affecter la validité des autres dispositions.</div>
              </div>

              {/* Article 8 */}
              <div className="mb-8">
                <div className="font-bold mb-2">Article 8 : Attribution de compétence</div>
                
                <div className="mb-2">Tout litige relèvera de la compétence exclusive du Tribunal Judiciaire de MARSEILLE.</div>
              </div>

              {/* Date et signatures */}
              <div className="mb-8">
                <div className="mb-4">Fait à MARSEILLE, le {formatDate(cession.created_at)}</div>
                <div className="mb-8">En trois exemplaires originaux</div>
                
                <div className="grid grid-cols-2 gap-8 mb-8">
                  {/* Le Cédant */}
                  <div>
                    <div className="font-bold mb-4">Le Cédant</div>
                    <div className="flex justify-center items-center mb-4">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                        <div className="text-white text-xs font-bold">∞</div>
                      </div>
                    </div>
                    <div className="text-xs text-center mb-2">Approuvé par KORPORATE Entreprise</div>
                    <div className="text-sm">Lu et approuvé,</div>
                    <div className="text-sm">Bon pour cession irrévocable de créance</div>
                    <div className="text-sm">d'un montant de 1 094,79 € TTC</div>
                  </div>
                  
                  {/* Le Cessionnaire */}
                  <div>
                    <div className="font-bold mb-4">Le Cessionnaire</div>
                    <div className="text-center mb-4">
                      <div className="font-bold text-2xl mb-2" style={{ fontFamily: 'cursive' }}>MUSSO DORIAN</div>
                    </div>
                    <div className="text-xs text-center mb-2">Approuvé par MUSSO DORIAN</div>
                    <div className="text-sm">Bon pour acceptation de cession</div>
                  </div>
                </div>
              </div>

              {/* Pièces jointes */}
              <div className="mb-8">
                <div className="font-bold mb-4">Vous trouverez ci-joint :</div>
                <div className="mb-1">1. La copie du rapport d'expertise</div>
                <div className="mb-1">2. La copie de la carte grise du véhicule72</div>
                <div className="mb-1">3. La copie du permis de conduire de l'assuré72</div>
              </div>
            </div>
          </div>

          {/* Attestation sur l'honneur section */}
          <div className="mb-8 border-t-2 border-black pt-8">
            {/* Title */}
            <div className="text-center mb-6">
              <div className="border-t-2 border-black pt-4 pb-4 border-b-2">
                <h2 className="font-bold text-lg">ATTESTATION SUR L'HONNEUR D'ABSENCE DE SURFACTURATION</h2>
              </div>
            </div>

            {/* Legal reference */}
            <div className="text-center mb-8">
              (Conformément à l'article L. 441-7 du Code de commerce)
            </div>

            {/* Company and destination */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="font-bold">KORPORATE</div>
                <div>25 COURS PIERRE PUGET</div>
                <div>13006 MARSEILLE</div>
                <div>ggobeyn@outlook.fr</div>
                <div>+33646465242</div>
              </div>
              
              <div className="text-right">
                <div className="mb-4">A l'attention de :</div>
                <div className="font-bold">{cession.insurance_companies?.name || 'ACTIVE ASSURANCES'}</div>
                <div>8-10 RUE DE LA FERME</div>
                <div>92100 BOULOGNE-BILLANCOURT</div>
              </div>
            </div>

            {/* Object */}
            <div className="mb-8">
              <strong>Objet :</strong> Attestation sur l'honneur certifiant l'absence de surfacturation
            </div>

            {/* Claim details */}
            <div className="mb-8">
              <div className="mb-2"><strong>N° sinistre :</strong> {cession.incident_number || '00125A'}</div>
              <div className="mb-2"><strong>N° contrat :</strong> {cession.policy_number || '7718265A'}</div>
              <div className="mb-2"><strong>PV expertise :</strong> {cession.report_number || 'AE25008924'}</div>
              <div className="mb-2"><strong>Véhicule :</strong> {cession.repair_orders?.vehicles?.license_plate || 'ED-684-JH'}</div>
            </div>

            {/* Attestation text */}
            <div className="mb-8">
              <p className="mb-6">Nous attestons par la présente, conformément à l'article L. 441-7 du Code de commerce, que :</p>
              
              <div className="mb-6">
                <div className="mb-4">
                  <strong>1.</strong> Les travaux de réparation effectués sur le véhicule {cession.repair_orders?.vehicles?.car_brands?.name || 'PEUGEOT'} {cession.repair_orders?.vehicles?.car_models?.name || '308'} (immatriculation {cession.repair_orders?.vehicles?.license_plate || 'ED-684-JH'}, n° 
                  série ) dans le cadre du sinistre survenu le {cession.incident_date ? formatDate(cession.incident_date) : '17/07/2025'}, référencé sous le n°{cession.incident_number || '00125A'}, ont été facturés en 
                  stricte conformité avec :
                </div>
                <div className="ml-8 mb-2">o Les tarifs professionnels habituellement pratiqués par notre établissement ;</div>
                <div className="ml-8 mb-2">o Les préconisations techniques du constructeur {cession.repair_orders?.vehicles?.car_brands?.name || 'PEUGEOT'} ;</div>
                <div className="ml-8 mb-2">o Les dispositions du rapport d'expertise n° {cession.report_number || 'AE25008924'} ;</div>
                <div className="ml-8 mb-4">o Les règles de l'art en vigueur dans le secteur de la réparation automobile.</div>
              </div>

              <div className="mb-6">
                <div className="mb-4">
                  <strong>2.</strong> Aucune majoration abusive, surcoût injustifié ou pratique commerciale déloyale n'a été appliquée. Les 
                  montants facturés correspondent intégralement :
                </div>
                <div className="ml-8 mb-2">o Au coût des pièces détachées (neuves ou d'occasion selon accord) ;</div>
                <div className="ml-8 mb-2">o Au temps de main d'œuvre réellement consacré ;</div>
                <div className="ml-8 mb-4">o Aux prestations annexes nécessaires à la remise en état du véhicule.</div>
              </div>

              <div className="mb-8">
                <strong>3.</strong> Cette attestation est délivrée en toute honnêteté, sous réserve des sanctions pénales prévues par les 
                articles L. 441-7 et L. 454-1 du Code de commerce en cas de déclaration frauduleuse.
              </div>
            </div>

            {/* Date and signature */}
            <div className="mb-8">
              <div className="mb-6">Fait à MARSEILLE, le {formatDate(cession.created_at)}</div>
              
              <div className="mb-4 font-bold">KORPORATE</div>
              
              <div className="text-center mb-4">
                <div className="font-bold text-2xl mb-2" style={{ fontFamily: 'cursive' }}>MUSSO DORIAN</div>
              </div>
              <div className="text-xs text-center">Approuvé par MUSSO DORIAN</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
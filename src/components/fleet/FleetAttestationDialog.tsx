import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCompany } from '@/hooks/use-company';
import { formatDate } from '@/utils/date-formatter';
import { getCurrentPosition, getDepartmentFromZipCode } from '@/utils/geolocation';

interface FleetAttestationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loanId: string | null;
  loanData?: any; // Données complètes de la réservation avec relations
}

const FleetAttestationDialog: React.FC<FleetAttestationDialogProps> = ({
  open,
  onOpenChange,
  loanId,
  loanData
}) => {
  const { companyData } = useCompany();
  const [userPosition, setUserPosition] = useState<string>('[position en cours...]');

  const loanCreationDate = loanData?.created_at ? formatDate(loanData.created_at) : formatDate(new Date().toISOString());

  // Obtenir la position de l'utilisateur
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

  if (!loanData) return null;
  
  // Debug pour voir la structure des données
  console.log('FleetAttestationDialog loanData:', loanData);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aperçu de l'attestation de prêt</DialogTitle>
        </DialogHeader>

        <div className="text-center mb-8">
          <h1 className="font-bold text-xl mb-2">
            ATTESTATION DE PRÊT DE VÉHICULE DE COURTOISIE
          </h1>
        </div>
        
        <div className="grid grid-cols-[1fr_1.5fr_1fr] gap-6 mb-6">
          {/* Colonne 1 - Entreprise */}
          <div>
            {companyData.logo_url ? (
              <div className="flex items-center justify-start mb-3" style={{maxWidth: '120px'}}>
                <img src={companyData.logo_url} alt="Logo entreprise" className="max-w-full h-auto object-contain" />
              </div>
            ) : (
              <div className="bg-orange-500 rounded-full p-2 w-fit mb-3">
                <span className="text-white font-bold text-base">LOGO</span>
              </div>
            )}
            <p className="text-black font-bold mb-2 text-sm">{companyData.name || ''}</p>
            <div className="text-sm text-black space-y-1">
              <p>{companyData.address || ''}</p>
              <p>{companyData.zipcode || ''} {companyData.city || ''}</p>
              <p>Téléphone : {companyData.phone || ''}</p>
              <p>E-mail : {companyData.email || ''}</p>
              <p>SIRET : {companyData.siret || ''}</p>
              <p>N° TVA : {companyData.tva || ''}</p>
            </div>
          </div>
    
          {/* Colonne 2 - Désignation du véhicule d'emprunt */}
          <div>
            <h3 className="text-base font-bold mb-3 text-black">Désignation du véhicule d'emprunt</h3>
            <div className="text-sm space-y-1 text-black">
              <div className="flex">
                <span className="font-medium w-32">Marque</span>
                <span>{loanData?.fleet_vehicles?.car_brands?.name || ''}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32">Modèle</span>
                <span>{loanData?.fleet_vehicles?.car_models?.name || ''}</span>
              </div>
              <div className="flex mb-4">
                <span className="font-medium w-32">Immatriculation</span>
                <span>{loanData?.fleet_vehicles?.license_plate || ''}</span>
              </div>
              
              {/* Informations de départ */}
              <div className="grid grid-cols-2 mt-6">
                <div>
                  <div className="font-bold text-black mb-1">Départ :</div>
                  <div className="space-y-1 text-black">
                    <div>Le : {loanData?.start_date ? formatDate(loanData.start_date) : ''}</div>
                    <div>Kilométrage : {loanData?.start_mileage || ''} Km</div>
                    <div>Carburant : {loanData?.fuel_level_start || ''}%</div>
                  </div>
                </div>
                
                {/* Informations de retour */}
                <div>
                  <div className="font-bold text-black mb-1">Retour :</div>
                  <div className="space-y-1 text-black">
                    <div>Le : {loanData?.expected_return_date ? formatDate(loanData.expected_return_date) : ''}</div>
                    <div>Kilométrage : - - - Km</div>
                    <div>Carburant : - - - %</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    
          {/* Colonne 3 - Au client */}
          <div>
            <h3 className="text-base font-bold mb-3 text-black">Au client</h3>
            <div className="text-sm space-y-1 text-black">
              <p className="font-medium">{loanData?.clients?.first_name} {loanData?.clients?.last_name}</p>
              {loanData?.clients?.address && <p>{loanData.clients.address}</p>}
              {(loanData?.clients?.postal_code || loanData?.clients?.city) && (
                <p>{[loanData?.clients?.postal_code, loanData?.clients?.city].filter(Boolean).join(' ')}</p>
              )}
              {loanData?.clients?.phone && <p>Téléphone : {loanData.clients.phone}</p>}
              {loanData?.insurance_contract_number && <p className="mt-6"><span className="font-bold">Numéro de contrat client :</span> {loanData.insurance_contract_number}</p>}
            </div>
          </div>
        </div>
        
        <div className="bg-white text-black text-sm leading-relaxed">
          {/* Titre du document */}
          <div className="text-center mb-8">
            <h1 className="font-bold text-xl mb-2">
              CONTRAT DE PRÊT DE VÉHICULE DE COURTOISIE
            </h1>
            <div className="text-sm italic">
              (Version amendée, complétée et renforcée)
            </div>
          </div>

          {/* ENTRE LES SOUSSIGNÉS */}
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-4">ENTRE LES SOUSSIGNÉS :</h2>
            
            <div className="mb-4">
              <div className="font-bold">Le Prêteur :</div>
              <div>Nom du garage : {companyData.name?.toUpperCase() || ""}</div>
              <div>Adresse : {companyData.address || ""} {companyData.zipcode || ""} {companyData.city || ""}</div>
              <div>N° SIRET : {companyData.siret || ""}</div>
            </div>
    
            <div className="font-bold mb-2">ET</div>
    
            <div className="mb-4">
              <div className="font-bold">L'Emprunteur :</div>
              <div>Nom et prénom : {loanData?.clients?.first_name} {loanData?.clients?.last_name}</div>
              {loanData?.clients?.address && <div>Adresse : {loanData.clients.address}</div>}
              {(loanData?.clients?.postal_code || loanData?.clients?.city) && (
                <div>{[loanData?.clients?.postal_code, loanData?.clients?.city].filter(Boolean).join(' ')}</div>
              )}
              {loanData?.clients?.phone && <div>Téléphone : {loanData.clients.phone}</div>}
            </div>
          </div>

          {/* PRÉAMBULE */}
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-4">PRÉAMBULE</h2>
            <div className="text-justify">
              Le présent contrat est conclu à titre exceptionnel et gracieux, dans le seul but de faciliter la mobilité temporaire de l'Emprunteur pendant l'immobilisation de son véhicule. Cette mise à disposition n'entraine aucune relation commerciale de location et ne saurait créer une quelconque obligation de résultat à l'égard du Prêteur quant aux performances, au confort ou à l'adaptation du véhicule aux besoins spécifiques de l'Emprunteur.
            </div>
          </div>

          {/* 1. OBJET DU CONTRAT */}
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-4">1. OBJET DU CONTRAT</h2>
            <div className="mb-2">
              Le garage met gratuitement à disposition de l'Emprunteur le véhicule suivant :
            </div>
            <div className="ml-4">
              <div>Marque : {loanData?.fleet_vehicles?.car_brands?.name || ''}</div>
              <div>Modèle : {loanData?.fleet_vehicles?.car_models?.name || ''}</div>
              <div>N° d'immatriculation : {loanData?.fleet_vehicles?.license_plate || ''}</div>
              <div>Carburant : {loanData?.fuel_level_start || ''}%</div>
              <div>Kilométrage : {loanData?.start_mileage || ''} Km</div>
            </div>
          </div>

          {/* 2. DURÉE DU PRÊT */}
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-4">2. DURÉE DU PRÊT</h2>
            <div>Période initiale : du {loanData?.start_date ? formatDate(loanData.start_date) : ''} au {loanData?.expected_return_date ? formatDate(loanData.expected_return_date) : ''}</div>
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
            <h2 className="font-bold text-lg mb-4">3. UTILISATION DU VÉHICULE</h2>
            
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
            <div className="font-bold">2. L'exigibilité d'une indemnité forfaitaire de 1000€</div>
            <div className="font-bold">3. La responsabilité illimitée de l'Emprunteur pour tout dommage qui surviendrait</div>

            <div className="mt-4">
              <div className="font-bold">3.2. Garde d'utilisation autorisée</div>
              <div>L'Emprunteur garantit que:</div>
              <div className="ml-4 mt-2">
                <div>• Le véhicule est utilisé exclusivement dans le cadre de son activité professionnelle déclarée, conformément à l'article L. 3121-1 du Code du travail.</div>
                <div>• L'usage du véhicule est strictement limité au département de {getDepartmentFromZipCode(companyData.zipcode || '')} et aux départements limitrophes.</div>
                <div>• Le kilométrage journalier n'excède pas 100 km, sauf autorisation écrite préalable du Prêteur.</div>
                <div>• Le véhicule n'est jamais utilisé:</div>
                <div className="ml-4">
                  <div>- Pour le transport de marchandises ou de marchandises dangereuses</div>
                  <div>- Pour la traction ou le remorquage de tout véhicule</div>
                  <div>- Pour l'apprentissage de la conduite</div>
                  <div>- Pour des compétitions, essais ou reconnaissances de rallyes</div>
                  <div>- Sur des chemins non carrossables ou en dehors des voies de circulation autorisées</div>
                  <div>- À toute fin illicite ou contraire aux bonnes mœurs</div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="font-bold">3.3. Sécurité routière et obligations légales</div>
              <div>L'Emprunteur s'engage formellement à:</div>
              <div className="ml-4 mt-2">
                <div>• Respecter scrupuleusement toutes les dispositions du Code de la route</div>
                <div>• Veiller à ce que tout occupant du véhicule soit systématiquement attaché par une ceinture de sécurité, en application de l'article R. 412-1 du Code de la route</div>
                <div>• Ne jamais conduire sous l'emprise d'alcool (taux supérieur à 0,0 g/l) ou de stupéfiants</div>
                <div>• Ne jamais utiliser un téléphone tenu en main pendant la conduite</div>
                <div>• Signaler immédiatement au Prêteur tout dysfonctionnement constaté sur le véhicule</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="font-bold">3.4. Sécurisation du matériel transporté</div>
              <div className="font-bold mt-2">3.4.1. Séparation physique et compartimentage</div>
              <div className="ml-4">
                <div>• Le chargement de matériel professionnel doit être rigoureusement séparé de l'espace réservé aux passagers par une cloison rigide ou un filet de séparation homologué, conformément aux points d'ancrage, prévu à cet effet, 4ᵐ de l'article L. 3311-1 du Code des transports et aux dispositions de cassation (Ch. crim., 5 janvier 2016, n° 15-81.859).</div>
                <div>• Pour les véhicules de tourisme sans cloison dédiée:</div>
                <div className="ml-4">
                  <div>- L'utilisation exclusive du coffre est obligatoire pour tout équipement professionnel</div>
                  <div>- Aucun objet ne doit être placé sur le siège arrière ou les sièges arrières</div>
                  <div>- Le chargement ne doit jamais dépasser la hauteur des dossiers des sièges arrière</div>
                </div>
              </div>

              <div className="font-bold mt-2">3.4.2. Fixation et arrimage du chargement</div>
              <div className="ml-4">
                <div>Les objets transportés doivent être arrimés conformément à l'article R. 312-17 du Code de la route, avec:</div>
                <div>• Utilisation obligatoire de sangles, cordes, fixation homologués CE</div>
                <div>• Double arrimage croisé pour tout chargement dépassant 25 kg</div>
                <div>• Arrimage en trois points pour tout chargement dépassant 50 kg</div>
                <div>• Calage des objets par des dispositifs appropriés pour éviter tout glissement</div>
                <div>• Répartition uniforme de la charge pour maintenir l'équilibre du véhicule et sa stabilité en conduite</div>
                <div>• Vérification de l'arrimage avant chaque départ et après chaque arrêt</div>
              </div>

              <div className="font-bold mt-2">3.4.3. Restrictions de chargement</div>
              <div className="ml-4">
                <div>Il est formellement interdit de transporter:</div>
                <div>• Des matières dangereuses au sens de l'ADR (inflammables, corrosives, toxiques, explosives)</div>
                <div>• Des produits liquides de nettoyage industriel, même dilués</div>
                <div>• Des objets dont la dimension excède la longueur intérieure du véhicule ou qui dépasseraient de l'habitacle</div>
                <div>• Des charges supérieures à 50% de la charge utile maximale indiquée sur la carte grise</div>
                <div>• Des objets tranchants ou susceptibles d'endommager les revêtements intérieurs</div>
                <div>• Des matériaux salissants sans protection adéquate du véhicule</div>
              </div>

              <div className="font-bold mt-2">3.4.4. Signalisation et visibilité</div>
              <div className="ml-4">
                <div>• Tout chargement dépassant l'arrière du véhicule doit être signalé par un dispositif réfléchissant homologué conforme à l'article R. 313-20 du Code de la route</div>
                <div>• Le chargement ne doit en aucun cas obstruer, même partiellement:</div>
                <div className="ml-4">
                  <div>- La visibilité directe ou indirecte (rétroviseurs), du conducteur</div>
                  <div>- L'accès aux commandes et dispositifs de sécurité du véhicule</div>
                  <div>- Les feux, clignotants ou plaques d'immatriculation</div>
                  <div>- Les issues de secours</div>
                </div>
              </div>

              <div className="font-bold mt-2">3.4.5. Responsabilité spécifique liée au chargement</div>
              <div className="ml-4">
                <div>En cas de manquement à ces obligations, et, sauf cause d'exonération de l'Emprunteur sera tenu pour seul et unique responsable de tous dommages au véhicule, à ses occupants ou à des tiers résultant d'un déplacement ou d'une projection du chargement.</div>
                <div>L'Emprunteur renonce expressément à tout recours contre le Prêteur à ce titre.</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="font-bold">3.5. Entretien et préservation du véhicule</div>
              <div className="font-bold mt-2">3.6. Entretien et préservation du véhicule</div>
              <div>L'Emprunteur s'engage à:</div>
              <div className="ml-4 mt-2">
                <div>• Vérifier régulièrement les niveaux (huile, liquide de refroidissement, lave-glace)</div>
                <div>• Contrôler la pression des pneumatiques avant tout trajet important</div>
                <div>• Maintenir la propreté intérieure et extérieure et éviter que s'altèrent</div>
                <div>• Ne pas fumer ni vapoter dans le véhicule</div>
                <div>• Ne pas consommer de nourriture ou boisson dans l'habitacle</div>
                <div>• Protéger les sièges en cas de transport d'outils ou d'équipements professionnels</div>
                <div>• Stationner le véhicule dans des lieux sécurisés, de préférence fermés et couverts la nuit</div>
                <div>• Ne jamais laisser les clés sur le contact ou dans le véhicule, même momentanément</div>
                <div>• Verrouiller systématiquement toutes les portières et activer l'alarme lors de chaque stationnement</div>
              </div>
            </div>
          </div>

          {/* 4. ASSURANCE ET RESPONSABILITÉ */}
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-4">4. ASSURANCE ET RESPONSABILITÉ</h2>
            
            <div className="mb-4">
              <div className="font-bold">4.1. Couverture d'assurance</div>
              <div>Le véhicule objet du présent contrat est couvert par l'assurance souscrite par le Prêteur sous le numéro de police 51105175W0001 auprès de GROUPAMA, conformément aux dispositions de l'article L 121-1 du Code des assurances.</div>
              <div>Cette garantie est strictement limitée aux risques expressément prévus dans ladite police, dont l'Emprunteur reconnaît avoir pris connaissance.</div>
            </div>

            <div className="mb-4">
              <div className="font-bold">4.2. Franchise et contribution de l'Emprunteur</div>
              <div>L'Emprunteur accepte expressément qu'en cas de sinistre, quelle que soit la responsabilité établie, il contribuera systématiquement à hauteur de:</div>
              <div className="ml-4 mt-2">
                <div>• 750€ en cas de sinistre matériel causé au véhicule prêté</div>
                <div>• 2000€ minimum en cas de vol ou tentative de vol. Cette contribution minimale s'applique indépendamment de la franchise prévue par l'assurance et constitue une condition essentielle du prêt gratuit consenti.</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="font-bold">4.3. Exclusions de responsabilité du Prêteur</div>
              <div>En application des articles L. 121-1 et L. 124-1 du Code des assurances, le Prêteur décline toute responsabilité, et l'assurance susvisée ne couvrirait pas les dommages matériels ou corporels survenus au véhicule prêté dans les cas suivants:</div>
              
              <div className="ml-4 mt-2">
                <div className="font-bold">4.3.1. Utilisation non conforme du véhicule</div>
                <div>L'utilisation du véhicule pour des activités non autorisées, y compris mais sans se limiter à la participation à des courses, des compétitions ou des essais de vitesse.</div>

                <div className="font-bold mt-2">4.3.2. Dommages intentionnels</div>
                <div>Les dommages causés par des actes intentionnels, fraude ou tout comportement malveillant de la part de l'Emprunteur.</div>

                <div className="font-bold mt-2">4.3.3. Faux témoignage</div>
                <div>Toute fausse déclaration faite par l'Emprunteur lors de la déclaration d'un sinistre.</div>

                <div className="font-bold mt-2">4.3.4. Absence de permis de conduire valide</div>
                <div>L'utilisation du véhicule par l'Emprunteur sans avoir un permis de conduire valide.</div>

                <div className="font-bold mt-2">4.3.5. Non-respect des conditions contractuelles</div>
                <div>Toute violation des conditions stipulées dans le contrat de prêt.</div>

                <div className="font-bold mt-2">4.3.6. Conduite sous l'emprise de l'alcool ou de stupéfiants</div>
                <div>L'utilisation du véhicule par l'Emprunteur sous l'emprise de l'alcool ou de stupéfiants.</div>

                <div className="font-bold mt-2">4.3.7. Vol ou tentative de vol</div>
                <div>Le vol ou la tentative de vol du véhicule prêté.</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="font-bold">4.4. Obligations de l'Emprunteur en matière de déclaration et de gestion des sinistres</div>
              
              <div className="font-bold mt-2">4.4.1. Délai et modalités de déclaration</div>
              <div>L'Emprunteur s'engage à...</div>
              
              <div className="font-bold mt-2">4.4.2. Informations à communiquer</div>
              <div>En cas de sinistre impliquant un tiers identifié, l'Emprunteur doit impérativement recueillir et transmettre au Prêteur...</div>
              
              <div className="font-bold mt-2">4.4.3. Conservation des preuves</div>
              <div>L'Emprunteur doit préserver toutes les preuves matérielles du sinistre et s'abstenir de...</div>
              
              <div className="font-bold mt-2">4.4.4. Coopération avec les experts et assureurs</div>
              <div>L'Emprunteur s'engage à...</div>
            </div>

            <div className="mb-4">
              <div className="font-bold">4.5. Responsabilité en cas d'infraction</div>
              <div>L'Emprunteur assume l'entière et exclusive responsabilité des infractions commises pendant la durée du prêt, y compris...</div>
            </div>
          </div>

          {/* 5. RESTITUTION DU VÉHICULE */}
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-4">5. RESTITUTION DU VÉHICULE</h2>
            
            <div className="mb-4">
              <div className="font-bold">5.1. État de restitution</div>
              <div>L'Emprunteur s'engage à restituer le véhicule:</div>
              <div className="ml-4 mt-2">
                <div>• Dans un état rigoureusement identique à celui constaté lors de la prise en charge, hors usure normale</div>
                <div>• Parfaitement propre à l'intérieur comme à l'extérieur</div>
                <div>• Avec un réservoir de carburant intégralement rempli</div>
                <div>• Avec tous les documents, clés, accessoires et équipements fournis</div>
                <div>• Sans odeur résiduelle (tabac, nourriture, etc.)</div>
                <div>• Sans aucun objet personnel ou professionnel à l'intérieur</div>
                <div>• Tout kilométrage excédant la prévision sera facturé 0.25 € du Km.</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="font-bold">5.2. Procédure de restitution</div>
              <div>La restitution du véhicule s'effectuera:</div>
              <div className="ml-4 mt-2">
                <div>• Exclusivement pendant les heures d'ouverture du garage</div>
                <div>• En présence d'un représentant habilité du Prêteur</div>
                <div>• Après inspection contradictoire détaillée du véhicule</div>
                <div>• Avec signature d'un procès-verbal de restitution</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="font-bold">5.3. Frais additionnels de remise en état</div>
              <div>Seront facturés à l'Emprunteur lors de la restitution:</div>
              <div className="ml-4 mt-2">
                <div>• Nettoyage intérieur complet si nécessaire: 150€</div>
                <div>• Nettoyage extérieur si nécessaire: 50€</div>
                <div>• Désodorisation en cas d'odeur de tabac: 200€</div>
                <div>• Remplacement des documents manquants: 150€ par document</div>
                <div>• Réparation de tout dommage non signalé: coût réel majoré de 20%</div>
                <div>• Remplacement de tout équipement ou accessoire manquant: valeur à neuf</div>
              </div>
            </div>
          </div>

          {/* 6. CLAUSES PÉNALES ET RÉSOLUTION */}
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-4">6. CLAUSES PÉNALES ET RÉSOLUTION</h2>
            
            <div className="mb-4">
              <div className="font-bold">6.1. Manquements aux obligations</div>
              <div>Toute violation des clauses susmentionnées entraînera:</div>
              <div className="ml-4 mt-2">
                <div>• La résolution immédiate du présent contrat sans préavis</div>
                <div>• L'obligation de restituer immédiatement le véhicule, sous astreinte de 200€ par jour de retard</div>
                <div>• Le paiement d&#39;une indemnité forfaitaire de 1000€ pour préjudice moral et commercial</div>
                <div>• Le remboursement intégral de tous frais engagés par le Prêteur pour récupérer le véhicule</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="font-bold">6.2. Recours contre les tiers</div>
              <div>En cas de dommage causé par un tiers identifié, l'Emprunteur:</div>
              <div className="ml-4 mt-2">
                <div>? S'oblige à coopérer pleinement avec le Prêteur et son assureur</div>
                <div>? Cède au Prêteur, à titre de garantie, sa créance à l'encontre du tiers responsable</div>
                <div>? S'engage à effectuer toutes démarches utiles pour préserver les droits du Prêteur</div>
                <div>? Accepte d'être appelé en garantie dans toute procédure judiciaire</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="font-bold">6.3. Attribution de juridiction</div>
              <div className="ml-4 mt-2">
                <div>En cas de litige relatif à l'interprétation ou l'exécution du présent contrat:</div>
                <div>• Les parties s'efforceront de trouver une solution amiable</div>
                <div>• À défaut, le Tribunal de Commerce de Marseille sera seul compétent</div>
                <div>• L'Emprunteur renonce expressément à toute exception d'incompétence territoriale</div>
              </div>
            </div>
          </div>

          {/* 7. DÉPÔT DE GARANTIE */}
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-4">7. DÉPÔT DE GARANTIE</h2>
            <div>Un dépôt de garantie de 1500€ sera versé par l'Emprunteur au moment de la prise en charge du véhicule.</div>
            <div className="mt-2">Ce dépôt pourra être encaissé immédiatement par le Prêteur en cas de:</div>
            <div className="ml-4 mt-2">
              <div>- Dommage constaté lors de la restitution</div>
              <div>- Retard dans la restitution</div>
              <div>- Infraction aux conditions d'utilisation</div>
              <div>- Frais non remboursés (amendes, carburant, nettoyage)</div>
            </div>
          </div>

          {/* 8. SIGNATURES */}
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-4">8. SIGNATURES</h2>
            <div>L'Emprunteur reconnaît expressément avoir lu l'intégralité du présent contrat, en avoir compris toutes les clauses et les accepter sans réserve.</div>
            <div className="mt-2">Il reconnaît en particulier l'étendue de sa responsabilité et la limitation de celle du Prêteur dans les cas énumérés à l'article 4.</div>
          </div>

          {/* Références légales */}
          <div className="mb-6">
            <div className="font-bold">Références légales intégrées :</div>
            <div className="text-sm mt-2">
              <div><span className="font-bold">Code des assurances :</span> Art. L. 121-1, L. 124-1, L. 124-3</div>
              <div><span className="font-bold">Code de la route :</span> Art. R. 412-1, R. 312-17, R. 413-17, R. 313-20, R. 317-25</div>
              <div><span className="font-bold">Code civil :</span> Art. 1242, 1226, 1231-1</div>
              <div><span className="font-bold">Code du travail :</span> Art. L. 3121-1</div>
              <div><span className="font-bold">Jurisprudence :</span> Cass. crim., 10 juillet 2012, n° 11-17.898 ; Cass. crim., 5 janvier 2016, n° 15-81.856</div>
            </div>
          </div>

          {/* Signature de l'assuré */}
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-4">Signature de l'assuré</h2>
            <div>
              {loanData?.client_signature ? (
                <img src={loanData.client_signature} alt="Signature du client" className="max-w-xs mb-2" />
              ) : (
                <div className="text-4xl font-bold mb-2" style={{ fontFamily: 'cursive' }}>
                  ∅
                </div>
              )}
              <div className="font-bold">{loanData?.clients?.first_name} {loanData?.clients?.last_name}</div>
              <div className="text-sm">Signé le {loanCreationDate} à {new Date(loanData?.created_at || new Date()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
              <div className="text-xs text-gray-600">À la latitude/longitude : {userPosition}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FleetAttestationDialog;
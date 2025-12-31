import React from 'react';

interface NewRepairOrderGeneralConditionsProps {
  companyData: any;
  pageNumber: number;
}

const NewRepairOrderGeneralConditions: React.FC<NewRepairOrderGeneralConditionsProps> = ({
  companyData,
  pageNumber,
}) => {
  if (pageNumber === 1) {
    return (
      <div className="bg-white p-6 text-black text-sm">
        <h2 className="text-xl font-bold text-center mb-6 text-gray-800">CONDITIONS GÉNÉRALES</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-gray-700 mb-2">1. OBJET ET CHAMP D'APPLICATION</h3>
            <p className="text-gray-600 text-justify leading-relaxed">
              Les présentes conditions générales s'appliquent à toutes les prestations de réparation automobile 
              effectuées par le prestataire. Elles constituent le socle unique de la relation commerciale entre 
              les parties conformément aux articles L111-1 à L111-9 du Code de la consommation.
            </p>
            <p className="text-xs italic text-gray-500 mt-1">Réf. : Art. L111-1 et suivants du Code de la consommation</p>
          </div>

          <div>
            <h3 className="font-bold text-gray-700 mb-2">2. INFORMATION PRÉCONTRACTUELLE</h3>
            <p className="text-gray-600 text-justify leading-relaxed">
              Conformément aux articles R111-1 et R111-2 du Code de la consommation, le prestataire communique 
              au client, de manière lisible et compréhensible, les caractéristiques essentielles des prestations, 
              leur prix, ainsi que la date ou le délai d'exécution prévu.
            </p>
            <p className="text-xs italic text-gray-500 mt-1">Réf. : Art. R111-1 et R111-2 du Code de la consommation</p>
          </div>

          <div>
            <h3 className="font-bold text-gray-700 mb-2">3. FORMATION DU CONTRAT</h3>
            <p className="text-gray-600 text-justify leading-relaxed">
              Le contrat est formé à la signature du présent ordre de réparation par le client. Conformément 
              aux articles 1123 à 1171 du Code civil, le consentement des parties est libre et éclairé. Toute 
              modification ultérieure nécessite l'accord écrit des deux parties.
            </p>
            <p className="text-xs italic text-gray-500 mt-1">Réf. : Art. 1123 à 1171 du Code civil</p>
          </div>

          <div>
            <h3 className="font-bold text-gray-700 mb-2">4. DEVIS ET ESTIMATION</h3>
            <p className="text-gray-600 text-justify leading-relaxed">
              Le devis établi par le prestataire est valable 30 jours à compter de sa date d'émission. Tout 
              dépassement du montant initial supérieur à 10% doit faire l'objet d'une information préalable 
              et d'un accord écrit du client avant exécution des travaux supplémentaires.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-700 mb-2">5. EXÉCUTION DES TRAVAUX</h3>
            <p className="text-gray-600 text-justify leading-relaxed">
              Le prestataire s'engage à exécuter les travaux selon les règles de l'art et dans le respect des 
              normes en vigueur. Les délais indiqués sont donnés à titre indicatif et peuvent être modifiés en 
              fonction des contraintes techniques ou de la disponibilité des pièces.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-700 mb-2">6. GARANTIE DES TRAVAUX</h3>
            <p className="text-gray-600 text-justify leading-relaxed">
              Conformément à l'article 1641 du Code Civil, les travaux sont garantis pendant une durée de 2 ans 
              à compter de leur réception. Cette garantie couvre les vices cachés et les défauts de conformité. 
              Les pièces de réemploi bénéficient d'une garantie de 3 mois ou 10 000 km.
            </p>
            <p className="text-xs italic text-gray-500 mt-1">Réf. : Art. 1641 du Code civil - Jurisprudence Civ. 1ère, 7 fév. 2018</p>
          </div>

          <div>
            <h3 className="font-bold text-gray-700 mb-2">7. RESPONSABILITÉ</h3>
            <p className="text-gray-600 text-justify leading-relaxed">
              Le prestataire décline toute responsabilité en cas de vol ou de détérioration des objets personnels 
              laissés dans le véhicule. Le client est invité à retirer tous effets personnels avant remise du véhicule. 
              Un état des lieux contradictoire peut être effectué à la demande de l'une des parties.
            </p>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500 text-center">
          Page 2/4
        </div>
      </div>
    );
  }

  // Page 2 des conditions générales
  return (
    <div className="bg-white p-6 text-black text-sm">
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-gray-700 mb-2">8. GARDIENNAGE</h3>
          <p className="text-gray-600 text-justify leading-relaxed">
            Les véhicules non retirés dans un délai de 15 jours suivant la notification de fin des travaux 
            feront l'objet d'une facturation de frais de gardiennage au tarif de 5€ HT par jour. Passé un 
            délai de 3 mois, le prestataire se réserve le droit d'engager une procédure d'abandon de véhicule.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-gray-700 mb-2">9. DROIT DE RÉTENTION</h3>
          <p className="text-gray-600 text-justify leading-relaxed">
            Conformément à l'article 2286 du Code civil, le prestataire dispose d'un droit de rétention sur 
            le véhicule jusqu'au paiement intégral des sommes dues au titre des travaux effectués.
          </p>
          <p className="text-xs italic text-gray-500 mt-1">Réf. : Art. 2286 du Code civil</p>
        </div>

        <div>
          <h3 className="font-bold text-gray-700 mb-2">10. MODALITÉS DE PAIEMENT</h3>
          <p className="text-gray-600 text-justify leading-relaxed">
            Le paiement est exigible à la restitution du véhicule. En cas de retard de paiement, des pénalités 
            de retard au taux de 3 fois le taux d'intérêt légal seront appliquées, ainsi qu'une indemnité 
            forfaitaire pour frais de recouvrement de 40€.
          </p>
        </div>

        <h2 className="text-lg font-bold text-center mt-6 mb-4 text-gray-800">TEXTES RÉGLEMENTAIRES</h2>

        <div>
          <h3 className="font-bold text-gray-700 mb-2">ÉCONOMIE CIRCULAIRE - PIÈCES DE RÉEMPLOI</h3>
          <p className="text-gray-600 text-justify leading-relaxed">
            Décret n°2020-1455 du 27 novembre 2020 : Le réparateur doit proposer au consommateur, pour 
            l'entretien ou la réparation de son véhicule, des pièces issues de l'économie circulaire à la 
            place de pièces neuves. Cette obligation concerne les pièces de carrosserie amovibles, les 
            pièces optiques et le vitrage non collé.
          </p>
          <p className="text-xs italic text-gray-500 mt-1">Réf. : Décret n°2020-1455 du 27 novembre 2020</p>
        </div>

        <div>
          <p className="text-gray-600 text-justify leading-relaxed">
            Décret n°2021-1947 du 31 décembre 2021 : Extension de l'obligation d'affichage des prix des 
            pièces recyclées. Le professionnel doit afficher de manière visible et lisible les prix des 
            pièces issues de l'économie circulaire et informer le consommateur de leur disponibilité.
          </p>
          <p className="text-xs italic text-gray-500 mt-1">Réf. : Décret n°2021-1947 du 31 décembre 2021</p>
        </div>

        <div>
          <h3 className="font-bold text-gray-700 mb-2">INFORMATION DU CONSOMMATEUR</h3>
          <p className="text-gray-600 text-justify leading-relaxed">
            Articles L.224-67 à L.224-68 du Code de la consommation : Le professionnel qui commercialise 
            des prestations d'entretien ou de réparation de véhicules automobiles permet au consommateur 
            d'opter pour l'utilisation de pièces de rechange issues de l'économie circulaire à la place 
            de pièces neuves.
          </p>
          <p className="text-xs italic text-gray-500 mt-1">Réf. : Art. L.224-67 à L.224-68 du Code de la consommation</p>
        </div>

        <div>
          <h3 className="font-bold text-gray-700 mb-2">11. LITIGES</h3>
          <p className="text-gray-600 text-justify leading-relaxed">
            En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut d'accord, 
            le litige sera soumis aux tribunaux compétents de {companyData?.city || 'Paris'}. Les présentes 
            conditions générales l'emportent sur toutes conditions contraires.
          </p>
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-500 text-center">
        Page 3/4
      </div>
    </div>
  );
};

export default NewRepairOrderGeneralConditions;

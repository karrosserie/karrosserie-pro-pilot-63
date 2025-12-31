import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

interface NewRepairOrderPDFProps {
  companyData: any;
  clientData: {
    name?: string;
    address?: string;
    city?: string;
    phone?: string;
    email?: string;
  };
  vehicleData: {
    brand?: string;
    model?: string;
    licensePlate?: string;
    mileage?: string;
    start_date?: string;
    end_date?: string;
  };
  orderData: {
    reference?: string;
    date?: string;
    amount?: number;
    notes?: string;
  };
  expertiseData?: {
    reportNumber?: string;
    expertName?: string;
    reportDate?: string;
  };
  incidentData?: {
    policyNumber?: string;
    claimNumber?: string;
    incidentDate?: string;
  };
  signatureData?: {
    clientName: string;
    isForOodrive?: boolean;
  };
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 35,
    backgroundColor: 'white',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 35,
    fontSize: 8,
    color: '#666',
  },
  // Page 1 - Identification
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#404348',
    padding: 10,
    textAlign: 'center',
    marginBottom: 20,
  },
  orderNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#404348',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    backgroundColor: '#f3f4f6',
    padding: 6,
    marginBottom: 8,
    marginTop: 12,
    color: '#404348',
  },
  twoColumns: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  column: {
    flex: 1,
    paddingHorizontal: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    width: 100,
    color: '#374151',
  },
  infoValue: {
    fontSize: 9,
    flex: 1,
    color: '#1f2937',
  },
  // Page 2 & 3 - Conditions générales
  conditionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#404348',
  },
  conditionsSubtitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    color: '#374151',
  },
  conditionsText: {
    fontSize: 8,
    lineHeight: 1.5,
    textAlign: 'justify',
    marginBottom: 6,
    color: '#4b5563',
  },
  legalReference: {
    fontSize: 7,
    fontStyle: 'italic',
    color: '#6b7280',
    marginBottom: 4,
  },
  // Page 4 - Récapitulatif et Signature
  summaryBox: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#f9fafb',
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#404348',
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#374151',
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  acceptanceTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#404348',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: '#404348',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
  },
  checkmark: {
    fontSize: 9,
    color: '#404348',
    fontWeight: 'bold',
  },
  checkboxText: {
    fontSize: 8,
    flex: 1,
    color: '#374151',
    lineHeight: 1.4,
  },
  signatureSection: {
    marginTop: 25,
    alignItems: 'center',
  },
  signatureTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#404348',
  },
  signatureBox: {
    width: 250,
    height: 80,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef9c3',
    marginBottom: 8,
  },
  signaturePlaceholder: {
    fontSize: 12,
    fontFamily: 'Courier',
    color: '#854d0e',
  },
  signatureName: {
    fontSize: 10,
    marginTop: 4,
    color: '#374151',
  },
  exemplaires: {
    fontSize: 9,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
    color: '#6b7280',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 35,
    right: 35,
    textAlign: 'center',
    fontSize: 7,
    color: '#9ca3af',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
  },
});

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR');
  } catch {
    return '-';
  }
};


const NewRepairOrderPDF: React.FC<NewRepairOrderPDFProps> = ({
  companyData,
  clientData,
  vehicleData,
  orderData,
  expertiseData,
  incidentData,
  signatureData,
}) => {
  const hasExpertiseData = expertiseData?.reportNumber || expertiseData?.expertName;
  const hasIncidentData = incidentData?.policyNumber || incidentData?.claimNumber || incidentData?.incidentDate;

  return (
    <Document>
      {/* PAGE 1 - IDENTIFICATION */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>ORDRE DE RÉPARATION CARROSSERIE</Text>
        <Text style={styles.orderNumber}>N° {orderData.reference}</Text>

        {/* Prestataire et Client */}
        <View style={styles.twoColumns}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>PRESTATAIRE</Text>
            {companyData?.logo_url && (
              <Image src={companyData.logo_url} style={{ width: 80, height: 40, marginBottom: 8, objectFit: 'contain' }} />
            )}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Raison sociale :</Text>
              <Text style={styles.infoValue}>{companyData?.name || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Adresse :</Text>
              <Text style={styles.infoValue}>{companyData?.address || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Code postal / Ville :</Text>
              <Text style={styles.infoValue}>{companyData?.zipcode || ''} {companyData?.city || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>SIRET :</Text>
              <Text style={styles.infoValue}>{companyData?.siret || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>N° TVA :</Text>
              <Text style={styles.infoValue}>{companyData?.tva || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Téléphone :</Text>
              <Text style={styles.infoValue}>{companyData?.phone || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email :</Text>
              <Text style={styles.infoValue}>{companyData?.email || ''}</Text>
            </View>
          </View>

          <View style={styles.column}>
            <Text style={styles.sectionTitle}>CLIENT</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nom / Raison sociale :</Text>
              <Text style={styles.infoValue}>{clientData?.name || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Adresse :</Text>
              <Text style={styles.infoValue}>{clientData?.address || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Code postal / Ville :</Text>
              <Text style={styles.infoValue}>{clientData?.city || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Téléphone :</Text>
              <Text style={styles.infoValue}>{clientData?.phone || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email :</Text>
              <Text style={styles.infoValue}>{clientData?.email || ''}</Text>
            </View>
          </View>
        </View>

        {/* Véhicule */}
        <Text style={styles.sectionTitle}>VÉHICULE</Text>
        <View style={styles.twoColumns}>
          <View style={styles.column}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Immatriculation :</Text>
              <Text style={styles.infoValue}>{vehicleData?.licensePlate || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Marque / Modèle :</Text>
              <Text style={styles.infoValue}>{vehicleData?.brand || ''} {vehicleData?.model || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Kilométrage :</Text>
              <Text style={styles.infoValue}>{vehicleData?.mileage || '-'}</Text>
            </View>
          </View>
          <View style={styles.column}>
            {vehicleData?.start_date && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date début travaux :</Text>
                <Text style={styles.infoValue}>{formatDate(vehicleData.start_date)}</Text>
              </View>
            )}
            {vehicleData?.end_date && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date fin prévue :</Text>
                <Text style={styles.infoValue}>{formatDate(vehicleData.end_date)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Sinistre (optionnel) */}
        {hasIncidentData && (
          <>
            <Text style={styles.sectionTitle}>SINISTRE</Text>
            <View style={styles.twoColumns}>
              <View style={styles.column}>
                {incidentData?.policyNumber && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>N° Police :</Text>
                    <Text style={styles.infoValue}>{incidentData.policyNumber}</Text>
                  </View>
                )}
                {incidentData?.claimNumber && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>N° Sinistre :</Text>
                    <Text style={styles.infoValue}>{incidentData.claimNumber}</Text>
                  </View>
                )}
              </View>
              <View style={styles.column}>
                {incidentData?.incidentDate && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Date sinistre :</Text>
                    <Text style={styles.infoValue}>{formatDate(incidentData.incidentDate)}</Text>
                  </View>
                )}
              </View>
            </View>
          </>
        )}

        {/* Rapport d'expertise (optionnel) */}
        {hasExpertiseData && (
          <>
            <Text style={styles.sectionTitle}>RAPPORT D'EXPERTISE</Text>
            <View style={styles.twoColumns}>
              <View style={styles.column}>
                {expertiseData?.reportNumber && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>N° Rapport :</Text>
                    <Text style={styles.infoValue}>{expertiseData.reportNumber}</Text>
                  </View>
                )}
              </View>
              <View style={styles.column}>
                {expertiseData?.expertName && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nom Expert :</Text>
                    <Text style={styles.infoValue}>{expertiseData.expertName}</Text>
                  </View>
                )}
                {expertiseData?.reportDate && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Date rapport :</Text>
                    <Text style={styles.infoValue}>{formatDate(expertiseData.reportDate)}</Text>
                  </View>
                )}
              </View>
            </View>
          </>
        )}

        <Text style={styles.pageNumber}>Page 1/4</Text>
        <Text style={styles.footer}>{companyData?.name} - SIRET {companyData?.siret} - TVA {companyData?.tva}</Text>
      </Page>

      {/* PAGE 2 - CONDITIONS GÉNÉRALES (Partie 1) */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.conditionsTitle}>CONDITIONS GÉNÉRALES</Text>

        <Text style={styles.conditionsSubtitle}>1. OBJET ET CHAMP D'APPLICATION</Text>
        <Text style={styles.conditionsText}>
          Les présentes conditions générales s'appliquent à toutes les prestations de réparation automobile 
          effectuées par le prestataire. Elles constituent le socle unique de la relation commerciale entre 
          les parties conformément aux articles L111-1 à L111-9 du Code de la consommation.
        </Text>
        <Text style={styles.legalReference}>Réf. : Art. L111-1 et suivants du Code de la consommation</Text>

        <Text style={styles.conditionsSubtitle}>2. INFORMATION PRÉCONTRACTUELLE</Text>
        <Text style={styles.conditionsText}>
          Conformément aux articles R111-1 et R111-2 du Code de la consommation, le prestataire communique 
          au client, de manière lisible et compréhensible, les caractéristiques essentielles des prestations, 
          leur prix, ainsi que la date ou le délai d'exécution prévu.
        </Text>
        <Text style={styles.legalReference}>Réf. : Art. R111-1 et R111-2 du Code de la consommation</Text>

        <Text style={styles.conditionsSubtitle}>3. FORMATION DU CONTRAT</Text>
        <Text style={styles.conditionsText}>
          Le contrat est formé à la signature du présent ordre de réparation par le client. Conformément 
          aux articles 1123 à 1171 du Code civil, le consentement des parties est libre et éclairé. Toute 
          modification ultérieure nécessite l'accord écrit des deux parties.
        </Text>
        <Text style={styles.legalReference}>Réf. : Art. 1123 à 1171 du Code civil</Text>

        <Text style={styles.conditionsSubtitle}>4. DEVIS ET ESTIMATION</Text>
        <Text style={styles.conditionsText}>
          Le devis établi par le prestataire est valable 30 jours à compter de sa date d'émission. Tout 
          dépassement du montant initial supérieur à 10% doit faire l'objet d'une information préalable 
          et d'un accord écrit du client avant exécution des travaux supplémentaires.
        </Text>

        <Text style={styles.conditionsSubtitle}>5. EXÉCUTION DES TRAVAUX</Text>
        <Text style={styles.conditionsText}>
          Le prestataire s'engage à exécuter les travaux selon les règles de l'art et dans le respect des 
          normes en vigueur. Les délais indiqués sont donnés à titre indicatif et peuvent être modifiés en 
          fonction des contraintes techniques ou de la disponibilité des pièces.
        </Text>

        <Text style={styles.conditionsSubtitle}>6. GARANTIE DES TRAVAUX</Text>
        <Text style={styles.conditionsText}>
          Conformément à l'article 1641 du Code Civil, les travaux sont garantis pendant une durée de 2 ans 
          à compter de leur réception. Cette garantie couvre les vices cachés et les défauts de conformité. 
          Les pièces de réemploi bénéficient d'une garantie de 3 mois ou 10 000 km.
        </Text>
        <Text style={styles.legalReference}>Réf. : Art. 1641 du Code civil - Jurisprudence Civ. 1ère, 7 fév. 2018</Text>

        <Text style={styles.conditionsSubtitle}>7. RESPONSABILITÉ</Text>
        <Text style={styles.conditionsText}>
          Le prestataire décline toute responsabilité en cas de vol ou de détérioration des objets personnels 
          laissés dans le véhicule. Le client est invité à retirer tous effets personnels avant remise du véhicule. 
          Un état des lieux contradictoire peut être effectué à la demande de l'une des parties.
        </Text>

        <Text style={styles.pageNumber}>Page 2/4</Text>
        <Text style={styles.footer}>{companyData?.name} - SIRET {companyData?.siret} - TVA {companyData?.tva}</Text>
      </Page>

      {/* PAGE 3 - CONDITIONS GÉNÉRALES (Partie 2) + TEXTES RÉGLEMENTAIRES */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.conditionsSubtitle}>8. GARDIENNAGE</Text>
        <Text style={styles.conditionsText}>
          Les véhicules non retirés dans un délai de 15 jours suivant la notification de fin des travaux 
          feront l'objet d'une facturation de frais de gardiennage au tarif de 5€ HT par jour. Passé un 
          délai de 3 mois, le prestataire se réserve le droit d'engager une procédure d'abandon de véhicule.
        </Text>

        <Text style={styles.conditionsSubtitle}>9. DROIT DE RÉTENTION</Text>
        <Text style={styles.conditionsText}>
          Conformément à l'article 2286 du Code civil, le prestataire dispose d'un droit de rétention sur 
          le véhicule jusqu'au paiement intégral des sommes dues au titre des travaux effectués.
        </Text>
        <Text style={styles.legalReference}>Réf. : Art. 2286 du Code civil</Text>

        <Text style={styles.conditionsSubtitle}>10. MODALITÉS DE PAIEMENT</Text>
        <Text style={styles.conditionsText}>
          Le paiement est exigible à la restitution du véhicule. En cas de retard de paiement, des pénalités 
          de retard au taux de 3 fois le taux d'intérêt légal seront appliquées, ainsi qu'une indemnité 
          forfaitaire pour frais de recouvrement de 40€.
        </Text>

        <Text style={styles.conditionsTitle}>TEXTES RÉGLEMENTAIRES</Text>

        <Text style={styles.conditionsSubtitle}>ÉCONOMIE CIRCULAIRE - PIÈCES DE RÉEMPLOI</Text>
        <Text style={styles.conditionsText}>
          Décret n°2020-1455 du 27 novembre 2020 : Le réparateur doit proposer au consommateur, pour 
          l'entretien ou la réparation de son véhicule, des pièces issues de l'économie circulaire à la 
          place de pièces neuves. Cette obligation concerne les pièces de carrosserie amovibles, les 
          pièces optiques et le vitrage non collé.
        </Text>
        <Text style={styles.legalReference}>Réf. : Décret n°2020-1455 du 27 novembre 2020</Text>

        <Text style={styles.conditionsText}>
          Décret n°2021-1947 du 31 décembre 2021 : Extension de l'obligation d'affichage des prix des 
          pièces recyclées. Le professionnel doit afficher de manière visible et lisible les prix des 
          pièces issues de l'économie circulaire et informer le consommateur de leur disponibilité.
        </Text>
        <Text style={styles.legalReference}>Réf. : Décret n°2021-1947 du 31 décembre 2021</Text>

        <Text style={styles.conditionsSubtitle}>INFORMATION DU CONSOMMATEUR</Text>
        <Text style={styles.conditionsText}>
          Articles L.224-67 à L.224-68 du Code de la consommation : Le professionnel qui commercialise 
          des prestations d'entretien ou de réparation de véhicules automobiles permet au consommateur 
          d'opter pour l'utilisation de pièces de rechange issues de l'économie circulaire à la place 
          de pièces neuves.
        </Text>
        <Text style={styles.legalReference}>Réf. : Art. L.224-67 à L.224-68 du Code de la consommation</Text>

        <Text style={styles.conditionsSubtitle}>11. LITIGES</Text>
        <Text style={styles.conditionsText}>
          En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut d'accord, 
          le litige sera soumis aux tribunaux compétents de {companyData?.city || 'Paris'}. Les présentes 
          conditions générales l'emportent sur toutes conditions contraires.
        </Text>

        <Text style={styles.pageNumber}>Page 3/4</Text>
        <Text style={styles.footer}>{companyData?.name} - SIRET {companyData?.siret} - TVA {companyData?.tva}</Text>
      </Page>

      {/* PAGE 4 - RÉCAPITULATIF ET SIGNATURE */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.conditionsTitle}>RÉCAPITULATIF ET ACCEPTATION</Text>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>RÉSUMÉ DE L'ORDRE DE RÉPARATION</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>N° Ordre de Réparation :</Text>
            <Text style={styles.summaryValue}>{orderData.reference}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date :</Text>
            <Text style={styles.summaryValue}>{formatDate(orderData.date)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Véhicule :</Text>
            <Text style={styles.summaryValue}>{vehicleData?.brand} {vehicleData?.model} - {vehicleData?.licensePlate}</Text>
          </View>
          
          {hasExpertiseData && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>N° Rapport Expertise :</Text>
              <Text style={styles.summaryValue}>{expertiseData?.reportNumber || '-'}</Text>
            </View>
          )}
          
          {vehicleData?.start_date && vehicleData?.end_date && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Délai prévisionnel :</Text>
              <Text style={styles.summaryValue}>Du {formatDate(vehicleData.start_date)} au {formatDate(vehicleData.end_date)}</Text>
            </View>
          )}

        </View>

        <Text style={styles.acceptanceTitle}>ACCEPTATION DU CLIENT</Text>
        
        <View style={styles.checkboxRow}>
          <View style={styles.checkbox}><Text style={styles.checkmark}>✓</Text></View>
          <Text style={styles.checkboxText}>
            Je reconnais avoir reçu un exemplaire des conditions générales et en accepte les termes.
          </Text>
        </View>
        
        <View style={styles.checkboxRow}>
          <View style={styles.checkbox}><Text style={styles.checkmark}>✓</Text></View>
          <Text style={styles.checkboxText}>
            Je reconnais avoir été informé de mon droit de rétractation conformément au Code de la consommation.
          </Text>
        </View>
        
        <View style={styles.checkboxRow}>
          <View style={styles.checkbox}><Text style={styles.checkmark}>✓</Text></View>
          <Text style={styles.checkboxText}>
            J'accepte les travaux décrits dans le rapport d'expertise référencé ci-dessus.
          </Text>
        </View>
        
        
        <View style={styles.checkboxRow}>
          <View style={styles.checkbox}><Text style={styles.checkmark}>✓</Text></View>
          <Text style={styles.checkboxText}>
            J'accepte les délais prévisionnels de réparation indiqués.
          </Text>
        </View>
        
        <View style={styles.checkboxRow}>
          <View style={styles.checkbox}><Text style={styles.checkmark}>✓</Text></View>
          <Text style={styles.checkboxText}>
            Je confirme avoir retiré tous mes effets personnels du véhicule ou les avoir déclarés au prestataire.
          </Text>
        </View>

        <View style={styles.signatureSection}>
          <Text style={styles.signatureTitle}>SIGNATURE DU CLIENT</Text>
          <View style={styles.signatureBox}>
            <Text style={styles.signaturePlaceholder}>[Signature1/]</Text>
          </View>
          <Text style={styles.signatureName}>{signatureData?.clientName || clientData?.name || ''}</Text>
        </View>

        <Text style={styles.exemplaires}>« Fait en deux exemplaires originaux »</Text>

        <Text style={styles.pageNumber}>Page 4/4</Text>
        <Text style={styles.footer}>Document généré par Karrosserie Pro - www.karrosserie.pro</Text>
      </Page>
    </Document>
  );
};

export default NewRepairOrderPDF;

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { formatDate } from '@/utils/date-formatter';

interface LoanContractPDFProps {
  loanData: any;
  companyData: any;
  userPosition: string;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 35,
    position: 'relative',
  },
  mainTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  contractInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    fontSize: 9,
  },
  preambuleSection: {
    marginBottom: 15,
  },
  preambuleTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  preambuleText: {
    fontSize: 8,
    lineHeight: 1.4,
    textAlign: 'justify',
    marginBottom: 6,
  },
  referenceSection: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f5f5f5',
  },
  referenceTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  referenceRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  referenceLabel: {
    width: 120,
    fontSize: 8,
  },
  referenceValue: {
    flex: 1,
    fontSize: 8,
  },
  articleTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    backgroundColor: '#e8e8e8',
    padding: 4,
  },
  articleText: {
    fontSize: 8,
    lineHeight: 1.4,
    marginBottom: 4,
    textAlign: 'justify',
  },
  twoColumnGrid: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 10,
  },
  column: {
    flex: 1,
  },
  partyTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
    textDecoration: 'underline',
  },
  partyInfo: {
    fontSize: 8,
    marginBottom: 2,
  },
  vehicleGrid: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 6,
  },
  vehicleColumn: {
    flex: 1,
    padding: 8,
    border: '1px solid #ccc',
  },
  vehicleTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  vehicleRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  vehicleLabel: {
    width: 80,
    fontSize: 8,
  },
  vehicleValue: {
    flex: 1,
    fontSize: 8,
  },
  bulletPoint: {
    fontSize: 8,
    marginLeft: 10,
    marginBottom: 2,
  },
  subSectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 4,
  },
  damageTable: {
    marginTop: 8,
    border: '1px solid #000',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e8e8e8',
    borderBottom: '1px solid #000',
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 8,
    fontWeight: 'bold',
    padding: 4,
    textAlign: 'center',
    borderRight: '1px solid #000',
  },
  tableHeaderCellLast: {
    flex: 1,
    fontSize: 8,
    fontWeight: 'bold',
    padding: 4,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #ccc',
  },
  tableCell: {
    flex: 1,
    fontSize: 7,
    padding: 3,
    borderRight: '1px solid #ccc',
  },
  tableCellLast: {
    flex: 1,
    fontSize: 7,
    padding: 3,
  },
  signatureSection: {
    marginTop: 20,
  },
  signatureGrid: {
    flexDirection: 'row',
    gap: 30,
  },
  signatureColumn: {
    flex: 1,
    border: '1px solid #ccc',
    padding: 10,
    minHeight: 80,
  },
  signatureTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  signatureImage: {
    width: 120,
    height: 50,
    objectFit: 'contain',
    alignSelf: 'center',
  },
  signatureDate: {
    fontSize: 8,
    marginTop: 8,
    textAlign: 'center',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
  },
});

// Liste des pièces pour l'état des lieux
const BODY_PARTS = [
  'Pare-choc avant', 'Capot', 'Aile avant droite', 'Aile avant gauche',
  'Porte avant droite', 'Porte avant gauche', 'Porte arrière droite', 'Porte arrière gauche',
  'Aile arrière droite', 'Aile arrière gauche', 'Pare-choc arrière', 'Hayon/Coffre',
  'Toit', 'Rétroviseur droit', 'Rétroviseur gauche', 'Pare-brise',
  'Lunette arrière', 'Vitres latérales', 'Jantes/Pneus'
];

const LoanContractPDF = ({ loanData, companyData, userPosition }: LoanContractPDFProps) => {
  const contractDate = formatDate(new Date().toISOString());
  const contractNumber = `CPV-${new Date().getFullYear()}-${loanData?.id?.substring(0, 6) || '000000'}`;
  
  // Parse damages from JSON
  const damages = loanData?.damages 
    ? (typeof loanData.damages === 'string' ? JSON.parse(loanData.damages) : loanData.damages)
    : [];
  
  // Get damage status for a part
  const getDamageStatus = (partName: string): string => {
    const damage = damages.find((d: any) => d.name === partName);
    if (!damage || damage.type === 'none') return '-';
    if (damage.type === 'rayure') return 'R';
    if (damage.type === 'choc') return 'C';
    if (damage.type === 'hs') return 'HS';
    return '-';
  };

  // Véhicule sinistré depuis le devis
  const damagedVehicle = loanData?.quotes?.vehicles;

  return (
    <Document>
      {/* Page 1 - Titre, Préambule, Articles 1-4 */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.mainTitle}>
          CONTRAT DE MISE À DISPOSITION DE VÉHICULE DE PRÊT
        </Text>
        <Text style={styles.subtitle}>
          (Articles 1875 à 1891 du Code civil - Prêt à usage)
        </Text>

        <View style={styles.contractInfo}>
          <Text>N° Contrat : {contractNumber}</Text>
          <Text>Date : {contractDate}</Text>
        </View>

        {/* Préambule */}
        <View style={styles.preambuleSection}>
          <Text style={styles.preambuleTitle}>PRÉAMBULE</Text>
          <Text style={styles.preambuleText}>
            Le présent contrat est établi dans le cadre d'une mise à disposition gratuite d'un véhicule de remplacement 
            pendant la durée des réparations du véhicule sinistré de l'Emprunteur. Cette mise à disposition constitue 
            un prêt à usage (commodat) au sens des articles 1875 et suivants du Code civil, et ne saurait être assimilée 
            à une location de véhicule.
          </Text>
          <Text style={styles.preambuleText}>
            L'Emprunteur reconnaît avoir pris connaissance des conditions générales du présent contrat et les accepte 
            sans réserve. Il s'engage à utiliser le véhicule en bon père de famille et à le restituer dans l'état où 
            il l'a reçu.
          </Text>
        </View>

        {/* Références sinistre */}
        <View style={styles.referenceSection}>
          <Text style={styles.referenceTitle}>RÉFÉRENCES DU SINISTRE</Text>
          <View style={styles.referenceRow}>
            <Text style={styles.referenceLabel}>N° de sinistre :</Text>
            <Text style={styles.referenceValue}>{loanData?.quotes?.claim_number || ''}</Text>
          </View>
          <View style={styles.referenceRow}>
            <Text style={styles.referenceLabel}>Date du sinistre :</Text>
            <Text style={styles.referenceValue}>{loanData?.sinister_date ? formatDate(loanData.sinister_date) : ''}</Text>
          </View>
          <View style={styles.referenceRow}>
            <Text style={styles.referenceLabel}>N° rapport d'expertise :</Text>
            <Text style={styles.referenceValue}>{loanData?.expertise_report_number || ''}</Text>
          </View>
        </View>

        {/* Article 1 - Identification des parties */}
        <Text style={styles.articleTitle}>ARTICLE 1 - IDENTIFICATION DES PARTIES</Text>
        <View style={styles.twoColumnGrid}>
          <View style={styles.column}>
            <Text style={styles.partyTitle}>LE PRÊTEUR</Text>
            <Text style={styles.partyInfo}>{companyData?.name || ''}</Text>
            <Text style={styles.partyInfo}>{companyData?.address || ''}</Text>
            <Text style={styles.partyInfo}>{companyData?.zipcode || ''} {companyData?.city || ''}</Text>
            <Text style={styles.partyInfo}>Tél : {companyData?.phone || ''}</Text>
            <Text style={styles.partyInfo}>Email : {companyData?.email || ''}</Text>
            <Text style={styles.partyInfo}>SIRET : {companyData?.siret || ''}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.partyTitle}>L'EMPRUNTEUR</Text>
            <Text style={styles.partyInfo}>{loanData?.clients?.first_name || ''} {loanData?.clients?.last_name || ''}</Text>
            <Text style={styles.partyInfo}>{loanData?.clients?.address || ''}</Text>
            <Text style={styles.partyInfo}>{loanData?.clients?.postal_code || ''} {loanData?.clients?.city || ''}</Text>
            <Text style={styles.partyInfo}>Tél : {loanData?.clients?.phone || ''}</Text>
            <Text style={styles.partyInfo}>Email : {loanData?.clients?.email || ''}</Text>
          </View>
        </View>

        {/* Article 2 - Assurance et Assistance */}
        <Text style={styles.articleTitle}>ARTICLE 2 - ASSURANCE ET ASSISTANCE</Text>
        <View style={styles.twoColumnGrid}>
          <View style={styles.column}>
            <Text style={styles.subSectionTitle}>ASSUREUR</Text>
            <Text style={styles.partyInfo}>Compagnie : {loanData?.insurance_company_name || ''}</Text>
            <Text style={styles.partyInfo}>N° contrat : {loanData?.insurance_contract_number || ''}</Text>
            <Text style={styles.partyInfo}>Tél : {loanData?.insurance_phone || ''}</Text>
            <Text style={styles.partyInfo}>Email : {loanData?.insurance_email || ''}</Text>
          </View>
          {loanData?.has_assistance && (
            <View style={styles.column}>
              <Text style={styles.subSectionTitle}>ASSISTEUR</Text>
              <Text style={styles.partyInfo}>Société : {loanData?.assistance_name || ''}</Text>
              <Text style={styles.partyInfo}>N° dossier : {loanData?.assistance_case_number || ''}</Text>
              <Text style={styles.partyInfo}>Email : {loanData?.assistance_email || ''}</Text>
            </View>
          )}
        </View>

        {/* Article 3 - Véhicules */}
        <Text style={styles.articleTitle}>ARTICLE 3 - VÉHICULES</Text>
        <View style={styles.vehicleGrid}>
          <View style={styles.vehicleColumn}>
            <Text style={styles.vehicleTitle}>VÉHICULE SINISTRÉ</Text>
            <View style={styles.vehicleRow}>
              <Text style={styles.vehicleLabel}>Marque :</Text>
              <Text style={styles.vehicleValue}>{damagedVehicle?.car_brands?.name || ''}</Text>
            </View>
            <View style={styles.vehicleRow}>
              <Text style={styles.vehicleLabel}>Modèle :</Text>
              <Text style={styles.vehicleValue}>{damagedVehicle?.car_models?.name || ''}</Text>
            </View>
            <View style={styles.vehicleRow}>
              <Text style={styles.vehicleLabel}>Immatriculation :</Text>
              <Text style={styles.vehicleValue}>{damagedVehicle?.license_plate || ''}</Text>
            </View>
            <View style={styles.vehicleRow}>
              <Text style={styles.vehicleLabel}>N° VIN :</Text>
              <Text style={styles.vehicleValue}>{damagedVehicle?.vin || ''}</Text>
            </View>
          </View>
          <View style={styles.vehicleColumn}>
            <Text style={styles.vehicleTitle}>VÉHICULE DE PRÊT</Text>
            <View style={styles.vehicleRow}>
              <Text style={styles.vehicleLabel}>Marque :</Text>
              <Text style={styles.vehicleValue}>{loanData?.fleet_vehicles?.car_brands?.name || ''}</Text>
            </View>
            <View style={styles.vehicleRow}>
              <Text style={styles.vehicleLabel}>Modèle :</Text>
              <Text style={styles.vehicleValue}>{loanData?.fleet_vehicles?.car_models?.name || ''}</Text>
            </View>
            <View style={styles.vehicleRow}>
              <Text style={styles.vehicleLabel}>Immatriculation :</Text>
              <Text style={styles.vehicleValue}>{loanData?.fleet_vehicles?.license_plate || ''}</Text>
            </View>
            <View style={styles.vehicleRow}>
              <Text style={styles.vehicleLabel}>N° VIN :</Text>
              <Text style={styles.vehicleValue}>{loanData?.fleet_vehicles?.vin || ''}</Text>
            </View>
          </View>
        </View>

        {/* Article 4 - Durée du prêt */}
        <Text style={styles.articleTitle}>ARTICLE 4 - DURÉE DU PRÊT</Text>
        <Text style={styles.articleText}>
          Le véhicule est mis à disposition à compter du {loanData?.start_date ? formatDate(loanData.start_date) : ''} 
          {loanData?.expected_return_date ? ` jusqu'au ${formatDate(loanData.expected_return_date)}` : ''}.
        </Text>
        <Text style={styles.articleText}>
          Formule de couverture : {loanData?.coverage_duration ? `${loanData.coverage_duration} jours` : 'Non spécifiée'}
        </Text>
        <Text style={styles.articleText}>
          L'Emprunteur s'engage à restituer le véhicule dès que son véhicule personnel sera disponible, 
          même si cette date intervient avant la fin de la période prévue.
        </Text>

        <Text style={styles.pageNumber}>Page 1/4</Text>
      </Page>

      {/* Page 2 - Articles 5-9 */}
      <Page size="A4" style={styles.page}>
        {/* Article 5 - Conducteur autorisé */}
        <Text style={styles.articleTitle}>ARTICLE 5 - CONDUCTEUR AUTORISÉ</Text>
        <Text style={styles.articleText}>
          Seul l'Emprunteur désigné ci-dessus est autorisé à conduire le véhicule de prêt. Tout autre conducteur 
          doit faire l'objet d'une autorisation écrite préalable du Prêteur.
        </Text>
        <View style={{ marginTop: 6 }}>
          <View style={styles.referenceRow}>
            <Text style={styles.referenceLabel}>N° permis de conduire :</Text>
            <Text style={styles.referenceValue}>{loanData?.clients?.license_number || ''}</Text>
          </View>
          <View style={styles.referenceRow}>
            <Text style={styles.referenceLabel}>Date de délivrance :</Text>
            <Text style={styles.referenceValue}>{loanData?.clients?.license_issue_date ? formatDate(loanData.clients.license_issue_date) : ''}</Text>
          </View>
          <View style={styles.referenceRow}>
            <Text style={styles.referenceLabel}>Préfecture :</Text>
            <Text style={styles.referenceValue}>{loanData?.clients?.prefecture || ''}</Text>
          </View>
        </View>

        {/* Article 6 - Conditions d'utilisation */}
        <Text style={styles.articleTitle}>ARTICLE 6 - CONDITIONS D'UTILISATION</Text>
        <Text style={styles.articleText}>L'Emprunteur s'engage à :</Text>
        <Text style={styles.bulletPoint}>• Utiliser le véhicule en bon père de famille conformément à sa destination normale</Text>
        <Text style={styles.bulletPoint}>• Ne pas sous-louer le véhicule ni le prêter à un tiers</Text>
        <Text style={styles.bulletPoint}>• Ne pas utiliser le véhicule pour des compétitions sportives ou des essais</Text>
        <Text style={styles.bulletPoint}>• Ne pas transporter de marchandises dangereuses ou illicites</Text>
        <Text style={styles.bulletPoint}>• Respecter le Code de la route et les limitations de vitesse</Text>
        <Text style={styles.bulletPoint}>• Ne pas fumer dans le véhicule</Text>
        <Text style={styles.bulletPoint}>• Ne pas quitter le territoire français sans autorisation préalable</Text>

        {/* Article 7 - Assurance du véhicule de prêt */}
        <Text style={styles.articleTitle}>ARTICLE 7 - ASSURANCE DU VÉHICULE DE PRÊT</Text>
        <Text style={styles.articleText}>
          Le véhicule de prêt est couvert par l'assurance du Prêteur. L'Emprunteur reste responsable de la franchise 
          en cas de sinistre responsable ou sans tiers identifié.
        </Text>
        <Text style={styles.articleText}>
          La franchise applicable est de : ____________ € (montant à compléter par le Prêteur).
        </Text>
        <Text style={styles.articleText}>
          L'Emprunteur peut souscrire une assurance complémentaire couvrant cette franchise auprès de son propre assureur.
        </Text>

        {/* Article 8 - Procédure en cas de sinistre */}
        <Text style={styles.articleTitle}>ARTICLE 8 - PROCÉDURE EN CAS DE SINISTRE</Text>
        <Text style={styles.articleText}>En cas d'accident ou de sinistre, l'Emprunteur doit impérativement :</Text>
        <Text style={styles.bulletPoint}>• Prévenir immédiatement le Prêteur par téléphone</Text>
        <Text style={styles.bulletPoint}>• Remplir un constat amiable avec le tiers (le cas échéant)</Text>
        <Text style={styles.bulletPoint}>• Ne pas reconnaître sa responsabilité</Text>
        <Text style={styles.bulletPoint}>• Relever l'identité des témoins éventuels</Text>
        <Text style={styles.bulletPoint}>• Déposer plainte en cas de vol ou de vandalisme</Text>
        <Text style={styles.bulletPoint}>• Transmettre tous les documents au Prêteur dans les 48 heures</Text>

        {/* Article 9 - Infractions au code de la route */}
        <Text style={styles.articleTitle}>ARTICLE 9 - INFRACTIONS AU CODE DE LA ROUTE</Text>
        <Text style={styles.articleText}>
          L'Emprunteur est seul responsable des infractions au Code de la route commises pendant la durée du prêt. 
          Il s'engage à régler directement les amendes et contraventions dont il sera l'auteur.
        </Text>
        <Text style={styles.articleText}>
          En cas de réception d'un avis de contravention par le Prêteur, celui-ci transmettra les coordonnées de 
          l'Emprunteur à l'autorité compétente conformément à la réglementation en vigueur.
        </Text>
        <Text style={styles.articleText}>
          L'Emprunteur s'engage à indemniser le Prêteur de tous frais administratifs liés au traitement des infractions 
          (forfait de 30 € par infraction).
        </Text>

        <Text style={styles.pageNumber}>Page 2/4</Text>
      </Page>

      {/* Page 3 - Articles 10-13 */}
      <Page size="A4" style={styles.page}>
        {/* Article 10 - Restitution */}
        <Text style={styles.articleTitle}>ARTICLE 10 - RESTITUTION DU VÉHICULE</Text>
        <Text style={styles.articleText}>
          L'Emprunteur s'engage à restituer le véhicule dans l'état où il l'a reçu, à la date et au lieu convenus.
        </Text>
        <Text style={styles.articleText}>Le véhicule doit être restitué :</Text>
        <Text style={styles.bulletPoint}>• Propre intérieurement et extérieurement</Text>
        <Text style={styles.bulletPoint}>• Avec le même niveau de carburant qu'au départ</Text>
        <Text style={styles.bulletPoint}>• Avec tous les documents et accessoires fournis (clés, carte grise, carte verte, etc.)</Text>
        <Text style={styles.articleText}>
          Tout retard non autorisé dans la restitution entraînera une facturation de 50 € par jour de retard, 
          sans préjudice des éventuelles poursuites pour abus de confiance.
        </Text>

        {/* Article 11 - Tarification */}
        <Text style={styles.articleTitle}>ARTICLE 11 - TARIFICATION ET FACTURATION</Text>
        <Text style={styles.articleText}>
          Le prêt du véhicule est consenti à titre gratuit dans le cadre de la réparation du véhicule sinistré.
        </Text>
        <Text style={styles.articleText}>
          Toutefois, les prestations suivantes pourront faire l'objet d'une facturation :
        </Text>
        <Text style={styles.bulletPoint}>• Nettoyage du véhicule si restitué sale : 80 € TTC</Text>
        <Text style={styles.bulletPoint}>• Complément de carburant au tarif en vigueur + 20 € de frais de service</Text>
        <Text style={styles.bulletPoint}>• Réparation des dommages non signalés au départ : selon devis</Text>
        <Text style={styles.bulletPoint}>• Frais de gestion des contraventions : 30 € par infraction</Text>

        {/* Article 12 - Autorisation paiement direct */}
        <Text style={styles.articleTitle}>ARTICLE 12 - AUTORISATION DE PAIEMENT DIRECT</Text>
        <Text style={styles.articleText}>
          L'Emprunteur autorise expressément le Prêteur à facturer directement à la compagnie d'assurance 
          ou à l'assisteur les frais de mise à disposition du véhicule de prêt, dans la limite des garanties 
          prévues au contrat d'assurance.
        </Text>

        {/* Article 13 - État des lieux */}
        <Text style={styles.articleTitle}>ARTICLE 13 - ÉTAT DES LIEUX CONTRADICTOIRE</Text>
        <Text style={styles.articleText}>
          L'état du véhicule est constaté contradictoirement au départ et au retour. Les dommages non mentionnés 
          à l'état des lieux de départ seront présumés avoir été causés pendant le prêt.
        </Text>
        <Text style={styles.articleText}>
          Légende : R = Rayure | C = Choc | HS = Hors Service
        </Text>

        <View style={styles.damageTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>ÉLÉMENT</Text>
            <Text style={styles.tableHeaderCell}>DÉPART</Text>
            <Text style={styles.tableHeaderCellLast}>RETOUR</Text>
          </View>
          {BODY_PARTS.map((part, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{part}</Text>
              <Text style={styles.tableCell}>{getDamageStatus(part)}</Text>
              <Text style={styles.tableCellLast}></Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={styles.referenceRow}>
            <Text style={styles.referenceLabel}>Kilométrage départ :</Text>
            <Text style={styles.referenceValue}>{loanData?.start_mileage || ''} km</Text>
          </View>
          <View style={styles.referenceRow}>
            <Text style={styles.referenceLabel}>Carburant départ :</Text>
            <Text style={styles.referenceValue}>{loanData?.fuel_level_start || ''}%</Text>
          </View>
        </View>

        <Text style={styles.pageNumber}>Page 3/4</Text>
      </Page>

      {/* Page 4 - Articles 14-15 et Signatures */}
      <Page size="A4" style={styles.page}>
        {/* Article 14 - Fondements juridiques */}
        <Text style={styles.articleTitle}>ARTICLE 14 - FONDEMENTS JURIDIQUES</Text>
        <Text style={styles.articleText}>
          Le présent contrat est régi par les dispositions du Code civil français, notamment :
        </Text>
        <Text style={styles.bulletPoint}>• Articles 1875 à 1891 relatifs au prêt à usage (commodat)</Text>
        <Text style={styles.bulletPoint}>• Articles 1101 et suivants relatifs aux contrats</Text>
        <Text style={styles.bulletPoint}>• Articles 1240 et suivants relatifs à la responsabilité civile</Text>
        <Text style={styles.articleText}>
          Tout litige relatif à l'exécution du présent contrat sera soumis à la juridiction compétente du lieu 
          du siège social du Prêteur.
        </Text>

        {/* Article 15 - Acceptation et signatures */}
        <Text style={styles.articleTitle}>ARTICLE 15 - ACCEPTATION ET SIGNATURES</Text>
        <Text style={styles.articleText}>
          L'Emprunteur déclare avoir pris connaissance de l'ensemble des conditions du présent contrat et les 
          accepter sans réserve. Il reconnaît avoir reçu un exemplaire du présent contrat.
        </Text>
        <Text style={styles.articleText}>
          L'Emprunteur atteste sur l'honneur être titulaire d'un permis de conduire en cours de validité 
          l'autorisant à conduire le véhicule mis à disposition.
        </Text>

        <View style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 9, fontWeight: 'bold' }}>
            Fait à {companyData?.city || '________________'}, le {contractDate}
          </Text>
          <Text style={{ fontSize: 8, marginTop: 4, fontStyle: 'italic' }}>
            En deux exemplaires originaux
          </Text>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureGrid}>
            <View style={styles.signatureColumn}>
              <Text style={styles.signatureTitle}>LE PRÊTEUR</Text>
              <Text style={{ fontSize: 8, textAlign: 'center' }}>{companyData?.name || ''}</Text>
              <Text style={{ fontSize: 7, textAlign: 'center', marginTop: 4 }}>Cachet et signature</Text>
            </View>
            <View style={styles.signatureColumn}>
              <Text style={styles.signatureTitle}>L'EMPRUNTEUR</Text>
              <Text style={{ fontSize: 8, textAlign: 'center' }}>
                {loanData?.clients?.first_name || ''} {loanData?.clients?.last_name || ''}
              </Text>
              {loanData?.client_signature && (
                <Image src={loanData.client_signature} style={styles.signatureImage} />
              )}
              <Text style={{ fontSize: 7, textAlign: 'center', marginTop: 4 }}>
                Lu et approuvé, signature précédée de la mention "Bon pour accord"
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 20, padding: 10, backgroundColor: '#f5f5f5' }}>
          <Text style={{ fontSize: 7, textAlign: 'center', fontStyle: 'italic' }}>
            Document généré électroniquement le {contractDate} - Position GPS : {userPosition}
          </Text>
          <Text style={{ fontSize: 7, textAlign: 'center', marginTop: 2 }}>
            Ce document a valeur de contrat entre les parties et engage leur responsabilité respective.
          </Text>
        </View>

        <Text style={styles.pageNumber}>Page 4/4</Text>
      </Page>
    </Document>
  );
};

export default LoanContractPDF;

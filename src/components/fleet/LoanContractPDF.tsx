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
    fontSize: 8,
    paddingTop: 25,
    paddingBottom: 35,
    paddingHorizontal: 30,
    position: 'relative',
  },
  mainTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 2,
    fontStyle: 'italic',
  },
  subtitleSmall: {
    fontSize: 8,
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  contractInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    fontSize: 8,
  },
  articleTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: '#e0e0e0',
    padding: 3,
  },
  subArticleTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 2,
  },
  articleText: {
    fontSize: 7,
    lineHeight: 1.35,
    marginBottom: 2,
    textAlign: 'justify',
  },
  twoColumnGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 6,
  },
  column: {
    flex: 1,
  },
  partyTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 2,
    textDecoration: 'underline',
  },
  partyInfo: {
    fontSize: 7,
    marginBottom: 1,
  },
  vehicleGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  vehicleColumn: {
    flex: 1,
    padding: 5,
    border: '1px solid #999',
  },
  vehicleTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  vehicleRow: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  vehicleLabel: {
    width: 70,
    fontSize: 7,
  },
  vehicleValue: {
    flex: 1,
    fontSize: 7,
  },
  bulletPoint: {
    fontSize: 7,
    marginLeft: 8,
    marginBottom: 1,
  },
  numberedPoint: {
    fontSize: 7,
    marginLeft: 8,
    marginBottom: 1,
  },
  infoTable: {
    marginTop: 4,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  infoLabel: {
    width: 100,
    fontSize: 7,
  },
  infoValue: {
    flex: 1,
    fontSize: 7,
  },
  simpleTable: {
    marginTop: 4,
    border: '1px solid #000',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderBottom: '1px solid #000',
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 7,
    fontWeight: 'bold',
    padding: 2,
    textAlign: 'center',
    borderRight: '1px solid #000',
  },
  tableHeaderCellLast: {
    flex: 1,
    fontSize: 7,
    fontWeight: 'bold',
    padding: 2,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #ccc',
  },
  tableCell: {
    flex: 1,
    fontSize: 6,
    padding: 2,
    borderRight: '1px solid #ccc',
  },
  tableCellLast: {
    flex: 1,
    fontSize: 6,
    padding: 2,
  },
  tariffRow: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  tariffLabel: {
    flex: 3,
    fontSize: 7,
  },
  tariffValue: {
    flex: 1,
    fontSize: 7,
    textAlign: 'right',
  },
  delegationBox: {
    marginTop: 4,
    padding: 6,
    border: '1px solid #000',
    backgroundColor: '#f8f8f8',
  },
  delegationText: {
    fontSize: 7,
    lineHeight: 1.4,
    marginBottom: 3,
    textAlign: 'justify',
  },
  delegationBold: {
    fontSize: 7,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 2,
  },
  signatureSection: {
    marginTop: 12,
  },
  signatureGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  signatureColumn: {
    flex: 1,
    border: '1px solid #999',
    padding: 8,
    minHeight: 70,
  },
  signatureTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  signatureImage: {
    width: 100,
    height: 40,
    objectFit: 'contain',
    alignSelf: 'center',
  },
  signatureMention: {
    fontSize: 6,
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 7,
    color: '#666',
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 30,
    right: 30,
    fontSize: 6,
    textAlign: 'center',
    color: '#666',
  },
  legalReferences: {
    marginTop: 4,
  },
  legalRef: {
    fontSize: 6,
    marginBottom: 1,
  },
  checkbox: {
    width: 8,
    height: 8,
    border: '1px solid #000',
    marginRight: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  etatLieuxTable: {
    marginTop: 4,
    border: '1px solid #000',
  },
  etatLieuxRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #ccc',
  },
  etatLieuxLabel: {
    flex: 2,
    fontSize: 7,
    padding: 2,
    borderRight: '1px solid #ccc',
  },
  etatLieuxCell: {
    flex: 1,
    fontSize: 7,
    padding: 2,
    textAlign: 'center',
    borderRight: '1px solid #ccc',
  },
  etatLieuxCellLast: {
    flex: 1,
    fontSize: 7,
    padding: 2,
    textAlign: 'center',
  },
});

const BODY_PARTS_SIMPLIFIED = [
  'Extérieur (carrosserie)',
  'Intérieur (habitacle)',
  'Jantes / Pneus',
  'Vitrage',
  'Accessoires (clés, docs)',
];

const LoanContractPDF = ({ loanData, companyData, userPosition }: LoanContractPDFProps) => {
  const contractDate = formatDate(new Date().toISOString());
  const contractNumber = `CPV-${new Date().getFullYear()}-${loanData?.id?.substring(0, 6) || '000000'}`;
  
  const damagedVehicle = loanData?.quotes?.vehicles;
  const clientName = `${loanData?.clients?.first_name || ''} ${loanData?.clients?.last_name || ''}`.trim();
  const insurerName = loanData?.insurance_company_name || '[Assureur]';
  const assisteurName = loanData?.assistance_name || '[Assisteur]';
  const companyName = companyData?.name || '[Carrossier]';

  return (
    <Document>
      {/* Page 1 - En-tête, Articles 1-4 */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.mainTitle}>
          CONTRAT DE MISE À DISPOSITION DE VÉHICULE DE PRÊT
        </Text>
        <Text style={styles.subtitle}>
          (Articles 1875 à 1891 du Code civil - Prêt à usage)
        </Text>
        <Text style={styles.subtitleSmall}>
          Avec autorisation de paiement direct à l'assisteur
        </Text>

        <View style={styles.contractInfo}>
          <Text>N° Contrat : {contractNumber}</Text>
          <Text>Date : {contractDate}</Text>
        </View>

        {/* Article 1 - Identification des parties */}
        <Text style={styles.articleTitle}>ARTICLE 1 - IDENTIFICATION DES PARTIES</Text>
        <View style={styles.twoColumnGrid}>
          <View style={styles.column}>
            <Text style={styles.partyTitle}>LE PRÊTEUR (ci-après "le Prêteur")</Text>
            <Text style={styles.partyInfo}>{companyData?.name || ''}</Text>
            <Text style={styles.partyInfo}>{companyData?.address || ''}</Text>
            <Text style={styles.partyInfo}>{companyData?.zipcode || ''} {companyData?.city || ''}</Text>
            <Text style={styles.partyInfo}>Tél : {companyData?.phone || ''}</Text>
            <Text style={styles.partyInfo}>Email : {companyData?.email || ''}</Text>
            <Text style={styles.partyInfo}>SIRET : {companyData?.siret || ''}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.partyTitle}>L'EMPRUNTEUR (ci-après "l'Emprunteur")</Text>
            <Text style={styles.partyInfo}>{clientName}</Text>
            <Text style={styles.partyInfo}>{loanData?.clients?.address || ''}</Text>
            <Text style={styles.partyInfo}>{loanData?.clients?.postal_code || ''} {loanData?.clients?.city || ''}</Text>
            <Text style={styles.partyInfo}>Tél : {loanData?.clients?.phone || ''}</Text>
            <Text style={styles.partyInfo}>Email : {loanData?.clients?.email || ''}</Text>
            <Text style={styles.partyInfo}>N° Permis : {loanData?.clients?.license_number || '[Non renseigné]'}</Text>
            <Text style={styles.partyInfo}>Délivré le : {loanData?.clients?.license_issue_date ? formatDate(loanData.clients.license_issue_date) : '[Non renseigné]'}</Text>
          </View>
        </View>

        {/* Article 2 - Assurance et Assistance */}
        <Text style={styles.articleTitle}>ARTICLE 2 - ASSURANCE ET ASSISTANCE</Text>
        <View style={styles.twoColumnGrid}>
          <View style={styles.column}>
            <Text style={styles.subArticleTitle}>ASSUREUR</Text>
            <Text style={styles.partyInfo}>Compagnie : {insurerName}</Text>
            <Text style={styles.partyInfo}>N° contrat : {loanData?.insurance_contract_number || ''}</Text>
            <Text style={styles.partyInfo}>N° sinistre : {loanData?.quotes?.claim_number || ''}</Text>
            <Text style={styles.partyInfo}>Email : {loanData?.insurance_email || ''}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.subArticleTitle}>ASSISTEUR</Text>
            <Text style={styles.partyInfo}>Société : {assisteurName}</Text>
            <Text style={styles.partyInfo}>N° dossier : {loanData?.assistance_case_number || ''}</Text>
            <Text style={styles.partyInfo}>Email : {loanData?.assistance_email || ''}</Text>
            <Text style={styles.partyInfo}>Formule : {loanData?.assistance_formula || ''}</Text>
          </View>
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
        
        <Text style={styles.subArticleTitle}>4.1 Période de mise à disposition</Text>
        <View style={styles.simpleTable}>
          <View style={styles.tableRow}>
            <Text style={{...styles.tableCell, fontWeight: 'bold'}}>Mise à disposition</Text>
            <Text style={styles.tableCellLast}>{loanData?.start_date ? formatDate(loanData.start_date) : ''}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={{...styles.tableCell, fontWeight: 'bold'}}>Restitution prévue</Text>
            <Text style={styles.tableCellLast}>{loanData?.expected_return_date ? formatDate(loanData.expected_return_date) : ''}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={{...styles.tableCell, fontWeight: 'bold'}}>Durée garantie</Text>
            <Text style={styles.tableCellLast}>{loanData?.assistance_formula || loanData?.coverage_duration ? `${loanData.coverage_duration || ''} jours` : ''}</Text>
          </View>
        </View>

        <Text style={styles.subArticleTitle}>4.2 Restitution anticipée</Text>
        <Text style={styles.articleText}>
          L'Emprunteur s'engage à restituer le véhicule dès que son véhicule personnel sera disponible, 
          même si cette date intervient avant la fin de la période prévue.
        </Text>

        <Text style={styles.subArticleTitle}>4.3 Prolongation</Text>
        <Text style={styles.articleText}>
          Toute prolongation doit faire l'objet d'une demande écrite au moins 24 heures avant la fin de la période initiale, 
          et nécessite l'accord préalable du Prêteur et de l'assisteur.
        </Text>

        <Text style={styles.subArticleTitle}>4.4 Pénalités de retard</Text>
        <Text style={styles.articleText}>
          Tout retard non autorisé dans la restitution entraînera une facturation de 45 € HT par jour de retard, 
          sans préjudice des éventuelles poursuites pour abus de confiance.
        </Text>

        <Text style={styles.pageNumber}>Page 1/4</Text>
      </Page>

      {/* Page 2 - Articles 5-6 */}
      <Page size="A4" style={styles.page}>
        {/* Article 5 - Conducteur autorisé */}
        <Text style={styles.articleTitle}>ARTICLE 5 - CONDUCTEUR AUTORISÉ</Text>
        
        <Text style={styles.subArticleTitle}>5.1 Conducteur unique</Text>
        <Text style={styles.articleText}>
          Seul l'Emprunteur désigné ci-dessus est autorisé à conduire le véhicule de prêt. 
          Le conducteur doit être titulaire d'un permis de conduire valide depuis plus de 2 ans.
        </Text>
        <View style={styles.infoTable}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>N° permis de conduire :</Text>
            <Text style={styles.infoValue}>{loanData?.clients?.license_number || ''}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date de délivrance :</Text>
            <Text style={styles.infoValue}>{loanData?.clients?.license_issue_date ? formatDate(loanData.clients.license_issue_date) : ''}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Préfecture :</Text>
            <Text style={styles.infoValue}>{loanData?.clients?.prefecture || ''}</Text>
          </View>
        </View>

        <Text style={styles.subArticleTitle}>5.2 Interdiction de prêt à tiers</Text>
        <Text style={styles.articleText}>
          Il est formellement interdit à l'Emprunteur de prêter le véhicule à un tiers. 
          Toute infraction à cette règle entraînera une pénalité de 500 € et la résiliation immédiate du contrat.
        </Text>

        <Text style={styles.subArticleTitle}>5.3 Conducteur secondaire (optionnel)</Text>
        <View style={styles.infoTable}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nom :</Text>
            <Text style={styles.infoValue}>________________________________________</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>N° permis :</Text>
            <Text style={styles.infoValue}>________________________________________</Text>
          </View>
        </View>

        {/* Article 6 - Conditions d'utilisation */}
        <Text style={styles.articleTitle}>ARTICLE 6 - CONDITIONS D'UTILISATION</Text>
        
        <Text style={styles.subArticleTitle}>6.1 Cadre autorisé</Text>
        <Text style={styles.articleText}>
          Le véhicule est destiné à un usage personnel en France métropolitaine uniquement. 
          Le kilométrage est limité à 150 km par jour. Tout dépassement sera facturé 0,30 € HT/km.
        </Text>

        <Text style={styles.subArticleTitle}>6.2 Usages interdits</Text>
        <Text style={styles.bulletPoint}>• Transport de personnes à titre onéreux (VTC, taxi)</Text>
        <Text style={styles.bulletPoint}>• Remorquage ou poussée d'un autre véhicule</Text>
        <Text style={styles.bulletPoint}>• Apprentissage de la conduite</Text>
        <Text style={styles.bulletPoint}>• Compétitions sportives ou essais de vitesse</Text>
        <Text style={styles.bulletPoint}>• Transport de marchandises dangereuses, illicites ou malodorantes</Text>
        <Text style={styles.bulletPoint}>• Usage en dehors du territoire français sans autorisation écrite</Text>

        <Text style={styles.subArticleTitle}>6.3 Obligations de sécurité</Text>
        <Text style={styles.bulletPoint}>• Taux d'alcoolémie : 0,0 g/l (tolérance zéro)</Text>
        <Text style={styles.bulletPoint}>• Interdiction d'usage du téléphone au volant</Text>
        <Text style={styles.bulletPoint}>• Port de la ceinture obligatoire pour tous les passagers</Text>
        <Text style={styles.bulletPoint}>• Respect strict du Code de la route</Text>
        <Text style={styles.bulletPoint}>• Interdiction de fumer dans le véhicule</Text>

        <Text style={styles.subArticleTitle}>6.4 Entretien courant</Text>
        <Text style={styles.articleText}>
          L'Emprunteur prend à sa charge pendant la durée du prêt :
        </Text>
        <Text style={styles.bulletPoint}>• Le carburant</Text>
        <Text style={styles.bulletPoint}>• Les frais de péage et de stationnement</Text>
        <Text style={styles.bulletPoint}>• La vérification régulière des niveaux (huile, liquide de refroidissement, lave-glace)</Text>
        <Text style={styles.bulletPoint}>• Le gonflage des pneumatiques</Text>

        {/* Article 7 - Assurance du véhicule de prêt */}
        <Text style={styles.articleTitle}>ARTICLE 7 - ASSURANCE DU VÉHICULE DE PRÊT</Text>
        
        <Text style={styles.subArticleTitle}>7.1 Couverture</Text>
        <Text style={styles.articleText}>
          Le véhicule de prêt est assuré par le Prêteur. Les garanties applicables sont :
        </Text>
        <View style={styles.infoTable}>
          <View style={styles.checkboxRow}>
            <View style={styles.checkbox} />
            <Text style={styles.articleText}>Responsabilité civile</Text>
          </View>
          <View style={styles.checkboxRow}>
            <View style={styles.checkbox} />
            <Text style={styles.articleText}>Dommages tous accidents</Text>
          </View>
          <View style={styles.checkboxRow}>
            <View style={styles.checkbox} />
            <Text style={styles.articleText}>Vol / Incendie</Text>
          </View>
          <View style={styles.checkboxRow}>
            <View style={styles.checkbox} />
            <Text style={styles.articleText}>Bris de glace</Text>
          </View>
        </View>

        <Text style={styles.subArticleTitle}>7.2 Franchise</Text>
        <Text style={styles.articleText}>
          En cas de sinistre responsable ou sans tiers identifié, la franchise reste à la charge de l'Emprunteur.
          Montant de la franchise : ____________ €
        </Text>

        <Text style={styles.subArticleTitle}>7.3 Exclusions de garantie</Text>
        <Text style={styles.articleText}>
          L'assurance ne couvre pas les sinistres survenus dans les cas suivants :
        </Text>
        <Text style={styles.bulletPoint}>• Conduite sous l'emprise de l'alcool ou de stupéfiants</Text>
        <Text style={styles.bulletPoint}>• Conducteur non autorisé au présent contrat</Text>
        <Text style={styles.bulletPoint}>• Usage non conforme aux conditions du contrat</Text>
        <Text style={styles.bulletPoint}>• Vol avec les clés laissées dans le véhicule</Text>

        <Text style={styles.pageNumber}>Page 2/4</Text>
      </Page>

      {/* Page 3 - Articles 8-11 */}
      <Page size="A4" style={styles.page}>
        {/* Article 8 - Procédure en cas de sinistre */}
        <Text style={styles.articleTitle}>ARTICLE 8 - PROCÉDURE EN CAS DE SINISTRE</Text>
        
        <Text style={styles.subArticleTitle}>8.1 Obligations immédiates</Text>
        <Text style={styles.articleText}>En cas d'accident ou de sinistre, l'Emprunteur doit impérativement :</Text>
        <Text style={styles.numberedPoint}>1. Prévenir immédiatement le Prêteur par téléphone au {companyData?.phone || ''}</Text>
        <Text style={styles.numberedPoint}>2. Remplir un constat amiable avec le tiers (le cas échéant)</Text>
        <Text style={styles.numberedPoint}>3. Relever l'identité et les coordonnées des témoins éventuels</Text>
        <Text style={styles.numberedPoint}>4. Prendre des photos des dégâts et de la scène</Text>
        <Text style={styles.numberedPoint}>5. Déposer plainte en cas de vol, vandalisme ou délit de fuite</Text>
        <Text style={styles.numberedPoint}>6. Transmettre tous les documents au Prêteur dans les 48 heures</Text>

        <Text style={styles.subArticleTitle}>8.2 Informations à recueillir</Text>
        <Text style={styles.articleText}>
          En cas d'accident avec un tiers, relever : nom, adresse, téléphone, assurance, n° de police, 
          immatriculation du véhicule adverse.
        </Text>

        <Text style={styles.subArticleTitle}>8.3 Interdictions</Text>
        <Text style={styles.bulletPoint}>• Ne jamais reconnaître sa responsabilité sur place</Text>
        <Text style={styles.bulletPoint}>• Ne pas faire réparer le véhicule sans accord du Prêteur</Text>
        <Text style={styles.bulletPoint}>• Ne signer aucun document engageant la responsabilité du Prêteur</Text>

        {/* Article 9 - Infractions */}
        <Text style={styles.articleTitle}>ARTICLE 9 - INFRACTIONS AU CODE DE LA ROUTE</Text>
        <Text style={styles.articleText}>
          L'Emprunteur est seul responsable des infractions commises pendant la durée du prêt. 
          Il s'engage à régler directement les amendes et contraventions.
        </Text>
        <Text style={styles.articleText}>
          En cas de réception d'un avis de contravention par le Prêteur, les coordonnées de l'Emprunteur 
          seront transmises à l'autorité compétente.
        </Text>
        <Text style={styles.articleText}>
          Frais administratifs : 30 € par infraction + frais de fourrière éventuels.
        </Text>

        {/* Article 10 - Restitution */}
        <Text style={styles.articleTitle}>ARTICLE 10 - RESTITUTION DU VÉHICULE</Text>
        
        <Text style={styles.subArticleTitle}>10.1 État de restitution</Text>
        <Text style={styles.articleText}>Le véhicule doit être restitué :</Text>
        <Text style={styles.bulletPoint}>• Propre intérieurement et extérieurement</Text>
        <Text style={styles.bulletPoint}>• Avec le même niveau de carburant qu'au départ</Text>
        <Text style={styles.bulletPoint}>• Avec tous les documents et accessoires (clés, carte grise, carte verte)</Text>
        <Text style={styles.bulletPoint}>• Sans nouveaux dommages non signalés</Text>

        <Text style={styles.subArticleTitle}>10.2 Frais de remise en état</Text>
        <View style={styles.simpleTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Prestation</Text>
            <Text style={styles.tableHeaderCellLast}>Tarif HT</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Nettoyage extérieur</Text>
            <Text style={styles.tableCellLast}>30 €</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Nettoyage intérieur</Text>
            <Text style={styles.tableCellLast}>80 €</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Désodorisation (tabac, animaux)</Text>
            <Text style={styles.tableCellLast}>150 €</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Complément carburant</Text>
            <Text style={styles.tableCellLast}>Prix station + 20%</Text>
          </View>
        </View>

        {/* Article 11 - Tarification */}
        <Text style={styles.articleTitle}>ARTICLE 11 - TARIFICATION</Text>
        <Text style={styles.articleText}>
          Le prêt du véhicule est consenti dans le cadre de la prise en charge par l'assisteur.
        </Text>
        <View style={styles.simpleTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Formule</Text>
            <Text style={styles.tableHeaderCellLast}>Tarif HT / jour</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Tarif journalier standard</Text>
            <Text style={styles.tableCellLast}>45 €</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Forfait 7 jours</Text>
            <Text style={styles.tableCellLast}>280 €</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Forfait 14 jours</Text>
            <Text style={styles.tableCellLast}>490 €</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Forfait 21 jours</Text>
            <Text style={styles.tableCellLast}>650 €</Text>
          </View>
        </View>
        <Text style={styles.articleText}>
          Au-delà de la durée couverte par l'assisteur, le tarif journalier sera facturé à l'Emprunteur.
        </Text>

        <Text style={styles.pageNumber}>Page 3/4</Text>
      </Page>

      {/* Page 4 - Articles 12-15 et Signatures */}
      <Page size="A4" style={styles.page}>
        {/* Article 12 - Délégation de paiement */}
        <Text style={styles.articleTitle}>ARTICLE 12 - DÉLÉGATION DE PAIEMENT</Text>
        <View style={styles.delegationBox}>
          <Text style={styles.delegationText}>
            Conformément aux dispositions de l'article 1336 du Code civil, l'Emprunteur, en sa qualité de délégant, 
            délègue par les présentes au Prêteur, en sa qualité de délégataire, le paiement des frais de mise à 
            disposition du véhicule de prêt par :
          </Text>
          <Text style={styles.delegationText}>
            • L'assureur : {insurerName}
          </Text>
          <Text style={styles.delegationText}>
            • Et/ou l'assisteur : {assisteurName}
          </Text>
          <Text style={styles.delegationText}>
            Cette délégation est consentie dans la limite du montant des garanties prévues au contrat d'assurance 
            et/ou d'assistance de l'Emprunteur.
          </Text>
          <Text style={styles.delegationBold}>
            L'Emprunteur, {clientName}, AUTORISE EXPRESSÉMENT ET IRRÉVOCABLEMENT le carrossier {companyName} 
            à percevoir directement les indemnités dues au titre du véhicule de remplacement.
          </Text>
          <Text style={styles.delegationText}>
            En cas de refus de prise en charge ou de prise en charge partielle par l'assureur ou l'assisteur, 
            l'Emprunteur s'engage à régler personnellement le solde restant dû.
          </Text>
        </View>

        {/* Article 13 - État des lieux */}
        <Text style={styles.articleTitle}>ARTICLE 13 - ÉTAT DES LIEUX</Text>
        <View style={styles.etatLieuxTable}>
          <View style={{...styles.etatLieuxRow, backgroundColor: '#e0e0e0'}}>
            <Text style={{...styles.etatLieuxLabel, fontWeight: 'bold'}}>Élément</Text>
            <Text style={{...styles.etatLieuxCell, fontWeight: 'bold'}}>RAS</Text>
            <Text style={{...styles.etatLieuxCellLast, fontWeight: 'bold'}}>Dégâts</Text>
          </View>
          {BODY_PARTS_SIMPLIFIED.map((part, index) => (
            <View key={index} style={styles.etatLieuxRow}>
              <Text style={styles.etatLieuxLabel}>{part}</Text>
              <Text style={styles.etatLieuxCell}>☐</Text>
              <Text style={styles.etatLieuxCellLast}>☐</Text>
            </View>
          ))}
        </View>
        <View style={styles.infoTable}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kilométrage départ :</Text>
            <Text style={styles.infoValue}>{loanData?.start_mileage || '________'} km</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Carburant départ :</Text>
            <Text style={styles.infoValue}>{loanData?.fuel_level_start || '____'}%</Text>
          </View>
        </View>

        {/* Article 14 - Fondements juridiques */}
        <Text style={styles.articleTitle}>ARTICLE 14 - FONDEMENTS JURIDIQUES</Text>
        <View style={styles.legalReferences}>
          <Text style={styles.legalRef}>• Art. 1875-1891 Code civil : prêt à usage (commodat)</Text>
          <Text style={styles.legalRef}>• Art. 1336-1340 Code civil : délégation de paiement</Text>
          <Text style={styles.legalRef}>• Art. 1231-1 Code civil : responsabilité contractuelle</Text>
          <Text style={styles.legalRef}>• Art. L.211-1 et suivants Code des assurances : assurance automobile</Text>
          <Text style={styles.legalRef}>• Art. L.211-10 Code des assurances : garantie assistance</Text>
          <Text style={styles.legalRef}>• Art. L.211-5-1 Code des assurances : libre choix du réparateur</Text>
        </View>

        {/* Article 15 - Signatures */}
        <Text style={styles.articleTitle}>ARTICLE 15 - ACCEPTATION ET SIGNATURES</Text>
        <Text style={styles.articleText}>
          L'Emprunteur déclare avoir pris connaissance de l'ensemble des conditions du présent contrat et les accepter sans réserve.
        </Text>

        <View style={{ marginTop: 8 }}>
          <Text style={{ fontSize: 8 }}>
            Fait à {companyData?.city || '________________'}, le {contractDate}, en deux exemplaires.
          </Text>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureGrid}>
            <View style={styles.signatureColumn}>
              <Text style={styles.signatureTitle}>LE PRÊTEUR</Text>
              <Text style={{ fontSize: 7, textAlign: 'center' }}>{companyData?.name || ''}</Text>
              <Text style={{ fontSize: 6, textAlign: 'center', marginTop: 2 }}>Cachet et signature</Text>
            </View>
            <View style={styles.signatureColumn}>
              <Text style={styles.signatureTitle}>L'EMPRUNTEUR</Text>
              <Text style={{ fontSize: 7, textAlign: 'center' }}>{clientName}</Text>
              {loanData?.client_signature && (
                <Image src={loanData.client_signature} style={styles.signatureImage} />
              )}
              <Text style={styles.signatureMention}>
                "Lu et approuvé, bon pour prêt et autorisation de paiement direct"
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>
            Contrat généré le {contractDate} - Document ayant valeur contractuelle entre les parties
          </Text>
        </View>

        <Text style={styles.pageNumber}>Page 4/4</Text>
      </Page>
    </Document>
  );
};

export default LoanContractPDF;

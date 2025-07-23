import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { formatDate } from '@/utils/date-formatter';

interface AttestationPDFProps {
  loanData: any;
  companyData: any;
  userPosition: string;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 30,
    paddingBottom: 60,
    paddingHorizontal: 30,
    position: 'relative',
  },
  mainTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  threeColumnGrid: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 15,
  },
  column1: {
    flex: 1,
  },
  column2: {
    flex: 1.5,
  },
  column3: {
    flex: 1,
  },
  logo: {
    width: 80,
    height: 30,
    marginBottom: 10,
  },
  logoFallback: {
    backgroundColor: '#f97316',
    borderRadius: 6,
    padding: 3,
    width: 40,
    height: 12,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  companyName: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  companyInfo: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  vehicleInfo: {
    fontSize: 9,
    marginBottom: 4,
  },
  vehicleRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  vehicleLabel: {
    width: 80,
    fontWeight: 'normal',
  },
  vehicleValue: {
    flex: 1,
  },
  departRetourGrid: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },
  departRetourColumn: {
    flex: 1,
  },
  departRetourTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  departRetourInfo: {
    fontSize: 9,
    marginBottom: 2,
  },
  clientName: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clientInfo: {
    fontSize: 9,
    marginBottom: 2,
  },
  contractRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  contractLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    width: 80,
  },
  contractValue: {
    fontSize: 9,
    flex: 1,
  },
  contractTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 30,
  },
  contractSubtitle: {
    fontSize: 10,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 15,
  },
  partyTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  partyInfo: {
    fontSize: 9,
    marginBottom: 2,
  },
  etText: {
    fontSize: 9,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  preambuleTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 15,
  },
  preambuleText: {
    fontSize: 9,
    lineHeight: 1.4,
    textAlign: 'justify',
    marginBottom: 15,
  },
  articleTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 15,
  },
  articleText: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 6,
  },
  vehicleDetails: {
    marginLeft: 15,
    marginBottom: 10,
  },
  vehicleDetailRow: {
    fontSize: 9,
    marginBottom: 2,
  },
  periodText: {
    fontSize: 9,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
  },
  subSectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
  },
  indentedText: {
    fontSize: 9,
    marginLeft: 15,
    marginBottom: 4,
  },
  bulletPoint: {
    fontSize: 9,
    marginLeft: 10,
    marginBottom: 3,
  },
  penaltyText: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 15,
  },
  signatureSection: {
    marginTop: 20,
  },
  signatureGrid: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 50,
  },
  signatureColumn: {
    flex: 1,
  },
  signatureTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  signatureName: {
    fontSize: 9,
    marginBottom: 10,
  },
  finalSignatureTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  finalSignatureName: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  signatureDate: {
    fontSize: 9,
    marginBottom: 4,
  },
  signatureLocation: {
    fontSize: 7,
  },
});

const AttestationPDF = ({ loanData, companyData, userPosition }: AttestationPDFProps) => {
  const loanCreationDate = loanData?.created_at ? formatDate(loanData.created_at) : formatDate(new Date().toISOString());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Titre principal */}
        <Text style={styles.mainTitle}>
          ATTESTATION DE PRÊT DE VÉHICULE DE COURTOISIE
        </Text>

        {/* Grille à 3 colonnes */}
        <View style={styles.threeColumnGrid}>
          {/* Colonne 1 - Entreprise */}
          <View style={styles.column1}>
            {companyData?.logo_url ? (
              <Image src={companyData.logo_url} style={styles.logo} />
            ) : (
              <View style={styles.logoFallback}>
                <Text style={styles.logoText}>AUTO PAINT</Text>
              </View>
            )}
            <Text style={styles.companyName}>{companyData?.name || ''}</Text>
            <Text style={styles.companyInfo}>{companyData?.address || ''}</Text>
            <Text style={styles.companyInfo}>{companyData?.zipcode || ''} {companyData?.city || ''}</Text>
            <Text style={styles.companyInfo}>Téléphone : {companyData?.phone || ''}</Text>
            <Text style={styles.companyInfo}>E-mail : {companyData?.email || ''}</Text>
            <Text style={styles.companyInfo}>SIRET : {companyData?.siret || ''}</Text>
            <Text style={styles.companyInfo}>N° TVA : {companyData?.tva || ''}</Text>
          </View>

          {/* Colonne 2 - Véhicule */}
          <View style={styles.column2}>
            <Text style={styles.sectionTitle}>Désignation du véhicule d'emprunt</Text>
            
            <View style={styles.vehicleRow}>
              <Text style={styles.vehicleLabel}>Marque</Text>
              <Text style={styles.vehicleValue}>{loanData?.fleet_vehicles?.car_brands?.name || ''}</Text>
            </View>
            
            <View style={styles.vehicleRow}>
              <Text style={styles.vehicleLabel}>Modèle</Text>
              <Text style={styles.vehicleValue}>{loanData?.fleet_vehicles?.car_models?.name || ''}</Text>
            </View>
            
            <View style={[styles.vehicleRow, { marginBottom: 8 }]}>
              <Text style={styles.vehicleLabel}>Immatriculation</Text>
              <Text style={styles.vehicleValue}>{loanData?.fleet_vehicles?.license_plate || ''}</Text>
            </View>

            {/* Départ/Retour */}
            <View style={styles.departRetourGrid}>
              <View style={styles.departRetourColumn}>
                <Text style={styles.departRetourTitle}>Départ :</Text>
                <Text style={styles.departRetourInfo}>Le : {loanData?.start_date ? formatDate(loanData.start_date) : ''}</Text>
                <Text style={styles.departRetourInfo}>Kilométrage : {loanData?.start_mileage || ''} Km</Text>
                <Text style={styles.departRetourInfo}>Carburant : {loanData?.fuel_level_start || ''}%</Text>
              </View>
              <View style={styles.departRetourColumn}>
                <Text style={styles.departRetourTitle}>Retour :</Text>
                <Text style={styles.departRetourInfo}>Le : {loanData?.expected_return_date ? formatDate(loanData.expected_return_date) : ''}</Text>
                <Text style={styles.departRetourInfo}>Kilométrage : - - - Km</Text>
                <Text style={styles.departRetourInfo}>Carburant : - - - %</Text>
              </View>
            </View>
          </View>

          {/* Colonne 3 - Client */}
          <View style={styles.column3}>
            <Text style={styles.sectionTitle}>Au client</Text>
            <Text style={styles.clientName}>
              {loanData?.clients?.first_name || ''} {loanData?.clients?.last_name || ''}
            </Text>
            {loanData?.clients?.address && (
              <Text style={styles.clientInfo}>{loanData.clients.address}</Text>
            )}
            {(loanData?.clients?.postal_code || loanData?.clients?.city) && (
              <Text style={styles.clientInfo}>
                {[loanData?.clients?.postal_code, loanData?.clients?.city].filter(Boolean).join(' ')}
              </Text>
            )}
            {loanData?.clients?.phone && (
              <Text style={styles.clientInfo}>Téléphone : {loanData.clients.phone}</Text>
            )}
            
            {loanData?.insurance_contract_number && (
              <View style={styles.contractRow}>
                <Text style={styles.contractLabel}>N° de contrat :</Text>
                <Text style={styles.contractValue}>{loanData.insurance_contract_number}</Text>
              </View>
            )}
          </View>
        </View>
      </Page>

      {/* Nouvelle page pour le contrat */}
      <Page size="A4" style={styles.page}>
        {/* Titre du contrat */}
        <Text style={styles.contractTitle}>
          CONTRAT DE PRÊT DE VÉHICULE DE COURTOISIE
        </Text>
        <Text style={styles.contractSubtitle}>
          (Version amendée, complétée et renforcée)
        </Text>

        {/* ENTRE LES SOUSSIGNÉS */}
        <Text style={styles.sectionHeader}>ENTRE LES SOUSSIGNÉS :</Text>
        
        <Text style={styles.partyTitle}>Le Prêteur :</Text>
        <Text style={styles.partyInfo}>Nom du garage : {companyData?.name?.toUpperCase() || "AUTO PAINT"}</Text>
        <Text style={styles.partyInfo}>Adresse : {companyData?.address || ""} {companyData?.zipcode || ""} {companyData?.city || ""}</Text>
        <Text style={styles.partyInfo}>N° SIRET : {companyData?.siret || ""}</Text>
        
        <Text style={styles.etText}>ET</Text>
        
        <Text style={styles.partyTitle}>L'Emprunteur :</Text>
        <Text style={styles.partyInfo}>Nom et prénom : {loanData?.clients?.first_name || ''} {loanData?.clients?.last_name || ''}</Text>
        {loanData?.clients?.address && (
          <Text style={styles.partyInfo}>Adresse : {loanData.clients.address}</Text>
        )}
        {(loanData?.clients?.postal_code || loanData?.clients?.city) && (
          <Text style={styles.partyInfo}>
            {[loanData?.clients?.postal_code, loanData?.clients?.city].filter(Boolean).join(' ')}
          </Text>
        )}
        {loanData?.clients?.phone && (
          <Text style={styles.partyInfo}>Téléphone : {loanData.clients.phone}</Text>
        )}

        {/* PRÉAMBULE */}
        <Text style={styles.preambuleTitle}>PRÉAMBULE</Text>
        <Text style={styles.preambuleText}>
          Le présent contrat est conclu à titre exceptionnel et gracieux, dans le seul but de faciliter la mobilité temporaire de l'Emprunteur pendant l'immobilisation de son véhicule. Cette mise à disposition n'entraine aucune relation commerciale de location et ne saurait créer une quelconque obligation de résultat à l'égard du Prêteur quant aux performances, au confort ou à l'adaptation du véhicule aux besoins spécifiques de l'Emprunteur.
        </Text>

        {/* 1. OBJET DU CONTRAT */}
        <Text style={styles.articleTitle}>1. OBJET DU CONTRAT</Text>
        <Text style={styles.articleText}>
          Le garage met gratuitement à disposition de l'Emprunteur le véhicule suivant :
        </Text>
        <View style={styles.vehicleDetails}>
          <Text style={styles.vehicleDetailRow}>Marque : {loanData?.fleet_vehicles?.car_brands?.name || ''}</Text>
          <Text style={styles.vehicleDetailRow}>Modèle : {loanData?.fleet_vehicles?.car_models?.name || ''}</Text>
          <Text style={styles.vehicleDetailRow}>N° d'immatriculation : {loanData?.fleet_vehicles?.license_plate || ''}</Text>
          <Text style={styles.vehicleDetailRow}>Carburant : {loanData?.fuel_level_start || ''}%</Text>
          <Text style={styles.vehicleDetailRow}>Kilométrage : {loanData?.start_mileage || ''} Km</Text>
        </View>

        {/* 2. DURÉE DU PRÊT */}
        <Text style={styles.articleTitle}>2. DURÉE DU PRÊT</Text>
        <Text style={styles.periodText}>
          Période initiale : du {loanData?.start_date ? formatDate(loanData.start_date) : ''} au {loanData?.expected_return_date ? formatDate(loanData.expected_return_date) : ''}
        </Text>
        <Text style={[styles.articleText, styles.boldText]}>Restitution anticipée obligatoire.</Text>
        <Text style={styles.articleText}>
          L'emprunteur s'engage expressément à restituer le véhicule sans délai dès que son véhicule personnel est prêt, même si cette disponibilité intervient avant la date de fin prévue initialement.
        </Text>

        <Text style={styles.subSectionTitle}>2.3. Prolongation</Text>
        <Text style={styles.articleText}>
          Toute demande de prolongation doit être formulée par écrit 24 heures avant l'échéance et reste soumise à l'acceptation discrétionnaire du Prêteur qui se réserve le droit de refuser sans avoir à justifier sa décision.
        </Text>

        <Text style={styles.subSectionTitle}>2.4. Pénalités de retard</Text>
        <Text style={styles.penaltyText}>
          Tout retard non justifié et préalablement accepté par écrit par le Prêteur entraînera une pénalité forfaitaire de 150€ par jour de retard entamé, sans préjudice de toute action en justice que le Prêteur pourrait intenter pour obtenir la restitution du véhicule.
        </Text>
      </Page>

      {/* Troisième page pour la suite */}
      <Page size="A4" style={styles.page}>
        {/* 3. UTILISATION DU VÉHICULE */}
        <Text style={styles.articleTitle}>3. UTILISATION DU VÉHICULE</Text>
        
        <Text style={styles.subSectionTitle}>3.1. Conducteurs autorisés</Text>
        <Text style={styles.articleText}>L'utilisation du véhicule est strictement limitée à :</Text>
        <Text style={styles.indentedText}>L'Emprunteur nommément désigné dans ce contrat</Text>
        <Text style={styles.indentedText}>
          Les employés de l'Emprunteur expressément listés dans l'annexe, titulaires d'un permis de conduire valide depuis plus de 3 ans, et dont copie du permis a été fournie au Prêteur avant la signature du présent contrat
        </Text>
        <Text style={styles.indentedText}>
          Tout prêt, cession ou mise à disposition du véhicule à une tierce personne entraîne:
        </Text>

        <Text style={[styles.articleText, styles.boldText]}>1. La résiliation immédiate du contrat</Text>
        <Text style={[styles.articleText, styles.boldText]}>2. L'exigibilité d'une indemnité forfaitaire de 1000€</Text>
        <Text style={[styles.articleText, styles.boldText]}>3. La responsabilité illimitée de l'Emprunteur pour tout dommage qui surviendrait</Text>

        {/* 3.2. Garde d'utilisation autorisée */}
        <Text style={styles.subSectionTitle}>3.2. Garde d'utilisation autorisée</Text>
        <Text style={styles.articleText}>L'Emprunteur garantit que:</Text>
        <Text style={styles.bulletPoint}>• Le véhicule est utilisé exclusivement dans le cadre de son activité professionnelle déclarée, conformément à l'article L. 3121-1 du Code du travail.</Text>
        <Text style={styles.bulletPoint}>• L'usage du véhicule est strictement limité au département de Bouches-du-Rhône (13) et aux départements limitrophes.</Text>
        <Text style={styles.bulletPoint}>• Le kilométrage journalier n'excède pas 100 km, sauf autorisation écrite préalable du Prêteur.</Text>
        <Text style={styles.bulletPoint}>• Le véhicule n'est jamais utilisé:</Text>
        <Text style={styles.indentedText}>- Pour le transport de marchandises ou de marchandises dangereuses</Text>
        <Text style={styles.indentedText}>- Pour la traction ou le remorquage de tout véhicule</Text>
        <Text style={styles.indentedText}>- Pour l'apprentissage de la conduite</Text>
        <Text style={styles.indentedText}>- Pour des compétitions, essais ou reconnaissances de rallyes</Text>
        <Text style={styles.indentedText}>- Sur des chemins non carrossables ou en dehors des voies de circulation autorisées</Text>
        <Text style={styles.indentedText}>- À toute fin illicite ou contraire aux bonnes mœurs</Text>

        {/* 3.3. Sécurité routière et obligations légales */}
        <Text style={styles.subSectionTitle}>3.3. Sécurité routière et obligations légales</Text>
        <Text style={styles.articleText}>L'Emprunteur s'engage formellement à:</Text>
        <Text style={styles.bulletPoint}>• Respecter scrupuleusement toutes les dispositions du Code de la route</Text>
        <Text style={styles.bulletPoint}>• Veiller à ce que tout occupant du véhicule soit systématiquement attaché par une ceinture de sécurité, en application de l'article R. 412-1 du Code de la route</Text>
        <Text style={styles.bulletPoint}>• Ne jamais conduire sous l'emprise d'alcool (taux supérieur à 0,0 g/l) ou de stupéfiants</Text>
        <Text style={styles.bulletPoint}>• Ne jamais utiliser un téléphone tenu en main pendant la conduite</Text>
        <Text style={styles.bulletPoint}>• Signaler immédiatement au Prêteur tout dysfonctionnement constaté sur le véhicule</Text>
      </Page>

      {/* Quatrième page pour les sections 3.4 à 3.6 */}
      <Page size="A4" style={styles.page}>
        {/* 3.4. Sécurisation du matériel transporté */}
        <Text style={styles.subSectionTitle}>3.4. Sécurisation du matériel transporté</Text>
        
        <Text style={[styles.subSectionTitle, { fontSize: 9, fontWeight: 'bold' }]}>3.4.1. Séparation physique et compartimentage</Text>
        <Text style={styles.bulletPoint}>• Le chargement de matériel professionnel doit être rigoureusement séparé de l'espace réservé aux passagers par une cloison rigide ou un filet de séparation homologué, conformément aux points d'ancrage, prévu à cet effet, 4ᵐ de l'article L. 3311-1 du Code des transports et aux dispositions de cassation (Ch. crim., 5 janvier 2016, n° 15-81.859).</Text>
        <Text style={styles.bulletPoint}>• Pour les véhicules de tourisme sans cloison dédiée:</Text>
        <Text style={styles.indentedText}>- L'utilisation exclusive du coffre est obligatoire pour tout équipement professionnel</Text>
        <Text style={styles.indentedText}>- Aucun objet ne doit être placé sur le siège arrière ou les sièges arrières</Text>
        <Text style={styles.indentedText}>- Le chargement ne doit jamais dépasser la hauteur des dossiers des sièges arrière</Text>

        <Text style={[styles.subSectionTitle, { fontSize: 9, fontWeight: 'bold' }]}>3.4.2. Fixation et arrimage du chargement</Text>
        <Text style={styles.articleText}>Les objets transportés doivent être arrimés conformément à l'article R. 312-17 du Code de la route, avec:</Text>
        <Text style={styles.bulletPoint}>• Utilisation obligatoire de sangles, cordes, fixation homologués CE</Text>
        <Text style={styles.bulletPoint}>• Double arrimage croisé pour tout chargement dépassant 25 kg</Text>
        <Text style={styles.bulletPoint}>• Arrimage en trois points pour tout chargement dépassant 50 kg</Text>
        <Text style={styles.bulletPoint}>• Calage des objets par des dispositifs appropriés pour éviter tout glissement</Text>
        <Text style={styles.bulletPoint}>• Répartition uniforme de la charge pour maintenir l'équilibre du véhicule et sa stabilité en conduite</Text>
        <Text style={styles.bulletPoint}>• Vérification de l'arrimage avant chaque départ et après chaque arrêt</Text>

        <Text style={[styles.subSectionTitle, { fontSize: 9, fontWeight: 'bold' }]}>3.4.3. Restrictions de chargement</Text>
        <Text style={styles.articleText}>Il est formellement interdit de transporter:</Text>
        <Text style={styles.bulletPoint}>• Des matières dangereuses au sens de l'ADR (inflammables, corrosives, toxiques, explosives)</Text>
        <Text style={styles.bulletPoint}>• Des produits liquides de nettoyage industriel, même dilués</Text>
        <Text style={styles.bulletPoint}>• Des objets dont la dimension excède la longueur intérieure du véhicule ou qui dépasseraient de l'habitacle</Text>
        <Text style={styles.bulletPoint}>• Des charges supérieures à 50% de la charge utile maximale indiquée sur la carte grise</Text>
        <Text style={styles.bulletPoint}>• Des objets tranchants ou susceptibles d'endommager les revêtements intérieurs</Text>
        <Text style={styles.bulletPoint}>• Des matériaux salissants sans protection adéquate du véhicule</Text>

        <Text style={[styles.subSectionTitle, { fontSize: 9, fontWeight: 'bold' }]}>3.4.4. Signalisation et visibilité</Text>
        <Text style={styles.bulletPoint}>• Tout chargement dépassant l'arrière du véhicule doit être signalé par un dispositif réfléchissant homologué conforme à l'article R. 313-20 du Code de la route</Text>
        <Text style={styles.bulletPoint}>• Le chargement ne doit en aucun cas obstruer, même partiellement:</Text>
        <Text style={styles.indentedText}>- La visibilité directe ou indirecte (rétroviseurs), du conducteur</Text>
        <Text style={styles.indentedText}>- L'accès aux commandes et dispositifs de sécurité du véhicule</Text>
        <Text style={styles.indentedText}>- Les feux, clignotants ou plaques d'immatriculation</Text>
        <Text style={styles.indentedText}>- Les issues de secours</Text>

        <Text style={[styles.subSectionTitle, { fontSize: 9, fontWeight: 'bold' }]}>3.4.5. Responsabilité spécifique liée au chargement</Text>
        <Text style={styles.articleText}>En cas de manquement à ces obligations, et, sauf cause d'exonération de l'Emprunteur sera tenu pour seul et unique responsable de tous dommages au véhicule, à ses occupants ou à des tiers résultant d'un déplacement ou d'une projection du chargement.</Text>
        <Text style={styles.articleText}>L'Emprunteur renonce expressément à tout recours contre le Prêteur à ce titre.</Text>

        {/* 3.5. et 3.6. Entretien et préservation du véhicule */}
        <Text style={styles.subSectionTitle}>3.5. Entretien et préservation du véhicule</Text>
        <Text style={styles.subSectionTitle}>3.6. Entretien et préservation du véhicule</Text>
        <Text style={styles.articleText}>L'Emprunteur s'engage à:</Text>
        <Text style={styles.bulletPoint}>• Vérifier régulièrement les niveaux (huile, liquide de refroidissement, lave-glace)</Text>
        <Text style={styles.bulletPoint}>• Contrôler la pression des pneumatiques avant tout trajet important</Text>
        <Text style={styles.bulletPoint}>• Maintenir la propreté intérieure et extérieure et éviter que s'altèrent</Text>
        <Text style={styles.bulletPoint}>• Ne pas fumer ni vapoter dans le véhicule</Text>
        <Text style={styles.bulletPoint}>• Ne pas consommer de nourriture ou boisson dans l'habitacle</Text>
        <Text style={styles.bulletPoint}>• Protéger les sièges en cas de transport d'outils ou d'équipements professionnels</Text>
        <Text style={styles.bulletPoint}>• Stationner le véhicule dans des lieux sécurisés, de préférence fermés et couverts la nuit</Text>
        <Text style={styles.bulletPoint}>• Ne jamais laisser les clés sur le contact ou dans le véhicule, même momentanément</Text>
        <Text style={styles.bulletPoint}>• Verrouiller systématiquement toutes les portières et activer l'alarme lors de chaque stationnement</Text>
      </Page>

      {/* Cinquième page pour les sections 4 et 5 */}
      <Page size="A4" style={styles.page}>
        {/* 4. ASSURANCE ET RESPONSABILITÉ */}
        <Text style={styles.articleTitle}>4. ASSURANCE ET RESPONSABILITÉ</Text>

        <Text style={styles.subSectionTitle}>4.1. Couverture d'assurance</Text>
        <Text style={styles.articleText}>Le véhicule objet du présent contrat est couvert par l'assurance souscrite par le Prêteur sous le numéro de police 51105175W0001 auprès de GROUPAMA, conformément aux dispositions de l'article L 121-1 du Code des assurances.</Text>
        <Text style={styles.articleText}>Cette garantie est strictement limitée aux risques expressément prévus dans ladite police, dont l'Emprunteur reconnaît avoir pris connaissance.</Text>

        <Text style={styles.subSectionTitle}>4.2. Franchise et contribution de l'Emprunteur</Text>
        <Text style={styles.articleText}>L'Emprunteur accepte expressément qu'en cas de sinistre, quelle que soit la responsabilité établie, il contribuera systématiquement à hauteur de:</Text>
        <Text style={styles.bulletPoint}>• 750€ en cas de sinistre matériel causé au véhicule prêté</Text>
        <Text style={styles.bulletPoint}>• 2000€ minimum en cas de vol ou tentative de vol. Cette contribution minimale s'applique indépendamment de la franchise prévue par l'assurance et constitue une condition essentielle du prêt gratuit consenti.</Text>

        <Text style={styles.subSectionTitle}>4.3. Exclusions de responsabilité du Prêteur</Text>
        <Text style={styles.articleText}>En application des articles L. 121-1 et L. 124-1 du Code des assurances, le Prêteur décline toute responsabilité, et l'assurance susvisée ne couvrirait pas les dommages matériels ou corporels survenus au véhicule prêté dans les cas suivants:</Text>

        <Text style={[styles.subSectionTitle, { fontSize: 9, fontWeight: 'bold' }]}>4.3.1. Utilisation non conforme du véhicule</Text>
        <Text style={styles.articleText}>L'utilisation du véhicule pour des activités non autorisées, y compris mais sans se limiter à la participation à des courses, des compétitions ou des essais de vitesse.</Text>

        <Text style={[styles.subSectionTitle, { fontSize: 9, fontWeight: 'bold' }]}>4.3.2. Dommages intentionnels</Text>
        <Text style={styles.articleText}>Les dommages causés par des actes intentionnels, fraude ou tout comportement malveillant de la part de l'Emprunteur.</Text>

        <Text style={[styles.subSectionTitle, { fontSize: 9, fontWeight: 'bold' }]}>4.3.3. Faux témoignage</Text>
        <Text style={styles.articleText}>Toute fausse déclaration faite par l'Emprunteur lors de la déclaration d'un sinistre.</Text>

        <Text style={[styles.subSectionTitle, { fontSize: 9, fontWeight: 'bold' }]}>4.3.4. Absence de permis de conduire valide</Text>
        <Text style={styles.articleText}>L'utilisation du véhicule par l'Emprunteur sans avoir un permis de conduire valide.</Text>

        <Text style={[styles.subSectionTitle, { fontSize: 9, fontWeight: 'bold' }]}>4.3.5. Non-respect des conditions contractuelles</Text>
        <Text style={styles.articleText}>Toute violation des conditions stipulées dans le contrat de prêt.</Text>

        <Text style={[styles.subSectionTitle, { fontSize: 9, fontWeight: 'bold' }]}>4.3.6. Conduite sous l'emprise de l'alcool ou de stupéfiants</Text>
        <Text style={styles.articleText}>L'utilisation du véhicule par l'Emprunteur sous l'emprise de l'alcool ou de stupéfiants.</Text>

        <Text style={[styles.subSectionTitle, { fontSize: 9, fontWeight: 'bold' }]}>4.3.7. Vol ou tentative de vol</Text>
        <Text style={styles.articleText}>Le vol ou la tentative de vol du véhicule prêté.</Text>

        <Text style={styles.subSectionTitle}>4.4. Obligations de l'Emprunteur en matière de déclaration et de gestion des sinistres</Text>
        <Text style={[styles.subSectionTitle, { fontSize: 9, fontWeight: 'bold' }]}>4.4.1. Délai et modalités de déclaration</Text>
        <Text style={styles.articleText}>L'Emprunteur s'engage à...</Text>
        <Text style={[styles.subSectionTitle, { fontSize: 9, fontWeight: 'bold' }]}>4.4.2. Informations à communiquer</Text>
        <Text style={styles.articleText}>En cas de sinistre impliquant un tiers identifié, l'Emprunteur doit impérativement recueillir et transmettre au Prêteur...</Text>
        <Text style={[styles.subSectionTitle, { fontSize: 9, fontWeight: 'bold' }]}>4.4.3. Conservation des preuves</Text>
        <Text style={styles.articleText}>L'Emprunteur doit préserver toutes les preuves matérielles du sinistre et s'abstenir de...</Text>
        <Text style={[styles.subSectionTitle, { fontSize: 9, fontWeight: 'bold' }]}>4.4.4. Coopération avec les experts et assureurs</Text>
        <Text style={styles.articleText}>L'Emprunteur s'engage à...</Text>

        <Text style={styles.subSectionTitle}>4.5. Responsabilité en cas d'infraction</Text>
        <Text style={styles.articleText}>L'Emprunteur assume l'entière et exclusive responsabilité des infractions commises pendant la durée du prêt, y compris...</Text>
      </Page>

      {/* Sixième page pour les sections 5, 6, 7 et 8 */}
      <Page size="A4" style={styles.page}>
        {/* 5. RESTITUTION DU VÉHICULE */}
        <Text style={styles.articleTitle}>5. RESTITUTION DU VÉHICULE</Text>

        <Text style={styles.subSectionTitle}>5.1. État de restitution</Text>
        <Text style={styles.articleText}>L'Emprunteur s'engage à restituer le véhicule:</Text>
        <Text style={styles.bulletPoint}>• Dans un état rigoureusement identique à celui constaté lors de la prise en charge, hors usure normale</Text>
        <Text style={styles.bulletPoint}>• Parfaitement propre à l'intérieur comme à l'extérieur</Text>
        <Text style={styles.bulletPoint}>• Avec un réservoir de carburant intégralement rempli</Text>
        <Text style={styles.bulletPoint}>• Avec tous les documents, clés, accessoires et équipements fournis</Text>
        <Text style={styles.bulletPoint}>• Sans odeur résiduelle (tabac, nourriture, etc.)</Text>
        <Text style={styles.bulletPoint}>• Sans aucun objet personnel ou professionnel à l'intérieur</Text>
        <Text style={styles.bulletPoint}>• Tout kilométrage excédant la prévision sera facturé 0.25 € du Km.</Text>

        <Text style={styles.subSectionTitle}>5.2. Procédure de restitution</Text>
        <Text style={styles.articleText}>La restitution du véhicule s'effectuera:</Text>
        <Text style={styles.bulletPoint}>• Exclusivement pendant les heures d'ouverture du garage</Text>
        <Text style={styles.bulletPoint}>• En présence d'un représentant habilité du Prêteur</Text>
        <Text style={styles.bulletPoint}>• Après inspection contradictoire détaillée du véhicule</Text>
        <Text style={styles.bulletPoint}>• Avec signature d'un procès-verbal de restitution</Text>

        <Text style={styles.subSectionTitle}>5.3. Frais additionnels de remise en état</Text>
        <Text style={styles.articleText}>Seront facturés à l'Emprunteur lors de la restitution:</Text>
        <Text style={styles.bulletPoint}>• Nettoyage intérieur complet si nécessaire: 150€</Text>
        <Text style={styles.bulletPoint}>• Nettoyage extérieur si nécessaire: 50€</Text>
        <Text style={styles.bulletPoint}>• Désodorisation en cas d'odeur de tabac: 200€</Text>
        <Text style={styles.bulletPoint}>• Remplacement des documents manquants: 150€ par document</Text>
        <Text style={styles.bulletPoint}>• Réparation de tout dommage non signalé: coût réel majoré de 20%</Text>
        <Text style={styles.bulletPoint}>• Remplacement de tout équipement ou accessoire manquant: valeur à neuf</Text>

        {/* 6. CLAUSES PÉNALES ET RÉSOLUTION */}
        <Text style={styles.articleTitle}>6. CLAUSES PÉNALES ET RÉSOLUTION</Text>

        <Text style={styles.subSectionTitle}>6.1. Manquements aux obligations</Text>
        <Text style={styles.articleText}>Toute violation des clauses susmentionnées entraînera:</Text>
        <Text style={styles.bulletPoint}>• La résolution immédiate du présent contrat sans préavis</Text>
        <Text style={styles.bulletPoint}>• L'obligation de restituer immédiatement le véhicule, sous astreinte de 200€ par jour de retard</Text>
        <Text style={styles.bulletPoint}>• Le paiement d'une indemnité forfaitaire de 1000€ pour préjudice moral et commercial</Text>
        <Text style={styles.bulletPoint}>• Le remboursement intégral de tous frais engagés par le Prêteur pour récupérer le véhicule</Text>

        <Text style={styles.subSectionTitle}>6.2. Recours contre les tiers</Text>
        <Text style={styles.articleText}>En cas de dommage causé par un tiers identifié, l'Emprunteur:</Text>
        <Text style={styles.bulletPoint}>? S'oblige à coopérer pleinement avec le Prêteur et son assureur</Text>
        <Text style={styles.bulletPoint}>? Cède au Prêteur, à titre de garantie, sa créance à l'encontre du tiers responsable</Text>
        <Text style={styles.bulletPoint}>? S'engage à effectuer toutes démarches utiles pour préserver les droits du Prêteur</Text>
        <Text style={styles.bulletPoint}>? Accepte d'être appelé en garantie dans toute procédure judiciaire</Text>

        <Text style={styles.subSectionTitle}>6.3. Attribution de juridiction</Text>
        <Text style={styles.articleText}>En cas de litige relatif à l'interprétation ou l'exécution du présent contrat:</Text>
        <Text style={styles.bulletPoint}>• Les parties s'efforceront de trouver une solution amiable</Text>
        <Text style={styles.bulletPoint}>• À défaut, le Tribunal de Commerce de Marseille sera seul compétent</Text>
        <Text style={styles.bulletPoint}>• L'Emprunteur renonce expressément à toute exception d'incompétence territoriale</Text>

        {/* 7. DÉPÔT DE GARANTIE */}
        <Text style={styles.articleTitle}>7. DÉPÔT DE GARANTIE</Text>
        <Text style={styles.articleText}>Un dépôt de garantie de 1500€ sera versé par l'Emprunteur au moment de la prise en charge du véhicule.</Text>
        <Text style={styles.articleText}>Ce dépôt pourra être encaissé immédiatement par le Prêteur en cas de:</Text>
        <Text style={styles.indentedText}>- Dommage constaté lors de la restitution</Text>
        <Text style={styles.indentedText}>- Retard dans la restitution</Text>
        <Text style={styles.indentedText}>- Infraction aux conditions d'utilisation</Text>
        <Text style={styles.indentedText}>- Frais non remboursés (amendes, carburant, nettoyage)</Text>

        {/* 8. SIGNATURES */}
        <Text style={styles.articleTitle}>8. SIGNATURES</Text>
        <Text style={styles.articleText}>L'Emprunteur reconnaît expressément avoir lu l'intégralité du présent contrat, en avoir compris toutes les clauses et les accepter sans réserve.</Text>
        <Text style={styles.articleText}>Il reconnaît en particulier l'étendue de sa responsabilité et la limitation de celle du Prêteur dans les cas énumérés à l'article 4.</Text>

        {/* Références légales */}
        <Text style={[styles.articleText, styles.boldText, { marginTop: 15 }]}>Références légales intégrées :</Text>
        <Text style={styles.articleText}><Text style={styles.boldText}>Code des assurances :</Text> Art. L. 121-1, L. 124-1, L. 124-3</Text>
        <Text style={styles.articleText}><Text style={styles.boldText}>Code de la route :</Text> Art. R. 412-1, R. 312-17, R. 413-17, R. 313-20, R. 317-25</Text>
        <Text style={styles.articleText}><Text style={styles.boldText}>Code civil :</Text> Art. 1242, 1226, 1231-1</Text>
        <Text style={styles.articleText}><Text style={styles.boldText}>Code du travail :</Text> Art. L. 3121-1</Text>
        <Text style={styles.articleText}><Text style={styles.boldText}>Jurisprudence :</Text> Cass. crim., 10 juillet 2012, n° 11-17.898 ; Cass. crim., 5 janvier 2016, n° 15-81.856</Text>

        {/* Section signature finale */}
        <View style={styles.signatureSection}>
          <Text style={styles.finalSignatureTitle}>Signature de l'assuré</Text>
          
          {/* Espace pour la signature manuscrite */}
          <View style={{ height: 40, marginVertical: 10, borderBottom: '1 solid #000' }}></View>
          
          <Text style={styles.finalSignatureName}>
            {loanData?.clients?.first_name || 'Geoffrey'} {loanData?.clients?.last_name || 'GOBEYN'}
          </Text>
          <Text style={styles.signatureDate}>
            Signé le {loanCreationDate} à {new Date(loanData?.created_at || new Date()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.signatureLocation}>
            À la latitude/longitude : {userPosition}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default AttestationPDF;
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
    width: 40,
    height: 15,
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

        {/* Section signature */}
        <View style={styles.signatureSection}>
          <Text style={[styles.articleText, styles.boldText]}>Lu et approuvé par les parties.</Text>
          
          <View style={styles.signatureGrid}>
            <View style={styles.signatureColumn}>
              <Text style={styles.signatureTitle}>Le Prêteur</Text>
              <Text style={styles.signatureName}>{companyData?.name || 'AUTO PAINT'}</Text>
            </View>
            <View style={styles.signatureColumn}>
              <Text style={styles.signatureTitle}>L'Emprunteur</Text>
              <Text style={styles.signatureName}>
                {loanData?.clients?.first_name || 'Geoffrey'} {loanData?.clients?.last_name || 'GOBEYN'}
              </Text>
            </View>
          </View>

          <Text style={styles.finalSignatureTitle}>Signature de l'assuré</Text>
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
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Cession } from '@/services/supabase/cessions';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
    lineHeight: 1.4,
    color: '#000000',
    size: 'A4',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    borderTop: 2,
    borderBottom: 2,
    borderColor: '#000000',
    paddingVertical: 10,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
  },
  text: {
    marginBottom: 5,
    textAlign: 'justify',
  },
  textLarge: {
    marginBottom: 15,
    textAlign: 'justify',
  },
  boldText: {
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
  },
  sectionLarge: {
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    minHeight: 80,
  },
  leftColumn: {
    flex: 1,
    paddingRight: 20,
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 20,
  },
  centerText: {
    textAlign: 'center',
  },
  justifyText: {
    textAlign: 'justify',
  },
  listItem: {
    marginBottom: 3,
    marginLeft: 0,
  },
  loanDetailsBox: {
    border: 1,
    borderColor: '#000000',
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  loanDetailsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    textDecoration: 'underline',
  },
  loanDetailRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  loanDetailLabel: {
    width: '40%',
    fontWeight: 'bold',
  },
  loanDetailValue: {
    width: '60%',
  },
});

interface FleetLoanCessionPDFProps {
  cession: Cession;
  companyData: any;
  selectedInsuranceCompany: any;
  fleetReservation: any;
  clientData: any;
  vehicleData: any;
}

export const FleetLoanCessionPDF = ({ 
  cession, 
  companyData, 
  selectedInsuranceCompany, 
  fleetReservation,
  clientData, 
  vehicleData 
}: FleetLoanCessionPDFProps) => {
  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const formatEuro = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Récupérer les informations du véhicule
  const brandName = vehicleData?.car_brands?.name || vehicleData?.brand || '';
  const modelName = vehicleData?.car_models?.name || vehicleData?.model || '';
  const licensePlate = vehicleData?.license_plate || '';

  // Récupérer le montant du prêt depuis la cession
  const loanAmount = (cession as any).loan_amount || 0;

  // Détecter si le client est une entreprise
  const isEnterprise = clientData?.client_type === 'entreprise';
  
  // Nom du gérant (utilisé pour les signatures)
  const managerName = clientData 
    ? `${clientData.first_name || ''} ${clientData.last_name || ''}`.trim()
    : '';
  
  // Nom à afficher : Raison sociale pour entreprise, nom complet pour particulier
  const clientName = isEnterprise && clientData?.company_name
    ? clientData.company_name
    : managerName;

  return (
    <Document>
      {/* Page 1: Notification de cession pour prêt de véhicule */}
      <Page size="A4" style={styles.page}>
        {/* Header text */}
        <Text style={[styles.textLarge, styles.justifyText]}>
          Conformément à l'article 1369-4 du Code civil, cette notification est également valablement effectuée par 
          courrier à l'adresse suivante : {selectedInsuranceCompany?.email || ''}, avec accusé de réception électronique.
        </Text>

        {/* Company info and destination */}   
        <View style={[styles.headerRow, { marginBottom: 40 }]}>
          <View style={styles.leftColumn}>
            <Text style={styles.boldText}>{companyData.name?.toUpperCase() || ''}</Text>
            <Text>{companyData.address || ''}</Text>
            <Text>{companyData.zipcode || ''} {companyData.city || ''}</Text>
            <Text>{companyData.email || ''}</Text>
            <Text>{companyData.phone || ''}</Text>
          </View>
          <View style={[styles.rightColumn, { marginTop: 80 }]}>
            <Text style={styles.boldText}>{selectedInsuranceCompany?.name || ''}</Text>
            {selectedInsuranceCompany?.address && <Text>{selectedInsuranceCompany.address}</Text>}
            {selectedInsuranceCompany?.address2 && <Text>{selectedInsuranceCompany.address2}</Text>}
            <Text>{selectedInsuranceCompany?.zipcode || ''} {selectedInsuranceCompany?.city || ''}</Text>
          </View>
        </View>

        {/* Document details */}
        <View style={styles.sectionLarge}>
          <View style={styles.section}>
            <Text><Text style={styles.boldText}>Objet :</Text> Notification de cession de créance - Prêt de véhicule (Article 1324 du Code civil)</Text>
          </View>
          <Text><Text style={styles.boldText}>N° sinistre :</Text> {cession.incident_number || 'N/A'}</Text>
          <Text><Text style={styles.boldText}>N° contrat :</Text> {cession.policy_number || 'N/A'}</Text>
          {cession.report_number && <Text><Text style={styles.boldText}>PV expertise :</Text> {cession.report_number}</Text>}
        </View>

        {/* Date and place */}
        <Text style={styles.sectionLarge}>{companyData.city}, le {formatDate(cession.created_at)}</Text>

        {/* Greeting */}
        <Text style={styles.section}>Madame, Monsieur,</Text>

        {/* Main text */}
        <Text style={[styles.textLarge, styles.justifyText]}>
          Conformément aux dispositions des articles 1321 et suivants du Code civil et L.121-13 du Code des 
          assurances, nous vous notifions par la présente la cession de créance intervenue ce jour entre :
        </Text>

        {/* Cedant info */}
        <View style={styles.sectionLarge}>
          <Text>LE CÉDANT</Text>
          {isEnterprise ? (
            <>
              <Text style={styles.boldText}>{clientName.toUpperCase()}</Text>
              <Text>Représenté par {managerName.toUpperCase()}, Gérant</Text>
            </>
          ) : (
            <Text style={styles.boldText}>{clientName.toUpperCase()}</Text>
          )}
          {clientData?.address && <Text>{clientData.address}</Text>}
          {clientData?.postal_code && clientData?.city && <Text>{clientData.postal_code} {clientData.city}</Text>}
          {clientData?.email && <Text>{clientData.email}</Text>}
          {clientData?.phone && <Text>{clientData.phone}</Text>}
        </View>

        {/* Au profit de */}
        <Text style={styles.section}>Au profit de :</Text>

        {/* Cessionnaire info */}
        <View style={styles.sectionLarge}>
          <Text>LE CESSIONNAIRE</Text>
          <Text style={styles.boldText}>{companyData.name?.toUpperCase() || ''}</Text>
          <Text>{companyData.address || ''}</Text>
          <Text>{companyData.zipcode || ''} {companyData.city || ''}</Text>
          <Text>{companyData.email || ''}</Text>
          <Text>{companyData.phone || ''}</Text>
        </View>

        {/* Loan details box */}
        <View style={styles.loanDetailsBox}>
          <Text style={styles.loanDetailsTitle}>DÉTAILS DU PRÊT DE VÉHICULE</Text>
          
          <View style={styles.loanDetailRow}>
            <Text style={styles.loanDetailLabel}>Véhicule prêté :</Text>
            <Text style={styles.loanDetailValue}>{brandName.toUpperCase()} {modelName}</Text>
          </View>
          
          <View style={styles.loanDetailRow}>
            <Text style={styles.loanDetailLabel}>Immatriculation :</Text>
            <Text style={styles.loanDetailValue}>{licensePlate}</Text>
          </View>
          
          <View style={styles.loanDetailRow}>
            <Text style={styles.loanDetailLabel}>Période de prêt :</Text>
            <Text style={styles.loanDetailValue}>
              Du {formatDate(fleetReservation.start_date)} au {formatDate(fleetReservation.end_date)}
            </Text>
          </View>
          
          <View style={styles.loanDetailRow}>
            <Text style={styles.loanDetailLabel}>Montant du prêt :</Text>
            <Text style={[styles.loanDetailValue, styles.boldText]}>{formatEuro(loanAmount)} € TTC</Text>
          </View>
        </View>

        {/* Incident date */}
        <Text style={styles.sectionLarge}>
          Suite au sinistre survenu le {cession.incident_date ? formatDate(cession.incident_date) : 'N/A'}.
        </Text>

        {/* Legal basis */}
        <View style={styles.sectionLarge}>
          <Text style={styles.section}>Cette cession est effectuée en vertu :</Text>
          <Text style={styles.listItem}>- De l'article L.121-13 du Code des assurances</Text>
          <Text style={styles.listItem}>- Des articles 1321 à 1326 du Code civil</Text>
          <Text style={styles.listItem}>- De la garantie véhicule de prêt du contrat d'assurance</Text>
        </View>

        {/* Payment request */}
        <Text style={[styles.textLarge, styles.justifyText]}>
          En conséquence, nous vous demandons de procéder au règlement de l'indemnité d'un montant de {formatEuro(loanAmount)} € TTC directement sur notre compte bancaire :
        </Text>

        {/* Bank details */}
        <View style={styles.sectionLarge}>
          <Text><Text style={styles.boldText}>BANQUE :</Text> {cession.bank_accounts?.bank || ''}</Text>
          <Text><Text style={styles.boldText}>IBAN :</Text> {cession.bank_accounts?.iban || ''}</Text>
          <Text><Text style={styles.boldText}>BIC :</Text> {cession.bank_accounts?.bic || ''}</Text>
        </View>

        {/* Closing text */}
        <Text style={[styles.textLarge, styles.justifyText]}>
          Dans l'attente du règlement dans les délais légaux prescrits par l'article L.211-5-1 du Code des assurances, nous vous prions d'agréer, Madame, Monsieur, l'expression de notre considération distinguée.
        </Text>
        
        {/* Signature section */}
        <View style={styles.sectionLarge}>
          <Text style={styles.boldText}>{companyData.name?.toUpperCase() || ''}</Text>
          <Text>[Signature1/]</Text>
        </View>
      </Page>

      {/* Page 2: Confirmation de cession par le client */}
      <Page size="A4" style={styles.page}>
        {/* Company info and destination repeated */}   
        <View style={[styles.headerRow, { marginBottom: 40 }]}>
          <View style={styles.leftColumn}>
            <Text style={styles.boldText}>{companyData.name?.toUpperCase() || ''}</Text>
            <Text>{companyData.address || ''}</Text>
            <Text>{companyData.zipcode || ''} {companyData.city || ''}</Text>
            <Text>{companyData.email || ''}</Text>
            <Text>{companyData.phone || ''}</Text>
          </View>
          <View style={[styles.rightColumn, { marginTop: 80 }]}>
            <Text style={styles.boldText}>{selectedInsuranceCompany?.name || ''}</Text>
            {selectedInsuranceCompany?.address && <Text>{selectedInsuranceCompany.address}</Text>}
            {selectedInsuranceCompany?.address2 && <Text>{selectedInsuranceCompany.address2}</Text>}
            <Text>{selectedInsuranceCompany?.zipcode || ''} {selectedInsuranceCompany?.city || ''}</Text>
          </View>
        </View>

        {/* Subject */}
        <View style={styles.section}>
          <Text><Text style={styles.boldText}>Objet :</Text> Confirmation de cession de créance - Prêt de véhicule - Dossier sinistre n°{cession.incident_number || ''}</Text>
        </View>

        {/* Greeting */}
        <Text style={styles.section}>Madame, Monsieur,</Text>

        {/* Main confirmation text */}
        {isEnterprise ? (
          <Text style={[styles.section, styles.justifyText]}>
            La société {clientName.toUpperCase()}, représentée par {managerName.toUpperCase()} en qualité de Gérant, assurée sous le contrat n°{cession.policy_number || ''}, confirme avoir cédé sa 
            créance d'indemnisation à {companyData.name?.toUpperCase() || ''} concernant le prêt du véhicule {brandName.toUpperCase()} {modelName} immatriculé {licensePlate} pour la période du {formatDate(fleetReservation.start_date)} au {formatDate(fleetReservation.end_date)}.
          </Text>
        ) : (
          <Text style={[styles.section, styles.justifyText]}>
            Je soussigné(e) {clientName.toUpperCase()}, assuré(e) sous le contrat n°{cession.policy_number || ''}, vous confirme avoir cédé ma 
            créance d'indemnisation à {companyData.name?.toUpperCase() || ''} concernant le prêt du véhicule {brandName.toUpperCase()} {modelName} immatriculé {licensePlate} pour la période du {formatDate(fleetReservation.start_date)} au {formatDate(fleetReservation.end_date)}.
          </Text>
        )}

        {/* Loan amount confirmation */}
        <Text style={[styles.section, styles.justifyText]}>
          Le montant de la créance cédée s'élève à {formatEuro(loanAmount)} € TTC correspondant aux frais de mise à disposition du véhicule de remplacement pendant la durée des réparations de mon véhicule sinistré.
        </Text>

        {/* Legal reference */}
        <Text style={[styles.section, styles.justifyText]}>
          En application de l'article L.121-13 du Code des assurances, {isEnterprise ? 'nous vous demandons' : 'je vous demande'} expressément de verser 
          l'indemnité directement au prestataire.
        </Text>

        <Text style={[styles.textLarge, styles.justifyText]}>
          Veuillez agréer, Madame, Monsieur, l'expression de {isEnterprise ? 'nos' : 'mes'} salutations distinguées.
        </Text>

        {/* Date and place */}
        <Text style={styles.sectionLarge}>Fait à {companyData.city}, le {formatDate(cession.created_at)}</Text>

        {/* Signature section */}
        <View style={styles.sectionLarge}>
          {isEnterprise ? (
            <>
              <Text style={styles.boldText}>{clientName.toUpperCase()}</Text>
              <Text>Représenté par {managerName.toUpperCase()}, Gérant</Text>
            </>
          ) : (
            <Text style={styles.boldText}>{clientName.toUpperCase()}</Text>
          )}
          <Text>[Signature2/]</Text>
        </View>
      </Page>
    </Document>
  );
};

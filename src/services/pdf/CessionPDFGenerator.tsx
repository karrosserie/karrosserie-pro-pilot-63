import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Cession } from '@/services/supabase/cessions';

// Register fonts for better PDF rendering
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf'
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 10,
    padding: 30,
    lineHeight: 1.5,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    borderTop: 2,
    borderBottom: 2,
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
  boldText: {
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
    textAlign: 'right',
  },
  separator: {
    borderTop: 1,
    marginVertical: 20,
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  signatureColumn: {
    flex: 1,
    textAlign: 'center',
  },
  list: {
    marginLeft: 15,
  },
  listItem: {
    marginBottom: 3,
  },
});

interface CessionPDFProps {
  cession: Cession;
  companyData: any;
  selectedInsuranceCompany: any;
}

export const CessionPDF = ({ cession, companyData, selectedInsuranceCompany }: CessionPDFProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const formatEuro = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Calculate specific amounts from repair order data
  const calculatePaintAmount = () => {
    if (!cession.repair_orders?.repairs_data) return 0;
    try {
      const repairs = typeof cession.repair_orders.repairs_data === 'string' 
        ? JSON.parse(cession.repair_orders.repairs_data)
        : cession.repair_orders.repairs_data;
      if (!Array.isArray(repairs)) return 0;
      const filtered = repairs.filter((item: any) => 
        item.description && (
          item.description.toUpperCase().includes('INGR') || 
          item.description.toUpperCase().includes('PEINTURE')
        )
      );
      return filtered.reduce((total: number, item: any) => {
        const totalTTC = parseFloat(item.total) || 0;
        const vatRate = parseFloat(item.vat) || 20;
        const htAmount = totalTTC / (1 + vatRate / 100);
        return total + htAmount;
      }, 0);
    } catch (error) {
      return 0;
    }
  };

  const calculateLaborAmount = () => {
    if (!cession.repair_orders?.repairs_data) return 0;
    try {
      const repairs = typeof cession.repair_orders.repairs_data === 'string' 
        ? JSON.parse(cession.repair_orders.repairs_data)
        : cession.repair_orders.repairs_data;
      if (!Array.isArray(repairs)) return 0;
      const filtered = repairs.filter((item: any) => 
        item.description && (
          item.description.includes('T1') || 
          item.description.includes('T2') || 
          item.description.includes('T3')
        )
      );
      return filtered.reduce((total: number, item: any) => {
        const totalTTC = parseFloat(item.total) || 0;
        const vatRate = parseFloat(item.vat) || 20;
        const htAmount = totalTTC / (1 + vatRate / 100);
        return total + htAmount;
      }, 0);
    } catch (error) {
      return 0;
    }
  };

  const calculatePartsAmount = () => {
    if (!cession.repair_orders?.parts_data) return 0;
    try {
      const parts = typeof cession.repair_orders.parts_data === 'string' 
        ? JSON.parse(cession.repair_orders.parts_data)
        : cession.repair_orders.parts_data;
      if (!Array.isArray(parts)) return 0;
      return parts.reduce((total: number, item: any) => {
        const totalTTC = parseFloat(item.total) || 0;
        const vatRate = parseFloat(item.vat) || 20;
        const htAmount = totalTTC / (1 + vatRate / 100);
        return total + htAmount;
      }, 0);
    } catch (error) {
      return 0;
    }
  };

  const calculateTaxAmount = () => {
    let totalTax = 0;
    
    // Calculate tax from repairs
    if (cession.repair_orders?.repairs_data) {
      try {
        const repairs = typeof cession.repair_orders.repairs_data === 'string' 
          ? JSON.parse(cession.repair_orders.repairs_data)
          : cession.repair_orders.repairs_data;
        if (Array.isArray(repairs)) {
          totalTax += repairs.reduce((tax: number, item: any) => {
            const total = parseFloat(item.total) || 0;
            const vatRate = parseFloat(item.vat) || 20;
            const taxAmount = total - (total / (1 + vatRate / 100));
            return tax + taxAmount;
          }, 0);
        }
      } catch (error) {
        // Handle error silently
      }
    }
    
    // Calculate tax from parts
    if (cession.repair_orders?.parts_data) {
      try {
        const parts = typeof cession.repair_orders.parts_data === 'string' 
          ? JSON.parse(cession.repair_orders.parts_data)
          : cession.repair_orders.parts_data;
        if (Array.isArray(parts)) {
          totalTax += parts.reduce((tax: number, item: any) => {
            const total = parseFloat(item.total) || 0;
            const vatRate = parseFloat(item.vat) || 20;
            const taxAmount = total - (total / (1 + vatRate / 100));
            return tax + taxAmount;
          }, 0);
        }
      } catch (error) {
        // Handle error silently
      }
    }
    
    return totalTax;
  };

  const paintAmount = calculatePaintAmount();
  const laborAmount = calculateLaborAmount();
  const partsAmount = calculatePartsAmount();
  const taxAmount = calculateTaxAmount();

  const clientName = cession.repair_orders?.clients 
    ? `${cession.repair_orders.clients.first_name} ${cession.repair_orders.clients.last_name}`
    : 'Client non assigné';

  const clientData = cession.repair_orders?.clients;
  const vehicleData = cession.repair_orders?.vehicles;

  return (
    <Document>
      {/* Page 1: Notification de cession */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.text}>
          Conformément à l'article 1369-4 du Code civil, cette notification est également valablement effectuée par 
          courrier à l'adresse suivante : {selectedInsuranceCompany?.email || ''}, avec accusé de réception électronique.
        </Text>

        <View style={styles.headerRow}>
          <View style={styles.column}>
            <Text style={styles.boldText}>{companyData.name?.toUpperCase() || ''}</Text>
            <Text>{companyData.address || ''}</Text>
            <Text>{companyData.zipcode || ''} {companyData.city || ''}</Text>
            <Text>{companyData.email || ''}</Text>
            <Text>{companyData.phone || ''}</Text>
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.boldText}>{selectedInsuranceCompany?.name || ''}</Text>
            {selectedInsuranceCompany?.address && <Text>{selectedInsuranceCompany.address}</Text>}
            {selectedInsuranceCompany?.address2 && <Text>{selectedInsuranceCompany.address2}</Text>}
            <Text>{selectedInsuranceCompany?.zipcode || ''} {selectedInsuranceCompany?.city || ''}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.boldText}>Objet : Notification de cession de créance (Article 1324 du Code civil)</Text>
          <Text>N° sinistre : {cession.incident_number || 'N/A'}</Text>
          <Text>N° contrat : {cession.policy_number || 'N/A'}</Text>
          <Text>PV expertise : {cession.report_number || 'N/A'}</Text>
        </View>

        <Text style={styles.text}>{companyData.city}, le {formatDate(cession.created_at)}</Text>

        <Text style={styles.text}>Madame, Monsieur,</Text>

        <Text style={styles.text}>
          Conformément aux dispositions des articles 1321 et suivants du Code civil et L.121-13 du Code des 
          assurances, nous vous notifions par la présente la cession de créance intervenue ce jour entre :
        </Text>

        <View style={styles.section}>
          <Text>LE CÉDANT</Text>
          <Text style={styles.boldText}>{clientName.toUpperCase()}</Text>
          {clientData?.address && <Text>{clientData.address}</Text>}
          {clientData?.postal_code && clientData?.city && <Text>{clientData.postal_code} {clientData.city}</Text>}
          {clientData?.email && <Text>{clientData.email}</Text>}
          {clientData?.phone && <Text>{clientData.phone}</Text>}
        </View>

        <Text style={styles.text}>Au profit de :</Text>

        <View style={styles.section}>
          <Text>LE CESSIONNAIRE</Text>
          <Text style={styles.boldText}>{companyData.name?.toUpperCase() || ''}</Text>
          <Text>{companyData.address || ''}</Text>
          <Text>{companyData.zipcode || ''} {companyData.city || ''}</Text>
          <Text>{companyData.email || ''}</Text>
          <Text>{companyData.phone || ''}</Text>
        </View>

        <View style={styles.section}>
          <Text>Concernant l'indemnisation des réparations du véhicule :</Text>
          <Text>{cession.repair_orders?.vehicles?.car_brands?.name?.toUpperCase() || ''} {cession.repair_orders?.vehicles?.car_models?.name || ''}</Text>
          <Text>Immatriculation : {cession.repair_orders?.vehicles?.license_plate || 'N/A'}</Text>
          <Text>N° Série : {vehicleData?.vin || 'N/A'}</Text>
        </View>

        <Text style={styles.text}>
          Suite au sinistre survenu le {cession.incident_date ? formatDate(cession.incident_date) : 'N/A'}.
        </Text>

        <View style={styles.section}>
          <Text>Cette cession est effectuée en vertu :</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>- De l'article L.121-13 du Code des assurances</Text>
            <Text style={styles.listItem}>- Des articles 1321 à 1326 du Code civil</Text>
            <Text style={styles.listItem}>- Du PV d'expertise n°{cession.report_number || 'N/A'}</Text>
            <Text style={styles.listItem}>- Du privilège du garagiste (article 2332, 3° du Code civil)</Text>
          </View>
        </View>

        <Text style={styles.text}>
          En conséquence, nous vous demandons de procéder au règlement de l'indemnité d'un montant de {cession.repair_orders?.amount ? `${formatEuro(cession.repair_orders.amount)} €` : '0,00 €'} TTC directement sur notre compte bancaire :
        </Text>

        <View style={styles.section}>
          <Text style={styles.boldText}>BANQUE : {cession.bank_accounts?.bank || ''}</Text>
          <Text style={styles.boldText}>IBAN : {cession.bank_accounts?.iban || ''}</Text>
          <Text style={styles.boldText}>BIC : {cession.bank_accounts?.bic || ''}</Text>
        </View>

        <View style={styles.section}>
          <Text>Vous trouverez ci-joint :</Text>
          <Text>1. Le contrat de cession de créance original</Text>
          <Text>2. L'ordre de réparation</Text>
        </View>

        <Text style={styles.text}>
          Dans l'attente du règlement dans les délais légaux prescrits par l'article L.211-5-1 du Code des assurances, nous vous prions d'agréer, Madame, Monsieur, l'expression de notre considération distinguée.
        </Text>

        <View style={styles.section}>
          <Text style={styles.boldText}>{companyData.name?.toUpperCase() || ''}</Text>
          <Text>[Signature1/]</Text>
        </View>
      </Page>

      {/* Page 2: Convention de cession */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>CONVENTION DE CESSION DE CRÉANCE D'INDEMNITÉ D'ASSURANCE</Text>
        
        <Text style={styles.text}>(Articles 1321 et suivants du Code Civil)</Text>
        <Text style={styles.text}>(Article L.121-13 du Code des assurances)</Text>

        <Text style={styles.text}>Entre les soussignés:</Text>

        <View style={styles.section}>
          <Text>LE CÉDANT</Text>
          <Text style={styles.boldText}>{clientName.toUpperCase()}</Text>
          {clientData?.address && <Text>{clientData.address}</Text>}
          {clientData?.postal_code && clientData?.city && <Text>{clientData.postal_code} {clientData.city}</Text>}
          {clientData?.email && <Text>{clientData.email}</Text>}
          {clientData?.phone && <Text>{clientData.phone}</Text>}
          <Text>Ci-après dénommé "Le Client/Assuré"</Text>
        </View>

        <Text style={styles.text}>ET</Text>

        <View style={styles.section}>
          <Text>LE CESSIONNAIRE</Text>
          <Text style={styles.boldText}>{companyData.name?.toUpperCase() || ''}</Text>
          <Text>{companyData.address || ''}</Text>
          <Text>{companyData.zipcode || ''} {companyData.city || ''}</Text>
          <Text>{companyData.email || ''}</Text>
          <Text>{companyData.phone || ''}</Text>
          <Text>Ci-après dénommé "Le Réparateur professionnel"</Text>
        </View>

        <Text style={styles.subtitle}>EXPOSÉ PRÉALABLE</Text>

        <Text style={styles.text}>Conformément aux dispositions :</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>- De l'article 1321 du Code civil établissant le principe et les effets de la cession de créance</Text>
          <Text style={styles.listItem}>- De l'article L.121-13 du Code des assurances imposant le versement de l'indemnité pour la remise en état effective du bien assuré</Text>
          <Text style={styles.listItem}>- De l'article R.121-5 du Code des assurances relatif aux modalités de règlement des indemnités d'assurance</Text>
        </View>

        <Text style={styles.text}>Le Client/Assuré entend céder sa créance d'indemnité d'assurance au Réparateur professionnel.</Text>

        <Text style={styles.subtitle}>IDENTIFICATION DU SINISTRE</Text>
        <Text>Compagnie d'assurance : {selectedInsuranceCompany?.name || ''}</Text>
        <Text>N° de contrat : {cession.policy_number || ''}</Text>
        <Text>Référence sinistre : {cession.incident_number || ''} du {cession.incident_date ? formatDate(cession.incident_date) : ''}</Text>
        <Text>Expert mandaté : {cession.expert_name || ''}</Text>
        <Text>Rapport d'expertise n° : {cession.report_number || ''}</Text>
        <Text>Montant validé : {cession.repair_orders?.amount ? `${formatEuro(cession.repair_orders.amount)} €` : '0,00 €'} TTC</Text>

        <Text style={styles.subtitle}>IDENTIFICATION DU VÉHICULE</Text>
        <Text>Véhicule : {cession.repair_orders?.vehicles?.car_brands?.name || ''} {cession.repair_orders?.vehicles?.car_models?.name || ''}</Text>
        <Text>N° d'enregistrement : {cession.repair_orders?.vehicles?.license_plate || ''}</Text>
        <Text>Kilométrage : {cession.repair_orders?.vehicles?.mileage || 'N/A'} Km</Text>

        <Text style={styles.subtitle}>CONVENTION</Text>

        <Text style={styles.subtitle}>Article 1 : Objet et portée de la cession</Text>
        <Text style={styles.text}>1.1 Le Client/Assuré déclare céder, sans réserve et de manière irrévocable, au Réparateur professionnel qui accepte, la créance d'indemnisation qu'il détient sur la compagnie d'assurance susvisée.</Text>

        <Text style={styles.subtitle}>Article 2 : Montant et composition de la créance cédée</Text>
        <Text style={styles.text}>La créance cédée correspond au montant total de {cession.repair_orders?.amount ? `${formatEuro(cession.repair_orders.amount)} €` : '0,00 €'} TTC, comprenant :</Text>
        <Text>- Pièces détachées : {formatEuro(partsAmount)} € HT</Text>
        <Text>- Main d'œuvre : {formatEuro(laborAmount)} € HT</Text>
        <Text>- Peinture et ingrédients : {formatEuro(paintAmount)} € HT</Text>
        <Text>- TVA : {formatEuro(taxAmount)} €</Text>

        <Text style={styles.text}>Fait à {companyData.city}, le {formatDate(cession.created_at)}</Text>

        <View style={styles.signatureRow}>
          <View style={styles.signatureColumn}>
            <Text>Le Cédant</Text>
            <Text style={styles.boldText}>{clientName.toUpperCase()}</Text>
            <Text>[Signature1/]</Text>
            <Text>Lu et approuvé,</Text>
            <Text>Bon pour cession irrévocable de créance</Text>
            <Text>d'un montant de {cession.repair_orders?.amount ? `${formatEuro(cession.repair_orders.amount)} €` : '0,00 €'} TTC</Text>
          </View>
          <View style={styles.signatureColumn}>
            <Text>Le Cessionnaire</Text>
            <Text style={styles.boldText}>{companyData.name?.toUpperCase()}</Text>
            <Text>[Signature2/]</Text>
            <Text>Bon pour acceptation de cession</Text>
          </View>
        </View>
      </Page>

      {/* Page 3: Attestation sur l'honneur */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>ATTESTATION SUR L'HONNEUR D'ABSENCE DE SURFACTURATION</Text>
        
        <Text style={styles.text}>(Conformément à l'article L. 441-7 du Code de commerce)</Text>

        <View style={styles.headerRow}>
          <View style={styles.column}>
            <Text style={styles.boldText}>{companyData.name?.toUpperCase() || ''}</Text>
            <Text>{companyData.address || ''}</Text>
            <Text>{companyData.zipcode || ''} {companyData.city || ''}</Text>
            <Text>{companyData.email || ''}</Text>
            <Text>{companyData.phone || ''}</Text>
          </View>
          <View style={styles.rightColumn}>
            <Text>A l'attention de :</Text>
            <Text style={styles.boldText}>{selectedInsuranceCompany?.name || ''}</Text>
            {selectedInsuranceCompany?.address && <Text>{selectedInsuranceCompany.address}</Text>}
            {selectedInsuranceCompany?.address2 && <Text>{selectedInsuranceCompany.address2}</Text>}
            <Text>{selectedInsuranceCompany?.zipcode || ''} {selectedInsuranceCompany?.city || ''}</Text>
          </View>
        </View>

        <Text style={styles.boldText}>Objet : Attestation sur l'honneur certifiant l'absence de surfacturation</Text>

        <View style={styles.section}>
          <Text>N° sinistre : {cession.incident_number || ''}</Text>
          <Text>N° contrat : {cession.policy_number || ''}</Text>
          <Text>PV expertise : {cession.report_number || ''}</Text>
          <Text>Véhicule : {cession.repair_orders?.vehicles?.license_plate || ''}</Text>
        </View>

        <Text style={styles.text}>Nous attestons par la présente, conformément à l'article L. 441-7 du Code de commerce, que :</Text>

        <Text style={styles.text}>
          1. Les travaux de réparation effectués sur le véhicule {cession.repair_orders?.vehicles?.car_brands?.name || ''} {cession.repair_orders?.vehicles?.car_models?.name || ''} (immatriculation {cession.repair_orders?.vehicles?.license_plate || ''}, n° 
          série {cession.repair_orders?.vehicles?.vin || ''}) dans le cadre du sinistre survenu le {cession.incident_date ? formatDate(cession.incident_date) : ''}, référencé sous le n°{cession.incident_number || ''}, ont été facturés en 
          stricte conformité avec :
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>o Les tarifs professionnels habituellement pratiqués par notre établissement ;</Text>
          <Text style={styles.listItem}>o Les préconisations techniques du constructeur {cession.repair_orders?.vehicles?.car_brands?.name || ''} ;</Text>
          <Text style={styles.listItem}>o Les dispositions du rapport d'expertise n° {cession.report_number || ''} ;</Text>
          <Text style={styles.listItem}>o Les règles de l'art en vigueur dans le secteur de la réparation automobile.</Text>
        </View>

        <Text style={styles.text}>
          2. Aucune majoration abusive, surcoût injustifié ou pratique commerciale déloyale n'a été appliquée. Les 
          montants facturés correspondent intégralement :
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>o Au coût des pièces détachées (neuves ou d'occasion selon accord) ;</Text>
          <Text style={styles.listItem}>o Au temps de main d'œuvre réellement consacré ;</Text>
          <Text style={styles.listItem}>o Aux prestations annexes nécessaires à la remise en état du véhicule.</Text>
        </View>

        <Text style={styles.text}>
          3. Cette attestation est délivrée en toute honnêteté, sous réserve des sanctions pénales prévues par les 
          articles L. 441-7 et L. 454-1 du Code de commerce en cas de déclaration frauduleuse.
        </Text>

        <Text style={styles.text}>Fait à {companyData.city}, le {formatDate(cession.created_at)}</Text>

        <View style={styles.section}>
          <Text style={styles.boldText}>{companyData.name?.toUpperCase()}</Text>
          <Text>[Signature1/]</Text>
        </View>
      </Page>
    </Document>
  );
};
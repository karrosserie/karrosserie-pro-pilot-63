import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Cession } from '@/services/supabase/cessions';
import { RepairOrderMainPage, RepairOrderGeneralConditionsPage, RepairOrderLegalReferencesPage } from './RepairOrderPageForCession';

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
  imageSection: {
    marginBottom: 20,
    paddingTop: 20,
  },
  imageTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  documentImage: {
    width: '100%',
    maxHeight: 400,
    objectFit: 'contain',
    marginBottom: 10,
  },
});

interface CessionPDFProps {
  cession: Cession;
  companyData: any;
  selectedInsuranceCompany: any;
  clientData?: any;
  vehicleData?: any;
}

export const CessionPDF = ({ cession, companyData, selectedInsuranceCompany, clientData, vehicleData }: CessionPDFProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const formatEuro = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Calculate specific amounts from repair order data (same as preview)
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

  // Utiliser les données passées en paramètres en priorité, sinon fallback sur cession.repair_orders
  const finalClientData = clientData || cession.repair_orders?.clients;
  const finalVehicleData = vehicleData || cession.repair_orders?.vehicles;

  return (
    <Document>
      {/* Page 1: Notification initiale */}
      <Page size="A4" style={styles.page} break>
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
            <Text><Text style={styles.boldText}>Objet :</Text> Notification de cession de créance (Article 1324 du Code civil)</Text>
          </View>
          <Text><Text style={styles.boldText}>N° sinistre :</Text> {cession.incident_number || 'N/A'}</Text>
          <Text><Text style={styles.boldText}>N° contrat :</Text> {cession.policy_number || 'N/A'}</Text>
          <Text><Text style={styles.boldText}>PV expertise :</Text> {cession.report_number || 'N/A'}</Text>
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
          <Text style={styles.boldText}>{clientName.toUpperCase()}</Text>
          {finalClientData?.address && <Text>{finalClientData.address}</Text>}
          {finalClientData?.postal_code && finalClientData?.city && <Text>{finalClientData.postal_code} {finalClientData.city}</Text>}
          {finalClientData?.email && <Text>{finalClientData.email}</Text>}
          {finalClientData?.phone && <Text>{finalClientData.phone}</Text>}
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

        {/* Vehicle details section */}
        <View style={styles.sectionLarge} break>
          <Text style={styles.text}>Concernant l'indemnisation des réparations du véhicule :</Text>
          <Text>{cession.repair_orders?.vehicles?.car_brands?.name?.toUpperCase() || ''} {cession.repair_orders?.vehicles?.car_models?.name || ''}</Text>
          <Text>Immatriculation : {cession.repair_orders?.vehicles?.license_plate || 'N/A'}</Text>
          <Text>N° Série : {finalVehicleData?.vin || 'N/A'}</Text>
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
          <Text style={styles.listItem}>- Du PV d'expertise n°{cession.report_number || 'N/A'}</Text>
          <Text style={styles.listItem}>- Du privilège du garagiste (article 2332, 3° du Code civil)</Text>
        </View>

        {/* Payment request */}
        <Text style={[styles.textLarge, styles.justifyText]}>
          En conséquence, nous vous demandons de procéder au règlement de l'indemnité d'un montant de {cession.repair_orders?.amount ? `${formatEuro(cession.repair_orders.amount)} €` : '0,00 €'} TTC directement sur notre compte bancaire :
        </Text>

        {/* Bank details */}
        <View style={styles.sectionLarge}>
          <Text><Text style={styles.boldText}>BANQUE :</Text> {cession.bank_accounts?.bank || ''}</Text>
          <Text><Text style={styles.boldText}>IBAN :</Text> {cession.bank_accounts?.iban || ''}</Text>
          <Text><Text style={styles.boldText}>BIC :</Text> {cession.bank_accounts?.bic || ''}</Text>
        </View>

        {/* Attachments */}
        <View style={styles.sectionLarge}>
          <Text style={styles.section}>Vous trouverez ci-joint :</Text>
          <Text>1. Le contrat de cession de créance original</Text>
          <Text style={styles.text}>2. L'ordre de réparation</Text>
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

        {/* Section de confirmation de cession avec séparateur */}
          {/* Company info and destination repeated */}   
        <View style={[styles.headerRow, { marginBottom: 40 }]} break>
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
          <Text><Text style={styles.boldText}>Objet :</Text> Confirmation de cession de créance - Dossier sinistre n°{cession.incident_number || ''}</Text>
        </View>

        {/* Greeting */}
        <Text style={styles.section}>Madame, Monsieur,</Text>

        {/* Main confirmation text */}
        <Text style={[styles.section, styles.justifyText]}>
          Je soussigné(e) {clientName.toUpperCase()}, assuré(e) sous le contrat n°{cession.policy_number || ''}, vous confirme avoir cédé ma 
          créance d'indemnisation à {companyData.name?.toUpperCase() || ''} concernant les réparations de mon véhicule {cession.repair_orders?.vehicles?.car_brands?.name || ''} {cession.repair_orders?.vehicles?.car_models?.name || ''} immatriculé {cession.repair_orders?.vehicles?.license_plate || ''}.
        </Text>

        {/* Legal reference */}
        <Text style={[styles.section, styles.justifyText]}>
          En application de l'article L.121-13 du Code des assurances, je vous demande expressément de verser 
          l'indemnité directement au réparateur.
        </Text>

        <Text style={[styles.textLarge, styles.justifyText]}>
          Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.
        </Text>

        {/* Date and place */}
        <Text style={styles.sectionLarge}>Fait à {companyData.city}, le {formatDate(cession.created_at)}</Text>

        {/* Signature section */}
        <View style={styles.sectionLarge}>
          <Text style={styles.boldText}>{clientName.toUpperCase()}</Text>
          <Text>[Signature2/]</Text>
        </View>
      </Page>

      {/* Page 2: Convention de cession */}
      <Page size="A4" style={styles.page} break>
        {/* Title */}
        <View style={styles.centerText}>
          <Text style={styles.title}>CONVENTION DE CESSION DE CRÉANCE D'INDEMNITÉ D'ASSURANCE</Text>
        </View>

        {/* Legal references */}
        <View style={styles.section}>
          <Text>(Articles 1321 et suivants du Code Civil)</Text>
          <Text>(Article L.121-13 du Code des assurances)</Text>
        </View>

        <Text style={styles.section}>Entre les soussignés:</Text>

        {/* Le Cédant */}
        <View style={styles.section}>
          <Text style={styles.text}>LE CÉDANT</Text>
          <Text style={styles.boldText}>{clientName.toUpperCase()}</Text>
          {finalClientData?.address && <Text>{finalClientData.address}</Text>}
          {finalClientData?.postal_code && finalClientData?.city && <Text>{finalClientData.postal_code} {finalClientData.city}</Text>}
          {finalClientData?.email && <Text>{finalClientData.email}</Text>}
          {finalClientData?.phone && <Text>{finalClientData.phone}</Text>}
          <Text style={styles.text}>Ci-après dénommé "Le Client/Assuré"</Text>
        </View>

        <Text style={styles.section}>ET</Text>

        {/* Le Cessionnaire */}
        <View style={styles.sectionLarge}>
          <Text style={styles.text}>LE CESSIONNAIRE</Text>
          <Text style={styles.boldText}>{companyData.name?.toUpperCase() || ''}</Text>
          <Text>{companyData.address || ''}</Text>
          <Text>{companyData.zipcode || ''} {companyData.city || ''}</Text>
          <Text>{companyData.email || ''}</Text>
          <Text>{companyData.phone || ''}</Text>
          <Text style={styles.text}>Ci-après dénommé "Le Réparateur professionnel"</Text>
        </View>

        {/* Exposé préalable */}
        <View style={styles.sectionLarge}>
          <Text style={styles.subtitle}>EXPOSÉ PRÉALABLE</Text>
          
          <Text style={styles.section}>Conformément aux dispositions :</Text>
          
          <Text style={styles.listItem}>- De l'article 1321 du Code civil établissant le principe et les effets de la cession de créance</Text>
          <Text style={styles.listItem}>- De l'article L.121-13 du Code des assurances imposant le versement de l'indemnité pour la remise en état effective du bien assuré</Text>
          <Text style={styles.listItem}>- De l'article R.121-5 du Code des assurances relatif aux modalités de règlement des indemnités d'assurance</Text>
          <Text style={styles.listItem}>- De l'arrêt de la Cour de cassation du 13 juin 2019 (n°18-17.907) confirmant l'opposabilité de la cession de créance d'indemnité d'assurance</Text>
          <Text style={styles.listItem}>- De l'arrêt de la Cour de cassation du 17 février 2015 (n°13-27.080) sur l'obligation de l'assureur de régler l'indemnité au réparateur cessionnaire</Text>
          
          <Text style={styles.sectionLarge}>Le Client/Assuré entend céder sa créance d'indemnité d'assurance au Réparateur professionnel.</Text>
        </View>

        {/* Identification du sinistre */}
        <View style={styles.sectionLarge}>
          <Text style={styles.subtitle}>IDENTIFICATION DU SINISTRE</Text>
          
          <Text><Text style={styles.boldText}>Compagnie d'assurance :</Text> {selectedInsuranceCompany?.name || ''}</Text>
          <Text><Text style={styles.boldText}>N° de contrat :</Text> {cession.policy_number || ''}</Text>
          <Text><Text style={styles.boldText}>Référence sinistre :</Text> {cession.incident_number || ''} du {cession.incident_date ? formatDate(cession.incident_date) : ''}</Text>
          <Text><Text style={styles.boldText}>Expert mandaté :</Text> {cession.expert_name || ''}</Text>
          <Text><Text style={styles.boldText}>Rapport d'expertise n° :</Text> {cession.report_number || ''}</Text>
          <Text><Text style={styles.boldText}>Montant validé :</Text> {cession.repair_orders?.amount ? `${formatEuro(cession.repair_orders.amount)} €` : '0,00 €'} TTC</Text>
        </View>

        {/* Identification du véhicule */}
        <View style={styles.sectionLarge} break>
          <Text style={styles.subtitle}>IDENTIFICATION DU VÉHICULE</Text>
          
          <Text><Text style={styles.boldText}>Véhicule :</Text> {cession.repair_orders?.vehicles?.car_brands?.name || ''} {cession.repair_orders?.vehicles?.car_models?.name || ''}</Text>
          <Text><Text style={styles.boldText}>N° d'enregistrement :</Text> {cession.repair_orders?.vehicles?.license_plate || ''}</Text>
          <Text><Text style={styles.boldText}>Kilométrage :</Text> {cession.repair_orders?.vehicles?.mileage || 'N/A'} Km</Text>
        </View>

        {/* Convention */}
        <View style={styles.sectionLarge}>
          <Text style={styles.subtitle}>CONVENTION</Text>
          
          {/* Article 1 */}
          <View style={styles.section}>
            <Text style={styles.text}>Article 1 : Objet et portée de la cession</Text>
            
            <Text style={styles.text}>1.1 Le Client/Assuré déclare céder, sans réserve et de manière irrévocable, au Réparateur professionnel qui accepte, la créance d'indemnisation qu'il détient sur la compagnie d'assurance susvisée.</Text>
            
            <Text style={styles.text}>1.2 Cette cession est consentie en application des articles 1321 et suivants du Code civil et L.121-13 du Code des assurances, pour garantir le paiement des réparations conformes au rapport d'expertise n°{cession.report_number || ''}.</Text>
            
            <Text style={styles.text}>1.3 Le Réparateur professionnel est subrogé dans tous les droits, actions et privilèges du Cédant vis-à-vis de la compagnie d'assurance.</Text>
          </View>

          {/* Article 2 */}
          <View style={styles.section}>
            <Text style={styles.text}>Article 2 : Montant et composition de la créance cédée</Text>
            
            <Text style={styles.text}>La créance cédée correspond au montant total de {cession.repair_orders?.amount ? `${formatEuro(cession.repair_orders.amount)} €` : '0,00 €'} TTC, comprenant :</Text>
            <Text>- Pièces détachées : {formatEuro(partsAmount)} € HT</Text>
            <Text>- Main d'œuvre : {formatEuro(laborAmount)} € HT</Text>
            <Text>- Peinture et ingrédients : {formatEuro(paintAmount)} € HT</Text>
            <Text style={styles.text}>- TVA : {formatEuro(taxAmount)} €</Text>
          </View>
        </View>

        {/* Article 3 */}
        <View style={styles.section}>
          <Text style={styles.text}>Article 3 : Garanties du Cédant</Text>
          
          <Text style={styles.text}>Le Cédant garantit expressément, sous sa responsabilité :</Text>
          <Text>3.1 L'existence et la disponibilité de la créance cédée</Text>
          <Text>3.2 Sa qualité de titulaire légitime du contrat d'assurance</Text>
          <Text>3.3 L'absence de toute cession ou délégation antérieure</Text>
          <Text>3.4 L'absence de cause de déchéance de garantie</Text>
          <Text>3.5 La validité et le maintien des garanties d'assurance</Text>
          <Text style={styles.text}>3.6 L'absence de contestation sur le montant de l'indemnité</Text>
        </View>

        {/* Article 4 */}
        <View style={styles.section}>
          <Text style={styles.text}>Article 4 : Obligations spécifiques de l'Assuré</Text>
          
          <Text style={styles.text}>Le Client/Assuré s'engage irrévocablement à :</Text>
          <Text>4.1 Ne pas révoquer la présente cession</Text>
          <Text>4.2 Ne pas percevoir directement l'indemnité d'assurance</Text>
          <Text>4.3 Informer immédiatement le Réparateur de toute notification de l'assurance</Text>
          <Text style={styles.text}>4.4 Coopérer pour la bonne exécution de la présente convention</Text>
        </View>

        {/* Article 5 */}
        <View style={styles.section}>
          <Text style={styles.text}>Article 5 : Notification et opposabilité</Text>
          
          <Text style={styles.text}>5.1 La présente cession sera notifiée à la compagnie d'assurance par :</Text>
          <Text>- Lettre recommandée avec accusé de réception</Text>
          <Text>- Courriel avec accusé de réception</Text>
          <Text>- Télécopie avec accusé de réception</Text>
          
          <Text style={styles.text}>5.2 Le Réparateur professionnel est expressément mandaté pour effectuer cette notification.</Text>
          
          <Text style={styles.text}>5.3 La notification mentionnera :</Text>
          <Text>- La référence du sinistre</Text>
          <Text>- Le montant de la créance cédée</Text>
          <Text>- Les coordonnées bancaires du Réparateur</Text>
          <Text style={styles.text}>- La mention expresse de l'article L.121-13 du Code des assurances</Text>
        </View>

        {/* Article 6 */}
        <View style={styles.section}>
          <Text style={styles.text}>Article 6 : Privilège et droit de rétention</Text>
          
          <Text>6.1 Le Réparateur bénéficie du privilège spécial mobilier prévu par l'article 2332 3° du Code civil.</Text>
          <Text style={styles.text}>6.2 Le Réparateur pourra exercer son droit de rétention jusqu'au complet paiement.</Text>
        </View>

        {/* Article 7 */}
        <View style={styles.section}>
          <Text style={styles.text}>Article 7 : Clause de substitution</Text>
          
          <Text style={styles.text}>En cas d'invalidité d'une clause, celle-ci sera réputée non écrite sans affecter la validité des autres dispositions.</Text>
        </View>

        {/* Article 8 */}
        <View style={styles.sectionLarge}>
          <Text style={styles.text}>Article 8 : Attribution de compétence</Text>
          
          <Text style={styles.text}>Tout litige relèvera de la compétence exclusive du Tribunal Judiciaire de {companyData.city}.</Text>
        </View>

        {/* Date et signatures */}
        <View style={styles.sectionLarge}>
          <Text style={styles.section}>Fait à {companyData.city}, le {formatDate(cession.created_at)}</Text>
          <Text style={styles.sectionLarge}>En trois exemplaires originaux</Text>
          
          <View style={styles.headerRow}>
            {/* Le Cédant */}
            <View style={styles.leftColumn}>
              <Text>Le Cédant</Text>
              <Text style={[styles.boldText, styles.section]}>{clientName.toUpperCase()}</Text>
              <Text>[Signature2/]</Text>
              <Text style={styles.text}>Lu et approuvé,</Text>
              <Text style={styles.text}>Bon pour cession irrévocable de créance</Text>
              <Text style={styles.text}>d'un montant de {cession.repair_orders?.amount ? `${formatEuro(cession.repair_orders.amount)} €` : '0,00 €'} TTC</Text>
            </View>
            
            {/* Le Cessionnaire */}
            <View style={styles.rightColumn}>
              <Text>Le Cessionnaire</Text>
              <Text style={[styles.boldText, styles.section]}>{companyData.name?.toUpperCase()}</Text>
              <Text>[Signature1/]</Text>
              <Text style={styles.text}>Bon pour acceptation de cession</Text>
            </View>
          </View>
        </View>

        {/* Pièces jointes */}
        <View style={styles.sectionLarge}>
          <Text style={styles.section}>Vous trouverez ci-joint :</Text>
          <Text>1. La copie du rapport d'expertise</Text>
          <Text>2. La copie de la carte grise du véhicule</Text>
          <Text>3. La copie du permis de conduire de l'assuré</Text>
        </View>
      </Page>

      {/* Page 4: Attestation sur l'honneur */}
      <Page size="A4" style={styles.page} break>
        {/* Title */}
        <View style={styles.centerText}>
          <Text style={styles.title}>ATTESTATION SUR L'HONNEUR D'ABSENCE DE SURFACTURATION</Text>
        </View>

        {/* Legal reference */}
        <Text style={[styles.centerText, styles.sectionLarge]}>(Conformément à l'article L. 441-7 du Code de commerce)</Text>

        {/* Company info and destination */}   
        <View style={styles.headerRow}>
          <View style={styles.leftColumn}>
            <Text style={styles.boldText}>{companyData.name?.toUpperCase() || ''}</Text>
            <Text>{companyData.address || ''}</Text>
            <Text>{companyData.zipcode || ''} {companyData.city || ''}</Text>
            <Text>{companyData.email || ''}</Text>
            <Text>{companyData.phone || ''}</Text>
          </View>
          <View style={[styles.rightColumn, { marginTop: 80 }]}>
            <Text>A l'attention de :</Text>
            <Text style={styles.boldText}>{selectedInsuranceCompany?.name || ''}</Text>
            {selectedInsuranceCompany?.address && <Text>{selectedInsuranceCompany.address}</Text>}
            {selectedInsuranceCompany?.address2 && <Text>{selectedInsuranceCompany.address2}</Text>}
            <Text>{selectedInsuranceCompany?.zipcode || ''} {selectedInsuranceCompany?.city || ''}</Text>
          </View>
        </View>
        
        {/* Object */}
        <View style={styles.sectionLarge}>
          <Text><Text style={styles.boldText}>Objet :</Text> Attestation sur l'honneur certifiant l'absence de surfacturation</Text>
        </View>

        {/* Claim details */}
        <View style={styles.sectionLarge}>
          <Text><Text style={styles.boldText}>N° sinistre :</Text> {cession.incident_number || ''}</Text>
          <Text><Text style={styles.boldText}>N° contrat :</Text> {cession.policy_number || ''}</Text>
          <Text><Text style={styles.boldText}>PV expertise :</Text> {cession.report_number || ''}</Text>
          <Text><Text style={styles.boldText}>Véhicule :</Text> {cession.repair_orders?.vehicles?.license_plate || ''}</Text>
        </View>

        {/* Attestation text */}
        <View style={styles.sectionLarge}>
          <Text style={styles.section}>Nous attestons par la présente, conformément à l'article L. 441-7 du Code de commerce, que :</Text>
          
          <View style={styles.section}>
            <Text style={styles.section}>
              1. Les travaux de réparation effectués sur le véhicule {cession.repair_orders?.vehicles?.car_brands?.name || ''} {cession.repair_orders?.vehicles?.car_models?.name || ''} (immatriculation {cession.repair_orders?.vehicles?.license_plate || ''}, n° 
              série {cession.repair_orders?.vehicles?.vin || ''}) dans le cadre du sinistre survenu le {cession.incident_date ? formatDate(cession.incident_date) : ''}, référencé sous le n°{cession.incident_number || ''}, ont été facturés en 
              stricte conformité avec :
            </Text>
            <Text style={styles.listItem}>o Les tarifs professionnels habituellement pratiqués par notre établissement ;</Text>
            <Text style={styles.listItem}>o Les préconisations techniques du constructeur {cession.repair_orders?.vehicles?.car_brands?.name || ''} ;</Text>
            <Text style={styles.listItem}>o Les dispositions du rapport d'expertise n° {cession.report_number || ''} ;</Text>
            <Text style={styles.section}>o Les règles de l'art en vigueur dans le secteur de la réparation automobile.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.section}>
              2. Aucune majoration abusive, surcoût injustifié ou pratique commerciale déloyale n'a été appliquée. Les 
              montants facturés correspondent intégralement :
            </Text>
            <Text style={styles.listItem}>o Au coût des pièces détachées (neuves ou d'occasion selon accord) ;</Text>
            <Text style={styles.listItem}>o Au temps de main d'œuvre réellement consacré ;</Text>
            <Text style={styles.section}>o Aux prestations annexes nécessaires à la remise en état du véhicule.</Text>
          </View>

          <Text style={styles.sectionLarge}>
            3. Cette attestation est délivrée en toute honnêteté, sous réserve des sanctions pénales prévues par les 
            articles L. 441-7 et L. 454-1 du Code de commerce en cas de déclaration frauduleuse.
          </Text>
        </View>

        {/* Date and signature */}
        <View style={styles.sectionLarge}>
          <Text style={styles.section}>Fait à {companyData.city}, le {formatDate(cession.created_at)}</Text>
          
          <Text style={[styles.boldText, styles.section]}>{companyData.name?.toUpperCase()}</Text>
          <Text>[Signature1/]</Text>
        </View>
      </Page>

      {/* Documents annexes */}
      
      {/* Permis de conduire recto */}
      {finalClientData?.driver_license_front_url && (
        <Page size="A4" style={styles.page} break>
          <View style={styles.imageSection}>
            <Text style={styles.imageTitle}>PERMIS DE CONDUIRE - RECTO</Text>
            <Image 
              style={styles.documentImage} 
              src={finalClientData.driver_license_front_url} 
            />
          </View>
        </Page>
      )}

      {/* Permis de conduire verso */}
      {finalClientData?.driver_license_back_url && (
        <Page size="A4" style={styles.page} break>
          <View style={styles.imageSection}>
            <Text style={styles.imageTitle}>PERMIS DE CONDUIRE - VERSO</Text>
            <Image 
              style={styles.documentImage} 
              src={finalClientData.driver_license_back_url} 
            />
          </View>
        </Page>
      )}

      {/* Images du véhicule */}
      {finalVehicleData?.vehicle_images && (() => {
        try {
          const vehicleImages = typeof finalVehicleData.vehicle_images === 'string' 
            ? JSON.parse(finalVehicleData.vehicle_images) 
            : finalVehicleData.vehicle_images;
          
          if (Array.isArray(vehicleImages) && vehicleImages.length > 0) {
            return vehicleImages.map((imageData: any, index: number) => {
              const imageUrl = typeof imageData === 'string' ? imageData : imageData?.url;
              const timing = imageData?.timing || 'Véhicule';
              
              if (imageUrl) {
                return (
                  <Page key={index} size="A4" style={styles.page} break>
                    <View style={styles.imageSection}>
                      <Text style={styles.imageTitle}>VÉHICULE - {timing.toUpperCase()}</Text>
                      <Image 
                        style={styles.documentImage} 
                        src={imageUrl} 
                      />
                    </View>
                  </Page>
                );
              }
              return null;
            }).filter(Boolean);
          }
        } catch (error) {
          console.error('Erreur lors du parsing des images véhicule:', error);
        }
        return null;
      })()}
      
      {/* Certificat d'immatriculation recto */}
      {finalVehicleData?.registration_document_front_url && (
        <Page size="A4" style={styles.page} break>
          <View style={styles.imageSection}>
            <Text style={styles.imageTitle}>CERTIFICAT D'IMMATRICULATION - RECTO</Text>
            <Image 
              style={styles.documentImage} 
              src={finalVehicleData.registration_document_front_url} 
            />
          </View>
        </Page>
      )}
      
      {/* Certificat d'immatriculation verso */}
      {finalVehicleData?.registration_document_back_url && (
        <Page size="A4" style={styles.page} break>
          <View style={styles.imageSection}>
            <Text style={styles.imageTitle}>CERTIFICAT D'IMMATRICULATION - VERSO</Text>
            <Image 
              style={styles.documentImage} 
              src={finalVehicleData.registration_document_back_url} 
            />
          </View>
        </Page>
      )}

      {/* Ordre de réparation intégré avec format A4 */}
      <RepairOrderMainPage cession={cession} companyData={companyData} />
      <RepairOrderGeneralConditionsPage />
      <RepairOrderLegalReferencesPage />

      {/* Rapport d'expertise original - fallback */}
      {cession.document_url && (
        <Page size="A4" style={styles.page} break>
          <View style={styles.imageSection}>
            <Text style={styles.imageTitle}>RAPPORT D'EXPERTISE ORIGINAL</Text>
            <Text style={styles.text}>
              Document disponible à l'adresse : {cession.document_url}
            </Text>
          </View>
        </Page>
      )}
    </Document>
  );
};
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
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
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    borderTop: 2,
    borderBottom: 2,
    borderColor: '#000000',
    paddingVertical: 10,
  },
  conditionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#404348',
    padding: 8,
    textAlign: 'center',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 15,
  },
  headerColumn: {
    flex: 1,
    paddingHorizontal: 8,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyInfo: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#404348',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    fontSize: 9,
  },
  table: {
    marginTop: 15,
    marginBottom: 15,
  },
  tableHeader: {
    backgroundColor: '#404348',
    flexDirection: 'row',
    padding: 6,
  },
  tableHeaderText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tableCell: {
    fontSize: 9,
  },
  totalsSection: {
    marginTop: 20,
    alignSelf: 'flex-end',
    minWidth: 200,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  totalRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#404348',
    color: 'white',
  },
  signatureSection: {
    marginTop: 30,
    alignItems: 'center',
  },
  signatureBox: {
    height: 75, 
    width: 150, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    fontSize: 8,
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#666',
    borderTop: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  conditionsSection: {
    marginBottom: 15,
  },
  conditionsSectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  conditionsText: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 10,
  },
});

interface RepairOrderPageForCessionProps {
  cession: Cession;
  companyData: any;
}

export const RepairOrderPageForCession = ({ cession, companyData }: RepairOrderPageForCessionProps) => {
  if (!cession.repair_orders) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const formatEuro = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Parse repair and parts data
  let repairs: any[] = [];
  let parts: any[] = [];
  
  try {
    repairs = cession.repair_orders.repairs_data 
      ? JSON.parse(cession.repair_orders.repairs_data as string) 
      : [];
    parts = cession.repair_orders.parts_data 
      ? JSON.parse(cession.repair_orders.parts_data as string) 
      : [];
  } catch (error) {
    console.error('Error parsing repair/parts data:', error);
  }

  const allItems = [...repairs, ...parts];

  // Calculate totals
  const totals = allItems.reduce((acc, item) => {
    const totalTTC = parseFloat(item.total) || 0;
    const vatRate = parseFloat(item.vat) || 20;
    const totalHT = totalTTC / (1 + vatRate / 100);
    const vatAmount = totalTTC - totalHT;

    acc.totalHT += totalHT;
    acc.totalVAT += vatAmount;
    acc.totalTTC += totalTTC;
    return acc;
  }, { totalHT: 0, totalVAT: 0, totalTTC: 0 });

  const clientName = cession.repair_orders.clients 
    ? `${cession.repair_orders.clients.first_name} ${cession.repair_orders.clients.last_name}`
    : '';
  
  const vehicleInfo = cession.repair_orders.vehicles 
    ? `${cession.repair_orders.vehicles.car_brands?.name || ''} ${cession.repair_orders.vehicles.car_models?.name || ''}`
    : '';

  return (
    <Document>
      {/* Page principale de l'ordre de réparation */}
      <Page size="A4" style={styles.page} break>
        {/* Title */}
        <Text style={styles.title}>ORDRE DE RÉPARATION N° {cession.repair_orders.reference}</Text>
        
        {/* Header with company and client info */}
        <View style={styles.header}>
          <View style={styles.headerColumn}>
            <Text style={styles.companyName}>{companyData.name?.toUpperCase() || ''}</Text>
            <Text style={styles.companyInfo}>Adresse: {companyData.address || ''}</Text>
            <Text style={styles.companyInfo}>{companyData.zipcode || ''} {companyData.city || ''}</Text>
            <Text style={styles.companyInfo}>Tél: {companyData.phone || ''}</Text>
            <Text style={styles.companyInfo}>Email: {companyData.email || ''}</Text>
            <Text style={styles.companyInfo}>SIRET: {companyData.siret || ''}</Text>
            <Text style={styles.companyInfo}>TVA: {companyData.tva_number || ''}</Text>
          </View>
          
          <View style={styles.headerColumn}>
            <Text style={styles.sectionTitle}>Client</Text>
            <Text style={styles.companyInfo}>{clientName}</Text>
            {cession.repair_orders.clients?.address && (
              <Text style={styles.companyInfo}>{cession.repair_orders.clients.address}</Text>
            )}
            {cession.repair_orders.clients?.postal_code && cession.repair_orders.clients?.city && (
              <Text style={styles.companyInfo}>
                {cession.repair_orders.clients.postal_code} {cession.repair_orders.clients.city}
              </Text>
            )}
            {cession.repair_orders.clients?.phone && (
              <Text style={styles.companyInfo}>Tél: {cession.repair_orders.clients.phone}</Text>
            )}
            {cession.repair_orders.clients?.email && (
              <Text style={styles.companyInfo}>Email: {cession.repair_orders.clients.email}</Text>
            )}
          </View>
        </View>

        {/* Vehicle and order info */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Informations du véhicule</Text>
          <View style={styles.detailRow}>
            <Text>Véhicule: {vehicleInfo}</Text>
            <Text>Immatriculation: {cession.repair_orders.vehicles?.license_plate || ''}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text>Date: {formatDate(cession.repair_orders.created_at)}</Text>
            <Text>Kilométrage: {cession.repair_orders.vehicles?.mileage ? `${cession.repair_orders.vehicles.mileage.toLocaleString()} km` : ''}</Text>
          </View>
        </View>

        {/* Items table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Référence</Text>
            <Text style={[styles.tableHeaderText, { flex: 3 }]}>Description</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Qté</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>P.U. HT</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>TVA</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Total TTC</Text>
          </View>
          
          {allItems.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1 }]}>{item.ref || ''}</Text>
              <Text style={[styles.tableCell, { flex: 3 }]}>{item.description || ''}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>
                {parseFloat(item.quantity) || 1}
              </Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                {formatEuro(parseFloat(item.unitCost) || 0)}
              </Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                {parseFloat(item.vat) || 20}%
              </Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                {formatEuro(parseFloat(item.total) || 0)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.boldText}>Total HT</Text>
            <Text>{formatEuro(totals.totalHT)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.boldText}>Total TVA</Text>
            <Text>{formatEuro(totals.totalVAT)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.boldText}>Total Remise</Text>
            <Text>{formatEuro(0)}</Text>
          </View>
          <View style={styles.totalRowFinal}>
            <Text style={[styles.boldText, { color: 'white' }]}>Total TTC</Text>
            <Text style={[styles.boldText, { color: 'white' }]}>{formatEuro(totals.totalTTC)}</Text>
          </View>
        </View>

        {/* Signature section */}
        <View style={styles.signatureSection}>
          <Text style={[styles.sectionTitle, { textAlign: 'center', marginBottom: 15 }]}>Signature du client</Text>
          {(cession.repair_orders as any).client_signature ? (
            <View style={{ alignItems: 'center' }}>
              <Image 
                src={(cession.repair_orders as any).client_signature} 
                style={{ width: 150, height: 75, marginBottom: 8 }} 
              />
              <Text style={{ fontSize: 9, marginBottom: 2 }}>
                {(cession.repair_orders as any).client_name_signature || clientName}
              </Text>
              <Text style={{ fontSize: 8, color: '#666' }}>
                Signé le {(cession.repair_orders as any).signature_date ? formatDate((cession.repair_orders as any).signature_date) : ''}
              </Text>
            </View>
          ) : (
            <View style={styles.signatureBox}>
              <Text style={{ fontSize: 9, color: '#666' }}>Signature en attente</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <Text style={styles.footer} fixed>
          {companyData?.name || ''} - {companyData?.address || ''} {companyData?.zipcode || ''} {companyData?.city || ''} - 
          SIRET {companyData?.siret || ''} - N° TVA : {companyData?.tva || ''} - 
          Tel : {companyData?.phone || ''} - Email : {companyData?.email || ''}
        </Text>
      </Page>

      {/* Page CONDITIONS GÉNÉRALES */}
      <Page size="A4" style={styles.page}>
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.conditionsTitle}>CONDITIONS GÉNÉRALES</Text>
        </View>

        <View style={styles.conditionsSection}>
          <Text style={styles.conditionsSectionTitle}>1. Application des conditions générales</Text>
          <Text style={styles.conditionsText}>
            Le présent ordre de réparation est soumis aux conditions générales de service de l'entreprise, dont le client reconnaît avoir
            pris connaissance et les avoir acceptées.
          </Text>
        </View>

        <View style={styles.conditionsSection}>
          <Text style={styles.conditionsSectionTitle}>2. Base légale</Text>
          <Text style={styles.conditionsText}>
            Conformément à l'arrêté du 27 avril 1995 relatif à la vente et aux prestations de service dans le secteur de la réparation
            automobile, et aux articles R.311-1 et suivants du Code de la route.
          </Text>
        </View>

        <View style={styles.conditionsSection}>
          <Text style={styles.conditionsSectionTitle}>3. Garantie légale et obligation de résultat</Text>
          <Text style={styles.conditionsText}>
            Les travaux réalisés bénéficient de la garantie légale de conformité et de la garantie des vices cachés. L'atelier s'engage à
            une obligation de résultat pour les réparations effectuées.
          </Text>
        </View>

        <View style={styles.conditionsSection}>
          <Text style={styles.conditionsSectionTitle}>4. Pièces remplacées et réserve de propriété</Text>
          <Text style={styles.conditionsText}>
            Les pièces remplacées seront tenues à disposition du client pendant 48 heures et restent la propriété de l'atelier jusqu'au
            paiement intégral.
          </Text>
        </View>

        <View style={styles.conditionsSection}>
          <Text style={styles.conditionsSectionTitle}>5. Expertise</Text>
          <Text style={styles.conditionsText}>
            Les travaux ne débuteront qu'après accord de l'expert et/ou de la compagnie d'assurance.
          </Text>
        </View>

        <View style={styles.conditionsSection}>
          <Text style={styles.conditionsSectionTitle}>6. Supplément de travaux</Text>
          <Text style={styles.conditionsText}>
            Tout supplément de travaux nécessitera un accord préalable du client et un avenant signé si supérieur à 10% du devis
            initial.
          </Text>
        </View>

        <View style={styles.conditionsSection}>
          <Text style={styles.conditionsSectionTitle}>7. Délais et responsabilité</Text>
          <Text style={styles.conditionsText}>
            En cas de retard dû à des circonstances indépendantes de notre volonté, le délai sera révisé sans indemnité
            compensatoire.
          </Text>
        </View>

        <View style={styles.conditionsSection}>
          <Text style={styles.conditionsSectionTitle}>8. Effets personnels et responsabilité</Text>
          <Text style={styles.conditionsText}>
            L'entreprise décline toute responsabilité en cas de perte, vol ou détérioration d'objets personnels non mentionnés à la
            réception du véhicule.
          </Text>
        </View>

        <View style={styles.conditionsSection}>
          <Text style={styles.conditionsSectionTitle}>9. Protection des données personnelles</Text>
          <Text style={styles.conditionsText}>
            Conformément au RGPD, le client dispose d'un droit d'accès, de rectification et de suppression de ses données.
          </Text>
        </View>

        <View style={styles.conditionsSection}>
          <Text style={styles.conditionsSectionTitle}>10. Droit de rétractation</Text>
          <Text style={styles.conditionsText}>
            Le droit de rétractation de 14 jours ne s'applique pas aux prestations de réparation automobile.
          </Text>
        </View>

        <View style={styles.conditionsSection}>
          <Text style={styles.conditionsSectionTitle}>11. Conditions de paiement et pénalités de retard</Text>
          <Text style={styles.conditionsText}>
            Le paiement est exigible à la réception du véhicule. Tout retard entraînera des pénalités légales.
          </Text>
        </View>

        <View style={styles.conditionsSection}>
          <Text style={styles.conditionsSectionTitle}>12. Médiation et règlement des litiges</Text>
          <Text style={styles.conditionsText}>
            En cas de litige, le client peut recourir au service de médiation de la consommation ou saisir la justice compétente.
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={[styles.conditionsSectionTitle, { fontSize: 12, backgroundColor: '#404348', color: 'white', padding: 8, textAlign: 'center' }]}>
            ASSURANCE PROFESSIONNELLE
          </Text>
          <Text style={styles.conditionsText}>
            L'entreprise a souscrit une assurance Responsabilité Civile Professionnelle auprès de :{'\n'}
            Allianz{'\n'}
            Couvrant les dommages matériels et corporels pouvant survenir pendant les travaux.
          </Text>
        </View>
      </Page>

      {/* Page RÉFÉRENCES JURIDIQUES */}
      <Page size="A4" style={styles.page}>
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.conditionsTitle}>RÉFÉRENCES JURIDIQUES</Text>
        </View>

        <View style={{ marginBottom: 10 }}>
          <Text style={styles.conditionsText}>
            • Article L.111-1 et L.111-2 du Code de la consommation : obligation d'information précontractuelle
          </Text>
          <Text style={styles.conditionsText}>
            • Article L.113-3 du Code de la consommation : affichage des prix
          </Text>
          <Text style={styles.conditionsText}>
            • Article L.217-4 à L.217-14 du Code de la consommation : garantie légale de conformité
          </Text>
          <Text style={styles.conditionsText}>
            • Articles 1641 à 1649 du Code civil : garantie des vices cachés
          </Text>
          <Text style={styles.conditionsText}>
            • Article L.616-1 du Code de la consommation : médiation de la consommation
          </Text>
          <Text style={styles.conditionsText}>
            • Article L.441-6 du Code de commerce : pénalités de retard
          </Text>
          <Text style={styles.conditionsText}>
            • Article 2286 du Code civil : droit de rétention
          </Text>
          <Text style={styles.conditionsText}>
            • Article L.123-33-3 du Code de commerce : résolution des litiges en ligne
          </Text>
          <Text style={styles.conditionsText}>
            • Directive 2013/11/UE du 21 mai 2013 relative au règlement extrajudiciaire des litiges de consommation
          </Text>
          <Text style={styles.conditionsText}>
            • Jurisprudence Cass. civ. 1ère, 8 mars 2012 : obligation d'information et de conseil du professionnel
          </Text>
          <Text style={styles.conditionsText}>
            • Jurisprudence Cass. civ. 1ère, 15 mai 2015 : obligation de résultat pour les réparations effectuées
          </Text>
        </View>
      </Page>
    </Document>
  );
};
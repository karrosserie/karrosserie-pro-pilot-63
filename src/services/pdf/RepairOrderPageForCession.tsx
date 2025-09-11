import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
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
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
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
        <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>Signature du client</Text>
        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <Text>Signature en attente</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text>Date: {formatDate(new Date().toISOString())}</Text>
          </View>
        </View>
      </View>
    </Page>
  );
};
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Invoice } from '@/services/supabase/invoices';

interface InvoicePDFProps {
  invoice: Invoice;
  companyData: any;
  receipts?: any[];
  clientData?: any;
  vehicleData?: any;
  template?: string;
}

// Styles communs pour le PDF
const commonStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 30,
    paddingBottom: 60,
    paddingHorizontal: 30,
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#404348',
    padding: 8,
    textAlign: 'center',
    marginBottom: 10,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyInfo: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 8,
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
  detailLabel: {
    fontWeight: 'bold',
    fontSize: 9,
  },
  detailValue: {
    fontSize: 9,
    textAlign: 'right',
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
  tableCellRight: {
    fontSize: 9,
    textAlign: 'right',
  },
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  totalsBox: {
    width: 200,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    fontSize: 9,
    paddingVertical: 2,
  },
  totalRowBold: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    fontSize: 10,
    fontWeight: 'bold',
    paddingVertical: 2,
  },
  finalTotal: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: 11,
    marginTop: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 7,
    color: '#666',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
});

// Styles spécifiques au template alternatif
const alternativeStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 15,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    textAlign: 'right',
  },
  alternativeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  redTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 10,
  },
  clientInfoBox: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  vehicleInfoBox: {
    backgroundColor: '#fff3cd',
    padding: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
});

const InvoicePDF = ({ invoice, companyData, receipts = [], clientData, vehicleData, template = 'default' }: InvoicePDFProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (error) {
      return '-';
    }
  };

  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2).replace('.', ',')} €`;
  };

  const renderAlternativeHeader = () => (
    <View style={alternativeStyles.header}>
      <View style={alternativeStyles.leftSection}>
        <Text style={alternativeStyles.redTitle}>{companyData?.name || 'VOTRE ENTREPRISE'}</Text>
        <View style={commonStyles.companyInfo}>
          <Text><Text style={{ fontWeight: 'bold' }}>ADRESSE :</Text> {companyData?.address || 'Votre adresse'}</Text>
          <Text>{companyData?.zipcode || ''} {companyData?.city || ''}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>TEL :</Text> {companyData?.phone || '+33 1 23 45 67 89'}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>EMAIL :</Text> {companyData?.email || 'contact@entreprise.com'}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>SIRET :</Text> {companyData?.siret || '123 456 789 00123'}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>TVA :</Text> {companyData?.tva || 'FR 12 123456789'}</Text>
        </View>
      </View>
      <View style={alternativeStyles.rightSection}>
        <Text style={alternativeStyles.alternativeTitle}>
          FACTURE {clientData?.number || invoice.reference}
        </Text>
        <View style={commonStyles.companyInfo}>
          <Text><Text style={{ fontWeight: 'bold' }}>Date :</Text> {clientData?.date || formatDate(invoice.date || invoice.created_at)}</Text>
          {clientData?.dueDate && (
            <Text><Text style={{ fontWeight: 'bold' }}>Échéance :</Text> {clientData.dueDate}</Text>
          )}
          {clientData?.claimNumber && (
            <Text><Text style={{ fontWeight: 'bold' }}>N° Sinistre :</Text> {clientData.claimNumber}</Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderDefaultHeader = () => (
    <View style={commonStyles.header}>
      {/* Colonne 1 - Informations entreprise */}
      <View style={commonStyles.headerColumn}>
        <View style={commonStyles.title}>
          <Text>FACTURE</Text>
        </View>
        <Text style={commonStyles.companyName}>{companyData?.name || 'KARROSSERIE'}</Text>
        <View style={commonStyles.companyInfo}>
          <Text>{companyData?.address || 'Votre adresse'}</Text>
          <Text>{companyData?.zipcode || ''} {companyData?.city || ''}</Text>
          <Text>Téléphone : {companyData?.phone || '+33 1 23 45 67 89'}</Text>
          <Text>E-mail : {companyData?.email || 'contact@karrosserie.fr'}</Text>
          <Text>SIRET : {companyData?.siret || '123 456 789 00123'}</Text>
          <Text>N° TVA : {companyData?.tva || 'FR 12 123456789'}</Text>
        </View>
      </View>

      {/* Colonne 2 - Détails de la facture */}
      <View style={commonStyles.headerColumn}>
        <Text style={commonStyles.sectionTitle}>Détails de la facture</Text>
        <View style={commonStyles.detailRow}>
          <Text style={commonStyles.detailLabel}>Facture</Text>
          <Text style={commonStyles.detailValue}>N° {clientData?.number || invoice.reference}</Text>
        </View>
        {clientData?.claimNumber && (
          <View style={commonStyles.detailRow}>
            <Text style={commonStyles.detailLabel}>N° de sinistre</Text>
            <Text style={commonStyles.detailValue}>{clientData.claimNumber}</Text>
          </View>
        )}
        <View style={commonStyles.detailRow}>
          <Text style={commonStyles.detailLabel}>Date de facturation</Text>
          <Text style={commonStyles.detailValue}>{clientData?.billingDate || formatDate(invoice.date || invoice.created_at)}</Text>
        </View>
        {clientData?.dueDate && (
          <View style={commonStyles.detailRow}>
            <Text style={commonStyles.detailLabel}>Date d'échéance</Text>
            <Text style={commonStyles.detailValue}>{clientData.dueDate}</Text>
          </View>
        )}
      </View>

      {/* Colonne 3 - Facture pour */}
      <View style={commonStyles.headerColumn}>
        <Text style={commonStyles.sectionTitle}>Facture pour</Text>
        <View style={commonStyles.companyInfo}>
          <Text style={commonStyles.companyName}>
            {clientData?.name || 'Client non spécifié'}
          </Text>
          <Text>{clientData?.address || 'Adresse non renseignée'}</Text>
          <Text>{clientData?.city || 'Ville non renseignée'}</Text>
          {clientData?.phone && (
            <Text>Téléphone : {clientData.phone}</Text>
          )}
          {clientData?.email && (
            <Text>E-mail : {clientData.email}</Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderClientInfo = () => {
    if (template === 'alternative') {
      return (
        <View style={alternativeStyles.clientInfoBox}>
          <Text style={commonStyles.sectionTitle}>FACTURER À :</Text>
          <Text style={commonStyles.companyName}>{clientData?.name || 'Client non spécifié'}</Text>
          <Text>{clientData?.address || 'Adresse non renseignée'}</Text>
          <Text>{clientData?.city || 'Ville non renseignée'}</Text>
          {clientData?.phone && <Text>Tél : {clientData.phone}</Text>}
          {clientData?.email && <Text>Email : {clientData.email}</Text>}
        </View>
      );
    }
    return null;
  };

  const renderVehicleInfo = () => {
    if (template === 'alternative' && (clientData?.vehicle || clientData?.licensePlate || clientData?.mileage)) {
      return (
        <View style={alternativeStyles.vehicleInfoBox}>
          <Text style={commonStyles.sectionTitle}>INFORMATIONS VÉHICULE :</Text>
          {clientData?.vehicle && <Text>Véhicule : {clientData.vehicle}</Text>}
          {clientData?.licensePlate && <Text>Immatriculation : {clientData.licensePlate}</Text>}
          {clientData?.mileage && <Text>Kilométrage : {clientData.mileage}</Text>}
        </View>
      );
    }
    return null;
  };

  return (
    <Document>
      <Page size="A4" style={commonStyles.page}>
        {template === 'alternative' ? renderAlternativeHeader() : renderDefaultHeader()}
        
        {renderClientInfo()}
        {renderVehicleInfo()}

        {/* Tableau des articles */}
        <View style={commonStyles.table}>
          <View style={commonStyles.tableHeader}>
            <Text style={[commonStyles.tableHeaderText, { flex: 3 }]}>Description</Text>
            <Text style={[commonStyles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Qté</Text>
            <Text style={[commonStyles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Prix Unit.</Text>
            <Text style={[commonStyles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Remise</Text>
            <Text style={[commonStyles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>TVA</Text>
            <Text style={[commonStyles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Total HT</Text>
          </View>
          
          {(clientData?.items || []).length > 0 ? (clientData?.items || []).map((item: any, index: number) => (
            <View key={index} style={commonStyles.tableRow}>
              <Text style={[commonStyles.tableCell, { flex: 3 }]}>{item.description || 'N/A'}</Text>
              <Text style={[commonStyles.tableCellRight, { flex: 1 }]}>{item.quantity?.toString().replace('.', ',') || '0'}</Text>
              <Text style={[commonStyles.tableCellRight, { flex: 1 }]}>{formatAmount(item.unitPrice || 0)}</Text>
              <Text style={[commonStyles.tableCellRight, { flex: 1 }]}>{item.discount || 0}%</Text>
              <Text style={[commonStyles.tableCellRight, { flex: 1 }]}>{item.vat || 20}%</Text>
              <Text style={[commonStyles.tableCellRight, { flex: 1, fontWeight: 'bold' }]}>{formatAmount(item.totalHT || 0)}</Text>
            </View>
          )) : (
            <View style={commonStyles.tableRow}>
              <Text style={[commonStyles.tableCell, { flex: 6, textAlign: 'center' }]}>
                Aucun article dans cette facture
              </Text>
            </View>
          )}
        </View>

        {/* Totaux */}
        <View style={commonStyles.totalsSection}>
          <View style={commonStyles.totalsBox}>
            <View style={commonStyles.totalRowBold}>
              <Text>Sous-total HT</Text>
              <Text>{clientData?.totals?.totalHT || '0,00 €'}</Text>
            </View>
            <View style={commonStyles.totalRow}>
              <Text>TVA</Text>
              <Text>{clientData?.totals?.totalVAT || clientData?.totals?.vat || '0,00 €'}</Text>
            </View>
            <View style={commonStyles.finalTotal}>
              <Text>TOTAL TTC</Text>
              <Text>{clientData?.totals?.totalTTC || clientData?.totals?.total || '0,00 €'}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={commonStyles.footer}>
          {companyData?.name || 'KARROSSERIE'} - {companyData?.address || ''} {companyData?.zipcode || ''} {companyData?.city || ''} - 
          SIRET {companyData?.siret || ''} - N° TVA : {companyData?.tva || ''} - 
          Tel : {companyData?.phone || ''} - Email : {companyData?.email || ''}
        </Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
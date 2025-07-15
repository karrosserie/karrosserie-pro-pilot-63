import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Invoice } from '@/services/supabase/invoices';
import { formatAmount } from '@/utils/invoiceCalculations';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
    padding: 6,
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
    ...commonStyles.header,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  headerColumn: {
    ...commonStyles.headerColumn,
    paddingHorizontal: 12,
  },
  title: {
    ...commonStyles.title,
    backgroundColor: '#2563eb',
    fontSize: 18,
    marginBottom: 15,
  },
  clientSection: {
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 10,
  },
  invoiceDetails: {
    backgroundColor: '#fff',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
});

const InvoicePDF = ({ invoice, companyData, receipts = [], clientData, vehicleData, template = 'default' }: InvoicePDFProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      return '-';
    }
  };

  // Préparer les données des items
  const allItems = [];
  if (invoice.repairs_data) {
    const repairs = Array.isArray(invoice.repairs_data) ? invoice.repairs_data : [];
    allItems.push(...repairs);
  }
  if (invoice.parts_data) {
    const parts = Array.isArray(invoice.parts_data) ? invoice.parts_data : [];
    allItems.push(...parts);
  }

  // Calculer les totaux
  let subtotal = 0;
  let totalVAT = 0;

  allItems.forEach(item => {
    const itemTotal = (item.quantity || 0) * (item.unitCost || item.price || 0);
    const discountAmount = itemTotal * (item.discount || 0) / 100;
    const itemTotalHT = itemTotal - discountAmount;
    const vatAmount = itemTotalHT * (item.vat || 20) / 100;
    
    subtotal += itemTotalHT;
    totalVAT += vatAmount;
  });

  const finalTotal = subtotal + totalVAT;

  // Filtrer les encaissements pour cette facture
  const invoicePayments = receipts?.filter(receipt => receipt.invoice_id === invoice.id) || [];
  const totalPaidAmount = invoicePayments.reduce((total, receipt) => total + (receipt.amount || 0), 0);

  const getCurrentStyles = () => {
    if (template === 'alternative') {
      return alternativeStyles;
    }
    return commonStyles;
  };

  const renderHeader = () => {
    if (template === 'alternative') {
      return (
        <View style={alternativeStyles.header}>
          {/* Layout alternatif avec disposition différente */}
          <View style={{ flex: 1 }}>
            <View style={alternativeStyles.title}>
              <Text>FACTURE</Text>
            </View>
            
            <View style={alternativeStyles.clientSection}>
              <Text style={commonStyles.sectionTitle}>Facture pour</Text>
              <Text style={commonStyles.companyName}>
                {clientData?.name || (invoice.clients ? `${invoice.clients.first_name} ${invoice.clients.last_name}` : 'Client non spécifié')}
              </Text>
              <Text>{clientData?.address || invoice.clients?.address || 'Adresse non renseignée'}</Text>
              <Text>{clientData?.city || (invoice.clients ? `${invoice.clients.postal_code || ''} ${invoice.clients.city || ''}` : 'Ville non renseignée')}</Text>
              {(clientData?.phone || invoice.clients?.phone) && (
                <Text>Téléphone : {clientData?.phone || invoice.clients?.phone}</Text>
              )}
              {(clientData?.email || invoice.clients?.email) && (
                <Text>E-mail : {clientData?.email || invoice.clients?.email}</Text>
              )}
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <View style={alternativeStyles.invoiceDetails}>
              <Text style={commonStyles.sectionTitle}>Détails de la facture</Text>
              <View style={commonStyles.detailRow}>
                <Text style={commonStyles.detailLabel}>Facture N°</Text>
                <Text style={commonStyles.detailValue}>{invoice.reference}</Text>
              </View>
              {invoice.claim_number && (
                <View style={commonStyles.detailRow}>
                  <Text style={commonStyles.detailLabel}>N° de sinistre</Text>
                  <Text style={commonStyles.detailValue}>{invoice.claim_number}</Text>
                </View>
              )}
              <View style={commonStyles.detailRow}>
                <Text style={commonStyles.detailLabel}>Date de facturation</Text>
                <Text style={commonStyles.detailValue}>{formatDate(invoice.date || invoice.created_at)}</Text>
              </View>
              {invoice.due_date && (
                <View style={commonStyles.detailRow}>
                  <Text style={commonStyles.detailLabel}>Date d'échéance</Text>
                  <Text style={commonStyles.detailValue}>{formatDate(invoice.due_date)}</Text>
                </View>
              )}
              {(clientData?.vehicle || invoice.vehicles) && (
                <View style={commonStyles.detailRow}>
                  <Text style={commonStyles.detailLabel}>Véhicule</Text>
                  <Text style={commonStyles.detailValue}>
                    {clientData?.vehicle || (invoice.vehicles ? 
                      `${invoice.vehicles.car_brands?.name || 'N/A'} ${invoice.vehicles.car_models?.name || 'N/A'}` : 
                      'N/A'
                    )}
                  </Text>
                </View>
              )}
              {(clientData?.licensePlate || invoice.vehicles?.license_plate) && (
                <View style={commonStyles.detailRow}>
                  <Text style={commonStyles.detailLabel}>Immatriculation</Text>
                  <Text style={commonStyles.detailValue}>{clientData?.licensePlate || invoice.vehicles?.license_plate}</Text>
                </View>
              )}
            </View>

            <Text style={[commonStyles.companyName, { marginTop: 15, textAlign: 'right' }]}>
              {companyData?.name || 'KARROSSERIE'}
            </Text>
            <View style={[commonStyles.companyInfo, { textAlign: 'right' }]}>
              <Text>{companyData?.address || 'Votre adresse'}</Text>
              <Text>{companyData?.zipcode || ''} {companyData?.city || ''}</Text>
              <Text>Tél : {companyData?.phone || '+33 1 23 45 67 89'}</Text>
              <Text>{companyData?.email || 'contact@karrosserie.fr'}</Text>
            </View>
          </View>
        </View>
      );
    }

    // Template par défaut
    return (
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
            <Text style={commonStyles.detailValue}>N° {invoice.reference}</Text>
          </View>
          {invoice.claim_number && (
            <View style={commonStyles.detailRow}>
              <Text style={commonStyles.detailLabel}>N° de sinistre</Text>
              <Text style={commonStyles.detailValue}>{invoice.claim_number}</Text>
            </View>
          )}
          <View style={commonStyles.detailRow}>
            <Text style={commonStyles.detailLabel}>Date de facturation</Text>
            <Text style={commonStyles.detailValue}>{formatDate(invoice.date || invoice.created_at)}</Text>
          </View>
          {invoice.due_date && (
            <View style={commonStyles.detailRow}>
              <Text style={commonStyles.detailLabel}>Date d'échéance</Text>
              <Text style={commonStyles.detailValue}>{formatDate(invoice.due_date)}</Text>
            </View>
          )}
        </View>

        {/* Colonne 3 - Facture pour */}
        <View style={commonStyles.headerColumn}>
          <Text style={commonStyles.sectionTitle}>Facture pour</Text>
          <View style={commonStyles.companyInfo}>
            <Text style={commonStyles.companyName}>
              {clientData?.name || (invoice.clients ? `${invoice.clients.first_name} ${invoice.clients.last_name}` : 'Client non spécifié')}
            </Text>
            <Text>{clientData?.address || invoice.clients?.address || 'Adresse non renseignée'}</Text>
            <Text>{clientData?.city || (invoice.clients ? `${invoice.clients.postal_code || ''} ${invoice.clients.city || ''}` : 'Ville non renseignée')}</Text>
            {(clientData?.phone || invoice.clients?.phone) && (
              <Text>Téléphone : {clientData?.phone || invoice.clients?.phone}</Text>
            )}
            {(clientData?.email || invoice.clients?.email) && (
              <Text>E-mail : {clientData?.email || invoice.clients?.email}</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={commonStyles.page}>
        {renderHeader()}

        {/* Tableau des articles */}
        <View style={commonStyles.table}>
          <View style={commonStyles.tableHeader}>
            <Text style={[commonStyles.tableHeaderText, { flex: 3 }]}>Article</Text>
            <Text style={[commonStyles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Qté</Text>
            <Text style={[commonStyles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Prix Unit.</Text>
            <Text style={[commonStyles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Remise</Text>
            <Text style={[commonStyles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>TVA</Text>
            <Text style={[commonStyles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Total HT</Text>
          </View>
          
          {allItems.length > 0 ? allItems.map((item, index) => {
            const itemTotal = (item.quantity || 0) * (item.unitCost || item.price || 0);
            const discountAmount = itemTotal * (item.discount || 0) / 100;
            const itemTotalHT = itemTotal - discountAmount;
            
            return (
              <View key={item.id || index} style={commonStyles.tableRow}>
                <Text style={[commonStyles.tableCell, { flex: 3 }]}>{item.label || item.description || 'N/A'}</Text>
                <Text style={[commonStyles.tableCellRight, { flex: 1 }]}>{(item.quantity || 0).toString().replace('.', ',')}</Text>
                <Text style={[commonStyles.tableCellRight, { flex: 1 }]}>{formatAmount(item.unitCost || item.price || 0)}</Text>
                <Text style={[commonStyles.tableCellRight, { flex: 1 }]}>{item.discount || 0}%</Text>
                <Text style={[commonStyles.tableCellRight, { flex: 1 }]}>{item.vat || 20}%</Text>
                <Text style={[commonStyles.tableCellRight, { flex: 1, fontWeight: 'bold' }]}>{formatAmount(itemTotalHT)}</Text>
              </View>
            );
          }) : (
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
              <Text>{formatAmount(subtotal)}</Text>
            </View>
            <View style={commonStyles.totalRow}>
              <Text>TVA</Text>
              <Text>{formatAmount(totalVAT)}</Text>
            </View>
            <View style={commonStyles.finalTotal}>
              <Text>TOTAL TTC</Text>
              <Text>{formatAmount(finalTotal)}</Text>
            </View>
            {totalPaidAmount > 0 && (
              <>
                <View style={[commonStyles.totalRow, { marginTop: 8 }]}>
                  <Text>Déjà payé</Text>
                  <Text>{formatAmount(totalPaidAmount)}</Text>
                </View>
                <View style={[commonStyles.totalRowBold, { color: '#dc2626' }]}>
                  <Text>Solde dû</Text>
                  <Text>{formatAmount(finalTotal - totalPaidAmount)}</Text>
                </View>
              </>
            )}
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
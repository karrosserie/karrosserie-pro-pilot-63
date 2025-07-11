import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Invoice } from '@/services/supabase/invoices';
import { InvoiceItem, formatAmount, calculateInvoiceTotals } from '@/utils/invoiceCalculations';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InvoicePDFProps {
  invoice: Invoice;
  companyData: any;
  receipts?: any[];
}

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 30,
    paddingBottom: 60,
    paddingHorizontal: 30,
  },
  section: {
    margin: 8,
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 15
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
    marginBottom: 12,
  },
  logo: {
    marginTop: 8,
    marginBottom: 8,
    maxWidth: 120,
    height: 'auto',
  },
  companyInfo: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 8,
  },
  companyName: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
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
    marginBottom: 2,
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
    width: 180,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    fontSize: 9,
  },
  totalRowBold: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    fontSize: 9,
    fontWeight: 'bold',
  },
  finalTotal: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: 10,
  },
  amountDue: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: 10,
    textAlign: 'center',
    marginTop: 8,
  },
  amountDueText: {
    fontSize: 9,
    marginBottom: 2,
  },
  amountDueValue: {
    fontSize: 14,
    fontWeight: 'bold',
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
  paymentTable: {
    marginTop: 15,
    marginBottom: 15,
  },
});

const InvoicePDF = ({ invoice, companyData, receipts = [] }: InvoicePDFProps) => {
  const totals = calculateInvoiceTotals(invoice.repairs_data, invoice.parts_data);
  
  // Calculer le total des encaissements pour cette facture
  const totalPaidAmount = receipts
    ?.filter(receipt => receipt.invoice_id === invoice.id)
    ?.reduce((total, receipt) => total + (receipt.amount || 0), 0) || 0;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      return '-';
    }
  };

  // Filtrer les encaissements pour cette facture
  const invoicePayments = receipts?.filter(receipt => receipt.invoice_id === invoice.id) || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header avec 3 colonnes */}
        <View style={styles.header}>
          {/* Colonne 1 - Informations entreprise */}
          <View style={styles.headerColumn}>
            <View style={styles.title}>
              <Text>FACTURE</Text>
            </View>
            {companyData?.logo_url ? (
              <Image style={styles.logo} src={companyData.logo_url} />
            ) : null}
            <Text style={styles.companyName}>{companyData?.name || 'KARROSSERIE'}</Text>
            <View style={styles.companyInfo}>
              <Text>{companyData?.address || 'Votre adresse'}</Text>
              <Text>{companyData?.zipcode || ''} {companyData?.city || ''}</Text>
              <Text>Téléphone : {companyData?.phone || '+33 1 23 45 67 89'}</Text>
              <Text>E-mail : {companyData?.email || 'contact@karrosserie.fr'}</Text>
              <Text>SIRET : {companyData?.siret || '123 456 789 00123'}</Text>
              <Text>N° TVA : {companyData?.tva || 'FR 12 123456789'}</Text>
            </View>
          </View>

          {/* Colonne 2 - Détails de la facture */}
          <View style={styles.headerColumn}>
            <Text style={styles.sectionTitle}>Détails de la facture</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Facture</Text>
              <Text style={styles.detailValue}>N° {invoice.reference}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>N° de sinistre</Text>
              <Text style={styles.detailValue}>{invoice.claim_number || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date de facturation</Text>
              <Text style={styles.detailValue}>{formatDate(invoice.created_at)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date d'échéance</Text>
              <Text style={styles.detailValue}>{formatDate(invoice.due_date)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Véhicule</Text>
              <Text style={styles.detailValue}>
                {invoice.vehicles ? 
                  `${invoice.vehicles.car_brands?.name || 'N/A'} ${invoice.vehicles.car_models?.name || 'N/A'}` : 
                  'N/A'
                }
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Immatriculation</Text>
              <Text style={styles.detailValue}>{invoice.vehicles?.license_plate || 'N/A'}</Text>
            </View>
            {invoice.vehicles?.mileage != null && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Kilométrage</Text>
                <Text style={styles.detailValue}>{invoice.vehicles.mileage} km</Text>
              </View>
            )}
            {totalPaidAmount > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Montant payé</Text>
                <Text style={styles.detailValue}>{formatAmount(totalPaidAmount)}</Text>
              </View>
            )}
            
            {/* Encadré Montant dû */}
            <View style={styles.amountDue}>
              <Text style={styles.amountDueText}>Montant dû</Text>
              <Text style={styles.amountDueValue}>{formatAmount(totals.finalTotal - totalPaidAmount)}</Text>
            </View>
          </View>

          {/* Colonne 3 - Facture pour */}
          <View style={styles.headerColumn}>
            <Text style={styles.sectionTitle}>Facture pour</Text>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>
                {invoice.clients ? `${invoice.clients.first_name} ${invoice.clients.last_name}` : 'Client non spécifié'}
              </Text>
              <Text>{invoice.clients?.address || 'Adresse non renseignée'}</Text>
              <Text>{invoice.clients?.postal_code || ''} {invoice.clients?.city || 'Ville non renseignée'}</Text>
              {invoice.clients?.phone && (
                <Text>Téléphone : {invoice.clients.phone}</Text>
              )}
              {invoice.clients?.email && (
                <Text>E-mail : {invoice.clients.email}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Tableau des articles */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 3 }]}>Article</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Quantité</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Coût Unitaire</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Remise</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>TVA</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Total HT</Text>
          </View>
          
          {totals.allItems.length > 0 ? totals.allItems.map((item, index) => {
            const itemTotal = (item.quantity || 0) * (item.unitCost || 0);
            const discountAmount = itemTotal * (item.discount || 0) / 100;
            const itemTotalHT = itemTotal - discountAmount;
            
            return (
              <View key={item.id || index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 3 }]}>{item.label || item.description || 'N/A'}</Text>
                <Text style={[styles.tableCellRight, { flex: 1 }]}>{(item.quantity || 0).toString().replace('.', ',')}</Text>
                <Text style={[styles.tableCellRight, { flex: 1 }]}>{formatAmount(item.unitCost || 0)}</Text>
                <Text style={[styles.tableCellRight, { flex: 1 }]}>{item.discount || 0}%</Text>
                <Text style={[styles.tableCellRight, { flex: 1 }]}>{item.vat || 20}%</Text>
                <Text style={[styles.tableCellRight, { flex: 1, fontWeight: 'bold' }]}>{formatAmount(itemTotalHT)}</Text>
              </View>
            );
          }) : (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 6, textAlign: 'center' }]}>
                Aucun article dans cette facture
              </Text>
            </View>
          )}
        </View>

        {/* Totaux */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRowBold}>
              <Text>Sous-total</Text>
              <Text>{formatAmount(totals.subtotalAfterDiscount)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>TVA</Text>
              <Text>{formatAmount(totals.totalVAT)}</Text>
            </View>
            <View style={styles.finalTotal}>
              <Text>TOTAL</Text>
              <Text>{formatAmount(totals.finalTotal)}</Text>
            </View>
          </View>
        </View>

        {/* Tableau des paiements (si applicable) */}
        {invoicePayments.length > 0 && (
          <View style={styles.paymentTable}>
            <Text style={styles.sectionTitle}>Liste des paiements</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 2 }]}>Date</Text>
              <Text style={[styles.tableHeaderText, { flex: 2 }]}>Mode de paiement</Text>
              <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Montant</Text>
            </View>
            
            {invoicePayments.map((payment, index) => (
              <View key={payment.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>
                  {payment.created_at ? format(new Date(payment.created_at), 'dd/MM/yyyy', { locale: fr }) : '-'}
                </Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>{payment.payment_method || '-'}</Text>
                <Text style={[styles.tableCellRight, { flex: 1, fontWeight: 'bold' }]}>
                  {formatAmount(payment.amount || 0)}
                </Text>
              </View>
            ))}
            
            <View style={styles.tableRow}>
              <Text style={[styles.tableCellRight, { flex: 4, fontWeight: 'bold' }]}>
                Total encaissé :
              </Text>
              <Text style={[styles.tableCellRight, { flex: 1, fontWeight: 'bold' }]}>
                {formatAmount(totalPaidAmount)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCellRight, { flex: 4, fontWeight: 'bold', color: '#dc2626' }]}>
                Solde restant :
              </Text>
              <Text style={[styles.tableCellRight, { flex: 1, fontWeight: 'bold', color: '#dc2626' }]}>
                {formatAmount(totals.finalTotal - totalPaidAmount)}
              </Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          {companyData?.name || 'KARROSSERIE'} - {companyData?.address || ''} {companyData?.zipcode || ''} {companyData?.city || ''} - 
          SIRET {companyData?.siret || ''} - N° TVA : {companyData?.tva || ''} - 
          Tel : {companyData?.phone || ''} - Email : {companyData?.email || ''}
        </Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
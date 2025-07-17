import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Invoice } from '@/services/supabase/invoices';
import InvoicePDFPaymentsTable from './pdf/InvoicePDFPaymentsTable';

interface InvoicePDFProps {
  invoice: Invoice;
  companyData: any;
  receipts?: any[];
  clientData?: any;
  vehicleData?: any;
  template?: string;
  documentType?: 'invoice' | 'repair_order' | 'credit' | 'quote';
}

// Styles pour le template par défaut
const defaultStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 30,
    paddingBottom: 60,
    paddingHorizontal: 30,
    position: 'relative',
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
  amountDueBox: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: 12,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  amountDueLabel: {
    fontSize: 10,
    fontWeight: 'normal',
    color: 'white',
    marginBottom: 2,
  },
  amountDueValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
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
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 30,
    paddingBottom: 60,
    paddingHorizontal: 30,
    backgroundColor: 'white',
    position: 'relative',
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  companySection: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 15,
  },
  companyInfo: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 2,
  },
  invoiceSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    width: 300,
    textAlign: 'right',
  },
  clientInfoSection: {
    marginTop: 4,
    width: 175,
  },
  clientInfo: {
    fontSize: 8,
    lineHeight: 1.3,
    marginBottom: 1,
  },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dateBox: {
    borderWidth: 2,
    borderColor: '#000',
    borderStyle: 'solid',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  dateLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 3,
  },
  dateValue: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableContainer: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    padding: 6,
    textAlign: 'center',
    borderRightWidth: 2,
    borderRightColor: '#000',
  },
  tableHeaderCellLast: {
    fontSize: 8,
    fontWeight: 'bold',
    padding: 6,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    fontSize: 8,
    fontWeight: 'bold',
    padding: 6,
    borderRightWidth: 2,
    borderRightColor: '#000',
  },
  tableCellLast: {
    fontSize: 8,
    fontWeight: 'bold',
    padding: 6,
    textAlign: 'center',
  },
  tableCellCenter: {
    textAlign: 'center',
  },
  tableCellLeft: {
    fontSize: 8,
    fontWeight: 'bold',
    padding: 6,
    textAlign: 'left',
    borderRightWidth: 2,
    borderRightColor: '#000',
  },
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  totalsTable: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 5,
  },
  totalsHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  totalsHeaderCell: {
    fontSize: 9,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center',
    borderRightWidth: 2,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
    width: 80,
  },
  totalsHeaderCellLast: {
    fontSize: 9,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center',
    width: 80,
  },
  totalsValueRow: {
    flexDirection: 'row',
  },
  totalsCell: {
    fontSize: 9,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center',
    borderRightWidth: 2,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
    width: 80,
  },
  totalsCellLast: {
    fontSize: 9,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center',
    width: 80,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 25,
    right: 25,
    textAlign: 'center',
    fontSize: 6,
    color: '#666',
  },
});

const InvoicePDF = ({ invoice, companyData, receipts = [], clientData, vehicleData, template = 'default', documentType = 'invoice' }: InvoicePDFProps) => {
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

  // Calculer les montants de paiement
  const totalPaidAmount = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
  const remainingAmount = invoice.amount - totalPaidAmount;

  if (template === 'alternative') {
    return (
      <Document>
        <Page size="A4" style={alternativeStyles.page}>
          {/* Header avec entreprise et facture */}
          <View style={alternativeStyles.mainHeader}>
            <View style={alternativeStyles.companySection}>
              <Text style={alternativeStyles.companyName}>{companyData?.name || ''}</Text>
              <View>
                <Text style={alternativeStyles.companyInfo}><Text style={{ fontWeight: 'bold' }}>ADRESSE :</Text> {companyData?.address || ''}</Text>
                <Text style={alternativeStyles.companyInfo}>{companyData?.zipcode || ''} {companyData?.city || ''}</Text>
                <Text style={alternativeStyles.companyInfo}><Text style={{ fontWeight: 'bold' }}>TEL :</Text> {companyData?.phone || ''}</Text>
                <Text style={alternativeStyles.companyInfo}><Text style={{ fontWeight: 'bold' }}>EMAIL :</Text> {companyData?.email || ''}</Text>
                <Text style={alternativeStyles.companyInfo}><Text style={{ fontWeight: 'bold' }}>SIRET :</Text> {companyData?.siret || ''}</Text>
                <Text style={alternativeStyles.companyInfo}><Text style={{ fontWeight: 'bold' }}>TVA :</Text> {companyData?.tva || ''}</Text>
              </View>
            </View>
            
            <View style={alternativeStyles.invoiceSection}>
              <Text style={alternativeStyles.invoiceTitle}>
                {documentType === 'repair_order' ? 'ORDRE DE RÉPARATION N°' : 
                 documentType === 'credit' ? 'AVOIR N°' : 
                 documentType === 'quote' ? 'DEVIS N°' : 'FACTURE N°'} {clientData?.number || invoice.reference}
              </Text>
              
              <View style={[alternativeStyles.clientInfoSection, { marginTop: 0 }]}>
                <Text style={[alternativeStyles.clientInfo, { fontWeight: 'bold' }]}>{clientData?.name || 'Client'}</Text>
                {clientData?.phone && <Text style={alternativeStyles.clientInfo}><Text style={{ fontWeight: 'bold' }}>TEL :</Text> {clientData.phone}</Text>}
                {clientData?.email && <Text style={alternativeStyles.clientInfo}><Text style={{ fontWeight: 'bold' }}>EMAIL :</Text> {clientData.email}</Text>}
                {clientData?.address && <Text style={alternativeStyles.clientInfo}><Text style={{ fontWeight: 'bold' }}>ADRESSE :</Text> {clientData.address}</Text>}
                {clientData?.city && <Text style={alternativeStyles.clientInfo}>{clientData.city}</Text>}
                {clientData?.licensePlate && <Text style={alternativeStyles.clientInfo}><Text style={{ fontWeight: 'bold' }}>Immatriculation :</Text> {clientData.licensePlate}</Text>}
                {clientData?.mileage && <Text style={alternativeStyles.clientInfo}><Text style={{ fontWeight: 'bold' }}>Kilométrage :</Text> {clientData.mileage}</Text>}
                {clientData?.vehicle && <Text style={alternativeStyles.clientInfo}><Text style={{ fontWeight: 'bold' }}>Véhicule :</Text> {clientData.vehicle}</Text>}
                
                {/* Section Délai prévisionnel pour les ordres de réparation */}
                {documentType === 'repair_order' && vehicleData?.start_date && vehicleData?.end_date && (
                  <View style={{ marginTop: 15 }}>
                    <Text style={[alternativeStyles.clientInfo, { fontWeight: 'bold', fontSize: 12 }]}>Délai prévisionnel</Text>
                    <Text style={alternativeStyles.clientInfo}>
                      <Text style={{ fontWeight: 'bold' }}>Date de début :</Text> {formatDate(vehicleData.start_date)}
                    </Text>
                    <Text style={alternativeStyles.clientInfo}>
                      <Text style={{ fontWeight: 'bold' }}>Date de fin :</Text> {formatDate(vehicleData.end_date)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Date */}
          <View style={alternativeStyles.dateSection}>
            <View style={alternativeStyles.dateBox}>
              <Text style={alternativeStyles.dateLabel}>DATE</Text>
              <Text style={alternativeStyles.dateValue}>{clientData?.billingDate || formatDate(invoice.date || invoice.created_at)}</Text>
            </View>
            {documentType === 'credit' && (
              <View style={[alternativeStyles.dateBox, { marginLeft: 125 }]}>
                <Text style={alternativeStyles.dateLabel}>FACTURE ASSOCIÉE</Text>
                <Text style={alternativeStyles.dateValue}>{clientData?.invoiceReference || invoice.reference || 'N/A'}</Text>
              </View>
            )}
            {documentType === 'invoice' && (
              <View style={[alternativeStyles.dateBox, { marginLeft: 125 }]}>
                <Text style={alternativeStyles.dateLabel}>DATE D'ÉCHÉANCE</Text>
                <Text style={alternativeStyles.dateValue}>{formatDate(invoice.due_date)}</Text>
              </View>
            )}
          </View>

          {/* Tableau des articles */}
          <View style={alternativeStyles.tableContainer}>
            <View style={alternativeStyles.tableHeader}>
              <Text style={[alternativeStyles.tableHeaderCell, { width: 30 }]}>Réf</Text>
              <Text style={[alternativeStyles.tableHeaderCell, { width: 225 }]}>Description</Text>
              <Text style={[alternativeStyles.tableHeaderCell, { width: 50 }]}>Quantité</Text>
              <Text style={[alternativeStyles.tableHeaderCell, { width: 40 }]}>Remise</Text>
              <Text style={[alternativeStyles.tableHeaderCell, { width: 50 }]}>Prix HT</Text>
              <Text style={[alternativeStyles.tableHeaderCell, { width: 35 }]}>TVA</Text>
              <Text style={[alternativeStyles.tableHeaderCell, { width: 50 }]}>Total HT</Text>
              <Text style={[alternativeStyles.tableHeaderCellLast, { width: 50 }]}>Total TTC</Text>
            </View>
            
            {(clientData?.items || []).map((item: any, index: number) => (
              <View key={index} style={alternativeStyles.tableRow}>
                <Text style={[alternativeStyles.tableCellLeft, { width: 30 }]}>{item.ref || ''}</Text>
                <Text style={[alternativeStyles.tableCellLeft, { width: 225 }]}>{item.description || 'N/A'}</Text>
                <Text style={[alternativeStyles.tableCell, { width: 50 }]}>
                  {item.quantity?.toString().replace('.', ',') || '0'}
                </Text>
                <Text style={[alternativeStyles.tableCell, { width: 40 }]}>
                  {item.discount || 0}%
                </Text>
                <Text style={[alternativeStyles.tableCell, { width: 50 }]}>
                  {item.unitPrice?.toFixed(2).replace('.', ',') || '0,00'}€
                </Text>
                <Text style={[alternativeStyles.tableCell, { width: 35 }]}>
                  {item.vat || 20}%
                </Text>
                <Text style={[alternativeStyles.tableCell, { width: 50 }]}>
                  {item.totalHT?.toFixed(2).replace('.', ',') || '0,00'}€
                </Text>
                <Text style={[alternativeStyles.tableCellLast, { width: 50 }]}>
                  {item.totalTTC?.toFixed(2).replace('.', ',') || '0,00'}€
                </Text>
              </View>
            ))}
          </View>

          {/* Totaux */}
          <View style={alternativeStyles.totalsContainer}>
            <View style={alternativeStyles.totalsTable}>
              <View style={alternativeStyles.totalsHeaderRow}>
                <Text style={alternativeStyles.totalsHeaderCell}>Total HT</Text>
                <Text style={alternativeStyles.totalsHeaderCell}>Total TVA</Text>
                <Text style={alternativeStyles.totalsHeaderCell}>Total Remise</Text>
                <Text style={alternativeStyles.totalsHeaderCellLast}>Total TTC</Text>
              </View>
              <View style={alternativeStyles.totalsValueRow}>
                <Text style={alternativeStyles.totalsCell}>{clientData?.totals?.totalHT || '0,00 €'}</Text>
                <Text style={alternativeStyles.totalsCell}>{clientData?.totals?.totalVAT || '0,00 €'}</Text>
                <Text style={alternativeStyles.totalsCell}>{clientData?.totals?.totalDiscount || '0,00 €'}</Text>
                <Text style={alternativeStyles.totalsCellLast}>{clientData?.totals?.totalTTC || '0,00 €'}</Text>
              </View>
            </View>
          </View>

          {/* Section Notes */}
          {clientData?.notes && (
            <View style={{ marginTop: 20, marginBottom: 15 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 8 }}>Notes :</Text>
              <Text style={{ fontSize: 9, lineHeight: 1.4 }}>{clientData.notes}</Text>
            </View>
          )}

          {/* Section Détails de paiement - uniquement pour les factures */}
          {documentType === 'invoice' && invoice?.payment_details && (
            <View style={{ marginTop: 15, marginBottom: 15 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 8 }}>Détails de paiement :</Text>
              <Text style={{ fontSize: 9, lineHeight: 1.4 }}>{invoice.payment_details}</Text>
            </View>
          )}

          {/* Footer */}
          <Text style={alternativeStyles.footer} fixed>
            {companyData?.name || ''} - {companyData?.address || ''} {companyData?.zipcode || ''} {companyData?.city || ''} - 
            SIRET {companyData?.siret || ''} - N° TVA : {companyData?.tva || ''} - 
            Tel : {companyData?.phone || ''} - Email : {companyData?.email || ''}
          </Text>
        </Page>
      </Document>
    );
  }

  // Template par défaut
  return (
    <Document>
      <Page size="A4" style={defaultStyles.page}>
        {/* Header par défaut */}
        <View style={defaultStyles.header}>
          <View style={defaultStyles.headerColumn}>
            <View style={defaultStyles.title}>
              <Text style={documentType === 'repair_order' ? { fontSize: 12 } : undefined}>
                {documentType === 'repair_order' ? 'ORDRE DE RÉPARATION' : 
                 documentType === 'credit' ? 'AVOIR' : 
                 documentType === 'quote' ? 'DEVIS' : 'FACTURE'}
              </Text>
            </View>
            {companyData?.logo_url && (
              <Image src={companyData.logo_url} style={{ width: 80, height: 60, marginBottom: 8 }} />
            )}
            <Text style={defaultStyles.companyName}>{companyData?.name || ''}</Text>
            <View style={defaultStyles.companyInfo}>
              <Text>{companyData?.address || ''}</Text>
              <Text>{companyData?.zipcode || ''} {companyData?.city || ''}</Text>
              <Text>Téléphone : {companyData?.phone || ''}</Text>
              <Text>E-mail : {companyData?.email || ''}</Text>
              <Text>SIRET : {companyData?.siret || ''}</Text>
              <Text>N° TVA : {companyData?.tva || ''}</Text>
            </View>
          </View>

          <View style={defaultStyles.headerColumn}>
            <Text style={defaultStyles.sectionTitle}>{documentType === 'repair_order' ? 'Détails ordre réparation' : 
                                                          documentType === 'credit' ? 'Détails de l\'avoir' : 
                                                          documentType === 'quote' ? 'Détails du devis' : 'Détails de la facture'}</Text>
            <View style={defaultStyles.detailRow}>
              <Text style={defaultStyles.detailLabel}>{documentType === 'repair_order' ? 'Ordre réparation' : 
                                                               documentType === 'credit' ? 'Avoir' : 
                                                               documentType === 'quote' ? 'Devis' : 'Facture'}</Text>
              <Text style={defaultStyles.detailValue}>N° {clientData?.number || invoice.reference}</Text>
            </View>
            {clientData?.claimNumber && (
              <View style={defaultStyles.detailRow}>
                <Text style={defaultStyles.detailLabel}>N° de sinistre</Text>
                <Text style={defaultStyles.detailValue}>{clientData.claimNumber}</Text>
              </View>
            )}
            <View style={defaultStyles.detailRow}>
              <Text style={defaultStyles.detailLabel}>{documentType === 'repair_order' ? 'Date de création' : 
                                                               documentType === 'credit' ? 'Date de l\'avoir' : 
                                                               documentType === 'quote' ? 'Date du devis' : 'Date de facturation'}</Text>
              <Text style={defaultStyles.detailValue}>{clientData?.billingDate || formatDate(invoice.date || invoice.created_at)}</Text>
            </View>
            {documentType === 'credit' && (
              <View style={defaultStyles.detailRow}>
                <Text style={defaultStyles.detailLabel}>Facture associée</Text>
                <Text style={defaultStyles.detailValue}>N° {clientData?.invoiceReference || invoice.reference || 'N/A'}</Text>
              </View>
            )}
            {clientData?.dueDate && (
              <View style={defaultStyles.detailRow}>
                <Text style={defaultStyles.detailLabel}>Date d'échéance</Text>
                <Text style={defaultStyles.detailValue}>{clientData.dueDate}</Text>
              </View>
            )}
            {clientData?.vehicle && (
              <View style={defaultStyles.detailRow}>
                <Text style={defaultStyles.detailLabel}>Véhicule</Text>
                <Text style={defaultStyles.detailValue}>{clientData.vehicle}</Text>
              </View>
            )}
            {clientData?.licensePlate && (
              <View style={defaultStyles.detailRow}>
                <Text style={defaultStyles.detailLabel}>Immatriculation</Text>
                <Text style={defaultStyles.detailValue}>{clientData.licensePlate}</Text>
              </View>
            )}
            {clientData?.mileage && (
              <View style={defaultStyles.detailRow}>
                <Text style={defaultStyles.detailLabel}>Kilométrage</Text>
                <Text style={defaultStyles.detailValue}>{clientData.mileage}</Text>
              </View>
            )}
            
            {/* Montant payé seulement pour les factures */}
            {documentType === 'invoice' && (
              <View style={defaultStyles.detailRow}>
                <Text style={defaultStyles.detailLabel}>Montant payé</Text>
                <Text style={defaultStyles.detailValue}>{formatAmount(totalPaidAmount)}</Text>
              </View>
            )}
            
            {/* Encadré Montant dû/total */}
            <View style={defaultStyles.amountDueBox}>
              <Text style={defaultStyles.amountDueLabel}>
                {documentType === 'repair_order' ? 'Montant total' : 
                 documentType === 'credit' ? 'Montant de l\'avoir' : 
                 documentType === 'quote' ? 'Montant total' : 'Montant dû'}
              </Text>
              <Text style={defaultStyles.amountDueValue}>
                {documentType === 'invoice' ? formatAmount(remainingAmount) : clientData?.amountDue || formatAmount(invoice.amount)}
              </Text>
            </View>
          </View>

          <View style={defaultStyles.headerColumn}>
            <Text style={defaultStyles.sectionTitle}>
              {documentType === 'repair_order' ? 'Ordre réparation pour' : 
               documentType === 'credit' ? 'Avoir pour' : 
               documentType === 'quote' ? 'Devis pour' : 'Facture pour'}
            </Text>
            <View style={defaultStyles.companyInfo}>
              <Text style={defaultStyles.companyName}>{clientData?.name || 'Client non spécifié'}</Text>
              <Text>{clientData?.address || 'Adresse non renseignée'}</Text>
              <Text>{clientData?.city || 'Ville non renseignée'}</Text>
              {clientData?.phone && <Text>Téléphone : {clientData.phone}</Text>}
              {clientData?.email && <Text>E-mail : {clientData.email}</Text>}
            </View>
            
            {/* Section Délai prévisionnel pour les ordres de réparation - placé dans la colonne client */}
            {documentType === 'repair_order' && vehicleData?.start_date && vehicleData?.end_date && (
              <View style={{ marginTop: 15 }}>
                <Text style={[defaultStyles.sectionTitle, { fontSize: 11, marginBottom: 6 }]}>Délai prévisionnel</Text>
                <View style={defaultStyles.detailRow}>
                  <Text style={defaultStyles.detailLabel}>Date de début</Text>
                  <Text style={defaultStyles.detailValue}>{formatDate(vehicleData.start_date)}</Text>
                </View>
                <View style={defaultStyles.detailRow}>
                  <Text style={defaultStyles.detailLabel}>Date de fin</Text>
                  <Text style={defaultStyles.detailValue}>{formatDate(vehicleData.end_date)}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Tableau des articles par défaut */}
        <View style={defaultStyles.table}>
          <View style={defaultStyles.tableHeader}>
            <Text style={[defaultStyles.tableHeaderText, { flex: 3 }]}>Description</Text>
            <Text style={[defaultStyles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Quantité</Text>
            <Text style={[defaultStyles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Remise</Text>
            <Text style={[defaultStyles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Coût unitaire</Text>
            <Text style={[defaultStyles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>TVA</Text>
            <Text style={[defaultStyles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Total HT</Text>
          </View>
          
          {(clientData?.items || []).length > 0 ? (clientData?.items || []).map((item: any, index: number) => (
            <View key={index} style={defaultStyles.tableRow}>
              <Text style={[defaultStyles.tableCell, { flex: 3 }]}>{item.description || 'N/A'}</Text>
              <Text style={[defaultStyles.tableCell, { flex: 1, textAlign: 'center' }]}>{item.quantity?.toString().replace('.', ',') || '0'}</Text>
              <Text style={[defaultStyles.tableCell, { flex: 1, textAlign: 'center' }]}>{item.discount || 0}%</Text>
              <Text style={[defaultStyles.tableCell, { flex: 1, textAlign: 'center' }]}>{formatAmount(item.unitPrice || 0)}</Text>
              <Text style={[defaultStyles.tableCell, { flex: 1, textAlign: 'center' }]}>{item.vat || 20}%</Text>
              <Text style={[defaultStyles.tableCell, { flex: 1, textAlign: 'center' }]}>{formatAmount(item.totalHT || 0)}</Text>
            </View>
          )) : (
            <View style={defaultStyles.tableRow}>
              <Text style={[defaultStyles.tableCell, { flex: 6, textAlign: 'center' }]}>
                Aucun article dans cette facture
              </Text>
            </View>
          )}
        </View>

        {/* Totaux par défaut */}
        <View style={defaultStyles.totalsSection}>
          <View style={defaultStyles.totalsBox}>
            <View style={defaultStyles.totalRowBold}>
              <Text>Sous-total</Text>
              <Text>{clientData?.totals?.subtotal || '0,00 €'}</Text>
            </View>
            <View style={defaultStyles.totalRow}>
              <Text>TVA</Text>
              <Text>{clientData?.totals?.vat || '0,00 €'}</Text>
            </View>
            <View style={defaultStyles.finalTotal}>
              <Text>TOTAL</Text>
              <Text>{clientData?.totals?.total || '0,00 €'}</Text>
            </View>
          </View>
        </View>

        {/* Section Paiements - seulement pour les factures */}
        {documentType === 'invoice' && (
          <InvoicePDFPaymentsTable 
            payments={receipts} 
            totalPaidAmount={totalPaidAmount} 
            remainingAmount={remainingAmount} 
          />
        )}

        {/* Section Notes - affichage dans le template par défaut */}
        {clientData?.notes && (
          <View style={{ marginTop: 20, marginBottom: 15 }}>
            <Text style={[defaultStyles.sectionTitle, { marginBottom: 8 }]}>Notes</Text>
            <Text style={{ fontSize: 9, lineHeight: 1.4 }}>{clientData.notes}</Text>
          </View>
        )}

        {/* Section Détails de paiement - uniquement pour les factures */}
        {documentType === 'invoice' && invoice?.payment_details && (
          <View style={{ marginTop: 15, marginBottom: 15 }}>
            <Text style={[defaultStyles.sectionTitle, { marginBottom: 8 }]}>Détails de paiement</Text>
            <Text style={{ fontSize: 9, lineHeight: 1.4 }}>{invoice.payment_details}</Text>
          </View>
        )}

        {/* Footer par défaut */}
        <Text style={defaultStyles.footer} fixed>
          {companyData?.name || ''} - {companyData?.address || ''} {companyData?.zipcode || ''} {companyData?.city || ''} - 
          SIRET {companyData?.siret || ''} - N° TVA : {companyData?.tva || ''} - 
          Tel : {companyData?.phone || ''} - Email : {companyData?.email || ''}
        </Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF;

import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { invoiceStyles } from './InvoiceStyles';

interface InvoicePDFProps {
  invoice: any;
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => (
  <Document>
    <Page size="A4" style={invoiceStyles.page}>
      {/* Header */}
      <View style={invoiceStyles.header}>
        <Text style={invoiceStyles.title}>FACTURE</Text>
        <View style={invoiceStyles.companyInfo}>
          <Text style={invoiceStyles.companyName}>{invoice.company.name}</Text>
          <Text>ADRESSE : {invoice.company.address} {invoice.company.zipCode} {invoice.company.city}</Text>
          <Text>TEL : {invoice.company.phone}</Text>
          <Text>EMAIL : {invoice.company.email}</Text>
          <Text>SIREN : {invoice.company.siren}</Text>
          <Text>TVA : {invoice.company.tva}</Text>
        </View>
      </View>

      {/* Invoice Details */}
      <View style={invoiceStyles.invoiceDetails}>
        <View style={invoiceStyles.leftColumn}>
          <Text style={{fontSize: 12, fontWeight: 'bold', marginBottom: 10}}>Détails de la facture :</Text>
          <View style={invoiceStyles.detailRow}>
            <Text style={invoiceStyles.label}>Facture:</Text>
            <Text style={invoiceStyles.value}>N° {invoice.reference}</Text>
          </View>
          <View style={invoiceStyles.detailRow}>
            <Text style={invoiceStyles.label}>Date facturation:</Text>
            <Text style={invoiceStyles.value}>{invoice.date}</Text>
          </View>
          <View style={invoiceStyles.detailRow}>
            <Text style={invoiceStyles.label}>Date d'échéance:</Text>
            <Text style={invoiceStyles.value}>{invoice.due_date}</Text>
          </View>
          <View style={invoiceStyles.detailRow}>
            <Text style={invoiceStyles.label}>Véhicule:</Text>
            <Text style={invoiceStyles.value}> {invoice.vehicle.brand} {invoice.vehicle.model}</Text>
          </View>
          <View style={invoiceStyles.detailRow}>
            <Text style={invoiceStyles.label}>Immatricule:</Text>
            <Text style={invoiceStyles.value}>{invoice.vehicle.license_plate}</Text>
          </View>
          <View style={invoiceStyles.detailRow}>
            <Text style={invoiceStyles.label}>Kilométrage:</Text>
            <Text style={invoiceStyles.value}>{invoice.vehicle.mileage} Km</Text>
          </View>
        </View>
        <View style={invoiceStyles.rightColumn}>
          <View style={invoiceStyles.detailRow}>
            <Text style={invoiceStyles.label}>Montant payé:</Text>
            <Text style={invoiceStyles.value}>{invoice.paidAmount} €</Text>
          </View>
          <View style={invoiceStyles.detailRow}>
            <Text style={invoiceStyles.label}>Montant dû:</Text>
            <Text style={invoiceStyles.value}>{invoice.remainAmount} €</Text>
          </View>
        </View>
      </View>

      {/* Client Section */}
      <View style={invoiceStyles.clientSection}>
        <Text style={{fontWeight: 'bold', marginBottom: 5}}>Facture pour :</Text>
        <Text>{invoice.client.name}</Text>
        <Text>TEL : {invoice.client.phone}</Text>
        <Text>EMAIL : {invoice.client.email}</Text>
        <Text>ADRESSE : {invoice.client.address} {invoice.client.zipCode} {invoice.client.city}</Text>
      </View>

      {/* Items Table */}
      <View style={invoiceStyles.tableHeader}>
        <Text style={invoiceStyles.col1}>Article</Text>
        <Text style={invoiceStyles.col2}>Quantité</Text>
        <Text style={invoiceStyles.col3}>Coût Unitaire</Text>
        <Text style={invoiceStyles.col4}>Remise</Text>
        <Text style={invoiceStyles.col5}>TVA</Text>
        <Text style={invoiceStyles.col6}>Total HT</Text>
      </View>

      {invoice.articles.map((article: any, index: number) => (
        <View style={invoiceStyles.tableRow} key={index}>
          <Text style={invoiceStyles.col1}>{article.description}</Text>
          <Text style={invoiceStyles.col2}>{article.quantity}</Text>
          <Text style={invoiceStyles.col3}>{article.unitCost} €</Text>
          <Text style={invoiceStyles.col4}>{article.discount} %</Text>
          <Text style={invoiceStyles.col5}>{article.vat} %</Text>
          <Text style={invoiceStyles.col6}>{article.total} €</Text>
        </View>
      ))}

      {/* Totals */}
      <View style={invoiceStyles.totalsSection}>
        <View style={invoiceStyles.totalRow}>
          <Text>Sous-total</Text>
          <Text>{invoice.amountHT} €</Text>
        </View>
        <View style={invoiceStyles.totalRow}>
          <Text>TVA</Text>
          <Text>{invoice.amountVat} €</Text>
        </View>
        <View style={invoiceStyles.totalRow}>
          <Text style={invoiceStyles.totalLabel}>TOTAL</Text>
          <Text style={invoiceStyles.totalLabel}>{invoice.amount}</Text>
        </View>
      </View>

      {/* Payment Details */}
      {invoice.receipts && (
        <View style={invoiceStyles.paymentSection}>
          <Text style={{fontWeight: 'bold', marginBottom: 5}}>Détails de paiement</Text>
          <Text>{invoice.payment_method}</Text>
          
          <Text style={{fontWeight: 'bold', marginTop: 10, marginBottom: 5}}>Notes</Text>
          <Text>yyy</Text>

          <View style={invoiceStyles.paymentTable}>
            <View style={invoiceStyles.paymentHeader}>
              <Text style={invoiceStyles.paymentCol1}>Date</Text>
              <Text style={invoiceStyles.paymentCol2}>Référence</Text>
              <Text style={invoiceStyles.paymentCol3}>Montant payé</Text>
              <Text style={invoiceStyles.paymentCol4}>TVA encaissée</Text>
              <Text style={invoiceStyles.paymentCol5}>Mode</Text>
              <Text style={invoiceStyles.paymentCol6}>Banque</Text>
              <Text style={invoiceStyles.paymentCol7}>Commentaires</Text>
            </View>
            
            {invoice.receipts.map((receipt: any, index: number) => (
              <View style={invoiceStyles.paymentRow} key={index}>
                <Text style={invoiceStyles.paymentCol1}>{receipt.date}</Text>
                <Text style={invoiceStyles.paymentCol2}>{receipt.reference}</Text>
                <Text style={invoiceStyles.paymentCol3}>{receipt.amount} €</Text>
                <Text style={invoiceStyles.paymentCol4}> €</Text>
                <Text style={invoiceStyles.paymentCol5}>{receipt.payment_method}</Text>
                <Text style={invoiceStyles.paymentCol6}>IBAN: {receipt.bank_account}</Text>
                <Text style={invoiceStyles.paymentCol7}>{receipt.notes}</Text>
              </View>
            ))}
          </View>
            
          <View style={invoiceStyles.summarySection}>
            <Text>Résumé: {invoice.paidAmount}€</Text>
            <Text style={{fontWeight: 'bold'}}>Solde restant: {invoice.remainAmount}€</Text>
          </View>
          
          <Text style={{fontWeight: 'bold', marginTop: 15, marginBottom: 5}}>Liste des paiements</Text>
        </View>
      )}

      {/* Footer */}
      <View style={invoiceStyles.footer}>
        <Text></Text>
        <Text>{invoice.company.name} - Siège social :{invoice.company.address} {invoice.company.zipCode} {invoice.company.city} {invoice.company.country} - RCS {invoice.company.siren} - N° TVA intracommunautaire : {invoice.company.tva} - Tel : {invoice.company.phone} - Email : {invoice.company.email}</Text>
      </View>
    </Page>
  </Document>
);
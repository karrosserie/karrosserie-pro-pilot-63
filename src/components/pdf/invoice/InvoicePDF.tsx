import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { invoiceStyles } from './InvoiceStyles';

interface InvoicePDFProps {
  invoice: any;
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => (
  <Document>
    <Page size="A4" style={invoiceStyles.page}>
      {/* Header with dark background */}
      <View style={invoiceStyles.headerSection}>
        <Text style={invoiceStyles.title}>FACTURE</Text>
      </View>

      <View style={invoiceStyles.mainContent}>
        {/* Top section with company and invoice details */}
        <View style={invoiceStyles.topSection}>
          <View style={invoiceStyles.leftInfo}>
            <Text style={invoiceStyles.companyName}>{invoice.company.name}</Text>
            <Text style={invoiceStyles.companyDetails}>ADRESSE : {invoice.company.address}</Text>
            <Text style={invoiceStyles.companyDetails}>{invoice.company.zipCode} {invoice.company.city}</Text>
            <Text style={invoiceStyles.companyDetails}>PHONE : {invoice.company.phone}</Text>
            <Text style={invoiceStyles.companyDetails}>EMAIL : {invoice.company.email}</Text>
            <Text style={invoiceStyles.companyDetails}>SIREN : {invoice.company.siren}</Text>
            <Text style={invoiceStyles.companyDetails}>TVA : {invoice.company.tva}</Text>
          </View>

          <View style={invoiceStyles.rightInfo}>
            <Text style={invoiceStyles.sectionTitle}>Détails de la facture :</Text>
            <View style={invoiceStyles.detailRow}>
              <Text style={invoiceStyles.label}>Facture:</Text>
              <Text style={invoiceStyles.value}>N° {invoice.reference}</Text>
            </View>
            <View style={invoiceStyles.detailRow}>
              <Text style={invoiceStyles.label}>N° de Sinistre:</Text>
              <Text style={invoiceStyles.value}>xxerty</Text>
            </View>
            <View style={invoiceStyles.detailRow}>
              <Text style={invoiceStyles.label}>Date facturation:</Text>
              <Text style={invoiceStyles.value}>{invoice.date}</Text>
            </View>
            <View style={invoiceStyles.detailRow}>
              <Text style={invoiceStyles.label}>Date d'échéance:</Text>
              <Text style={invoiceStyles.value}>{invoice.due_date || invoice.date}</Text>
            </View>
            <View style={invoiceStyles.detailRow}>
              <Text style={invoiceStyles.label}>Véhicule:</Text>
              <Text style={invoiceStyles.value}>{invoice.vehicle.brand} {invoice.vehicle.model}</Text>
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
        </View>

        {/* Client Section */}
        <View style={invoiceStyles.clientSection}>
          <Text style={invoiceStyles.clientTitle}>Facture pour :</Text>
          <Text style={invoiceStyles.companyDetails}>{invoice.client.name || invoice.client.nom}</Text>
          <Text style={invoiceStyles.companyDetails}>PHONE : {invoice.client.phone || invoice.client.telephone}</Text>
          <Text style={invoiceStyles.companyDetails}>EMAIL : {invoice.client.email}</Text>
          <Text style={invoiceStyles.companyDetails}>ADRESSE : {invoice.client.address || invoice.client.adresse} {invoice.client.zipCode} {invoice.client.city}</Text>
        </View>

        {/* Amount Due Section */}
        <View style={invoiceStyles.amountDueSection}>
          <Text style={invoiceStyles.amountDueLabel}>Montant dû:</Text>
          <Text style={invoiceStyles.amountDueValue}>{invoice.amount}</Text>
        </View>

        {/* Items Table */}
        <View style={invoiceStyles.table}>
          <View style={invoiceStyles.tableHeader}>
            <Text style={invoiceStyles.col1}>Article</Text>
            <Text style={invoiceStyles.col2}>Quantité</Text>
            <Text style={invoiceStyles.col3}>Coût Unitaire</Text>
            <Text style={invoiceStyles.col4}>Remise</Text>
            <Text style={invoiceStyles.col5}>TVA</Text>
            <Text style={invoiceStyles.col6}>Total HT</Text>
          </View>

          {invoice.articles.map((article: any, index: number) => (
            <View style={[invoiceStyles.tableRow, index % 2 === 1 && invoiceStyles.tableRowEven]} key={index}>
              <Text style={invoiceStyles.col1}>{article.description}</Text>
              <Text style={invoiceStyles.col2}>{article.quantity}</Text>
              <Text style={invoiceStyles.col3}>{article.unitCost}€</Text>
              <Text style={invoiceStyles.col4}>{article.discount}%</Text>
              <Text style={invoiceStyles.col5}>{article.vat}%</Text>
              <Text style={invoiceStyles.col6}>{article.total}€</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={invoiceStyles.totalsSection}>
          <View style={invoiceStyles.totalRow}>
            <Text style={invoiceStyles.totalLabel}>Sous-total</Text>
            <Text style={invoiceStyles.totalValue}>{invoice.amountHT}€</Text>
          </View>
          <View style={invoiceStyles.totalRow}>
            <Text style={invoiceStyles.totalLabel}>TVA</Text>
            <Text style={invoiceStyles.totalValue}>{invoice.amountVat}€</Text>
          </View>
          <View style={invoiceStyles.totalRow}>
            <Text style={invoiceStyles.totalLabel}>Remise</Text>
            <Text style={invoiceStyles.totalValue}>0,00€</Text>
          </View>
          <View style={[invoiceStyles.totalRow, invoiceStyles.totalRowFinal]}>
            <Text style={[invoiceStyles.totalLabel, { color: 'white' }]}>TOTAL</Text>
            <Text style={[invoiceStyles.totalValue, { color: 'white' }]}>{invoice.amount}</Text>
          </View>
        </View>

        {/* Payment Details */}
        {invoice.receipts && invoice.receipts.length > 0 && (
          <View style={invoiceStyles.paymentSection}>
            <Text style={invoiceStyles.sectionTitle}>Détails de paiement</Text>
            
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
                  <Text style={invoiceStyles.paymentCol3}>{receipt.amount}€</Text>
                  <Text style={invoiceStyles.paymentCol4}>-</Text>
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
          </View>
        )}

        {/* Footer */}
        <View style={invoiceStyles.footer}>
          <Text>Les factures émises par ISTRES sont basées sur les informations disponibles au moment de leur établissement. Toute modification des conditions ou des prestations pourra entraîner un ajustement ultérieur.</Text>
          <Text style={{ marginTop: 10 }}>
            {invoice.company.name} - Siège social : {invoice.company.address} {invoice.company.zipCode} {invoice.company.city} {invoice.company.country} - RCS {invoice.company.siren} - N° TVA intracommunautaire : {invoice.company.tva} - Tel : {invoice.company.phone} - Email : {invoice.company.email}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);
import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { invoiceStyles } from './InvoiceStyles';

interface InvoicePDFProps {
  invoice: any;
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => {
  console.log('🔥 NOUVEAU PDF TEMPLATE CHARGÉ - Version 2024', invoice);
  return (
  <Document>
    <Page size="A4" style={invoiceStyles.page}>
      {/* Dark header bar */}
      <View style={invoiceStyles.headerBar}>
        <Text style={invoiceStyles.headerTitle}>FACTURE</Text>
      </View>

      <View style={invoiceStyles.contentArea}>
        {/* Top section with company info and details */}
        <View style={invoiceStyles.topSection}>
          {/* Left panel - Company info */}
          <View style={invoiceStyles.leftPanel}>
            {/* Company logo placeholder */}
            <View style={invoiceStyles.companyLogo}>
              <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>LOGO</Text>
            </View>
            
            <Text style={invoiceStyles.companyName}>Z5 ISTRES</Text>
            <Text style={invoiceStyles.companyDetails}>ADRESSE : {invoice.company.address}</Text>
            <Text style={invoiceStyles.companyDetails}>{invoice.company.zipCode} {invoice.company.city}</Text>
            <Text style={invoiceStyles.companyDetails}>PHONE : {invoice.company.phone}</Text>
            <Text style={invoiceStyles.companyDetails}>EMAIL : {invoice.company.email}</Text>
            <Text style={invoiceStyles.companyDetails}>SIREN : {invoice.company.siren}</Text>
            <Text style={invoiceStyles.companyDetails}>TVA : {invoice.company.tva}</Text>
          </View>

          {/* Right panel - Invoice details and client */}
          <View style={invoiceStyles.rightPanel}>
            {/* Invoice details */}
            <View style={invoiceStyles.detailsSection}>
              <Text style={invoiceStyles.detailsTitle}>Détails de la facture :</Text>
              <View style={invoiceStyles.detailRow}>
                <Text style={invoiceStyles.detailLabel}>Facture:</Text>
                <Text style={invoiceStyles.detailValue}>N° {invoice.reference}</Text>
              </View>
              <View style={invoiceStyles.detailRow}>
                <Text style={invoiceStyles.detailLabel}>N° de Sinistre:</Text>
                <Text style={invoiceStyles.detailValue}>xxerty</Text>
              </View>
              <View style={invoiceStyles.detailRow}>
                <Text style={invoiceStyles.detailLabel}>Date facturation:</Text>
                <Text style={invoiceStyles.detailValue}>{invoice.date}</Text>
              </View>
              <View style={invoiceStyles.detailRow}>
                <Text style={invoiceStyles.detailLabel}>Date d'échéance:</Text>
                <Text style={invoiceStyles.detailValue}>{invoice.due_date || invoice.date}</Text>
              </View>
              <View style={invoiceStyles.detailRow}>
                <Text style={invoiceStyles.detailLabel}>Véhicule:</Text>
                <Text style={invoiceStyles.detailValue}>{invoice.vehicle.brand} {invoice.vehicle.model}</Text>
              </View>
              <View style={invoiceStyles.detailRow}>
                <Text style={invoiceStyles.detailLabel}>Immatricule:</Text>
                <Text style={invoiceStyles.detailValue}>{invoice.vehicle.license_plate}</Text>
              </View>
              <View style={invoiceStyles.detailRow}>
                <Text style={invoiceStyles.detailLabel}>Kilométrage:</Text>
                <Text style={invoiceStyles.detailValue}>{invoice.vehicle.mileage} Km</Text>
              </View>
            </View>

            {/* Client section */}
            <View style={invoiceStyles.clientSection}>
              <Text style={invoiceStyles.clientTitle}>Facture pour :</Text>
              <Text style={invoiceStyles.clientInfo}>Demo user</Text>
              <Text style={invoiceStyles.clientInfo}>PHONE : {invoice.client.phone || invoice.client.telephone}</Text>
              <Text style={invoiceStyles.clientInfo}>EMAIL : {invoice.client.email}</Text>
              <Text style={invoiceStyles.clientInfo}>ADRESSE : {invoice.client.address || invoice.client.adresse} {invoice.client.zipCode} {invoice.client.city}</Text>
            </View>
          </View>
        </View>

        {/* Big blue amount due box */}
        <View style={invoiceStyles.amountDueContainer}>
          <Text style={invoiceStyles.amountDueLabel}>Montant dû:</Text>
          <Text style={invoiceStyles.amountDueValue}>{invoice.amount}</Text>
        </View>

        {/* Articles table */}
        <View style={invoiceStyles.tableContainer}>
          {/* Table header */}
          <View style={invoiceStyles.tableHeader}>
            <Text style={[invoiceStyles.tableHeaderText, invoiceStyles.colArticle]}>Article</Text>
            <Text style={[invoiceStyles.tableHeaderText, invoiceStyles.colQuantity]}>Quantité</Text>
            <Text style={[invoiceStyles.tableHeaderText, invoiceStyles.colUnitPrice]}>Coût Unitaire</Text>
            <Text style={[invoiceStyles.tableHeaderText, invoiceStyles.colDiscount]}>Remise</Text>
            <Text style={[invoiceStyles.tableHeaderText, invoiceStyles.colTVA]}>TVA</Text>
            <Text style={[invoiceStyles.tableHeaderText, invoiceStyles.colTotal]}>Total HT</Text>
          </View>

          {/* Table rows */}
          {invoice.articles.map((article: any, index: number) => (
            <View style={[invoiceStyles.tableRow, index % 2 === 1 && invoiceStyles.tableRowEven]} key={index}>
              <Text style={[invoiceStyles.tableCell, invoiceStyles.colArticle]}>{article.description}</Text>
              <Text style={[invoiceStyles.tableCell, invoiceStyles.colQuantity]}>{article.quantity}</Text>
              <Text style={[invoiceStyles.tableCell, invoiceStyles.colUnitPrice]}>{article.unitCost}€</Text>
              <Text style={[invoiceStyles.tableCell, invoiceStyles.colDiscount]}>{article.discount}%</Text>
              <Text style={[invoiceStyles.tableCell, invoiceStyles.colTVA]}>{article.vat}%</Text>
              <Text style={[invoiceStyles.tableCell, invoiceStyles.colTotal]}>{article.total}€</Text>
            </View>
          ))}
        </View>

        {/* Totals section */}
        <View style={invoiceStyles.totalsContainer}>
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
            <Text style={invoiceStyles.totalValue}>6,30€</Text>
          </View>
          <View style={[invoiceStyles.totalRow, invoiceStyles.totalRowFinal]}>
            <Text style={[invoiceStyles.totalLabel, { color: 'white', fontWeight: 'bold' }]}>TOTAL</Text>
            <Text style={[invoiceStyles.totalValue, { color: 'white', fontWeight: 'bold' }]}>{invoice.amount}</Text>
          </View>
        </View>

        {/* Footer note */}
        <View style={invoiceStyles.footer}>
          <Text>Les factures émises par ISTRES sont basées sur les informations disponibles au moment de leur établissement. Toute modification des conditions ou des prestations pourra entraîner un ajustement ultérieur.</Text>
        </View>
      </View>
    </Page>
  </Document>
  );
};
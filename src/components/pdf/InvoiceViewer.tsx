import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    borderBottom: '1px solid #000',
    paddingBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  companyInfo: {
    marginBottom: 10
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2
  },
  invoiceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  leftColumn: {
    flex: 1
  },
  rightColumn: {
    flex: 1
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 3
  },
  label: {
    width: 120,
    fontWeight: 'bold'
  },
  value: {
    flex: 1
  },
  clientSection: {
    marginBottom: 20,
    padding: 10,
    border: '1px solid #cccccc'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderBottom: '1px solid #cccccc'
  },
  tableRow: {
    flexDirection: 'row',
    padding: 5,
    borderBottom: '1px solid #eeeeee'
  },
  col1: { width: '20%' },
  col2: { width: '15%' },
  col3: { width: '15%' },
  col4: { width: '15%' },
  col5: { width: '15%' },
  col6: { width: '20%' },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end'
  },
  totalRow: {
    flexDirection: 'row',
    width: 200,
    justifyContent: 'space-between',
    marginBottom: 3
  },
  totalLabel: {
    fontWeight: 'bold'
  },
  paymentSection: {
    marginTop: 20,
    marginBottom: 20
  },
  paymentTable: {
    border: '1px solid #cccccc',
    marginTop: 10
  },
  paymentHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderBottom: '1px solid #cccccc'
  },
  paymentRow: {
    flexDirection: 'row',
    padding: 5,
    borderBottom: '1px solid #eeeeee'
  },
  paymentCol1: { width: '12%' },
  paymentCol2: { width: '12%' },
  paymentCol3: { width: '12%' },
  paymentCol4: { width: '12%' },
  paymentCol5: { width: '12%' },
  paymentCol6: { width: '15%' },
  paymentCol7: { width: '10%' },
  paymentCol8: { width: '15%' },
  summarySection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9'
  },
  footer: {
    marginTop: 30,
    fontSize: 8,
    textAlign: 'center',
    borderTop: '1px solid #000',
    paddingTop: 10,
    color: '#666666'
  }
});

// Composant PDF
export const InvoicePDF = ({invoice}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>FACTURE</Text>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{invoice.company.name}</Text>
          <Text>ADRESSE : {invoice.company.address} {invoice.company.zipCode} {invoice.company.city}</Text>
          <Text>TEL : {invoice.company.phone}</Text>
          <Text>EMAIL : {invoice.company.email}</Text>
          <Text>SIREN : {invoice.company.siren}</Text>
          <Text>TVA : {invoice.company.tva}</Text>
        </View>
      </View>

      {/* Invoice Details */}
      <View style={styles.invoiceDetails}>
        <View style={styles.leftColumn}>
          <Text style={{fontSize: 12, fontWeight: 'bold', marginBottom: 10}}>Détails de la facture :</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Facture:</Text>
            <Text style={styles.value}>N° {invoice.reference}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Date facturation:</Text>
            <Text style={styles.value}>{invoice.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Date d'échéance:</Text>
            <Text style={styles.value}>{invoice.due_date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Véhicule:</Text>
            <Text style={styles.value}> {invoice.vehicle.brand} {invoice.vehicle.model}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Immatricule:</Text>
            <Text style={styles.value}>{invoice.vehicle.license_plate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Kilométrage:</Text>
            <Text style={styles.value}>{invoice.vehicle.mileage} Km</Text>
          </View>
        </View>
        <View style={styles.rightColumn}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Montant payé:</Text>
            <Text style={styles.value}>{invoice.paidAmount} €</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Montant dû:</Text>
            <Text style={styles.value}>{invoice.remainAmount} €</Text>
          </View>
        </View>
      </View>

      {/* Client Section */}
      <View style={styles.clientSection}>
        <Text style={{fontWeight: 'bold', marginBottom: 5}}>Facture pour :</Text>
        <Text>{invoice.client.name}</Text>
        <Text>TEL : {invoice.client.phone}</Text>
        <Text>EMAIL : {invoice.client.email}</Text>
        <Text>ADRESSE : {invoice.client.address} {invoice.client.zipCode} {invoice.client.city}</Text>
      </View>

      {/* Items Table */}
      <View style={styles.tableHeader}>
        <Text style={styles.col1}>Article</Text>
        <Text style={styles.col2}>Quantité</Text>
        <Text style={styles.col3}>Coût Unitaire</Text>
        <Text style={styles.col4}>Remise</Text>
        <Text style={styles.col5}>TVA</Text>
        <Text style={styles.col6}>Total HT</Text>
      </View>

       {invoice.articles.map((article, index) => (
      
      <View style={styles.tableRow} key={index}>
        <Text style={styles.col1}>{article.description}</Text>
        <Text style={styles.col2}>{article.quantity}</Text>
        <Text style={styles.col3}>{article.unitCost} €</Text>
        <Text style={styles.col4}>{article.discount} %</Text>
        <Text style={styles.col5}>{article.vat} %</Text>
        <Text style={styles.col6}>{article.total} €</Text>
      </View>

       ))}
      

      {/* Totals */}
      <View style={styles.totalsSection}>
        <View style={styles.totalRow}>
          <Text>Sous-total</Text>
          <Text>{invoice.amountHT} €</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>TVA</Text>
          <Text>{invoice.amountVat} €</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalLabel}>{invoice.amount}</Text>
        </View>
      </View>

      {/* Payment Details */}
       { invoice.receipts &&
      <View style={styles.paymentSection}>
        <Text style={{fontWeight: 'bold', marginBottom: 5}}>Détails de paiement</Text>
        <Text>{invoice.payment_method }</Text>
        
        <Text style={{fontWeight: 'bold', marginTop: 10, marginBottom: 5}}>Notes</Text>
        <Text>yyy</Text>

       
        
           <View style={styles.paymentTable}>
          <View style={styles.paymentHeader}>
            <Text style={styles.paymentCol1}>Date</Text>
            <Text style={styles.paymentCol2}>Référence</Text>
            <Text style={styles.paymentCol3}>Montant payé</Text>
            <Text style={styles.paymentCol4}>TVA encaissée</Text>
            <Text style={styles.paymentCol5}>Mode</Text>
            <Text style={styles.paymentCol6}>Banque</Text>
            <Text style={styles.paymentCol7}>Commentaires</Text>
          </View>
          
           {invoice.receipts.map((receipt, index) => (
          <View style={styles.paymentRow}  key={index}>
            <Text style={styles.paymentCol1}>{receipt.date}</Text>
            <Text style={styles.paymentCol2}>{receipt.reference}</Text>
            <Text style={styles.paymentCol3}>{receipt.amount} €</Text>
            <Text style={styles.paymentCol4}> €</Text>
            <Text style={styles.paymentCol5}>{receipt.payment_method}</Text>
            <Text style={styles.paymentCol6}>IBAN: {receipt.bank_account}</Text>
            <Text style={styles.paymentCol7}>{receipt.notes}</Text>
          </View>
           ))}
        </View>
          
        
        <View style={styles.summarySection}>
          <Text>Résumé:  {invoice.paidAmount}€</Text>
          <Text style={{fontWeight: 'bold'}}>Solde restant: {invoice.remainAmount}€</Text>
        </View>

        
        
        <Text style={{fontWeight: 'bold', marginTop: 15, marginBottom: 5}}>Liste des paiements</Text>
        
        
        
       
      </View>
      }

      {/* Footer */}
      <View style={styles.footer}>
        <Text></Text>
        <Text>{invoice.company.name} - Siège social :{invoice.company.address} {invoice.company.zipCode} {invoice.company.city} {invoice.company.country} - RCS {invoice.company.siren} - N° TVA intracommunautaire : {invoice.company.tva} - Tel : {invoice.company.phone} - Email : {invoice.company.email}</Text>
      </View>
    </Page>
  </Document>
);

// Composant principal
const InvoiceViewer = () => {
  const invoiceData = {
    reference: '1',
    date: '06/05/2025',
    vehicle:{
      model:"I X1",
      brand:"BMW",
      license_plate : 'P837',
      mileage: '10000',
      fuel_level:"E"
    },
    company:{
      name:"DEMO GEOFFREY MOYA",
      address:"10 rue courteissade",
      zipCode :"13320",
      city:"Bouc bel air",
      country:"France",
      siren:"567890123",
      siret:"56789012300013",
      tva:"FR 567890123",
      phone:"+33650363126",
      email:"geoffrey.moya@gmail.com"
    },
    client: {
      nom: 'aaa',
      telephone: '+33612345678',
      email: 'geo@geo.fr',
      adresse: 'zfrrzfgrzf',
      zipCode :"13320",
      city:"Bouc bel air",
    },
    articles: [
      {
        description: 'peinture',
        quantity: '1',
        discount: '0',
        unitCost: '500,00',
        vat: '20',
        total: '500,00'
      },
      {
        description: 'mastic',
        quantity: '1',
        discount: '0',
        unitCost: '1.000,00',
        vat: '20',
        total: '1.000,00'
      }
    ],
    receipts:[
      {
        date:"01/06/2025",
        amount:"1000.00",
        reference:"",
        payment_method:"Virement bancaire",
        bank_account:"FR06000666544567876543456",
        notes:"paiement content"
      }
    ],
    notes:"aaaaa",
    amountHT: '1.500,00',
    amountVat: '300,00',
    amount: '1.800,00',
    payment_method:"especes",
    paidAmount:"1000.00",
    remainAmount:"800.00"
  };
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Facture PDF</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-4">
              Cliquez sur le bouton ci-dessous pour télécharger la facture en PDF
            </p>
            
            <PDFDownloadLink
              document={<InvoicePDF invoice={invoiceData} />}
              fileName="facture-geoffrey-moya.pdf"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {({ blob, url, loading, error }) =>
                loading ? 'Génération du PDF...' : 'Télécharger la facture PDF'
              }
            </PDFDownloadLink>
          </div>
          
          
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewer;
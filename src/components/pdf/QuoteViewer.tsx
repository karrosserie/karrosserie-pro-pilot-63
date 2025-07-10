import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  companyInfo: {
    marginBottom: 15,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoLine: {
    marginBottom: 2,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    textDecoration: 'underline',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  clientSection: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginBottom: 15,
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 15,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0',
    padding: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableCol: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    textAlign: 'center',
  },
  tableCell: {
    margin: 'auto',
    fontSize: 9,
  },
  totalSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 3,
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  finalTotal: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    fontSize: 8,
    textAlign: 'center',
    borderTop: 1,
    paddingTop: 10,
  },
});

// Composant PDF
export const QuotePDF = ({ quoteData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Devis</Text>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{quoteData.company.name}</Text>
          <Text style={styles.infoLine}>ADRESSE : {quoteData.company.address} {quoteData.company.zipCode} {quoteData.company.city}</Text>
          <Text style={styles.infoLine}>TEL : {quoteData.company.phone}</Text>
          <Text style={styles.infoLine}>EMAIL : {quoteData.company.email}</Text>
          <Text style={styles.infoLine}>SIREN : {quoteData.company.siren}</Text>
          <Text style={styles.infoLine}>TVA : {quoteData.company.tva}</Text>
        </View>
      </View>

      {/* Détails de l'ordre de réparation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details de l'ordre de réparation :</Text>
        <View style={styles.row}>
          <Text>Devis: N° {quoteData.reference}</Text>
          <Text>Date de l'ordre de réparation : {quoteData.date}</Text>
        </View>
        <View style={styles.row}>
          <Text>Véhicule: {quoteData.vehicle.brand} {quoteData.vehicle.model}</Text>
          <Text>Immatricule : {quoteData.vehicle.license_plate}</Text>
        </View>
        <View style={styles.row}>
          <Text>Kilométrage : {quoteData.vehicle.mileage} Km</Text>
          <Text>Total: {quoteData.total} €</Text>
        </View>
      </View>

      {/* Informations client */}
      <View style={styles.clientSection}>
        <Text style={styles.sectionTitle}>Devis pour:</Text>
        <Text style={styles.infoLine}>{quoteData.client.nom}</Text>
        <Text style={styles.infoLine}>TEL : {quoteData.client.telephone}</Text>
        <Text style={styles.infoLine}>EMAIL : {quoteData.client.email}</Text>
        <Text style={styles.infoLine}>ADRESSE : {quoteData.client.address} {quoteData.client.zipCode} {quoteData.client.city}</Text>
      </View>

      {/* Tableau des articles */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Article</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Quantité</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Remise</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Coût Unitaire</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>TVA</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Total HT</Text>
          </View>
        </View>
        {quoteData.articles.map((article, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{article.description}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{article.quantity}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{article.discount} %</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{article.unitCost} €</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{article.vat} %</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{article.total} €</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Totaux */}
      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text>Sous-total</Text>
          <Text>{quoteData.amountHT} €</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>TVA</Text>
          <Text>{quoteData.amountVat} €</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.finalTotal}>TOTAL</Text>
          <Text style={styles.finalTotal}>{quoteData.amount} €</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>{quoteData.company.name} - Siège social :{quoteData.company.address} {quoteData.company.zipCode} {quoteData.company.city} {quoteData.company.country} - RCS {quoteData.company.siren} - N° TVA intracommunautaire : {quoteData.company.tva} - Tel : {quoteData.company.phone} - Email : {quoteData.company.email}</Text>
      </View>
    </Page>
  </Document>
);

// Composant principal
const QuoteViewer = () => {
  const quoteData = {
    reference: '1',
    date: '06/05/2025',
    vehicle:{
      model:"I X1",
      brand:"BMW",
      license_plate : 'P837',
      mileage: '10000',
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
      adress: 'zfrrzfgrzf',
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
    amountHT: '1.500,00',
    amountVat: '300,00',
    amount: '1.800,00',
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Devis PDF</h1>
        <p className="text-gray-600">Cliquez sur le bouton ci-dessous pour télécharger le PDF</p>
      </div>


      <div className="text-center">
        <PDFDownloadLink
          document={<QuotePDF quoteData={quoteData} />}
          fileName="devis.pdf"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          {({ blob, url, loading, error }) =>
            loading ? 'Génération du PDF...' : 'Télécharger le PDF'
          }
        </PDFDownloadLink>
      </div>

      
    </div>
  );
};

export default QuoteViewer;
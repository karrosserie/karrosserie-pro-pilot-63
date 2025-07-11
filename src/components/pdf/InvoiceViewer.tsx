import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// NOUVEAU DESIGN STYLES - Version 2024
const newInvoiceStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },
  headerBar: {
    backgroundColor: '#4a5568',
    paddingVertical: 12,
    paddingHorizontal: 20
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  contentArea: {
    padding: 20
  },
  topSection: {
    flexDirection: 'row',
    marginBottom: 25
  },
  leftPanel: {
    width: '40%',
    paddingRight: 20
  },
  companyLogo: {
    width: 60,
    height: 60,
    backgroundColor: '#2d3748',
    borderRadius: 30,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 5
  },
  companyDetails: {
    fontSize: 9,
    color: '#4a5568',
    marginBottom: 2
  },
  rightPanel: {
    width: '60%',
    paddingLeft: 20
  },
  detailsSection: {
    backgroundColor: '#f7fafc',
    padding: 15,
    marginBottom: 15,
    border: '1px solid #e2e8f0'
  },
  detailsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 10
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4
  },
  detailLabel: {
    width: 90,
    fontSize: 9,
    color: '#4a5568'
  },
  detailValue: {
    flex: 1,
    fontSize: 9,
    color: '#2d3748',
    fontWeight: 'bold'
  },
  clientSection: {
    backgroundColor: '#f7fafc',
    padding: 15,
    border: '1px solid #e2e8f0'
  },
  clientTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8
  },
  clientInfo: {
    fontSize: 9,
    color: '#2d3748',
    marginBottom: 2
  },
  amountDueContainer: {
    backgroundColor: '#3182ce',
    padding: 20,
    marginVertical: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  amountDueLabel: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5
  },
  amountDueValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold'
  },
  tableContainer: {
    border: '1px solid #e2e8f0',
    marginBottom: 20
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4a5568',
    paddingVertical: 10,
    paddingHorizontal: 8
  },
  tableHeaderText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold'
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottom: '1px solid #e2e8f0'
  },
  tableRowEven: {
    backgroundColor: '#f7fafc'
  },
  tableCell: {
    fontSize: 9,
    color: '#2d3748'
  },
  colArticle: { width: '35%', paddingRight: 5 },
  colQuantity: { width: '10%', textAlign: 'center' },
  colUnitPrice: { width: '15%', textAlign: 'right' },
  colDiscount: { width: '10%', textAlign: 'center' },
  colTVA: { width: '10%', textAlign: 'center' },
  colTotal: { width: '20%', textAlign: 'right' },
  totalsContainer: {
    alignItems: 'flex-end',
    marginTop: 20
  },
  totalRow: {
    flexDirection: 'row',
    width: 200,
    justifyContent: 'space-between',
    paddingVertical: 3,
    paddingHorizontal: 10
  },
  totalRowFinal: {
    backgroundColor: '#3182ce',
    color: 'white',
    fontWeight: 'bold'
  },
  totalLabel: {
    fontSize: 10
  },
  totalValue: {
    fontSize: 10,
    textAlign: 'right'
  },
  footer: {
    marginTop: 40,
    paddingTop: 15,
    borderTop: '1px solid #e2e8f0',
    fontSize: 8,
    color: '#4a5568',
    textAlign: 'center'
  }
});

// NOUVEAU COMPOSANT PDF - Version 2024
export const InvoicePDF = ({ invoice }: { invoice: any }) => {
  console.log('🔥🔥🔥 NOUVEAU PDF DESIGN CHARGÉ - V2024 🔥🔥🔥', invoice);
  
  return (
    <Document>
      <Page size="A4" style={newInvoiceStyles.page}>
        {/* Header sombre */}
        <View style={newInvoiceStyles.headerBar}>
          <Text style={newInvoiceStyles.headerTitle}>FACTURE</Text>
        </View>

        <View style={newInvoiceStyles.contentArea}>
          {/* Section du haut */}
          <View style={newInvoiceStyles.topSection}>
            {/* Panneau gauche - Info entreprise */}
            <View style={newInvoiceStyles.leftPanel}>
              <View style={newInvoiceStyles.companyLogo}>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>LOGO</Text>
              </View>
              
              <Text style={newInvoiceStyles.companyName}>Z5 ISTRES</Text>
              <Text style={newInvoiceStyles.companyDetails}>ADRESSE : {invoice.company.address}</Text>
              <Text style={newInvoiceStyles.companyDetails}>{invoice.company.zipCode} {invoice.company.city}</Text>
              <Text style={newInvoiceStyles.companyDetails}>PHONE : {invoice.company.phone}</Text>
              <Text style={newInvoiceStyles.companyDetails}>EMAIL : {invoice.company.email}</Text>
              <Text style={newInvoiceStyles.companyDetails}>SIREN : {invoice.company.siren}</Text>
              <Text style={newInvoiceStyles.companyDetails}>TVA : {invoice.company.tva}</Text>
            </View>

            {/* Panneau droit */}
            <View style={newInvoiceStyles.rightPanel}>
              {/* Détails facture */}
              <View style={newInvoiceStyles.detailsSection}>
                <Text style={newInvoiceStyles.detailsTitle}>Détails de la facture :</Text>
                <View style={newInvoiceStyles.detailRow}>
                  <Text style={newInvoiceStyles.detailLabel}>Facture:</Text>
                  <Text style={newInvoiceStyles.detailValue}>N° {invoice.reference}</Text>
                </View>
                <View style={newInvoiceStyles.detailRow}>
                  <Text style={newInvoiceStyles.detailLabel}>N° de Sinistre:</Text>
                  <Text style={newInvoiceStyles.detailValue}>xxerty</Text>
                </View>
                <View style={newInvoiceStyles.detailRow}>
                  <Text style={newInvoiceStyles.detailLabel}>Date facturation:</Text>
                  <Text style={newInvoiceStyles.detailValue}>{invoice.date}</Text>
                </View>
                <View style={newInvoiceStyles.detailRow}>
                  <Text style={newInvoiceStyles.detailLabel}>Date d'échéance:</Text>
                  <Text style={newInvoiceStyles.detailValue}>{invoice.due_date || invoice.date}</Text>
                </View>
                <View style={newInvoiceStyles.detailRow}>
                  <Text style={newInvoiceStyles.detailLabel}>Véhicule:</Text>
                  <Text style={newInvoiceStyles.detailValue}>{invoice.vehicle.brand} {invoice.vehicle.model}</Text>
                </View>
                <View style={newInvoiceStyles.detailRow}>
                  <Text style={newInvoiceStyles.detailLabel}>Immatricule:</Text>
                  <Text style={newInvoiceStyles.detailValue}>{invoice.vehicle.license_plate}</Text>
                </View>
                <View style={newInvoiceStyles.detailRow}>
                  <Text style={newInvoiceStyles.detailLabel}>Kilométrage:</Text>
                  <Text style={newInvoiceStyles.detailValue}>{invoice.vehicle.mileage} Km</Text>
                </View>
              </View>

              {/* Section client */}
              <View style={newInvoiceStyles.clientSection}>
                <Text style={newInvoiceStyles.clientTitle}>Facture pour :</Text>
                <Text style={newInvoiceStyles.clientInfo}>Demo user</Text>
                <Text style={newInvoiceStyles.clientInfo}>PHONE : +33645666684</Text>
                <Text style={newInvoiceStyles.clientInfo}>EMAIL : demo@user.com</Text>
                <Text style={newInvoiceStyles.clientInfo}>ADRESSE : 11 rue grammy 13004</Text>
              </View>
            </View>
          </View>

          {/* Grande boîte bleue montant dû */}
          <View style={newInvoiceStyles.amountDueContainer}>
            <Text style={newInvoiceStyles.amountDueLabel}>Montant dû:</Text>
            <Text style={newInvoiceStyles.amountDueValue}>630,00€</Text>
          </View>

          {/* Tableau articles */}
          <View style={newInvoiceStyles.tableContainer}>
            <View style={newInvoiceStyles.tableHeader}>
              <Text style={[newInvoiceStyles.tableHeaderText, newInvoiceStyles.colArticle]}>Article</Text>
              <Text style={[newInvoiceStyles.tableHeaderText, newInvoiceStyles.colQuantity]}>Quantité</Text>
              <Text style={[newInvoiceStyles.tableHeaderText, newInvoiceStyles.colUnitPrice]}>Coût Unitaire</Text>
              <Text style={[newInvoiceStyles.tableHeaderText, newInvoiceStyles.colDiscount]}>Remise</Text>
              <Text style={[newInvoiceStyles.tableHeaderText, newInvoiceStyles.colTVA]}>TVA</Text>
              <Text style={[newInvoiceStyles.tableHeaderText, newInvoiceStyles.colTotal]}>Total HT</Text>
            </View>

            {/* Lignes du tableau */}
            <View style={newInvoiceStyles.tableRow}>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colArticle]}>T1</Text>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colQuantity]}>2</Text>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colUnitPrice]}>110,00€</Text>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colDiscount]}>0%</Text>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colTVA]}>20%</Text>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colTotal]}>220,00€</Text>
            </View>
            
            <View style={[newInvoiceStyles.tableRow, newInvoiceStyles.tableRowEven]}>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colArticle]}>T2</Text>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colQuantity]}>2</Text>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colUnitPrice]}>110,00€</Text>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colDiscount]}>0%</Text>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colTVA]}>20%</Text>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colTotal]}>220,00€</Text>
            </View>

            <View style={newInvoiceStyles.tableRow}>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colArticle]}>GRILLE DE PARE-CHOCS AV</Text>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colQuantity]}>1</Text>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colUnitPrice]}>95,00€</Text>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colDiscount]}>5%</Text>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colTVA]}>20%</Text>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colTotal]}>90,25€</Text>
            </View>

            <View style={[newInvoiceStyles.tableRow, newInvoiceStyles.tableRowEven]}>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colArticle]}>CONDENSEUR DE CLIMATISATION MOTRIO</Text>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colQuantity]}>5</Text>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colUnitPrice]}>0,00€</Text>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colDiscount]}>0%</Text>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colTVA]}>20%</Text>
              <Text style={[newInvoiceStyles.tableCell, newInvoiceStyles.colTotal]}>0,00€</Text>
            </View>
          </View>

          {/* Section totaux */}
          <View style={newInvoiceStyles.totalsContainer}>
            <View style={newInvoiceStyles.totalRow}>
              <Text style={newInvoiceStyles.totalLabel}>Sous-total</Text>
              <Text style={newInvoiceStyles.totalValue}>530,25€</Text>
            </View>
            <View style={newInvoiceStyles.totalRow}>
              <Text style={newInvoiceStyles.totalLabel}>TVA</Text>
              <Text style={newInvoiceStyles.totalValue}>106,05€</Text>
            </View>
            <View style={newInvoiceStyles.totalRow}>
              <Text style={newInvoiceStyles.totalLabel}>Remise</Text>
              <Text style={newInvoiceStyles.totalValue}>6,30€</Text>
            </View>
            <View style={[newInvoiceStyles.totalRow, newInvoiceStyles.totalRowFinal]}>
              <Text style={[newInvoiceStyles.totalLabel, { color: 'white', fontWeight: 'bold' }]}>TOTAL</Text>
              <Text style={[newInvoiceStyles.totalValue, { color: 'white', fontWeight: 'bold' }]}>630,00€</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={newInvoiceStyles.footer}>
            <Text>Les factures émises par ISTRES sont basées sur les informations disponibles au moment de leur établissement. Toute modification des conditions ou des prestations pourra entraîner un ajustement ultérieur.</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const mockInvoiceData = {
  reference: '2024/12/0006',
  date: '11/12/2024',
  due_date: '11/12/2024',
  vehicle: {
    model: "Silo Bonum",
    brand: "Silo Bonum",
    license_plate: 'AZ-ER-RTY',
    mileage: '500 Km'
  },
  company: {
    name: "Z5 ISTRES",
    address: "75 ROUTE DE LA CABANE NOIRE",
    zipCode: "13800",
    city: "ISTRES",
    phone: "+33644658858",
    email: "benedicte@gmail.com",
    siren: "902 090 675609",
    tva: "FR982 090 190 475"
  },
  client: {
    name: 'Demo user'
  },
  articles: [],
  amount: '630,00€'
};

const InvoiceViewer = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Facture PDF - NOUVEAU DESIGN</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-4">
              Cliquez sur le bouton ci-dessous pour télécharger la facture en PDF avec le nouveau design
            </p>
            
            <PDFDownloadLink
              document={<InvoicePDF invoice={mockInvoiceData} />}
              fileName="facture-nouveau-design.pdf"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {({ blob, url, loading, error }) =>
                loading ? 'Génération du PDF...' : 'Télécharger la facture PDF - NOUVEAU DESIGN'
              }
            </PDFDownloadLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewer;
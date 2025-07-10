
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  companyInfo: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  avoirDetails: {
    marginBottom: 20,
  },
  avoirTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  detailItem: {
    width: '50%',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 10,
  },
  clientInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    padding: 5,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  col1: { width: '20%' },
  col2: { width: '15%' },
  col3: { width: '15%' },
  col4: { width: '15%' },
  col5: { width: '15%' },
  col6: { width: '20%' },
  totals: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 5,
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  notes: {
    marginTop: 20,
    marginBottom: 20,
  },
  notesTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    fontSize: 8,
    textAlign: 'center',
    color: '#666',
  },
  poweredBy: {
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
    marginTop: 20,
  },
});

// Composant PDF Document
export const CreditPDF = ({credit}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>AVOIR</Text>
          <Text style={styles.companyInfo}>{credit.company.name}</Text>
          <Text style={styles.companyInfo}>ADRESSE : {credit.company.address} {credit.company.zipCode} {credit.company.city}</Text>
          <Text style={styles.companyInfo}>TEL : {credit.company.phone}</Text>
          <Text style={styles.companyInfo}>EMAIL : {credit.company.email}</Text>
          <Text style={styles.companyInfo}>SIREN : {credit.company.siren}</Text>
          <Text style={styles.companyInfo}>TVA : {credit.company.tva}</Text>
        </View>
      </View>

      {/* Détails de l'avoir */}
      <View style={styles.avoirDetails}>
        <Text style={styles.avoirTitle}>Details de l'avoir:</Text>
        
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Avoir:</Text>
            <Text style={styles.detailValue}>N° {credit.reference}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date de l'avoir:</Text>
            <Text style={styles.detailValue}>{credit.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Facture associée:</Text>
            <Text style={styles.detailValue}>N° {credit.invoice.reference}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Véhicule:</Text>
            <Text style={styles.detailValue}>{credit.vehicle.brand} {credit.vehicle.model}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Immatricule :</Text>
            <Text style={styles.detailValue}>{credit.vehicle.license_plate}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Kilométrage :</Text>
            <Text style={styles.detailValue}>{credit.vehicle.mileage} Km</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Statut de l'avoir :</Text>
            <Text style={styles.detailValue}>{credit.status}</Text>
          </View>
        </View>
      </View>

      {/* Informations client */}
      <View style={styles.clientInfo}>
        <Text style={styles.detailLabel}>Avoir pour :</Text>
        <Text style={styles.detailValue}>{credit.client.name}</Text>
        <Text style={styles.detailValue}>TEL : {credit.client.phone}</Text>
        <Text style={styles.detailValue}>EMAIL :{credit.client.email}</Text>
        <Text style={styles.detailValue}>ADRESSE : {credit.client.address} {credit.client.zipCode} {credit.client.city}</Text>
      </View>

      {/* Tableau des articles */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>Article</Text>
          <Text style={styles.col2}>Quantité</Text>
          <Text style={styles.col3}>Coût Unitaire</Text>
          <Text style={styles.col4}>Remise</Text>
          <Text style={styles.col5}>TVA</Text>
          <Text style={styles.col6}>Total HT</Text>
        </View>

        {credit.articles.map((article, index) => (
        <View style={styles.tableRow} key={index}>
          <Text style={styles.col1}>{article.description}</Text>
          <Text style={styles.col2}>{article.quantity}</Text>
          <Text style={styles.col3}>{article.unitCost}€</Text>
          <Text style={styles.col4}>{article.discount} %</Text>
          <Text style={styles.col5}>{article.vat} %</Text>
          <Text style={styles.col6}>{article.total} €</Text>
        </View>
        ))}
      </View>

      {/* Totaux */}
      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text>Sous-total</Text>
          <Text>{credit.amountHT}€</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>TVA</Text>
          <Text>{credit.amountVat} €</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalLabel}>{credit.amount} €</Text>
        </View>
      </View>

      {/* Notes */}
      <View style={styles.notes}>
        <Text style={styles.notesTitle}>Notes</Text>
        <Text>{credit.notes}</Text>
      </View>

      {/* Powered by */}
      <Text style={styles.poweredBy}></Text>

      {/* Footer */}
      <Text style={styles.footer}>
        {credit.company.name} - Siège social :{credit.company.address} {credit.company.zipCode} {credit.company.city} {credit.company.country} - RCS {credit.company.siren} - N° TVA intracommunautaire : {credit.company.tva} - Tel : {credit.company.phone} - Email : {credit.company.email}
      </Text>
    </Page>
  </Document>
);

// Composant principal avec bouton de téléchargement
const AvoirViewer = () => {
  const creditData = {
    reference: '1',
    invoice:{
      reference:"1"
    },
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
        description: 'mastic',
        quantity: '1',
        discount: '0',
        unitCost: '50,00',
        vat: '20',
        total: '60,00'
      }
    ],
   
    notes:"aaaaa",
    amountHT: '50,00',
    amountVat: '10,00',
    amount: '60,00',
  };
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Avoir PDF</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Document d'Avoir</h2>
          <p className="text-gray-600 mb-6">
            Cliquez sur le bouton ci-dessous pour télécharger le PDF de l'avoir.
          </p>
          
          <PDFDownloadLink
            document={<CreditPDF credit={creditData} />}
            fileName="avoir-001.pdf"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {({ blob, url, loading, error }) =>
              loading ? 'Génération du PDF...' : 'Télécharger le PDF'
            }
          </PDFDownloadLink>
          
          
        </div>
      </div>
    </div>
  );
};

export default AvoirViewer;
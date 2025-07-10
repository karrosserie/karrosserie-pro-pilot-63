import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 30,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  companyInfo: {
    fontSize: 12,
    marginBottom: 5,
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
    marginBottom: 5,
  },
  column: {
    flex: 1,
    marginRight: 10,
  },
  table: {
    marginVertical: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: 1,
    paddingBottom: 5,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 3,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  tableCellLeft: {
    flex: 1,
    textAlign: 'left',
    paddingHorizontal: 5,
  },
  tableCellRight: {
    flex: 1,
    textAlign: 'right',
    paddingHorizontal: 5,
  },
  total: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 10,
  },
  conditions: {
    fontSize: 8,
    marginTop: 20,
    lineHeight: 1.3,
  },
  conditionItem: {
    marginBottom: 8,
  },
  conditionTitle: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    borderTop: 1,
    paddingTop: 5,
  },
});

// Composant PDF Document
export const RepairOrderPDF = ({repairOrder}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>Ordre de réparation</Text>
        <Text style={styles.companyInfo}>{repairOrder.company.name}</Text>
        <Text style={styles.companyInfo}>ADRESSE : {repairOrder.company.address} {repairOrder.company.zipCode} {repairOrder.company.city}</Text>
        <Text style={styles.companyInfo}>TEL : {repairOrder.company.phone}</Text>
        <Text style={styles.companyInfo}>EMAIL : {repairOrder.company.email}</Text>
        <Text style={styles.companyInfo}>SIREN : {repairOrder.company.siret}</Text>
        <Text style={styles.companyInfo}>TVA : {repairOrder.company.tva}</Text>
      </View>

      {/* Détails de l'ordre de réparation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Détails de l'ordre de réparation :</Text>
        
        <View style={styles.row}>
          <View style={styles.column}>
            <Text>O.R: N° {repairOrder.reference}</Text>
            <Text>Véhicule: {repairOrder.vehicle.brand} {repairOrder.vehicle.model}</Text>
            <Text>Immatricule : {repairOrder.vehicle.license_plate}</Text>
          </View>
          <View style={styles.column}>
            <Text>Kilométrage : {repairOrder.vehicle.mileage} Km</Text>
            <Text style={styles.total}>Total: {repairOrder.amount} €</Text>
          </View>
        </View>
      </View>

      {/* Informations client */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ordre de réparation de</Text>
        <Text>{repairOrder.client.name}</Text>
        <Text>TEL : {repairOrder.client.phone}</Text>
        <Text>EMAIL : {repairOrder.client.email}</Text>
        <Text>ADRESSE : {repairOrder.client.address} {repairOrder.client.zipCode} {repairOrder.client.city}</Text>
      </View>

      {/* Délai prévisionnel */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DÉLAI PRÉVISIONNEL:</Text>
        <Text>Date de début des travaux : {repairOrder.start_date}</Text>
        <Text>Date de fin des travaux : {repairOrder.end_date}</Text>
      </View>

      {/* Tableau des articles */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableCellLeft}>Article</Text>
          <Text style={styles.tableCell}>Quantité</Text>
          <Text style={styles.tableCell}>Coût Unitaire</Text>
          <Text style={styles.tableCell}>Remise</Text>
          <Text style={styles.tableCell}>TVA</Text>
          <Text style={styles.tableCellRight}>Total HT</Text>
        </View>
          {repairOrder.articles.map((article, index) => (
        <View style={styles.tableRow} key={index}>
          <Text style={styles.tableCellLeft}>{article.description}</Text>
          <Text style={styles.tableCell}>{article.quantity}</Text>
          <Text style={styles.tableCell}>{article.unitCost} €</Text>
          <Text style={styles.tableCell}>{article.discount} %</Text>
          <Text style={styles.tableCell}>{article.vat} %</Text>
          <Text style={styles.tableCellRight}>{article.total} €</Text>
        </View>
        ))}
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <Text>{repairOrder.notes}</Text>
      </View>

      {/* Informations du véhicule */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>INFORMATIONS DU VÉHICULE</Text>
        <Text>État général : </Text>
        <Text>État de propreté : </Text>
        <Text>Niveau carburant : {repairOrder.vehicle.fuel_level}</Text>
      </View>

      {/* Assurance professionnelle */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ASSURANCE PROFESSIONNELLE</Text>
        <Text>L'entreprise a souscrit une assurance Responsabilité Civile Professionnelle auprès de : allianz</Text>
        <Text>Couvrant les dommages matériels et corporels pouvant survenir pendant les travaux.</Text>
      </View>

      {/* Pied de page */}
      <View style={styles.footer}>
        <Text>{repairOrder.company.name} - Siège social :{repairOrder.company.address} {repairOrder.company.zipCode} {repairOrder.company.city} {repairOrder.company.country} - RCS {repairOrder.company.siren} - N° TVA intracommunautaire : {repairOrder.company.tva} - Tel : {repairOrder.company.phone} - Email : {repairOrder.company.email}</Text>
      </View>
    </Page>

    {/* Page 2 - Conditions générales */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>CONDITIONS GÉNÉRALES</Text>
      </View>

      <View style={styles.conditions}>
        <View style={styles.conditionItem}>
          <Text style={styles.conditionTitle}>1. Application des conditions générales</Text>
          <Text>Le présent ordre de réparation est soumis aux conditions générales de service de l'entreprise, dont le client reconnaît avoir pris connaissance et les avoir acceptées.</Text>
        </View>

        <View style={styles.conditionItem}>
          <Text style={styles.conditionTitle}>2. Base légale</Text>
          <Text>Conformément à l'arrêté du 27 avril 1995 relatif à la vente et aux prestations de service dans le secteur de la réparation automobile, et aux articles R.311-1 et suivants du Code de la route.</Text>
        </View>

        <View style={styles.conditionItem}>
          <Text style={styles.conditionTitle}>3. Garantie légale et obligation de résultat</Text>
          <Text>Les travaux réalisés bénéficient de la garantie légale de conformité et de la garantie des vices cachés. L'atelier s'engage à une obligation de résultat pour les réparations effectuées.</Text>
        </View>

        <View style={styles.conditionItem}>
          <Text style={styles.conditionTitle}>4. Pièces remplacées et réserve de propriété</Text>
          <Text>Les pièces remplacées seront tenues à disposition du client pendant 48 heures et restent la propriété de l'atelier jusqu'au paiement intégral.</Text>
        </View>

        <View style={styles.conditionItem}>
          <Text style={styles.conditionTitle}>5. Expertise</Text>
          <Text>Les travaux ne débuteront qu'après accord de l'expert et/ou de la compagnie d'assurance.</Text>
        </View>

        <View style={styles.conditionItem}>
          <Text style={styles.conditionTitle}>6. Supplément de travaux</Text>
          <Text>Tout supplément de travaux nécessitera un accord préalable du client et un avenant signé si supérieur à 10% du devis initial.</Text>
        </View>

        <View style={styles.conditionItem}>
          <Text style={styles.conditionTitle}>7. Délais et responsabilité</Text>
          <Text>En cas de retard dû à des circonstances indépendantes de notre volonté, le délai sera révisé sans indemnité compensatoire.</Text>
        </View>

        <View style={styles.conditionItem}>
          <Text style={styles.conditionTitle}>8. Effets personnels et responsabilité</Text>
          <Text>L'entreprise décline toute responsabilité en cas de perte, vol ou détérioration d'objets personnels non mentionnés à la réception du véhicule.</Text>
        </View>

        <View style={styles.conditionItem}>
          <Text style={styles.conditionTitle}>9. Protection des données personnelles</Text>
          <Text>Conformément au RGPD, le client dispose d'un droit d'accès, de rectification et de suppression de ses données.</Text>
        </View>

        <View style={styles.conditionItem}>
          <Text style={styles.conditionTitle}>10. Droit de rétractation</Text>
          <Text>Le droit de rétractation de 14 jours ne s'applique pas aux prestations de réparation automobile.</Text>
        </View>

        <View style={styles.conditionItem}>
          <Text style={styles.conditionTitle}>11. Conditions de paiement et pénalités de retard</Text>
          <Text>Le paiement est exigible à la réception du véhicule. Tout retard entraînera des pénalités légales.</Text>
        </View>

        <View style={styles.conditionItem}>
          <Text style={styles.conditionTitle}>12. Médiation et règlement des litiges</Text>
          <Text>En cas de litige, le client peut recourir au service de médiation de la consommation ou saisir la justice compétente.</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>{repairOrder.company.name} - Siège social :{repairOrder.company.address} {repairOrder.company.zipCode} {repairOrder.company.city} {repairOrder.company.country} - RCS {repairOrder.company.siren} - N° TVA intracommunautaire : {repairOrder.company.tva} - Tel : {repairOrder.company.phone} - Email : {repairOrder.company.email}</Text>
      </View>
    </Page>

    {/* Page 3 - Références juridiques */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>RÉFÉRENCES JURIDIQUES</Text>
      </View>

      <View style={styles.conditions}>
        <Text>- Article L.111-1 et L.111-2 du Code de la consommation : obligation d'information précontractuelle</Text>
        <Text>- Article L.113-3 du Code de la consommation : affichage des prix</Text>
        <Text>- Article L.217-4 à L.217-14 du Code de la consommation : garantie légale de conformité</Text>
        <Text>- Articles 1641 à 1649 du Code civil : garantie des vices cachés</Text>
        <Text>- Article L.616-1 du Code de la consommation : médiation de la consommation</Text>
        <Text>- Article L.441-6 du Code de commerce : pénalités de retard</Text>
        <Text>- Article 2286 du Code civil : droit de rétention</Text>
        <Text>- Article L.123-33-3 du Code de commerce : résolution des litiges en ligne</Text>
        <Text>- Directive 2013/11/UE du 21 mai 2013 relative au règlement extrajudiciaire des litiges de consommation</Text>
        <Text>- Jurisprudence Cass. civ. 1ère, 8 mars 2012 : obligation d'information et de conseil du professionnel</Text>
        <Text>- Jurisprudence Cass. civ. 1ère, 15 mai 2015 : obligation de résultat pour les réparations effectuées</Text>
        
        <Text style={{ marginTop: 20, textAlign: 'center' }}>Powered by TCPDF (www.tcpdf.org)</Text>
      </View>

      <View style={styles.footer}>
        <Text>{repairOrder.company.name} - Siège social :{repairOrder.company.address} {repairOrder.company.zipCode} {repairOrder.company.city} {repairOrder.company.country} - RCS {repairOrder.company.siren} - N° TVA intracommunautaire : {repairOrder.company.tva} - Tel : {repairOrder.company.phone} - Email : {repairOrder.company.email}</Text>
      </View>
    </Page>
  </Document>
);

// Composant principal avec visualiseur PDF
const RepairOrderViewer = () => {
  const repairData = {
    reference: '1',
    date: '06/05/2025',
    start_date:"07/05/2025",
    end_date:"08/05/2025",
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
    notes:"aaaaa",
    amountHT: '1.500,00',
    amountVat: '300,00',
    amount: '1.800,00',
  };
  return (
    <div className="w-full h-screen">
      <PDFViewer width="100%" height="100%">
        <RepairOrderPDF repairOrder={repairData} />
      </PDFViewer>
    </div>
  );
};

export default RepairOrderViewer;
import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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
    marginBottom: 3,
  },
  label: {
    fontWeight: 'bold',
    width: 120,
  },
  value: {
    flex: 1,
  },
  contractTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  article: {
    marginBottom: 12,
  },
  articleTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subArticle: {
    marginLeft: 10,
    marginBottom: 5,
  },
  subArticleTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  paragraph: {
    marginBottom: 5,
    textAlign: 'justify',
  },
  listItem: {
    marginLeft: 15,
    marginBottom: 2,
  },
  signature: {
    marginTop: 20,
    textAlign: 'center',
  },
  signatureBox: {
    border: 1,
    borderColor: '#000',
    padding: 10,
    marginTop: 10,
    minHeight: 50,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
  },
});

// Composant PDF
export const VehiclefleetReservationPDF = ({fleetReservation}) => (
  <Document>
    {/* Page 1 - Attestation */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Attestation de prêt de véhicule</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>De :</Text>
        <Text>{fleetReservation.company.name}</Text>
        <Text>ADRESSE : {fleetReservation.company.address} {fleetReservation.company.zipCode} {fleetReservation.company.city}</Text>
        <Text>TEL : {fleetReservation.company.phone}</Text>
        <Text>EMAIL : {fleetReservation.company.email}</Text>
        <Text>SIREN : {fleetReservation.company.siren}</Text>
        <Text>TVA : {fleetReservation.company.tva}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Au Client:</Text>
        <Text>{fleetReservation.client.name}</Text>
        <Text>TEL : {fleetReservation.client.phone}</Text>
        <Text>EMAIL : {fleetReservation.client.email}</Text>
        <Text>ADRESSE : {fleetReservation.client.address} {fleetReservation.client.zipCode} {fleetReservation.client.city}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Designation du vehicule d'emprunt:</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Marque :</Text>
          <Text style={styles.value}>{fleetReservation.vehicle.brand}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Modele :</Text>
          <Text style={styles.value}>{fleetReservation.vehicle.model}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>N° Immatriculation :</Text>
          <Text style={styles.value}>{fleetReservation.vehicle.license_plate}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Départ :</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Le :</Text>
          <Text style={styles.value}>{fleetReservation.start_date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kilométrage :</Text>
          <Text style={styles.value}>{fleetReservation.start_mileage } Km</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Carburant :</Text>
          <Text style={styles.value}>{fleetReservation.fuel_level_start} %</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Retour :</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Le :</Text>
          <Text style={styles.value}>{fleetReservation.expected_return_date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kilométrage :</Text>
          <Text style={styles.value}>{fleetReservation.end_mileage} Km</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Carburant :</Text>
          <Text style={styles.value}>{fleetReservation.fuel_level_end} %</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Documents requis :</Text>
        <Text>☐ Carte grise du véhicule</Text>
        <Text>☐ Permis de conduire</Text>
        <Text>☐ Carte verte assurance</Text>
        <Text>☐ Photos du véhicule</Text>
      </View>
    </Page>

    {/* Page 2 - Contrat détaillé */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.contractTitle}>
        CONTRAT DE PRÊT DE VÉHICULE DE COURTOISIE
      </Text>
      <Text style={styles.contractTitle}>
        (Version amendée, complétée et renforcée)
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ENTRE LES SOUSSIGNÉS :</Text>
        
        <Text style={styles.subArticleTitle}>Le Prêteur :</Text>
        <Text>Nom du garage : {fleetReservation.company.name}</Text>
        <Text>Adresse : {fleetReservation.company.address} {fleetReservation.company.zipCode} {fleetReservation.company.city}</Text>
        <Text>Représenté par : {fleetReservation.company.name}</Text>
        
        <Text style={styles.subArticleTitle}>L'Emprunteur :</Text>
        <Text>Raison sociale : </Text>
        <Text>Adresse :  {fleetReservation.client.address} {fleetReservation.client.zipCode} {fleetReservation.client.city}</Text>
        <Text>Nom et prénom : {fleetReservation.client.name}</Text>
        <Text>Téléphone : {fleetReservation.client.phone}</Text>
      </View>

      <View style={styles.article}>
        <Text style={styles.articleTitle}>PREAMBULE</Text>
        <Text style={styles.paragraph}>
          Le présent contrat est conclu à titre exceptionnel et gracieux, dans le seul but de faciliter la mobilité temporaire de l'Emprunteur pendant l'immobilisation de son véhicule. Cette mise à disposition n'entraîne aucune relation commerciale de location et ne saurait créer une quelconque obligation de résultat à la charge du Prêteur quant aux performances, au confort ou à l'adaptation du véhicule aux besoins spécifiques de l'Emprunteur.
        </Text>
      </View>

      <View style={styles.article}>
        <Text style={styles.articleTitle}>1. OBJET DU CONTRAT</Text>
        <Text style={styles.paragraph}>
          Le garage met gratuitement à disposition de l'Emprunteur le véhicule suivant :
        </Text>
        <Text>Marque : {fleetReservation.vehicle.brand}</Text>
        <Text>Modèle : {fleetReservation.vehicle.model}</Text>
        <Text>N° Immatriculation : {fleetReservation.vehicle.license_plate}</Text>
        <Text>Carburant : {fleetReservation.fuel_level_start } %</Text>
        <Text>Kilométrage : {fleetReservation.start_mileage } Km</Text>
      </View>

      <View style={styles.article}>
        <Text style={styles.articleTitle}>2. DURÉE DU PRÊT</Text>
        <Text style={styles.paragraph}>
          Période initiale : du {fleetReservation.start_date} au {fleetReservation.expected_return_date}
        </Text>
        <Text style={styles.paragraph}>
          Restitution anticipée obligatoire. L'emprunteur s'engage expressément à restituer le véhicule sans délai dès que son véhicule personnel est prêt, même si cette disponibilité intervient avant la date de fin prévue initialement.
        </Text>
        
        <Text style={styles.subArticleTitle}>2.3. Prolongation</Text>
        <Text style={styles.paragraph}>
          Toute demande de prolongation doit être formulée par écrit 24 heures avant l'échéance et reste soumise à l'acceptation discrétionnaire du Prêteur qui se réserve le droit de refuser sans avoir à justifier sa décision.
        </Text>
        
        <Text style={styles.subArticleTitle}>2.4. Pénalités de retard</Text>
        <Text style={styles.paragraph}>
          Tout retard non justifié et préalablement accepté par écrit par le Prêteur entraînera une pénalité forfaitaire de 150€ par jour de retard entamé, sans préjudice de toute action en justice que le Prêteur pourrait intenter pour obtenir la restitution du véhicule.
        </Text>
      </View>
    </Page>

    {/* Page 3 - Utilisation du véhicule */}
    <Page size="A4" style={styles.page}>
      <View style={styles.article}>
        <Text style={styles.articleTitle}>3. UTILISATION DU VÉHICULE</Text>
        
        <Text style={styles.subArticleTitle}>3.1. Conducteurs autorisés</Text>
        <Text style={styles.paragraph}>L'utilisation du véhicule est strictement limitée à :</Text>
        <Text style={styles.listItem}>• L'Emprunteur nommément désigné dans ce contrat</Text>
        <Text style={styles.listItem}>• Les employés de l'Emprunteur expressément listés en annexe, titulaires d'un permis de conduire valide depuis plus de 3 ans</Text>
        
        <Text style={styles.paragraph}>Tout prêt, cession ou mise à disposition du véhicule à toute personne non expressément autorisée entraînera :</Text>
        <Text style={styles.listItem}>1. La résiliation immédiate du contrat</Text>
        <Text style={styles.listItem}>2. L'exigibilité d'une indemnité forfaitaire de 1000€</Text>
        <Text style={styles.listItem}>3. La responsabilité illimitée de l'Emprunteur pour tout dommage</Text>

        <Text style={styles.subArticleTitle}>3.2. Cadre d'utilisation autorisé</Text>
        <Text style={styles.paragraph}>L'Emprunteur garantit que :</Text>
        <Text style={styles.listItem}>• Le véhicule est utilisé exclusivement dans le cadre de son activité professionnelle déclarée</Text>
        <Text style={styles.listItem}>• L'usage est strictement limité au département des Bouches-du-Rhône (13) et aux départements limitrophes</Text>
        <Text style={styles.listItem}>• Le kilométrage journalier n'excède pas 100 km</Text>
        
        <Text style={styles.paragraph}>Le véhicule n'est jamais utilisé :</Text>
        <Text style={styles.listItem}>• Pour le transport rémunéré de personnes ou de marchandises</Text>
        <Text style={styles.listItem}>• Pour la traction ou le remorquage</Text>
        <Text style={styles.listItem}>• Pour l'apprentissage de la conduite</Text>
        <Text style={styles.listItem}>• Pour des compétitions ou essais</Text>
        <Text style={styles.listItem}>• Sur des chemins non carrossables</Text>
        <Text style={styles.listItem}>• À toute fin illicite</Text>

        <Text style={styles.subArticleTitle}>3.3. Sécurité routière et obligations légales</Text>
        <Text style={styles.paragraph}>L'Emprunteur s'engage formellement à :</Text>
        <Text style={styles.listItem}>• Respecter scrupuleusement le Code de la route</Text>
        <Text style={styles.listItem}>• Veiller à ce que tout occupant soit attaché</Text>
        <Text style={styles.listItem}>• Ne jamais conduire sous l'emprise d'alcool ou de stupéfiants</Text>
        <Text style={styles.listItem}>• Ne jamais utiliser un téléphone tenu en main</Text>
        <Text style={styles.listItem}>• Signaler immédiatement tout dysfonctionnement</Text>
      </View>

      <View style={styles.article}>
        <Text style={styles.subArticleTitle}>3.4. Sécurisation du matériel transporté</Text>
        
        <Text style={styles.subArticleTitle}>3.4.1. Séparation physique et compartimentage</Text>
        <Text style={styles.paragraph}>
          Le chargement de matériel professionnel doit être rigoureusement séparé de l'espace réservé aux passagers par une cloison rigide ou un filet de séparation homologué.
        </Text>
        
        <Text style={styles.subArticleTitle}>3.4.2. Fixation et arrimage du chargement</Text>
        <Text style={styles.paragraph}>
          Les objets transportés doivent être arrimés conformément à l'article R. 312-17 du Code de la route.
        </Text>
        
        <Text style={styles.subArticleTitle}>3.4.3. Restrictions de chargement</Text>
        <Text style={styles.paragraph}>Il est formellement interdit de transporter :</Text>
        <Text style={styles.listItem}>• Toutes matières dangereuses classifiées par l'ADR</Text>
        <Text style={styles.listItem}>• Des produits liquides de nettoyage industriel</Text>
        <Text style={styles.listItem}>• Des objets dépassant les dimensions du véhicule</Text>
        <Text style={styles.listItem}>• Des charges supérieures à 50% de la charge utile maximale</Text>
      </View>
    </Page>

    {/* Page 4 - Assurance et responsabilité */}
    <Page size="A4" style={styles.page}>
      <View style={styles.article}>
        <Text style={styles.articleTitle}>4. ASSURANCE ET RESPONSABILITÉ</Text>
        
        <Text style={styles.subArticleTitle}>4.1. Couverture d'assurance</Text>
        <Text style={styles.paragraph}>
          Le véhicule est couvert par l'assurance souscrite par le Prêteur sous le numéro de police 51105175W0001 auprès de GROUPAMA, conformément aux dispositions de l'article L. 121-1 du Code des assurances.
        </Text>
        
        <Text style={styles.subArticleTitle}>4.2. Franchise et contribution de l'Emprunteur</Text>
        <Text style={styles.paragraph}>
          L'Emprunteur accepte expressément qu'en cas de sinistre, il contribuera systématiquement à hauteur de :
        </Text>
        <Text style={styles.listItem}>• 1000€ minimum pour tout dommage matériel</Text>
        <Text style={styles.listItem}>• 2000€ minimum en cas de vol ou tentative de vol</Text>
        
        <Text style={styles.subArticleTitle}>4.3. Exclusions de responsabilité du Prêteur</Text>
        <Text style={styles.paragraph}>
          Le Prêteur décline toute responsabilité dans les cas suivants :
        </Text>
        <Text style={styles.listItem}>• Utilisation non conforme du véhicule</Text>
        <Text style={styles.listItem}>• Dommages intentionnels</Text>
        <Text style={styles.listItem}>• Faux témoignage</Text>
        <Text style={styles.listItem}>• Absence de permis de conduire valide</Text>
        <Text style={styles.listItem}>• Non-respect des conditions contractuelles</Text>
        <Text style={styles.listItem}>• Conduite sous l'emprise d'alcool ou de stupéfiants</Text>
        <Text style={styles.listItem}>• Vol ou tentative de vol</Text>
      </View>

      <View style={styles.article}>
        <Text style={styles.articleTitle}>5. RESTITUTION DU VÉHICULE</Text>
        
        <Text style={styles.subArticleTitle}>5.1. État de restitution</Text>
        <Text style={styles.paragraph}>L'Emprunteur s'engage à restituer le véhicule :</Text>
        <Text style={styles.listItem}>• Dans un état rigoureusement identique à la prise en charge</Text>
        <Text style={styles.listItem}>• Parfaitement propre à l'intérieur comme à l'extérieur</Text>
        <Text style={styles.listItem}>• Avec un réservoir de carburant intégralement rempli</Text>
        <Text style={styles.listItem}>• Avec tous les documents, clés, accessoires fournis</Text>
        <Text style={styles.listItem}>• Sans odeur résiduelle</Text>
        <Text style={styles.listItem}>• Sans aucun objet personnel</Text>
        <Text style={styles.paragraph}>
          Tout kilométrage excédant la prévision sera facturé 0,25 € du Km.
        </Text>
        
        <Text style={styles.subArticleTitle}>5.2. Procédure de restitution</Text>
        <Text style={styles.paragraph}>La restitution s'effectuera :</Text>
        <Text style={styles.listItem}>• Exclusivement pendant les heures d'ouverture</Text>
        <Text style={styles.listItem}>• En présence d'un représentant habilité du Prêteur</Text>
        <Text style={styles.listItem}>• Après inspection contradictoire détaillée</Text>
        <Text style={styles.listItem}>• Avec signature d'un procès-verbal</Text>
        
        <Text style={styles.subArticleTitle}>5.3. Frais additionnels de remise en état</Text>
        <Text style={styles.paragraph}>Seront facturés à l'Emprunteur :</Text>
        <Text style={styles.listItem}>• Nettoyage intérieur complet : 150€</Text>
        <Text style={styles.listItem}>• Nettoyage extérieur : 50€</Text>
        <Text style={styles.listItem}>• Désodorisation tabac : 200€</Text>
        <Text style={styles.listItem}>• Remplacement documents : 150€ par document</Text>
      </View>
    </Page>

    {/* Page 5 - Clauses finales */}
    <Page size="A4" style={styles.page}>
      <View style={styles.article}>
        <Text style={styles.articleTitle}>6. CLAUSES PÉNALES ET RÉSOLUTION</Text>
        
        <Text style={styles.subArticleTitle}>6.1. Manquements aux obligations</Text>
        <Text style={styles.paragraph}>Toute violation des clauses entraînera :</Text>
        <Text style={styles.listItem}>• La résolution immédiate du contrat</Text>
        <Text style={styles.listItem}>• L'obligation de restituer immédiatement le véhicule</Text>
        <Text style={styles.listItem}>• Le paiement d'une indemnité forfaitaire de 1000€</Text>
        <Text style={styles.listItem}>• Le remboursement intégral des frais de récupération</Text>
        
        <Text style={styles.subArticleTitle}>6.2. Recours contre les tiers</Text>
        <Text style={styles.paragraph}>
          En cas de dommage causé par un tiers identifié, l'Emprunteur s'oblige à coopérer pleinement avec le Prêteur et son assureur.
        </Text>
        
        <Text style={styles.subArticleTitle}>6.3. Attribution de juridiction</Text>
        <Text style={styles.paragraph}>
          En cas de litige, le Tribunal de Commerce de Marseille sera seul compétent.
        </Text>
      </View>

      <View style={styles.article}>
        <Text style={styles.articleTitle}>7. DÉPÔT DE GARANTIE</Text>
        <Text style={styles.paragraph}>
          Un dépôt de garantie de 1500€ sera versé par l'Emprunteur au moment de la prise en charge du véhicule.
        </Text>
        <Text style={styles.paragraph}>
          Ce dépôt pourra être encaissé immédiatement en cas de dommage, retard, infraction aux conditions ou frais non remboursés.
        </Text>
      </View>

      <View style={styles.article}>
        <Text style={styles.articleTitle}>8. SIGNATURES</Text>
        <Text style={styles.paragraph}>
          L'Emprunteur reconnaît expressément avoir lu l'intégralité du présent contrat, en avoir compris toutes les clauses et les accepter sans réserve.
        </Text>
        <Text style={styles.paragraph}>
          Il reconnaît en particulier l'étendue de sa responsabilité et la limitation de celle du Prêteur dans les cas énumérés à l'article 4.
        </Text>
        
        <Text style={styles.paragraph}>Références légales intégrées :</Text>
        <Text style={styles.listItem}>• Code des assurances : Art. L. 121-1, L. 124-1, L. 124-3</Text>
        <Text style={styles.listItem}>• Code de la route : Art. R. 412-1, R. 312-17, R. 413-17, R. 313-20, R. 317-25</Text>
        <Text style={styles.listItem}>• Code civil : Art. 1242, 1226, 1231-1</Text>
        <Text style={styles.listItem}>• Code du travail : Art. L. 3121-1</Text>
        <Text style={styles.listItem}>• Jurisprudence : Cass. crim., 10 juillet 2012, n° 11-17.898 ; Cass. crim., 5 janvier 2016, n° 15-81.856</Text>
      </View>

      <View style={styles.signature}>
        <Text style={styles.sectionTitle}>Signature de l'assuré</Text>
        <Text>{fleetReservation.signature.name}</Text>
        <Text>Signé le{fleetReservation.signature.date}</Text>
        <Text>À la latitude,longitude :{fleetReservation.signature.geoloc}</Text>
        <View style={styles.signatureBox}>
          <Text>Signature</Text>
        </View>
      </View>

      <Text style={styles.footer}>
       
      </Text>
    </Page>
  </Document>
);

// Composant principal avec bouton de téléchargement
const VehiclefleetReservationViewer = () => {
  const fleetReservationData = {
    reference: '1',
    start_date : '06/05/2025',
    expected_return_date :"06/06/2025",
    start_mileage:"1000", 
    end_mileage:"1100",
    fuel_level_start :"50",
    fuel_level_end :"40",
    vehicle_images :[{url:""}],
    vehicle:{
      model:"I X1",
      brand:"BMW",
      license_plate : 'P837',
      mileage: '10000',
      registration_front_url :"",
      registration_back_url :"",
      insurance_card_url :""

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
      driver_license_front_url :"",
      driver_license_back_url :""
    },
     signature : {
      name:"Geoffrey Moya",
      image:"",
      date:"",
      geoloc:"",
      city:""
    }
     
  
  };
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Générateur d'Attestation de Prêt de Véhicule
      </h1>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Document PDF</h2>
        <p className="text-gray-700 mb-4">
          Cliquez sur le bouton ci-dessous pour télécharger l'attestation de prêt de véhicule au format PDF.
        </p>
        
        <PDFDownloadLink 
          document={<VehiclefleetReservationPDF fleetReservation={fleetReservationData} />} 
          fileName="attestation_pret_vehicule.pdf"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {({ blob, url, loading, error }) =>
            loading ? 'Génération du PDF...' : 'Télécharger le PDF'
          }
        </PDFDownloadLink>
      </div>

    </div>
  );
};

export default VehiclefleetReservationViewer;
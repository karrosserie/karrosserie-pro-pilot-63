

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  PDFDownloadLink,
  Image
} from '@react-pdf/renderer';

// Styles PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: 'Helvetica'
  },
  section: {
    marginBottom: 10
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  block: {
    marginVertical: 6
  },
  label: {
    fontWeight: 'bold'
  },
  signature: {
    marginTop: 20,
    marginBottom: 20
  },
  frame: {
    border: '1pt solid black',
    padding: 6,
    marginBottom: 10
  },
  smallText: {
    fontSize: 9,
    lineHeight: 1.3
  },
  spacing: {
    marginTop: 6,
    marginBottom: 6
  }
});

// Composant principal
export const ExonerationPDF = ({exoneration}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>FORMULAIRE DE REQUÊTE EN EXONÉRATION</Text>
      <Text style={styles.smallText}> (art. 529-10 et R. 49-14 du code de procédure pénale)</Text>

      <View style={styles.section}>
        <Text style={styles.block}>
          Vous venez de recevoir un avis de contravention au code de la route concernant le véhicule dont vous êtes le titulaire du certificat
          d'immatriculation. Si vous contestez cette contravention, vous devez impérativement utiliser le présent formulaire, en remplissant l'un des trois
          cadres suivants et en joignant les documents demandés.
        </Text>
        <Text style={styles.block}>
          Ce formulaire doit alors être adressé, avec l'avis de contravention, PAR LETTRE RECOMMANDÉE AVEC DEMANDE D'AVIS DE RÉCEPTION, au service
          mentionné ci-contre.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Je soussigné {exoneration.company.name}</Text>
        <Text style={styles.label}>
          Titulaire du certificat d’immatriculation du véhicule de marque {exoneration.vehicle.brand} {exoneration.vehicle.model} immatriculé {exoneration.vehicle.license_plate}
        </Text>
        <Text>
          Conteste la contravention qui vient de m’être adressée pour le motif suivant :
        </Text>
        <Text style={styles.signature}>À {exoneration.signature.geoloc} le {exoneration.signature.date}</Text>
        <Text>Signature : {exoneration.signature.image}</Text>
      </View>

      <Text style={styles.label}>1 – Mon véhicule avait été volé ou détruit avant que la contravention ne soit constatée.</Text>
      <Text style={styles.smallText}>
        Je joins à ma requête le récépissé de dépôt de plainte ou la déclaration de destruction du véhicule.
      </Text>

      <Text style={[styles.label, styles.spacing]}>
        2 – J'avais prêté (ou loué) mon véhicule à la personne suivante :
      </Text>
      <Text>Nom : {exoneration.client.name}  Prénom(s) : …………………  Sexe : M / F</Text>
      <Text>Épouse : …………………  Date de naissance :  {exoneration.date_of_birth }  Lieu :  {exoneration.place_of_birth }</Text>
      <Text>Demeurant : {exoneration.client.address} {exoneration.client.zipCode} {exoneration.client.city}</Text>
      <Text>N° de permis : {exoneration.license_number  }</Text>

      <Text style={styles.smallText}>
        Toute déclaration inexacte est punie d'une amende de 1 500 € (art. R.49-19 du CPP) et peut entraîner des poursuites pénales.
      </Text>

      <Text style={[styles.label, styles.spacing]}>
        3 – Je conteste pour un autre motif (à préciser ci-dessous ou au dos).
      </Text>
      <Text style={styles.smallText}>
        Dans ce cas, vous devez obligatoirement vous acquitter d’une consignation de 135 € via un timbre-amende.
      </Text>

      <View style={styles.frame}>
        <Text style={styles.label}>MOTIF DE LA REQUÊTE (à compléter pour le cas 3) :</Text>
        <Text style={styles.spacing}>………………………………………………………………………………………………………………</Text>
        <Text>………………………………………………………………………………………………………………</Text>
      </View>

      <Text style={[styles.label, styles.spacing]}>INFORMATIONS COMPLÉMENTAIRES :</Text>
      <Text style={styles.smallText}>
        Votre requête sera examinée par l’officier du ministère public. Si elle est recevable, la contravention pourra être classée ou vous serez convoqué
        devant le juge. En cas de classement, vous serez informé(e) et pourrez demander le remboursement de la consignation.
      </Text>
      <Text style={styles.smallText}>
        En cas de condamnation, une amende majorée, un retrait de points ou d’autres peines peuvent être prononcés.
      </Text>

      <View style={styles.spacing}>
        <Text style={styles.label}>Barème des sanctions :</Text>
        <Text style={styles.smallText}>- <Text>Dépassement &lt; 20 km/h : 135 €, 1 pt</Text></Text>
        <Text style={styles.smallText}>- <Text>20–30 km/h : 135 €, 2 pts</Text></Text>
        <Text style={styles.smallText}>- <Text>30–40 km/h : 135 €, 3 pts</Text></Text>
        <Text style={styles.smallText}>- <Text>40–50 km/h : 135 €, 4 pts, suspension possible</Text></Text>
        <Text style={styles.smallText}>- <Text>Non-respect des arrêts, distances, voies réservées : 135 €, jusqu’à 3 pts</Text></Text>
      </View>
    </Page>
    
<Page>
  <View>
      <Image src={exoneration.driver_license_front_url }/>
      <Image src={exoneration.driver_license_back_url }/>
  </View>
</Page>

<Page>
  <Image src={exoneration.pv_image}/>
</Page>


  </Document>
);


const ExonerationViewer = () => {
   const ExonerationData = {
    reference: '1',
    pv_image:"",
    driver_license_front_url:'',
    driver_license_back_url:'',
    date_of_birth:"",
    place_of_birth:"",
    license_number:"",
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
      geoloc:""
    }
     
  
  };
  return (<div>
    <PDFDownloadLink document={<ExonerationPDF exoneration={ExonerationData}/>} fileName="requete-exoneration.pdf">
  {({ loading }) => (loading ? 'Chargement...' : 'Télécharger le PDF')}
</PDFDownloadLink>
</div>)
}

export default ExonerationViewer;

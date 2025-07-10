// AttestationRestitution.jsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Définir les styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    marginBottom: 5,
  },
  signature: {
    marginTop: 20,
  },
});

// Définir le document PDF
export const FleetReservationReturnPDF = ({fleetReservationReturn}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Attestation de restitution</Text>

      <View style={styles.section}>
        <Text style={styles.text}>Je soussigné : {fleetReservationReturn.client.name},</Text>
        <Text style={styles.text}>reconnais avoir restitué ce jour,{fleetReservationReturn.return_date} </Text>
        <Text style={styles.text}>le véhicule de prêt {fleetReservationReturn.vehicle.brand}, {fleetReservationReturn.vehicle.model} , {fleetReservationReturn.vehicle.license_plate}</Text>
        <Text style={styles.text}>à l'entreprise : {fleetReservationReturn.company.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>
          J'atteste que le véhicule a été rendu dans l'état décrit dans ce rapport d'état
        </Text>
        <Text style={styles.text}>et confirme avoir récupéré mon véhicule personnel</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>État du véhicule :{fleetReservationReturn.status}</Text>
        <Text style={styles.text}>Carburant : {fleetReservationReturn.fuel_level_return} %</Text>
        <Text style={styles.text}>Kilométrage : {fleetReservationReturn.return_mileage } Km</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>Photos du véhicule</Text>
        {fleetReservationReturn.vehicle_images }
      </View>

      <View style={styles.signature}>
        <Text style={styles.text}>Signature du client</Text>
        <Text style={styles.text}>{fleetReservationReturn.signature.name} </Text>
        <Text style={styles.text}>Signé le {fleetReservationReturn.signature.date}</Text>
        <Text style={styles.text}>À la latitude,longitude : {fleetReservationReturn.signature.geoloc}</Text>
        {fleetReservationReturn.signature.image}
      </View>

      
    </Page>
  </Document>
);





const VehicleLoanReturnViewer = () => { 

  const fleetReservationData = {
    reference: '1',
    return_date :"06/06/2025",
    return_mileage:"1000", 
    fuel_level_return :"50",
    status:"completed",
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
  <div>
    <h1>Télécharger l'attestation</h1>
    <PDFDownloadLink
      document={<FleetReservationReturnPDF fleetReservationReturn={fleetReservationData}/>}
      fileName="attestation_restitution.pdf"
    >
      {({ loading }) =>
        loading ? 'Création du PDF...' : 'Télécharger le PDF'
      }
    </PDFDownloadLink>
  </div>
)}

export default VehicleLoanReturnViewer;




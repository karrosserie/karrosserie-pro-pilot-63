import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { formatDate } from '@/utils/date-formatter';
import { getDepartmentFromZipCode } from '@/utils/geolocation';

interface ReturnAttestationPDFProps {
  returnData: any;
  loanData: any;
  companyData: any;
  userPosition: string;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    lineHeight: 1.5,
    flexDirection: 'column',
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textDecoration: 'underline',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  column: {
    flexDirection: 'column',
    flexGrow: 1,
    marginRight: 20,
  },
  columnLeft: {
    flexDirection: 'column',
    width: '45%',
    marginRight: '10%',
  },
  columnRight: {
    flexDirection: 'column',
    width: '45%',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 11,
    marginBottom: 5,
  },
  text: {
    fontSize: 10,
    marginBottom: 3,
  },
  textBold: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  border: {
    border: '1 solid black',
    padding: 10,
    marginBottom: 10,
  },
  vehicleInfo: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginBottom: 10,
  },
  attestationText: {
    fontSize: 10,
    lineHeight: 1.6,
    textAlign: 'justify',
    marginBottom: 15,
  },
  signatureSection: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '40%',
    height: 80,
    border: '1 solid black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signatureLabel: {
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 10,
  },
  signatureLocation: {
    fontSize: 8,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  documentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  documentItem: {
    width: '48%',
    marginBottom: 10,
    marginRight: '2%',
  },
  documentLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  documentImage: {
    width: '100%',
    maxHeight: 150,
    objectFit: 'contain',
    border: '1 solid #ccc',
  },
  damagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  damageItem: {
    width: '23%',
    marginBottom: 10,
    marginRight: '2%',
    fontSize: 8,
    textAlign: 'center',
    border: '1 solid #ddd',
    padding: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 60,
    right: 60,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
  },
});

const ReturnAttestationPDF = ({ returnData, loanData, companyData, userPosition }: ReturnAttestationPDFProps) => {
  const returnDate = returnData?.return_date ? formatDate(returnData.return_date) : formatDate(new Date().toISOString());
  const loanStartDate = loanData?.start_date ? formatDate(loanData.start_date) : 'N/A';

  const getVehicleInfo = () => {
    const vehicle = loanData?.fleet_vehicles;
    if (!vehicle) return 'Véhicule non spécifié';
    
    const brand = vehicle.car_brands?.name || 'N/A';
    const model = vehicle.car_models?.name || 'N/A';
    return `${brand} ${model}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Titre principal */}
        <Text style={styles.mainTitle}>
          ATTESTATION DE RETOUR DE VÉHICULE DE COURTOISIE
        </Text>

        {/* Informations de l'entreprise et du client */}
        <View style={styles.row}>
          <View style={styles.columnLeft}>
            <Text style={styles.label}>DE :</Text>
            <View style={styles.border}>
              <Text style={styles.textBold}>{companyData?.name || 'Entreprise'}</Text>
              <Text style={styles.text}>{companyData?.address || 'Adresse non spécifiée'}</Text>
              <Text style={styles.text}>{companyData?.zipcode} {companyData?.city}</Text>
              <Text style={styles.text}>Tél : {companyData?.phone || 'N/A'}</Text>
              <Text style={styles.text}>Email : {companyData?.email || 'N/A'}</Text>
              <Text style={styles.text}>SIRET : {companyData?.siren || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.columnRight}>
            <Text style={styles.label}>DU CLIENT :</Text>
            <View style={styles.border}>
              <Text style={styles.textBold}>
                {loanData?.clients?.first_name} {loanData?.clients?.last_name}
              </Text>
              <Text style={styles.text}>{loanData?.clients?.address || 'Adresse non spécifiée'}</Text>
              <Text style={styles.text}>
                {loanData?.clients?.zip_code} {loanData?.clients?.city}
              </Text>
              <Text style={styles.text}>Tél : {loanData?.clients?.phone || 'N/A'}</Text>
              {loanData?.clients?.email && (
                <Text style={styles.text}>Email : {loanData.clients.email}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Informations sur le véhicule */}
        <Text style={styles.sectionTitle}>DÉSIGNATION DU VÉHICULE RETOURNÉ</Text>
        <View style={styles.vehicleInfo}>
          <Text style={styles.text}>
            <Text style={styles.textBold}>Marque et Modèle :</Text> {getVehicleInfo()}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.textBold}>N° d'immatriculation :</Text> {loanData?.fleet_vehicles?.license_plate || 'N/A'}
          </Text>
        </View>

        {/* Informations de prêt */}
        <View style={styles.row}>
          <View style={styles.columnLeft}>
            <Text style={styles.label}>DÉPART :</Text>
            <Text style={styles.text}>Le : {loanStartDate}</Text>
            <Text style={styles.text}>Kilométrage : {loanData?.start_mileage || 0} Km</Text>
            <Text style={styles.text}>Niveau de carburant : {loanData?.fuel_level_start || 0}%</Text>
          </View>

          <View style={styles.columnRight}>
            <Text style={styles.label}>RETOUR :</Text>
            <Text style={styles.text}>Le : {returnDate}</Text>
            <Text style={styles.text}>Kilométrage : {returnData?.return_mileage || 0} Km</Text>
            <Text style={styles.text}>Niveau de carburant : {returnData?.fuel_level_end || 0}%</Text>
          </View>
        </View>

        {/* État du véhicule au retour */}
        {returnData?.damages && returnData.damages.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>ÉTAT DU VÉHICULE AU RETOUR</Text>
            <View style={styles.damagesGrid}>
              {returnData.damages.map((damage: any, index: number) => (
                <View key={index} style={styles.damageItem}>
                  <Text>{damage.name}</Text>
                  <Text style={styles.textBold}>{damage.type}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Photos du véhicule au retour */}
        {returnData?.vehicle_images && returnData.vehicle_images.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>PHOTOS DU VÉHICULE AU RETOUR</Text>
            <View style={styles.documentsGrid}>
              {returnData.vehicle_images.slice(0, 4).map((imageUrl: string, index: number) => (
                <View key={index} style={styles.documentItem}>
                  <Text style={styles.documentLabel}>Photo {index + 1}</Text>
                  <Image 
                    src={imageUrl} 
                    style={styles.documentImage}
                  />
                </View>
              ))}
            </View>
          </>
        )}

        {/* Attestation */}
        <Text style={styles.sectionTitle}>ATTESTATION</Text>
        <Text style={styles.attestationText}>
          Je soussigné(e), {loanData?.clients?.first_name} {loanData?.clients?.last_name}, 
          certifie par la présente avoir restitué le véhicule de courtoisie décrit ci-dessus 
          le {returnDate} dans l'état décrit dans ce formulaire.
        </Text>
        
        <Text style={styles.attestationText}>
          Je reconnais que ma signature apposée électroniquement sur la présente tablette 
          vaut engagement ferme et personnel. Je confirme que cette signature constitue 
          l'expression de mon consentement libre et éclairé, et engage ma pleine responsabilité juridique.
        </Text>

        {/* Section signature */}
        <View style={styles.signatureSection}>
          <View>
            <Text style={styles.signatureLabel}>
              Signature du client
            </Text>
            <View style={styles.signatureBox}>
              {returnData?.client_signature && (
                <Image 
                  src={returnData.client_signature} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              )}
            </View>
            <Text style={styles.text}>
              {loanData?.clients?.first_name} {loanData?.clients?.last_name}
            </Text>
          </View>

          <View>
            <Text style={styles.signatureLabel}>
              Signature du représentant
            </Text>
            <View style={styles.signatureBox}>
              {/* Espace pour signature du représentant */}
            </View>
            <Text style={styles.text}>
              {companyData?.name}
            </Text>
          </View>
        </View>

        {/* Informations légales */}
        <Text style={styles.signatureLocation}>
          Document signé électroniquement le {returnDate} à {userPosition}
        </Text>
        
        <View style={styles.footer}>
          <Text>
            La signature électronique a la même valeur légale qu'une signature manuscrite.
            Exigence issue du Règlement eIDAS et du Code civil français, art. 1366-1367).
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReturnAttestationPDF;
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 8,
    padding: 6,
    backgroundColor: '#f8f9fa',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    textDecoration: 'underline',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  label: {
    fontWeight: 'bold',
    width: '40%',
  },
  value: {
    width: '60%',
  },
  letterContent: {
    lineHeight: 1.2,
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 4,
    textAlign: 'justify',
  },
  signature: {
    marginTop: 15,
    alignItems: 'flex-end',
  },
  signatureBox: {
    width: 180,
    height: 60,
    border: '1 solid #cccccc',
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signatureImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  signatureText: {
    fontSize: 10,
    color: '#666666',
  },
  conductorInfo: {
    marginLeft: 15,
    marginBottom: 4,
  },
});

interface DenunciationPDFProps {
  violationData: {
    violation: any;
    reservation: any;
    conductor: any;
  };
  companyData: any;
  signature?: string;
  signatoryName?: string;
}

const DenunciationPDF: React.FC<DenunciationPDFProps> = ({
  violationData,
  companyData,
  signature,
  signatoryName
}) => {
  const { violation, reservation, conductor } = violationData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>
          COURRIER DE DÉNONCIATION{'\n'}
          À L'AGENCE NATIONALE DE TRAITEMENT AUTOMATISÉ DES INFRACTIONS
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de l'entreprise</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nom de l'entreprise :</Text>
            <Text style={styles.value}>{companyData?.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Adresse :</Text>
            <Text style={styles.value}>{companyData?.address}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Code postal / Ville :</Text>
            <Text style={styles.value}>{companyData?.zipcode} {companyData?.city}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Téléphone :</Text>
            <Text style={styles.value}>{companyData?.phone}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email :</Text>
            <Text style={styles.value}>{companyData?.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>SIREN :</Text>
            <Text style={styles.value}>{companyData?.siren}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails de l'infraction</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Référence :</Text>
            <Text style={styles.value}>{violation.reference_number}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date :</Text>
            <Text style={styles.value}>
              {format(new Date(violation.violation_date), 'dd/MM/yyyy', { locale: fr })}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Heure :</Text>
            <Text style={styles.value}>{violation.violation_time || 'Non précisée'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Lieu :</Text>
            <Text style={styles.value}>{violation.location || 'Non précisé'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Véhicule :</Text>
            <Text style={styles.value}>{violation.license_plate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Type d'infraction :</Text>
            <Text style={styles.value}>{violation.violation_type}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Montant :</Text>
            <Text style={styles.value}>{violation.fine_amount}€</Text>
          </View>
        </View>

        <View style={styles.letterContent}>
          <Text style={styles.paragraph}>
            <Text style={{ fontWeight: 'bold' }}>Objet :</Text> Dénonciation du conducteur au moment de l'infraction
          </Text>

          <Text style={styles.paragraph}>Madame, Monsieur,</Text>

          <Text style={styles.paragraph}>
            Par la présente, je vous informe que le véhicule immatriculé{' '}
            <Text style={{ fontWeight: 'bold' }}>{violation.license_plate}</Text>{' '}
            était conduit au moment de l'infraction par :
          </Text>

          <View style={styles.conductorInfo}>
            <Text style={styles.paragraph}>
              <Text style={{ fontWeight: 'bold' }}>Nom et prénom :</Text> {conductor.first_name} {conductor.last_name}
            </Text>
            <Text style={styles.paragraph}>
              <Text style={{ fontWeight: 'bold' }}>Date de naissance :</Text>{' '}
              {conductor.date_of_birth ? format(new Date(conductor.date_of_birth), 'dd/MM/yyyy', { locale: fr }) : 'Non renseignée'}
            </Text>
            <Text style={styles.paragraph}>
              <Text style={{ fontWeight: 'bold' }}>Lieu de naissance :</Text> {conductor.place_of_birth || 'Non renseigné'}
            </Text>
            <Text style={styles.paragraph}>
              <Text style={{ fontWeight: 'bold' }}>Numéro de permis :</Text> {conductor.license_number || 'Non renseigné'}
            </Text>
            <Text style={styles.paragraph}>
              <Text style={{ fontWeight: 'bold' }}>Préfecture de délivrance :</Text> {conductor.prefecture || 'Non renseignée'}
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Ce véhicule était prêté dans le cadre d'un service de courtoisie de notre établissement.
            La période de prêt s'étendait du{' '}
            {format(new Date(reservation.start_date), 'dd/MM/yyyy', { locale: fr })}{' '}
            au{' '}
            {reservation.expected_return_date ? 
              format(new Date(reservation.expected_return_date), 'dd/MM/yyyy', { locale: fr }) : 
              'date non définie'
            }.
          </Text>

          <Text style={styles.paragraph}>
            Je certifie sur l'honneur l'exactitude des renseignements ci-dessus et joins à ce courrier 
            une copie du permis de conduire du conducteur désigné.
          </Text>
        </View>

        <View style={styles.signature}>
          <Text>Fait le {format(new Date(), 'dd/MM/yyyy', { locale: fr })}</Text>
          <Text>Signature du responsable :</Text>
          {signatoryName && (
            <Text style={{ marginTop: 5, fontSize: 10 }}>{signatoryName}</Text>
          )}
          <View style={styles.signatureBox}>
            {signature ? (
              <Image style={styles.signatureImage} src={signature} />
            ) : (
              <Text style={styles.signatureText}>Zone de signature</Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default DenunciationPDF;
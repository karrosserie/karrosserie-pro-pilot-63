import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontSize: 11,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    textDecoration: 'underline',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    textDecoration: 'underline',
  },
  paragraph: {
    marginBottom: 10,
    textAlign: 'justify',
  },
  bold: {
    fontWeight: 'bold',
  },
  tribunal: {
    textAlign: 'right',
    marginBottom: 30,
  },
  signature: {
    marginTop: 40,
    textAlign: 'right',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 3,
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 5,
  },
});

interface DemandeJugementPDFProps {
  companyData: any;
  clientData: any;
  caseData: any;
  documents: any[];
  totalAmount: number;
}

const DemandeJugementPDF: React.FC<DemandeJugementPDFProps> = ({
  companyData,
  clientData,
  caseData,
  documents,
  totalAmount,
}) => {
  const currentDate = new Date().toLocaleDateString('fr-FR');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.tribunal}>
          <Text>À l'attention du</Text>
          <Text style={styles.bold}>TRIBUNAL JUDICIAIRE DE MARSEILLE</Text>
          <Text>6 Rue Joseph Autran</Text>
          <Text>13006 MARSEILLE</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>REQUÊTE DE JUGEMENT SUR PIÈCES</Text>
          <Text>Article 1385 et suivants du Code de procédure civile</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I - DEMANDEUR</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>{companyData?.name || 'Société'}</Text>
          </Text>
          <Text>SIREN : {companyData?.siren || 'N/A'}</Text>
          <Text>SIRET : {companyData?.siret || 'N/A'}</Text>
          <Text>Adresse : {companyData?.address || ''}</Text>
          <Text>{companyData?.zipcode || ''} {companyData?.city || ''}</Text>
          <Text>Téléphone : {companyData?.phone || ''}</Text>
          <Text>Email : {companyData?.email || ''}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>II - DÉBITEUR</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>
              {clientData?.first_name || ''} {clientData?.last_name || ''}
            </Text>
          </Text>
          <Text>Adresse : {clientData?.address || ''}</Text>
          <Text>{clientData?.postal_code || ''} {clientData?.city || ''}</Text>
          <Text>Téléphone : {clientData?.phone || ''}</Text>
          <Text>Email : {clientData?.email || ''}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>III - CRÉANCE</Text>
          <Text style={styles.paragraph}>
            Le demandeur sollicite du Tribunal un jugement sur pièces 
            à l'encontre du débiteur susvisé, en paiement de la somme de <Text style={styles.bold}>{totalAmount.toFixed(2)}€</Text> 
            (euros), correspondant aux prestations non réglées détaillées ci-après.
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Origine de la créance :</Text>
          </Text>
          <Text style={styles.paragraph}>
            Prestations de réparation automobile effectuées selon devis signé et accepté par le client. 
            Les travaux ont été réalisés conformément aux termes convenus et le véhicule a été livré 
            en parfait état de fonctionnement.
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Documents joints à l'appui :</Text>
          </Text>
          {documents.map((doc, index) => (
            <Text key={index} style={{ marginLeft: 20, marginBottom: 3 }}>
              • {doc.name} - {doc.description}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>IV - CARACTÈRE CERTAIN, LIQUIDE ET EXIGIBLE DE LA CRÉANCE</Text>
          <Text style={styles.paragraph}>
            La créance est <Text style={styles.bold}>certaine</Text> : elle résulte de prestations 
            effectivement réalisées comme en attestent les documents joints.
          </Text>
          <Text style={styles.paragraph}>
            La créance est <Text style={styles.bold}>liquide</Text> : son montant est déterminé 
            à la somme de {totalAmount.toFixed(2)}€.
          </Text>
          <Text style={styles.paragraph}>
            La créance est <Text style={styles.bold}>exigible</Text> : le délai de paiement 
            convenu est largement dépassé sans règlement de la part du débiteur malgré nos relances.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>V - DEMANDE</Text>
          <Text style={styles.paragraph}>
            Par ces motifs, le demandeur sollicite de Monsieur le Juge :
          </Text>
          <Text style={styles.paragraph}>
            - De bien vouloir rendre un jugement sur pièces à l'encontre 
            du débiteur susvisé ;
          </Text>
          <Text style={styles.paragraph}>
            - D'ordonner au débiteur de payer au demandeur la somme de <Text style={styles.bold}>{totalAmount.toFixed(2)}€</Text> 
            en principal, outre les intérêts de retard au taux légal à compter de la date d'exigibilité ;
          </Text>
          <Text style={styles.paragraph}>
            - De condamner le débiteur aux dépens de l'instance.
          </Text>
        </View>

        <View style={styles.signature}>
          <Text>Fait à {companyData?.city || ''}, le {currentDate}</Text>
          <Text style={{ marginTop: 10 }}>Le demandeur</Text>
          <Text style={styles.bold}>{companyData?.name || ''}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default DemandeJugementPDF;
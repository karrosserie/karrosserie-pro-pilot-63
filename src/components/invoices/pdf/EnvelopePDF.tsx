import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

// Format enveloppe DL : 220mm x 110mm (paysage)
const DL_WIDTH = 220 * 2.83465; // mm to points
const DL_HEIGHT = 110 * 2.83465;

const styles = StyleSheet.create({
  page: {
    width: DL_WIDTH,
    height: DL_HEIGHT,
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 10,
    position: 'relative',
  },
  senderZone: {
    position: 'absolute',
    top: 15,
    left: 20,
    maxWidth: 180,
  },
  senderName: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  senderText: {
    fontSize: 8,
    color: '#444',
    lineHeight: 1.4,
  },
  recipientZone: {
    position: 'absolute',
    top: '40%',
    right: 40,
    width: 200,
    textAlign: 'left',
  },
  recipientName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  recipientText: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  referenceZone: {
    position: 'absolute',
    bottom: 12,
    right: 20,
    fontSize: 8,
    color: '#666',
  },
});

interface EnvelopePDFProps {
  companyData: {
    name?: string;
    address?: string;
    city?: string;
    zipcode?: string;
  };
  clientData: {
    name?: string;
    address?: string;
    city?: string;
    postal_code?: string;
  };
  invoiceReference?: string;
}

const EnvelopePDF: React.FC<EnvelopePDFProps> = ({ 
  companyData, 
  clientData, 
  invoiceReference 
}) => {
  const senderAddress = [
    companyData?.address,
    [companyData?.zipcode, companyData?.city].filter(Boolean).join(' ')
  ].filter(Boolean).join('\n');

  const recipientAddress = [
    clientData?.address,
    [clientData?.postal_code, clientData?.city].filter(Boolean).join(' ')
  ].filter(Boolean).join('\n');

  return (
    <Document>
      <Page size={[DL_WIDTH, DL_HEIGHT]} style={styles.page}>
        {/* Zone expéditeur - haut gauche */}
        <View style={styles.senderZone}>
          <Text style={styles.senderName}>{companyData?.name || ''}</Text>
          <Text style={styles.senderText}>{senderAddress}</Text>
        </View>

        {/* Zone destinataire - centre droit */}
        <View style={styles.recipientZone}>
          <Text style={styles.recipientName}>{clientData?.name || ''}</Text>
          <Text style={styles.recipientText}>{recipientAddress}</Text>
        </View>

        {/* Référence facture - bas droit */}
        {invoiceReference && (
          <View style={styles.referenceZone}>
            <Text>Réf: {invoiceReference}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default EnvelopePDF;

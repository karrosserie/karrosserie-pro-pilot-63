import React from 'react';
import { Text } from '@react-pdf/renderer';
import { pdfStyles } from './styles';

interface InvoicePDFFooterProps {
  companyData: any;
}

const InvoicePDFFooter = ({ companyData }: InvoicePDFFooterProps) => {
  const firstLine = `${companyData?.name || 'KARROSSERIE'} - ${companyData?.address || ''} ${companyData?.zipcode || ''} ${companyData?.city || ''} - SIRET ${companyData?.siret || ''} - N° TVA : ${companyData?.tva || ''} - Tel : ${companyData?.phone || ''}`;
  const emailLine = `Email : ${companyData?.email || ''}`;
  
  return (
    <Text style={pdfStyles.footer}>
      {firstLine}
      {'\n'}
      {emailLine}
    </Text>
  );
};

export default InvoicePDFFooter;
import React from 'react';
import { Text } from '@react-pdf/renderer';
import { pdfStyles } from './styles';

interface InvoicePDFFooterProps {
  companyData: any;
}

const InvoicePDFFooter = ({ companyData }: InvoicePDFFooterProps) => {
  return (
    <Text style={pdfStyles.footer}>
      {companyData?.name || 'KARROSSERIE'} - {companyData?.address || ''} {companyData?.zipcode || ''} {companyData?.city || ''} - 
      SIRET {companyData?.siret || ''} - N° TVA : {companyData?.tva || ''} - 
      Tel : {companyData?.phone || ''} - Email : {companyData?.email || ''}
    </Text>
  );
};

export default InvoicePDFFooter;
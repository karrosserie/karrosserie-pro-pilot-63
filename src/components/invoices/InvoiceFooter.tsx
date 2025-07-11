import React from 'react';

interface InvoiceFooterProps {
  companyData?: any;
}

const InvoiceFooter = ({ companyData }: InvoiceFooterProps) => {
  if (!companyData) {
    return null;
  }

  return (
    <div className="mt-8 pt-4 border-t text-xs text-gray-500 text-center">
      <p>
        {companyData.name} - {companyData.address} {companyData.zipcode} {companyData.city} - 
        SIRET {companyData.siret} - N° TVA : {companyData.tva || ''} - 
        Tel : {companyData.phone} - Email : {companyData.email}
      </p>
    </div>
  );
};

export default InvoiceFooter;
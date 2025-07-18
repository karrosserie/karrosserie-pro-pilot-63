import React from 'react';

interface DefaultQuoteFooterProps {
  companyData: any;
}

const DefaultQuoteFooter = ({ companyData }: DefaultQuoteFooterProps) => {
  return (
    <div className="mt-auto pt-4 text-[10px] text-gray-500 text-center">
      <p>
        {companyData.name || ''} - {companyData.address || ''} {companyData.zipcode || ''} {companyData.city || ''} - 
        SIRET {companyData.siret || ''} - N° TVA : {companyData.tva || ''} - 
        Tel : {companyData.phone || ''} - Email : {companyData.email || ''}
      </p>
    </div>
  );
};

export default DefaultQuoteFooter;
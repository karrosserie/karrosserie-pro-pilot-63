import React from 'react';

interface DefaultCreditFooterProps {
  companyData: any;
}

const DefaultCreditFooter = ({ companyData }: DefaultCreditFooterProps) => {
  return (
    <div className="mt-auto pt-3 sm:pt-4 text-[8px] sm:text-[9px] md:text-[10px] text-gray-500 text-center px-2">
      <p className="break-words">
        {companyData.name || ''} - {companyData.address || ''} {companyData.zipcode || ''} {companyData.city || ''} - 
        SIRET {companyData.siret || ''} - N° TVA : {companyData.tva || ''} - 
        Tel : {companyData.phone || ''} - Email : {companyData.email || ''}
      </p>
    </div>
  );
};

export default DefaultCreditFooter;
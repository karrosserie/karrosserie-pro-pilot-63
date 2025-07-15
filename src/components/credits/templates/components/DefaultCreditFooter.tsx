import React from 'react';

interface DefaultCreditFooterProps {
  companyData: any;
}

const DefaultCreditFooter = ({ companyData }: DefaultCreditFooterProps) => {
  return (
    <div className="mt-auto pt-4 text-[10px] text-gray-500 text-center">
      <p>
        {companyData.name || 'AUTO PAINT'} - {companyData.address || '25 rue sainte victoire'} {companyData.zipcode || '13006'} {companyData.city || 'MARSEILLE'} - 
        SIRET {companyData.siret || '12345678900010'} - N° TVA : {companyData.tva || 'FR123456789'} - 
        Tel : {companyData.phone || '+330646465242'} - Email : {companyData.email || 'autopaint@yopmail.com'}
      </p>
    </div>
  );
};

export default DefaultCreditFooter;
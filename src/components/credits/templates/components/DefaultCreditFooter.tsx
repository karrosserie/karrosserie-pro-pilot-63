import React from 'react';

interface DefaultCreditFooterProps {
  companyData: any;
}

const DefaultCreditFooter = ({ companyData }: DefaultCreditFooterProps) => {
  return (
    <div className="flex justify-between items-end mt-auto pt-6">
      <div className="text-sm text-gray-600">
        <p className="mb-2 font-semibold">Informations :</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Cet avoir est valable pour une durée illimitée.</li>
          <li>L'avoir peut être utilisé pour de futurs achats ou travaux.</li>
          <li>Pour toute question, contactez-nous.</li>
        </ul>
      </div>
      
      <div className="text-right text-sm text-gray-600 ml-6">
        <p className="font-semibold mb-1">Merci de votre confiance !</p>
        <p>{companyData.name || 'KARROSSERIE'}</p>
        <p>{companyData.address || 'Votre adresse'}</p>
        <p>{companyData.zipcode || ''} {companyData.city || ''}</p>
        <p>Téléphone : {companyData.phone || '+33 1 23 45 67 89'}</p>
      </div>
    </div>
  );
};

export default DefaultCreditFooter;
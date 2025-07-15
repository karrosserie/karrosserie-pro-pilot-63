import React from 'react';

interface DefaultRepairOrderFooterProps {
  companyData: any;
}

const DefaultRepairOrderFooter = ({ companyData }: DefaultRepairOrderFooterProps) => {
  return (
    <div className="flex justify-between items-end mt-auto pt-6">
      <div className="text-sm text-gray-600">
        <p className="mb-2 font-semibold">Conditions de paiement :</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Paiement comptant, sauf conditions particulières d'escompte.</li>
          <li>En cas de retard de paiement, indemnité forfaitaire pour frais de recouvrement : 40 euros.</li>
          <li>Pénalités de retard : 3 fois le taux de l'intérêt légal (taux BCE + 10%).</li>
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

export default DefaultRepairOrderFooter;
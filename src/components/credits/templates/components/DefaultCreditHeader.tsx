import React from 'react';

interface DefaultCreditHeaderProps {
  companyData: any;
  creditData: {
    number?: string;
    claimNumber?: string;
    billingDate?: string;
    dueDate?: string;
    vehicle?: string;
    licensePlate?: string;
    mileage?: string;
    amountDue?: string;
  };
  clientData: {
    name?: string;
    first_name?: string;
    last_name?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    phone?: string;
    email?: string;
  };
}

const DefaultCreditHeader = ({ companyData, creditData, clientData }: DefaultCreditHeaderProps) => {
  return (
    <div className="grid grid-cols-3 gap-6 mb-6">
      {/* Colonne 1 - Entreprise */}
      <div>
        <h1 className="text-2xl font-bold text-white px-3 py-1 text-center mb-3" style={{backgroundColor: 'rgba(64,67,72,255)'}}>AVOIR</h1>
        {companyData.logo_url ? (
          <div className="flex items-center justify-start mb-3" style={{maxWidth: '120px'}}>
            <img src={companyData.logo_url} alt="Logo entreprise" className="max-w-full h-auto object-contain" />
          </div>
        ) : (
          <div className="bg-orange-500 rounded-full p-2 w-fit mb-3">
            <span className="text-white font-bold text-base">LOGO</span>
          </div>
        )}
        <p className="text-gray-600 font-bold mb-2">{companyData.name || ''}</p>
        <div className="text-base text-gray-600 space-y-1">
          <p>{companyData.address || ''}</p>
          <p>{companyData.zipcode || ''} {companyData.city || ''}</p>
          <p>Téléphone : {companyData.phone || ''}</p>
          <p>E-mail : {companyData.email || ''}</p>
          <p>SIRET : {companyData.siret || ''}</p>
          <p>N° TVA : {companyData.tva || ''}</p>
        </div>
      </div>

      {/* Colonne 2 - Détails de l'avoir */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Détails de l'avoir</h3>
        <div className="text-base space-y-1">
          <div className="flex justify-between">
            <span className="font-medium">Avoir</span>
            <span>{creditData.number}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">N° de sinistre</span>
            <span>{creditData.claimNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Date de création</span>
            <span>{creditData.billingDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Date d'échéance</span>
            <span>{creditData.dueDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Véhicule</span>
            <span>{creditData.vehicle}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Immatriculation</span>
            <span>{creditData.licensePlate}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Kilométrage</span>
            <span>{creditData.mileage}</span>
          </div>
        </div>
        
        {/* Encadré Montant à avoir */}
        <div className="bg-blue-600 text-white p-2 text-center mt-3">
          <p className="text-base mb-1">Montant à avoir</p>
          <p className="text-lg font-bold">{creditData.amountDue}</p>
        </div>
      </div>

      {/* Colonne 3 - Avoir pour */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Avoir pour</h3>
        <div className="text-base space-y-1">
          <p className="font-medium">{clientData.name || `${clientData.first_name || ''} ${clientData.last_name || ''}`.trim()}</p>
          <p>{clientData.address}</p>
          <p>{clientData.postal_code} {clientData.city}</p>
          {clientData.phone && <p>Téléphone : {clientData.phone}</p>}
          {clientData.email && <p>E-mail : {clientData.email}</p>}
        </div>
      </div>
    </div>
  );
};

export default DefaultCreditHeader;
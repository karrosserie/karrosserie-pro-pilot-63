import React from 'react';

interface DefaultQuoteHeaderProps {
  companyData: any;
  quoteData: {
    number?: string;
    claimNumber?: string;
    billingDate?: string;
    validUntil?: string;
    vehicle?: string;
    licensePlate?: string;
    mileage?: string;
    amountDue?: string;
  };
  clientData: {
    name?: string;
    address?: string;
    city?: string;
    phone?: string;
    email?: string;
  };
}

const DefaultQuoteHeader = ({ companyData, quoteData, clientData }: DefaultQuoteHeaderProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
      {/* Colonne 1 - Entreprise */}
      <div className="break-inside-avoid">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white px-2 sm:px-3 py-1 text-center mb-2 sm:mb-3" style={{backgroundColor: 'rgba(64,67,72,255)'}}>DEVIS</h1>
        {companyData.logo_url && (
          <div className="flex items-center justify-start mb-3" style={{maxWidth: '120px'}}>
            <img src={companyData.logo_url} alt="Logo entreprise" className="max-w-full h-auto object-contain" />
          </div>
        )}
        <p className="text-gray-600 font-bold mb-1 sm:mb-2 text-sm sm:text-base">{companyData.name || ''}</p>
        <div className="text-xs sm:text-sm md:text-base text-gray-600 space-y-0.5 sm:space-y-1">
          <p>{companyData.address || ''}</p>
          <p>{companyData.zipcode || ''} {companyData.city || ''}</p>
          <p>Tél : {companyData.phone || ''}</p>
          <p className="break-all">Email : {companyData.email || ''}</p>
          <p>SIRET : {companyData.siret || ''}</p>
          <p>N° TVA : {companyData.tva || ''}</p>
        </div>
      </div>

      {/* Colonne 2 - Détails du devis */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800">Détails du devis</h3>
        <div className="text-xs sm:text-sm md:text-base space-y-0.5 sm:space-y-1">
          <div className="flex justify-between">
            <span className="font-medium">Devis</span>
            <span>{quoteData.number}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">N° de sinistre</span>
            <span>{quoteData.claimNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Date de création</span>
            <span>{quoteData.billingDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Valable jusqu'au</span>
            <span>{quoteData.validUntil}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Véhicule</span>
            <span>{quoteData.vehicle}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Immatriculation</span>
            <span>{quoteData.licensePlate}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Kilométrage</span>
            <span>{quoteData.mileage}</span>
          </div>
        </div>
        
        {/* Encadré Montant total */}
        <div className="bg-blue-600 text-white p-1.5 sm:p-2 text-center mt-2 sm:mt-3">
          <p className="text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1">Montant total</p>
          <p className="text-base sm:text-lg font-bold">{quoteData.amountDue}</p>
        </div>
      </div>

      {/* Colonne 3 - Devis pour */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800">Devis pour</h3>
        <div className="text-xs sm:text-sm md:text-base space-y-0.5 sm:space-y-1">
          <p className="font-medium">{clientData.name}</p>
          <p>{clientData.address}</p>
          <p>{clientData.city}</p>
          {clientData.phone && <p>Téléphone : {clientData.phone}</p>}
          {clientData.email && <p>E-mail : {clientData.email}</p>}
        </div>
      </div>
    </div>
  );
};

export default DefaultQuoteHeader;
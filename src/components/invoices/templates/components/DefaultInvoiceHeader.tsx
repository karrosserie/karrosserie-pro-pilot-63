import React from 'react';

interface DefaultInvoiceHeaderProps {
  companyData: any;
  invoiceData: {
    number?: string;
    claimNumber?: string;
    billingDate?: string;
    dueDate?: string;
    vehicle?: string;
    licensePlate?: string;
    mileage?: string;
    amountPaid?: string;
    amountDue?: string;
  };
  clientData: {
    name?: string;
    address?: string;
    city?: string;
    phone?: string;
    email?: string;
  };
  remainingAmount?: number;
  totalPaidAmount?: number;
  payments?: any[];
}

const DefaultInvoiceHeader = ({ companyData, invoiceData, clientData, remainingAmount, totalPaidAmount, payments }: DefaultInvoiceHeaderProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
      {/* Colonne 1 - Entreprise */}
      <div>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white px-2 sm:px-3 py-1 text-center mb-2 sm:mb-3" style={{backgroundColor: 'rgba(64,67,72,255)'}}>FACTURE</h1>
        {companyData.logo_url ? (
          <div className="flex items-start justify-start mb-3" style={{maxWidth: '250px'}}>
            <img src={companyData.logo_url} alt="Logo entreprise" className="max-w-full h-auto object-contain" style={{maxHeight: '180px'}} />
          </div>
        ) : (
          <div className="bg-orange-500 rounded-full p-2 w-fit mb-3">
            <span className="text-white font-bold text-base">LOGO</span>
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

      {/* Colonne 2 - Détails de la facture */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800">Détails de la facture</h3>
        <div className="text-xs sm:text-sm md:text-base space-y-0.5 sm:space-y-1">
          <div className="flex justify-between">
            <span className="font-medium">Facture</span>
            <span>{invoiceData.number}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">N° de sinistre</span>
            <span>{invoiceData.claimNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Date de facturation</span>
            <span>{invoiceData.billingDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Date d&apos;échéance</span>
            <span>{invoiceData.dueDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Véhicule</span>
            <span>{invoiceData.vehicle}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Immatriculation</span>
            <span>{invoiceData.licensePlate}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Kilométrage</span>
            <span>{invoiceData.mileage}</span>
          </div>
          {payments && payments.length > 0 && (
            <div className="flex justify-between">
              <span className="font-medium">Montant payé</span>
              <span>{totalPaidAmount ? `${totalPaidAmount.toFixed(2).replace('.', ',')} €` : '0,00 €'}</span>
            </div>
          )}
        </div>
        
        {/* Encadré Montant dû */}
        <div className="bg-blue-600 text-white p-1.5 sm:p-2 text-center mt-2 sm:mt-3">
          <p className="text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1">Montant dû</p>
          <p className="text-base sm:text-lg font-bold">{remainingAmount ? `${remainingAmount.toFixed(2).replace('.', ',')} €` : '0,00 €'}</p>
        </div>
      </div>

      {/* Colonne 3 - Facture pour */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800">Facture pour</h3>
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

export default DefaultInvoiceHeader;
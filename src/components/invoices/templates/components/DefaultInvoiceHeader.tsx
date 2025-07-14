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

const DefaultInvoiceHeader = ({ companyData, invoiceData, clientData }: DefaultInvoiceHeaderProps) => {
  return (
    <div className="grid grid-cols-3 gap-6 mb-6">
      {/* Colonne 1 - Entreprise */}
      <div>
        <h1 className="text-2xl font-bold text-white px-3 py-1 text-center mb-3" style={{backgroundColor: 'rgba(64,67,72,255)'}}>FACTURE</h1>
        {companyData.logo_url ? (
          <div className="flex items-center justify-start mb-3" style={{maxWidth: '120px'}}>
            <img src={companyData.logo_url} alt="Logo entreprise" className="max-w-full h-auto object-contain" />
          </div>
        ) : (
          <div className="bg-orange-500 rounded-full p-2 w-fit mb-3">
            <span className="text-white font-bold text-base">KR</span>
          </div>
        )}
        <p className="text-gray-600 font-bold mb-2">{companyData.name || 'KARROSSERIE'}</p>
        <div className="text-base text-gray-600 space-y-1">
          <p>{companyData.address || 'Votre adresse'}</p>
          <p>{companyData.zipcode || ''} {companyData.city || ''}</p>
          <p>Téléphone : {companyData.phone || '+33 1 23 45 67 89'}</p>
          <p>E-mail : {companyData.email || 'contact@karrosserie.fr'}</p>
          <p>SIRET : {companyData.siret || '123 456 789 00123'}</p>
          <p>N° TVA : {companyData.tva || 'FR 12 123456789'}</p>
        </div>
      </div>

      {/* Colonne 2 - Détails de la facture */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Détails de la facture</h3>
        <div className="text-base space-y-1">
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
          <div className="flex justify-between">
            <span className="font-medium">Montant payé</span>
            <span>375,00 €</span>
          </div>
        </div>
        
        {/* Encadré Montant dû */}
        <div className="bg-blue-600 text-white p-2 text-center mt-3">
          <p className="text-base mb-1">Montant dû</p>
          <p className="text-lg font-bold">719,78 €</p>
        </div>
      </div>

      {/* Colonne 3 - Facture pour */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Facture pour</h3>
        <div className="text-base space-y-1">
          <p className="font-medium">{clientData.name}</p>
          <p>{clientData.address}</p>
          <p>{clientData.city}</p>
          <p>Téléphone : {clientData.phone}</p>
          <p>E-mail : {clientData.email}</p>
        </div>
      </div>
    </div>
  );
};

export default DefaultInvoiceHeader;
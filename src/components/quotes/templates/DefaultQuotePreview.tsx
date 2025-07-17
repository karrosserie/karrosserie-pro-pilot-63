
import React from 'react';

interface DefaultQuotePreviewProps {
  companyData?: any;
  quoteData?: any;
  clientData?: any;
  items?: any[];
  totals?: any;
}

const DefaultQuotePreview = ({ 
  companyData, 
  quoteData, 
  clientData, 
  items = [], 
  totals 
}: DefaultQuotePreviewProps) => {
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          {companyData?.logo_url && (
            <img 
              src={companyData.logo_url} 
              alt="Logo entreprise" 
              className="h-16 mb-4"
            />
          )}
          <div className="text-sm">
            <div className="font-bold text-lg">{companyData?.name || 'Nom de l\'entreprise'}</div>
            <div>{companyData?.address}</div>
            <div>{companyData?.zipcode} {companyData?.city}</div>
            <div>Tél: {companyData?.phone}</div>
            <div>Email: {companyData?.email}</div>
            {companyData?.siret && <div>SIRET: {companyData.siret}</div>}
          </div>
        </div>
        
        <div className="text-right">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">DEVIS</h1>
          <div className="text-sm space-y-1">
            <div><strong>N° Devis:</strong> {quoteData?.number}</div>
            <div><strong>Date:</strong> {quoteData?.date}</div>
            {quoteData?.validUntil && (
              <div><strong>Valable jusqu'au:</strong> {quoteData.validUntil}</div>
            )}
            {quoteData?.claimNumber && (
              <div><strong>N° Sinistre:</strong> {quoteData.claimNumber}</div>
            )}
          </div>
        </div>
      </div>

      {/* Client Info */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2">Informations Client</h3>
        <div className="bg-gray-50 p-4 rounded">
          <div><strong>Client:</strong> {clientData?.name}</div>
          {clientData?.address && <div><strong>Adresse:</strong> {clientData.address}</div>}
          {clientData?.city && <div><strong>Ville:</strong> {clientData.city}</div>}
          {clientData?.phone && <div><strong>Téléphone:</strong> {clientData.phone}</div>}
          {clientData?.email && <div><strong>Email:</strong> {clientData.email}</div>}
        </div>
      </div>

      {/* Vehicle Info */}
      {(clientData?.vehicle || clientData?.licensePlate) && (
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Informations Véhicule</h3>
          <div className="bg-gray-50 p-4 rounded">
            {clientData?.vehicle && <div><strong>Véhicule:</strong> {clientData.vehicle}</div>}
            {clientData?.licensePlate && <div><strong>Plaque:</strong> {clientData.licensePlate}</div>}
            {clientData?.mileage && <div><strong>Kilométrage:</strong> {clientData.mileage}</div>}
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2">Détail des prestations</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Référence</th>
              <th className="border border-gray-300 p-2 text-left">Description</th>
              <th className="border border-gray-300 p-2 text-center">Qté</th>
              <th className="border border-gray-300 p-2 text-right">Prix Unit. HT</th>
              <th className="border border-gray-300 p-2 text-right">Total HT</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{item.ref}</td>
                <td className="border border-gray-300 p-2">{item.description}</td>
                <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
                <td className="border border-gray-300 p-2 text-right">
                  {item.unitPrice.toFixed(2).replace('.', ',')} €
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {item.totalHT.toFixed(2).replace('.', ',')} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mb-6">
        <div className="flex justify-end">
          <div className="w-80">
            <div className="flex justify-between py-1">
              <span>Total HT:</span>
              <span>{totals?.totalHT}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Total TVA:</span>
              <span>{totals?.totalVAT}</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-lg border-t border-gray-300">
              <span>Total TTC:</span>
              <span>{totals?.totalTTC}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {(quoteData?.notes || clientData?.notes) && (
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Notes</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p className="whitespace-pre-wrap">{quoteData?.notes || clientData?.notes}</p>
          </div>
        </div>
      )}

      {/* Additional Info */}
      {(quoteData?.reportNumber || quoteData?.policyNumber || quoteData?.expertName) && (
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Informations expertise</h3>
          <div className="bg-gray-50 p-4 rounded text-sm space-y-1">
            {quoteData?.reportNumber && <div><strong>N° Rapport:</strong> {quoteData.reportNumber}</div>}
            {quoteData?.policyNumber && <div><strong>N° Police:</strong> {quoteData.policyNumber}</div>}
            {quoteData?.expertName && <div><strong>Expert:</strong> {quoteData.expertName}</div>}
            {quoteData?.incidentDate && <div><strong>Date sinistre:</strong> {quoteData.incidentDate}</div>}
            {quoteData?.reportDate && <div><strong>Date rapport:</strong> {quoteData.reportDate}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default DefaultQuotePreview;


import React from 'react';

interface AlternativeQuotePreviewProps {
  companyData?: any;
  quoteData?: any;
  clientData?: any;
  items?: any[];
  totals?: any;
}

const AlternativeQuotePreview = ({ 
  companyData, 
  quoteData, 
  clientData, 
  items = [], 
  totals 
}: AlternativeQuotePreviewProps) => {
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header with modern design */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg mb-8">
        <div className="flex justify-between items-start">
          <div>
            {companyData?.logo_url && (
              <img 
                src={companyData.logo_url} 
                alt="Logo entreprise" 
                className="h-12 mb-3 bg-white p-1 rounded"
              />
            )}
            <div className="text-sm opacity-90">
              <div className="font-bold text-lg opacity-100">{companyData?.name || 'Nom de l\'entreprise'}</div>
              <div>{companyData?.address}</div>
              <div>{companyData?.zipcode} {companyData?.city}</div>
              <div>Tél: {companyData?.phone}</div>
              <div>Email: {companyData?.email}</div>
            </div>
          </div>
          
          <div className="text-right">
            <h1 className="text-3xl font-bold mb-4">DEVIS</h1>
            <div className="text-sm space-y-1 opacity-90">
              <div><strong>N°:</strong> {quoteData?.number}</div>
              <div><strong>Date:</strong> {quoteData?.date}</div>
              {quoteData?.validUntil && (
                <div><strong>Valable jusqu'au:</strong> {quoteData.validUntil}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Client and Vehicle Info in Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-3 text-blue-600">Client</h3>
          <div className="space-y-2 text-sm">
            <div><strong>Nom:</strong> {clientData?.name}</div>
            {clientData?.address && <div><strong>Adresse:</strong> {clientData.address}</div>}
            {clientData?.city && <div><strong>Ville:</strong> {clientData.city}</div>}
            {clientData?.phone && <div><strong>Téléphone:</strong> {clientData.phone}</div>}
            {clientData?.email && <div><strong>Email:</strong> {clientData.email}</div>}
          </div>
        </div>
        
        {(clientData?.vehicle || clientData?.licensePlate) && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3 text-blue-600">Véhicule</h3>
            <div className="space-y-2 text-sm">
              {clientData?.vehicle && <div><strong>Modèle:</strong> {clientData.vehicle}</div>}
              {clientData?.licensePlate && <div><strong>Plaque:</strong> {clientData.licensePlate}</div>}
              {clientData?.mileage && <div><strong>Kilométrage:</strong> {clientData.mileage}</div>}
            </div>
          </div>
        )}
      </div>

      {/* Items Table with modern styling */}
      <div className="mb-8">
        <h3 className="font-bold text-lg mb-4 text-blue-600">Prestations</h3>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-3 text-left font-semibold">Référence</th>
                <th className="p-3 text-left font-semibold">Description</th>
                <th className="p-3 text-center font-semibold">Qté</th>
                <th className="p-3 text-right font-semibold">Prix Unit. HT</th>
                <th className="p-3 text-right font-semibold">Total HT</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3 border-t border-gray-100">{item.ref}</td>
                  <td className="p-3 border-t border-gray-100">{item.description}</td>
                  <td className="p-3 text-center border-t border-gray-100">{item.quantity}</td>
                  <td className="p-3 text-right border-t border-gray-100">
                    {item.unitPrice.toFixed(2).replace('.', ',')} €
                  </td>
                  <td className="p-3 text-right border-t border-gray-100">
                    {item.totalHT.toFixed(2).replace('.', ',')} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals with modern card */}
      <div className="mb-8">
        <div className="flex justify-end">
          <div className="bg-gray-50 rounded-lg p-4 w-80">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total HT:</span>
                <span>{totals?.totalHT}</span>
              </div>
              <div className="flex justify-between">
                <span>Total TVA:</span>
                <span>{totals?.totalVAT}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total TTC:</span>
                  <span className="text-blue-600">{totals?.totalTTC}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {(quoteData?.notes || clientData?.notes) && (
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-3 text-blue-600">Notes</h3>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="whitespace-pre-wrap text-sm">{quoteData?.notes || clientData?.notes}</p>
          </div>
        </div>
      )}

      {/* Additional Info */}
      {(quoteData?.reportNumber || quoteData?.policyNumber || quoteData?.expertName) && (
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-3 text-blue-600">Informations expertise</h3>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {quoteData?.reportNumber && <div><strong>N° Rapport:</strong> {quoteData.reportNumber}</div>}
              {quoteData?.policyNumber && <div><strong>N° Police:</strong> {quoteData.policyNumber}</div>}
              {quoteData?.expertName && <div><strong>Expert:</strong> {quoteData.expertName}</div>}
              {quoteData?.incidentDate && <div><strong>Date sinistre:</strong> {quoteData.incidentDate}</div>}
              {quoteData?.reportDate && <div><strong>Date rapport:</strong> {quoteData.reportDate}</div>}
              {quoteData?.claimNumber && <div><strong>N° Sinistre:</strong> {quoteData.claimNumber}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlternativeQuotePreview;

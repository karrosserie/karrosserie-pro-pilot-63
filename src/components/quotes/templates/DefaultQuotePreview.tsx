import React from 'react';

interface DefaultQuotePreviewProps {
  companyData: any;
  quoteData: any;
  clientData: any;
  items: any[];
  totals: any;
}

const DefaultQuotePreview = ({ companyData, quoteData, clientData, items, totals }: DefaultQuotePreviewProps) => {
  return (
    <div className="bg-white p-8 min-h-screen">
      {/* En-tête */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          {companyData?.logo_url ? (
            <img 
              src={companyData.logo_url} 
              alt="Logo"
              className="h-16 w-auto mb-4"
            />
          ) : (
            <div className="h-16 w-32 bg-gray-200 rounded mb-4 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Logo</span>
            </div>
          )}
          <div className="text-sm text-gray-600">
            <p className="font-semibold">{companyData?.name || 'Nom de l\'entreprise'}</p>
            <p>{companyData?.address || 'Adresse'}</p>
            <p>{companyData?.zipcode} {companyData?.city}</p>
            <p>Tél: {companyData?.phone || 'Téléphone'}</p>
            <p>Email: {companyData?.email || 'Email'}</p>
            {companyData?.siret && <p>SIRET: {companyData.siret}</p>}
            {companyData?.tva && <p>TVA: {companyData.tva}</p>}
          </div>
        </div>

        <div className="text-right">
          <h1 className="text-3xl font-bold text-karrosserie-orange mb-2">DEVIS</h1>
          <div className="text-sm text-gray-600">
            <p><span className="font-semibold">N°:</span> {quoteData.number}</p>
            <p><span className="font-semibold">Date:</span> {quoteData.date}</p>
            {quoteData.validUntil && (
              <p><span className="font-semibold">Valable jusqu'au:</span> {quoteData.validUntil}</p>
            )}
          </div>
        </div>
      </div>

      {/* Informations client et véhicule */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">CLIENT</h3>
          <div className="text-sm text-gray-600">
            <p className="font-medium">{clientData?.name || 'Nom du client'}</p>
            {clientData?.address && <p>{clientData.address}</p>}
            {clientData?.city && <p>{clientData.city}</p>}
            {clientData?.phone && <p>Tél: {clientData.phone}</p>}
            {clientData?.email && <p>Email: {clientData.email}</p>}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-2">VÉHICULE</h3>
          <div className="text-sm text-gray-600">
            {quoteData.vehicle && <p><span className="font-medium">Véhicule:</span> {quoteData.vehicle}</p>}
            {quoteData.licensePlate && <p><span className="font-medium">Plaque:</span> {quoteData.licensePlate}</p>}
            {quoteData.mileage && <p><span className="font-medium">Kilométrage:</span> {quoteData.mileage}</p>}
          </div>
        </div>
      </div>

      {/* Informations expertise */}
      {(quoteData.claimNumber || quoteData.reportNumber || quoteData.policyNumber) && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-2">INFORMATIONS EXPERTISE</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            {quoteData.claimNumber && (
              <p><span className="font-medium">N° Sinistre:</span> {quoteData.claimNumber}</p>
            )}
            {quoteData.reportNumber && (
              <p><span className="font-medium">N° Rapport:</span> {quoteData.reportNumber}</p>
            )}
            {quoteData.policyNumber && (
              <p><span className="font-medium">N° Police:</span> {quoteData.policyNumber}</p>
            )}
            {quoteData.expertName && (
              <p><span className="font-medium">Expert:</span> {quoteData.expertName}</p>
            )}
            {quoteData.incidentDate && (
              <p><span className="font-medium">Date sinistre:</span> {quoteData.incidentDate}</p>
            )}
            {quoteData.reportDate && (
              <p><span className="font-medium">Date rapport:</span> {quoteData.reportDate}</p>
            )}
          </div>
        </div>
      )}

      {/* Tableau des prestations */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Description</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">Qté</th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold">Prix unit. HT</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">TVA</th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold">Total HT</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2 text-sm">{item.description}</td>
                <td className="border border-gray-300 px-4 py-2 text-center text-sm">{item.quantity}</td>
                <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                  {item.unitPrice.toFixed(2).replace('.', ',')} €
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center text-sm">{item.vat}%</td>
                <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                  {item.totalHT.toFixed(2).replace('.', ',')} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totaux */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-1 text-sm">
            <span>Sous-total HT:</span>
            <span>{totals.totalHT}</span>
          </div>
          <div className="flex justify-between py-1 text-sm">
            <span>TVA:</span>
            <span>{totals.totalVAT}</span>
          </div>
          <div className="flex justify-between py-2 text-lg font-bold border-t">
            <span>Total TTC:</span>
            <span>{totals.totalTTC}</span>
          </div>
        </div>
      </div>

      {/* Conditions */}
      <div className="text-xs text-gray-600">
        <p className="font-semibold mb-2">Conditions générales:</p>
        <p>Ce devis est valable 30 jours à compter de sa date d'émission.</p>
        <p>Les travaux seront exécutés selon les règles de l'art et les normes en vigueur.</p>
        <p>Le paiement est exigible à la fin des travaux.</p>
      </div>
    </div>
  );
};

export default DefaultQuotePreview;
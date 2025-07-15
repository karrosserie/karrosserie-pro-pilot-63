import React from 'react';

interface AlternativeQuotePreviewProps {
  companyData: any;
  quoteData: any;
  clientData: any;
  items: any[];
  totals: any;
}

const AlternativeQuotePreview = ({ companyData, quoteData, clientData, items, totals }: AlternativeQuotePreviewProps) => {
  return (
    <div className="bg-white min-h-screen">
      {/* En-tête avec bande colorée */}
      <div className="bg-gradient-to-r from-karrosserie-orange to-orange-600 text-white p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            {companyData?.logo_url ? (
              <img 
                src={companyData.logo_url} 
                alt="Logo"
                className="h-12 w-auto mb-3 brightness-0 invert"
              />
            ) : (
              <div className="h-12 w-24 bg-white/20 rounded mb-3 flex items-center justify-center">
                <span className="text-white text-xs">Logo</span>
              </div>
            )}
            <h1 className="text-3xl font-bold">DEVIS</h1>
          </div>
          <div className="text-right text-sm">
            <p className="text-lg font-semibold">N° {quoteData.number}</p>
            <p>Date: {quoteData.date}</p>
            {quoteData.validUntil && <p>Valable jusqu'au: {quoteData.validUntil}</p>}
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Informations entreprise */}
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-700">
            <p className="font-semibold text-lg mb-2">{companyData?.name || 'Nom de l\'entreprise'}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>{companyData?.address || 'Adresse'}</p>
                <p>{companyData?.zipcode} {companyData?.city}</p>
              </div>
              <div>
                <p>Tél: {companyData?.phone || 'Téléphone'}</p>
                <p>Email: {companyData?.email || 'Email'}</p>
                {companyData?.siret && <p>SIRET: {companyData.siret}</p>}
                {companyData?.tva && <p>TVA: {companyData.tva}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Informations client et véhicule */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-semibold text-karrosserie-orange mb-3 text-lg border-b border-karrosserie-orange pb-1">
              CLIENT
            </h3>
            <div className="text-sm text-gray-700">
              <p className="font-medium text-base mb-1">{clientData?.name || 'Nom du client'}</p>
              {clientData?.address && <p>{clientData.address}</p>}
              {clientData?.city && <p>{clientData.city}</p>}
              {clientData?.phone && <p>Tél: {clientData.phone}</p>}
              {clientData?.email && <p>Email: {clientData.email}</p>}
            </div>
          </div>

          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-semibold text-karrosserie-orange mb-3 text-lg border-b border-karrosserie-orange pb-1">
              VÉHICULE
            </h3>
            <div className="text-sm text-gray-700">
              {quoteData.vehicle && <p><span className="font-medium">Véhicule:</span> {quoteData.vehicle}</p>}
              {quoteData.licensePlate && <p><span className="font-medium">Plaque:</span> {quoteData.licensePlate}</p>}
              {quoteData.mileage && <p><span className="font-medium">Kilométrage:</span> {quoteData.mileage}</p>}
            </div>
          </div>
        </div>

        {/* Informations expertise */}
        {(quoteData.claimNumber || quoteData.reportNumber || quoteData.policyNumber) && (
          <div className="mb-8 border border-gray-200 rounded p-4">
            <h3 className="font-semibold text-karrosserie-orange mb-3 text-lg border-b border-karrosserie-orange pb-1">
              INFORMATIONS EXPERTISE
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
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
          <h3 className="font-semibold text-karrosserie-orange mb-4 text-lg">DÉTAIL DES PRESTATIONS</h3>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-karrosserie-orange text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Qté</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Prix unit. HT</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">TVA</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Total HT</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3 text-sm">{item.description}</td>
                    <td className="px-4 py-3 text-center text-sm">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-sm">
                      {item.unitPrice.toFixed(2).replace('.', ',')} €
                    </td>
                    <td className="px-4 py-3 text-center text-sm">{item.vat}%</td>
                    <td className="px-4 py-3 text-right text-sm font-medium">
                      {item.totalHT.toFixed(2).replace('.', ',')} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totaux */}
        <div className="flex justify-end mb-8">
          <div className="w-80 bg-gray-50 rounded p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sous-total HT:</span>
                <span className="font-medium">{totals.totalHT}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>TVA:</span>
                <span className="font-medium">{totals.totalVAT}</span>
              </div>
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between text-lg font-bold text-karrosserie-orange">
                  <span>Total TTC:</span>
                  <span>{totals.totalTTC}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conditions */}
        <div className="bg-gray-50 rounded p-4 text-xs text-gray-600">
          <p className="font-semibold mb-2 text-karrosserie-orange">Conditions générales:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Ce devis est valable 30 jours à compter de sa date d'émission.</li>
            <li>Les travaux seront exécutés selon les règles de l'art et les normes en vigueur.</li>
            <li>Le paiement est exigible à la fin des travaux.</li>
            <li>Toute modification du devis fera l'objet d'un avenant.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AlternativeQuotePreview;
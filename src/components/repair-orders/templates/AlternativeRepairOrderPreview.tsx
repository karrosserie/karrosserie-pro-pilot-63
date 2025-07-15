import React from 'react';

interface AlternativeRepairOrderPreviewProps {
  companyData: any;
  orderData: any;
  clientData: any;
  items: any[];
  totals: any;
}

const AlternativeRepairOrderPreview = ({ companyData, orderData, clientData, items, totals }: AlternativeRepairOrderPreviewProps) => {
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
            <h1 className="text-2xl font-bold">ORDRE DE RÉPARATION</h1>
          </div>
          <div className="text-right text-sm">
            <p className="text-lg font-semibold">N° {orderData.number}</p>
            <p>Date: {orderData.date}</p>
            <p className="bg-white/20 px-2 py-1 rounded mt-1">Statut: {orderData.status}</p>
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
              {orderData.vehicle && <p><span className="font-medium">Véhicule:</span> {orderData.vehicle}</p>}
              {orderData.licensePlate && <p><span className="font-medium">Plaque:</span> {orderData.licensePlate}</p>}
              {orderData.mileage && <p><span className="font-medium">Kilométrage:</span> {orderData.mileage}</p>}
            </div>
          </div>
        </div>

        {/* Informations expertise */}
        {(orderData.claimNumber || orderData.reportNumber || orderData.policyNumber) && (
          <div className="mb-8 border border-gray-200 rounded p-4">
            <h3 className="font-semibold text-karrosserie-orange mb-3 text-lg border-b border-karrosserie-orange pb-1">
              INFORMATIONS EXPERTISE
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
              {orderData.claimNumber && (
                <p><span className="font-medium">N° Sinistre:</span> {orderData.claimNumber}</p>
              )}
              {orderData.reportNumber && (
                <p><span className="font-medium">N° Rapport:</span> {orderData.reportNumber}</p>
              )}
              {orderData.policyNumber && (
                <p><span className="font-medium">N° Police:</span> {orderData.policyNumber}</p>
              )}
              {orderData.expertName && (
                <p><span className="font-medium">Expert:</span> {orderData.expertName}</p>
              )}
              {orderData.incidentDate && (
                <p><span className="font-medium">Date sinistre:</span> {orderData.incidentDate}</p>
              )}
              {orderData.reportDate && (
                <p><span className="font-medium">Date rapport:</span> {orderData.reportDate}</p>
              )}
            </div>
          </div>
        )}

        {/* Tableau des travaux */}
        <div className="mb-8">
          <h3 className="font-semibold text-karrosserie-orange mb-4 text-lg">DÉTAIL DES TRAVAUX</h3>
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

        {/* Notes */}
        {orderData.notes && (
          <div className="mb-8 bg-blue-50 rounded p-4">
            <h3 className="font-semibold text-karrosserie-orange mb-2 text-lg">NOTES</h3>
            <div className="text-sm text-gray-700">
              <p>{orderData.notes}</p>
            </div>
          </div>
        )}

        {/* Signature */}
        {orderData.signatureDate && (
          <div className="mb-8 border border-gray-200 rounded p-4">
            <h3 className="font-semibold text-karrosserie-orange mb-3 text-lg border-b border-karrosserie-orange pb-1">
              SIGNATURE CLIENT
            </h3>
            <div className="text-sm text-gray-700">
              <p className="mb-4">Signé le {orderData.signatureDate}</p>
              <div className="h-20 border-2 border-dashed border-gray-300 rounded bg-gray-50 flex items-center justify-center">
                <span className="text-gray-400 font-medium">Signature client</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlternativeRepairOrderPreview;
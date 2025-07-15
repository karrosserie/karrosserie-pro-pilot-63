import React from 'react';

interface AlternativeCreditPreviewProps {
  companyData: any;
  creditData: any;
  clientData: any;
  items: any[];
  totals: any;
}

const AlternativeCreditPreview = ({ companyData, creditData, clientData, items, totals }: AlternativeCreditPreviewProps) => {
  return (
    <div className="bg-white min-h-screen">
      {/* En-tête avec bande colorée */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 mb-8">
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
            <h1 className="text-3xl font-bold">AVOIR</h1>
          </div>
          <div className="text-right text-sm">
            <p className="text-lg font-semibold">N° {creditData.number}</p>
            <p>Date: {creditData.date}</p>
            {creditData.invoiceNumber && <p>Facture N°: {creditData.invoiceNumber}</p>}
            <p className="bg-white/20 px-2 py-1 rounded mt-1">Statut: {creditData.status}</p>
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
            <h3 className="font-semibold text-red-600 mb-3 text-lg border-b border-red-600 pb-1">
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

          {(creditData.vehicle || creditData.licensePlate || creditData.mileage) && (
            <div className="border border-gray-200 rounded p-4">
              <h3 className="font-semibold text-red-600 mb-3 text-lg border-b border-red-600 pb-1">
                VÉHICULE
              </h3>
              <div className="text-sm text-gray-700">
                {creditData.vehicle && <p><span className="font-medium">Véhicule:</span> {creditData.vehicle}</p>}
                {creditData.licensePlate && <p><span className="font-medium">Plaque:</span> {creditData.licensePlate}</p>}
                {creditData.mileage && <p><span className="font-medium">Kilométrage:</span> {creditData.mileage}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Tableau des éléments de l'avoir */}
        <div className="mb-8">
          <h3 className="font-semibold text-red-600 mb-4 text-lg">DÉTAIL DE L'AVOIR</h3>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Qté</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Prix unit. HT</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">TVA</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Total HT</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? items.map((item, index) => (
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
                )) : (
                  <tr>
                    <td className="px-4 py-3 text-sm text-center text-gray-500 bg-gray-50" colSpan={5}>
                      Aucun élément dans cet avoir
                    </td>
                  </tr>
                )}
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
                <div className="flex justify-between text-lg font-bold text-red-600">
                  <span>Total avoir TTC:</span>
                  <span>{totals.totalTTC}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternativeCreditPreview;
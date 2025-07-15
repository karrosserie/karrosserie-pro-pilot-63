import React from 'react';

interface DefaultCreditPreviewProps {
  companyData: any;
  creditData: any;
  clientData: any;
  items: any[];
  totals: any;
}

const DefaultCreditPreview = ({ companyData, creditData, clientData, items, totals }: DefaultCreditPreviewProps) => {
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
          <h1 className="text-3xl font-bold text-red-600 mb-2">AVOIR</h1>
          <div className="text-sm text-gray-600">
            <p><span className="font-semibold">N°:</span> {creditData.number}</p>
            <p><span className="font-semibold">Date:</span> {creditData.date}</p>
            {creditData.invoiceNumber && (
              <p><span className="font-semibold">Facture N°:</span> {creditData.invoiceNumber}</p>
            )}
            <p><span className="font-semibold">Statut:</span> {creditData.status}</p>
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

        {(creditData.vehicle || creditData.licensePlate || creditData.mileage) && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">VÉHICULE</h3>
            <div className="text-sm text-gray-600">
              {creditData.vehicle && <p><span className="font-medium">Véhicule:</span> {creditData.vehicle}</p>}
              {creditData.licensePlate && <p><span className="font-medium">Plaque:</span> {creditData.licensePlate}</p>}
              {creditData.mileage && <p><span className="font-medium">Kilométrage:</span> {creditData.mileage}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Tableau des éléments de l'avoir */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-800 mb-4">DÉTAIL DE L'AVOIR</h3>
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
            {items.length > 0 ? items.map((item, index) => (
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
            )) : (
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-sm text-center text-gray-500" colSpan={5}>
                  Aucun élément dans cet avoir
                </td>
              </tr>
            )}
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
          <div className="flex justify-between py-2 text-lg font-bold border-t text-red-600">
            <span>Total avoir TTC:</span>
            <span>{totals.totalTTC}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {creditData.notes && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-2">NOTES</h3>
          <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded">
            <p>{creditData.notes}</p>
          </div>
        </div>
      )}

      {/* Informations légales */}
      <div className="text-xs text-gray-600">
        <p className="font-semibold mb-2">Informations:</p>
        <p>Cet avoir est à déduire du montant de votre prochaine facture.</p>
        <p>Avoir émis en application des conditions générales de vente.</p>
        <p>Conservez ce document, il vous sera demandé pour tout remboursement.</p>
      </div>
    </div>
  );
};

export default DefaultCreditPreview;
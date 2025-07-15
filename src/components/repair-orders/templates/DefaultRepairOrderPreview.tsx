import React from 'react';

interface DefaultRepairOrderPreviewProps {
  companyData: any;
  orderData: any;
  clientData: any;
  items: any[];
  totals: any;
}

const DefaultRepairOrderPreview = ({ companyData, orderData, clientData, items, totals }: DefaultRepairOrderPreviewProps) => {
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
          <h1 className="text-3xl font-bold text-karrosserie-orange mb-2">ORDRE DE RÉPARATION</h1>
          <div className="text-sm text-gray-600">
            <p><span className="font-semibold">N°:</span> {orderData.number}</p>
            <p><span className="font-semibold">Date:</span> {orderData.date}</p>
            {orderData.orderDate && orderData.orderDate !== orderData.date && (
              <p><span className="font-semibold">Date ordre:</span> {orderData.orderDate}</p>
            )}
            <p><span className="font-semibold">Statut:</span> {orderData.status}</p>
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
            {orderData.vehicle && <p><span className="font-medium">Véhicule:</span> {orderData.vehicle}</p>}
            {orderData.licensePlate && <p><span className="font-medium">Plaque:</span> {orderData.licensePlate}</p>}
            {orderData.mileage && <p><span className="font-medium">Kilométrage:</span> {orderData.mileage}</p>}
          </div>
        </div>
      </div>

      {/* Informations expertise */}
      {(orderData.claimNumber || orderData.reportNumber || orderData.policyNumber) && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-2">INFORMATIONS EXPERTISE</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
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

      {/* Tableau des prestations */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-800 mb-4">DÉTAIL DES TRAVAUX</h3>
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

      {/* Notes */}
      {orderData.notes && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-2">NOTES</h3>
          <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded">
            <p>{orderData.notes}</p>
          </div>
        </div>
      )}

      {/* Signature */}
      {orderData.signatureDate && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-2">SIGNATURE CLIENT</h3>
          <div className="text-sm text-gray-600">
            <p>Signé le {orderData.signatureDate}</p>
            <div className="mt-4 h-16 border border-gray-300 rounded bg-gray-50 flex items-center justify-center">
              <span className="text-gray-400">Signature client</span>
            </div>
          </div>
        </div>
      )}

      {/* Conditions */}
      <div className="text-xs text-gray-600">
        <p className="font-semibold mb-2">Conditions:</p>
        <p>Les travaux seront exécutés selon les règles de l'art et les normes en vigueur.</p>
        <p>Le client reconnaît avoir pris connaissance des conditions générales.</p>
        <p>Paiement à la fin des travaux.</p>
      </div>
    </div>
  );
};

export default DefaultRepairOrderPreview;
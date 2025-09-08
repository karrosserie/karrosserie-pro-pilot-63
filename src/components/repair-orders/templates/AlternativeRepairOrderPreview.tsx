import React from 'react';

interface AlternativeRepairOrderPreviewProps {
  companyData: any;
  orderData?: {
    number?: string;
    date?: string;
    orderDate?: string;
    vehicle?: string;
    licensePlate?: string;
    mileage?: string;
    claimNumber?: string;
    reportNumber?: string;
    policyNumber?: string;
    expertName?: string;
    incidentDate?: string;
    reportDate?: string;
    amountDue?: string;
    notes?: string;
  };
  clientData?: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
  };
  vehicleData?: {
    start_date?: string;
    end_date?: string;
  };
  items?: Array<{
    ref?: string;
    description?: string;
    quantity?: number;
    discount?: number;
    unitPrice?: number;
    vat?: number;
    totalHT?: number;
    totalTTC?: number;
  }>;
  totals?: {
    totalHT?: string;
    totalVAT?: string;
    totalDiscount?: string;
    totalTTC?: string;
  };
  signatureData?: {
    signature: string | null;
    clientName: string;
    signatureDate: string | null;
  };
}

const AlternativeRepairOrderPreview = ({ companyData, orderData, clientData, vehicleData, items, totals, signatureData }: AlternativeRepairOrderPreviewProps) => {
  // Utiliser uniquement les données réelles, pas de valeurs par défaut
  const orderDataToUse = orderData || {};
  const clientDataToUse = clientData || {};
  const itemsToUse = items || [];
  const totalsToUse = totals || {};

  return (
    <div className="bg-white p-6 rounded shadow-sm h-full" style={{ fontFamily: 'Arial, sans-serif', backgroundColor: 'white', minHeight: '100%' }}>
      {/* En-tête avec entreprise et ORDRE DE RÉPARATION */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">{companyData?.name || ''}</h1>
          <div className="text-sm text-gray-700 space-y-1">
            {companyData?.address && <p><strong>ADRESSE :</strong> {companyData.address}</p>}
            {(companyData?.zipcode || companyData?.city) && <p>{companyData?.zipcode || ''} {companyData?.city || ''}</p>}
            {companyData?.phone && <p><strong>TEL :</strong> {companyData.phone}</p>}
            {companyData?.email && <p><strong>EMAIL :</strong> {companyData.email}</p>}
            {companyData?.siret && <p><strong>SIRET :</strong> {companyData.siret}</p>}
            {companyData?.tva && <p><strong>TVA :</strong> {companyData.tva}</p>}
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-black">ORDRE DE RÉPARATION N° {orderDataToUse.number || ''}</h2>
          
          {/* Informations client déplacées ici */}
          <div className="text-left p-4 w-2/3 ml-auto">
            <div className="text-sm text-gray-600 space-y-1">
              {clientDataToUse.name && <p><strong>{clientDataToUse.name}</strong></p>}
              {clientDataToUse.phone && <p><strong>TEL :</strong> {clientDataToUse.phone}</p>}
              {clientDataToUse.email && <p><strong>EMAIL :</strong> {clientDataToUse.email}</p>}
              {clientDataToUse.address && <p><strong>ADRESSE :</strong> {clientDataToUse.address}</p>}
              {clientDataToUse.city && <p>{clientDataToUse.city}</p>}
              {orderDataToUse.licensePlate && <p><strong>Immatriculation :</strong> {orderDataToUse.licensePlate}</p>}
              {orderDataToUse.mileage && <p><strong>Kilométrage :</strong> {orderDataToUse.mileage}</p>}
              {orderDataToUse.vehicle && <p><strong>Véhicule :</strong> {orderDataToUse.vehicle}</p>}
              
              {/* Délai prévisionnel - affiché seulement si les deux dates sont renseignées */}
              {vehicleData?.start_date && vehicleData?.end_date && (
                <div className="mt-3 pt-2 border-t border-gray-300">
                  <p className="text-lg font-semibold text-gray-800 mb-1">Délai prévisionnel</p>
                  <p><strong>Date de début :</strong> {vehicleData.start_date}</p>
                  <p><strong>Date de fin :</strong> {vehicleData.end_date}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Date avec coins arrondis */}
      {orderDataToUse.date && (
        <div className="flex justify-center mb-8">
          <div className="border-2 border-black rounded-lg px-4 py-2 text-center">
            <div className="font-bold text-sm mb-1">DATE</div>
            <div className="font-bold text-sm">{orderDataToUse.date}</div>
          </div>
        </div>
      )}

      {/* Tableau des articles avec bordure globale */}
      {itemsToUse.length > 0 && (
        <div className="border-2 border-black rounded-lg overflow-hidden mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="border-r-2 border-b-2 border-black p-2 font-bold text-left">Réf</th>
                <th className="border-r-2 border-b-2 border-black p-2 font-bold text-left">Description</th>
                <th className="border-r-2 border-b-2 border-black p-2 font-bold text-center">Quantité</th>
                <th className="border-r-2 border-b-2 border-black p-2 font-bold text-center">Remise</th>
                <th className="border-r-2 border-b-2 border-black p-2 font-bold text-center">Prix HT</th>
                <th className="border-r-2 border-b-2 border-black p-2 font-bold text-center">TVA</th>
                <th className="border-r-2 border-b-2 border-black p-2 font-bold text-center">Total HT</th>
                <th className="border-b-2 border-black p-2 font-bold text-center">Total TTC</th>
              </tr>
            </thead>
            <tbody>
              {itemsToUse.map((item, index) => (
                <tr key={index}>
                  <td className="border-r-2 border-black p-2 font-bold">{item.ref || ''}</td>
                  <td className="border-r-2 border-black p-2 font-bold">{item.description || ''}</td>
                  <td className="border-r-2 border-black p-2 font-bold text-center">
                    {item.quantity !== undefined && item.quantity !== null ? item.quantity.toString().replace('.', ',') : '0'}
                  </td>
                  <td className="border-r-2 border-black p-2 font-bold text-center">
                    {item.discount !== undefined && item.discount !== null ? item.discount : 0}%
                  </td>
                  <td className="border-r-2 border-black p-2 font-bold text-center">
                    {item.unitPrice !== undefined && item.unitPrice !== null ? item.unitPrice.toFixed(2).replace('.', ',') : '0,00'}€
                  </td>
                  <td className="border-r-2 border-black p-2 font-bold text-center">
                    {item.vat !== undefined && item.vat !== null ? item.vat : 20}%
                  </td>
                  <td className="border-r-2 border-black p-2 font-bold text-center">
                    {item.totalHT !== undefined && item.totalHT !== null ? item.totalHT.toFixed(2).replace('.', ',') : '0,00'}€
                  </td>
                  <td className="p-2 font-bold text-center">
                    {item.totalTTC !== undefined && item.totalTTC !== null ? item.totalTTC.toFixed(2).replace('.', ',') : '0,00'}€
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Totaux */}
      {(totalsToUse.totalHT || totalsToUse.totalVAT || totalsToUse.totalDiscount || totalsToUse.totalTTC) && (
        <div className="flex justify-end">
          <div className="border-2 border-black rounded-lg overflow-hidden">
            <table className="text-sm border-collapse">
              <tbody>
                <tr>
                  <td className="border-r-2 border-black p-2 font-bold text-center">Total HT</td>
                  <td className="border-r-2 border-black p-2 font-bold text-center">Total TVA</td>
                  <td className="border-r-2 border-black p-2 font-bold text-center">Total Remise</td>
                  <td className="p-2 font-bold text-center">Total TTC</td>
                </tr>
                <tr>
                  <td className="border-r-2 border-black border-t-2 border-black p-2 font-bold">{totalsToUse.totalHT || '0,00 €'}</td>
                  <td className="border-r-2 border-black border-t-2 border-black p-2 font-bold">{totalsToUse.totalVAT || '0,00 €'}</td>
                  <td className="border-r-2 border-black border-t-2 border-black p-2 font-bold">{totalsToUse.totalDiscount || '0,00 €'}</td>
                  <td className="border-t-2 border-black p-2 font-bold">{totalsToUse.totalTTC || '0,00 €'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notes */}
      {orderDataToUse.notes && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Notes</h3>
          <p className="text-sm">{orderDataToUse.notes}</p>
        </div>
      )}

      {/* Section signature client */}
      {signatureData && (
        <div className="mt-8 flex justify-center">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-4">Signature du client</h3>
            {signatureData.signature ? (
              <div className="border-2 border-black rounded-lg p-4">
                <img 
                  src={signatureData.signature} 
                  alt="Signature du client"
                  className="mx-auto mb-2"
                  style={{ maxWidth: '200px', maxHeight: '100px' }}
                />
                <p className="text-sm font-bold">{signatureData.clientName}</p>
                {signatureData.signatureDate && (
                  <p className="text-xs text-gray-600">Signé le {signatureData.signatureDate}</p>
                )}
              </div>
            ) : (
              <div className="border-2 border-black border-dashed rounded-lg p-4 text-gray-500">
                <div style={{ width: '200px', height: '100px' }} className="mx-auto flex items-center justify-center">
                  <span className="text-sm font-bold">Signature en attente</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      {(companyData?.name || companyData?.address || companyData?.zipcode || companyData?.city || companyData?.siret || companyData?.tva || companyData?.phone || companyData?.email) && (
        <div className="mt-8 text-xs text-center text-gray-500">
          <p>
            {companyData?.name || ''} 
            {companyData?.address && ` - ${companyData.address}`}
            {(companyData?.zipcode || companyData?.city) && ` ${companyData?.zipcode || ''} ${companyData?.city || ''}`}
            {companyData?.siret && ` - SIRET ${companyData.siret}`}
            {companyData?.tva && ` - N° TVA : ${companyData.tva}`}
            {companyData?.phone && ` - Tel : ${companyData.phone}`}
            {companyData?.email && ` - Email : ${companyData.email}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default AlternativeRepairOrderPreview;
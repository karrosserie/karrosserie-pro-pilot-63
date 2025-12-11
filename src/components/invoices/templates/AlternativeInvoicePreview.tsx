import React from 'react';

interface AlternativeInvoicePreviewProps {
  companyData: any;
  invoiceData?: {
    number?: string;
    date?: string;
    dueDate?: string;
    notes?: string;
    payment_details?: string;
  };
  clientData?: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    licensePlate?: string;
    mileage?: string;
    vehicle?: string;
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
    globalDiscount?: string;
    totalTTC?: string;
  };
  payments?: any[];
  totalPaidAmount?: number;
  remainingAmount?: number;
  isPaid?: boolean;
}

const AlternativeInvoicePreview = ({ companyData, invoiceData, clientData, items, totals, payments, totalPaidAmount, remainingAmount, isPaid = false }: AlternativeInvoicePreviewProps) => {
  // Utiliser uniquement les données réelles, pas de valeurs par défaut
  const invoiceDataToUse = invoiceData || {};
  const clientDataToUse = clientData || {};
  const itemsToUse = items || [];
  const totalsToUse = totals || {};

  return (
    <div className="bg-white p-6 rounded shadow-sm h-full relative" style={{ fontFamily: 'Arial, sans-serif', backgroundColor: 'white', minHeight: '100%' }}>
      {/* Tampon ACQUITTÉ pour les factures payées */}
      {isPaid && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="transform -rotate-[30deg] border-4 border-green-500 text-green-500 text-5xl font-bold px-8 py-4 rounded-lg opacity-40">
            ACQUITTÉ
          </div>
        </div>
      )}
      {/* En-tête avec entreprise et FACTURE */}
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
          <h2 className="text-3xl font-bold text-black">FACTURE N° {invoiceDataToUse.number || ''}</h2>
          
          {/* Informations client déplacées ici */}
          <div className="text-left p-4 w-2/3 ml-auto min-w-[300px]">
            <div className="text-sm text-gray-600 space-y-1">
              {clientDataToUse.name && <p><strong>{clientDataToUse.name}</strong></p>}
              {clientDataToUse.phone && <p><strong>TEL :</strong> {clientDataToUse.phone}</p>}
              {clientDataToUse.email && <p><strong>EMAIL :</strong> {clientDataToUse.email}</p>}
              {clientDataToUse.address && <p><strong>ADRESSE :</strong> {clientDataToUse.address}</p>}
              {clientDataToUse.city && <p>{clientDataToUse.city}</p>}
              {clientDataToUse.licensePlate && <p><strong>Immatriculation :</strong> {clientDataToUse.licensePlate}</p>}
              {clientDataToUse.mileage && <p><strong>Kilométrage :</strong> {clientDataToUse.mileage}</p>}
              {clientDataToUse.vehicle && <p><strong>Véhicule :</strong> {clientDataToUse.vehicle}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Dates avec coins arrondis et plus d'espace */}
      <div className="flex justify-center gap-48 mb-8">
        {invoiceDataToUse.date && (
          <div className="border-2 border-black rounded-lg px-4 py-2 text-center">
            <div className="font-bold text-sm mb-1">DATE</div>
            <div className="font-bold text-sm">{invoiceDataToUse.date}</div>
          </div>
        )}
        {invoiceDataToUse.dueDate && (
          <div className="border-2 border-black rounded-lg px-4 py-2 text-center">
            <div className="font-bold text-sm mb-1">DATE D'ÉCHÉANCE</div>
            <div className="font-bold text-sm">{invoiceDataToUse.dueDate}</div>
          </div>
        )}
      </div>

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
      {(totalsToUse.totalHT || totalsToUse.totalVAT || totalsToUse.totalDiscount || totalsToUse.globalDiscount || totalsToUse.totalTTC) && (
        <div className="flex justify-end">
          <div className="border-2 border-black rounded-lg overflow-hidden">
            <table className="text-sm border-collapse">
              <tbody>
                <tr>
                  <td className="border-r-2 border-black p-2 font-bold text-center">Total HT</td>
                  <td className="border-r-2 border-black p-2 font-bold text-center">Total TVA</td>
                  <td className="border-r-2 border-black p-2 font-bold text-center">Total Remise</td>
                  {totalsToUse.globalDiscount && (
                    <td className="border-r-2 border-black p-2 font-bold text-center">Remise Globale</td>
                  )}
                  <td className="p-2 font-bold text-center">Total TTC</td>
                </tr>
                <tr>
                  <td className="border-r-2 border-black border-t-2 border-black p-2 font-bold">{totalsToUse.totalHT || '0,00 €'}</td>
                  <td className="border-r-2 border-black border-t-2 border-black p-2 font-bold">{totalsToUse.totalVAT || '0,00 €'}</td>
                  <td className="border-r-2 border-black border-t-2 border-black p-2 font-bold">{totalsToUse.totalDiscount || '0,00 €'}</td>
                  {totalsToUse.globalDiscount && (
                    <td className="border-r-2 border-black border-t-2 border-black p-2 font-bold text-red-600">-{totalsToUse.globalDiscount}</td>
                  )}
                  <td className="border-t-2 border-black p-2 font-bold">{totalsToUse.totalTTC || '0,00 €'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notes */}
      {invoiceDataToUse.notes && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Notes</h3>
          <p className="text-sm">{invoiceDataToUse.notes}</p>
        </div>
      )}

      {/* Détails de paiement */}
      {invoiceDataToUse.payment_details && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Détails de paiement</h3>
          <p className="text-sm">{invoiceDataToUse.payment_details}</p>
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

export default AlternativeInvoicePreview;
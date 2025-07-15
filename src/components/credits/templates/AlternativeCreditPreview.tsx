import React from 'react';

interface AlternativeCreditPreviewProps {
  companyData: any;
  creditData?: {
    number?: string;
    date?: string;
    invoiceNumber?: string;
    vehicle?: string;
    licensePlate?: string;
    mileage?: string;
  };
  clientData?: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
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
}

const AlternativeCreditPreview = ({ companyData, creditData, clientData, items, totals }: AlternativeCreditPreviewProps) => {
  // Données par défaut pour l'aperçu
  const defaultCreditData = {
    number: 'N°5',
    date: '11/12/2024',
    invoiceNumber: 'FACT-2024-001',
    vehicle: 'PEUGEOT 308',
    licensePlate: 'AB-123-CD',
    mileage: '85 678 Km',
    ...creditData
  };

  const defaultClientData = {
    name: 'JEAN DUPONT',
    phone: '+33 6 12 34 56 78',
    email: 'jean.dupont@email.com',
    address: '134 Boulevard Michelet',
    city: '13008 MARSEILLE',
    ...clientData
  };

  const defaultItems = items || [
    { ref: '', description: 'Remboursement pièce défectueuse', quantity: 1, discount: 0, unitPrice: 110.00, vat: 20, totalHT: 110.00, totalTTC: 132.00 },
    { ref: '', description: 'Avoir sur main d\'œuvre', quantity: 2, discount: 0, unitPrice: 50.00, vat: 20, totalHT: 100.00, totalTTC: 120.00 }
  ];

  const defaultTotals = {
    totalHT: '210,00€',
    totalVAT: '42,00€',
    totalDiscount: '0,00€',
    totalTTC: '252,00€',
    ...totals
  };

  return (
    <div className="bg-white p-6 rounded shadow-sm h-full" style={{ fontFamily: 'Arial, sans-serif', backgroundColor: 'white', minHeight: '100%' }}>
      {/* En-tête avec entreprise et AVOIR */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">{companyData.name || 'VOTRE ENTREPRISE'}</h1>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>ADRESSE :</strong> {companyData.address || 'Votre adresse'}</p>
            <p>{companyData.zipcode || ''} {companyData.city || ''}</p>
            <p><strong>TEL :</strong> {companyData.phone || '+33 1 23 45 67 89'}</p>
            <p><strong>EMAIL :</strong> {companyData.email || 'contact@entreprise.com'}</p>
            <p><strong>SIRET :</strong> {companyData.siret || '123 456 789 00123'}</p>
            <p><strong>TVA :</strong> {companyData.tva || 'FR 12 123456789'}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-black">AVOIR {defaultCreditData.number}</h2>
          
          {/* Informations client déplacées ici */}
          <div className="text-left p-4 w-2/3 ml-auto">
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>{defaultClientData.name}</strong></p>
              {defaultClientData.phone && <p><strong>TEL :</strong> {defaultClientData.phone}</p>}
              {defaultClientData.email && <p><strong>EMAIL :</strong> {defaultClientData.email}</p>}
              {defaultClientData.address && <p><strong>ADRESSE :</strong> {defaultClientData.address}</p> }
              {defaultClientData.city && <p>{defaultClientData.city}</p>}
              {defaultCreditData.licensePlate && <p><strong>Immatriculation :</strong> {defaultCreditData.licensePlate}</p>}
              {defaultCreditData.mileage && <p><strong>Kilométrage :</strong> {defaultCreditData.mileage}</p>}
              {defaultCreditData.vehicle && <p><strong>Véhicule :</strong> {defaultCreditData.vehicle}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Dates avec coins arrondis et plus d'espace */}
      <div className="flex justify-center gap-48 mb-8">
        <div className="border-2 border-black rounded-lg px-4 py-2 text-center">
          <div className="font-bold text-sm mb-1">DATE</div>
          <div className="font-bold text-sm">{defaultCreditData.date}</div>
        </div>
        {defaultCreditData.invoiceNumber && (
          <div className="border-2 border-black rounded-lg px-4 py-2 text-center">
            <div className="font-bold text-sm mb-1">FACTURE N°</div>
            <div className="font-bold text-sm">{defaultCreditData.invoiceNumber}</div>
          </div>
        )}
      </div>

      {/* Tableau des articles avec bordure globale */}
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
            {defaultItems.map((item, index) => (
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

      {/* Totaux */}
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
                <td className="border-r-2 border-black border-t-2 border-black p-2 font-bold">{defaultTotals.totalHT}</td>
                <td className="border-r-2 border-black border-t-2 border-black p-2 font-bold">{defaultTotals.totalVAT}</td>
                <td className="border-r-2 border-black border-t-2 border-black p-2 font-bold">{defaultTotals.totalDiscount}</td>
                <td className="border-t-2 border-black p-2 font-bold">{defaultTotals.totalTTC}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-xs text-center text-gray-500">
        <p>{companyData.name || 'AUTO PAINT'} - {companyData.address || '25 rue sainte victoire'} {companyData.zipcode || '13006'} {companyData.city || 'MARSEILLE'} - 
           SIRET {companyData.siret || '12345678900010'} - N° TVA : {companyData.tva || 'FR123456789'} - 
           Tel : {companyData.phone || '+330646465242'} - Email : {companyData.email || 'autopaint@yopmail.com'}</p>
      </div>
    </div>
  );
};

export default AlternativeCreditPreview;
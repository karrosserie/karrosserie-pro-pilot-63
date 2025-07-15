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
}

const AlternativeRepairOrderPreview = ({ companyData, orderData, clientData, vehicleData, items, totals }: AlternativeRepairOrderPreviewProps) => {
  // Données par défaut pour l'aperçu
  const defaultOrderData = {
    number: 'N°5',
    date: '11/12/2024',
    orderDate: '11/12/2024',
    vehicle: 'PEUGEOT 308',
    licensePlate: 'AB-123-CD',
    mileage: '85 678 Km',
    amountDue: '630,00€',
    ...orderData
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
    { ref: '', description: 'T1', quantity: 2, discount: 0, unitPrice: 110.00, vat: 20, totalHT: 220.00, totalTTC: 264.00 },
    { ref: '', description: 'T2', quantity: 2, discount: 0, unitPrice: 110.00, vat: 20, totalHT: 220.00, totalTTC: 264.00 },
    { ref: '', description: 'GRILLE DE PARE-CHOCS AV', quantity: 1, discount: 5, unitPrice: 95.00, vat: 20, totalHT: 90.25, totalTTC: 108.30 },
    { ref: '', description: 'CONDENSEUR DE CLIMATISATION MOTRIO', quantity: 5, discount: 0, unitPrice: 0.00, vat: 20, totalHT: 0.00, totalTTC: 0.00 }
  ];

  const defaultTotals = {
    totalHT: '530,25€',
    totalVAT: '106,05€',
    totalDiscount: '5,30€',
    totalTTC: '630,00€',
    ...totals
  };

  return (
    <div className="bg-white p-6 rounded shadow-sm h-full" style={{ fontFamily: 'Arial, sans-serif', backgroundColor: 'white', minHeight: '100%' }}>
      {/* En-tête avec entreprise et ORDRE DE RÉPARATION */}
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
          <h2 className="text-3xl font-bold text-black">ORDRE DE RÉPARATION N° {defaultOrderData.number}</h2>
          
          {/* Informations client déplacées ici */}
          <div className="text-left p-4 w-2/3 ml-auto">
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>{defaultClientData.name}</strong></p>
              {defaultClientData.phone && <p><strong>TEL :</strong> {defaultClientData.phone}</p>}
              {defaultClientData.email && <p><strong>EMAIL :</strong> {defaultClientData.email}</p>}
              {defaultClientData.address && <p><strong>ADRESSE :</strong> {defaultClientData.address}</p> }
              {defaultClientData.city && <p>{defaultClientData.city}</p>}
              <p><strong>Immatriculation :</strong> {defaultOrderData.licensePlate}</p>
              <p><strong>Kilométrage :</strong> {defaultOrderData.mileage}</p>
              <p><strong>Véhicule :</strong> {defaultOrderData.vehicle}</p>
              
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
      <div className="flex justify-center mb-8">
        <div className="border-2 border-black rounded-lg px-4 py-2 text-center">
          <div className="font-bold text-sm mb-1">DATE</div>
          <div className="font-bold text-sm">{defaultOrderData.date}</div>
        </div>
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

export default AlternativeRepairOrderPreview;
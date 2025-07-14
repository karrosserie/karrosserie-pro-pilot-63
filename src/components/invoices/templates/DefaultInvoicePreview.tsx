import React from 'react';

interface DefaultInvoicePreviewProps {
  companyData: any;
  invoiceData?: {
    number?: string;
    claimNumber?: string;
    billingDate?: string;
    dueDate?: string;
    vehicle?: string;
    licensePlate?: string;
    mileage?: string;
    amountDue?: string;
  };
  clientData?: {
    name?: string;
    address?: string;
    city?: string;
    phone?: string;
    email?: string;
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
    subtotal?: string;
    vat?: string;
    total?: string;
  };
}

const DefaultInvoicePreview = ({ companyData, invoiceData, clientData, items, totals }: DefaultInvoicePreviewProps) => {
  // Données par défaut pour l'aperçu
  const defaultInvoiceData = {
    number: 'N° 5',
    claimNumber: 'SIN-2024-001',
    billingDate: '11/07/2025',
    dueDate: '10/08/2025',
    vehicle: 'Peugeot 308',
    licensePlate: 'AB-123-CD',
    mileage: '85 679 km',
    amountDue: '1 250,00 €',
    ...invoiceData
  };

  const defaultClientData = {
    name: 'Jean Dupont',
    address: '134 Boulevard Michelet',
    city: '13008 MARSEILLE',
    phone: '+33 6 12 34 56 78',
    email: 'jean.dupont@email.com',
    ...clientData
  };

  const defaultItems = items || [
    { ref: '', description: 'T1', quantity: 2, discount: 0, unitPrice: 110.00, vat: 20, totalHT: 220.00, totalTTC: 264.00 },
    { ref: '', description: 'T2', quantity: 2, discount: 0, unitPrice: 110.00, vat: 20, totalHT: 220.00, totalTTC: 264.00 },
    { ref: '', description: 'GRILLE DE PARE-CHOCS AV', quantity: 1, discount: 5, unitPrice: 95.00, vat: 20, totalHT: 90.25, totalTTC: 108.30 },
    { ref: '', description: 'CONDENSEUR DE CLIMATISATION MOTRIO', quantity: 5, discount: 0, unitPrice: 0.00, vat: 20, totalHT: 0.00, totalTTC: 0.00 }
  ];

  const defaultTotals = {
    subtotal: '918,75 €',
    vat: '183,75 €',
    total: '1 102,50 €',
    ...totals
  };
  return (
    <div className="bg-white p-4 rounded shadow-sm h-full flex flex-col min-h-full" style={{ minHeight: '500px', backgroundColor: 'white' }}>
      {/* En-tête avec 3 colonnes */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Colonne 1 - Entreprise */}
        <div>
          <h1 className="text-2xl font-bold text-white px-3 py-1 text-center mb-3" style={{backgroundColor: 'rgba(64,67,72,255)'}}>FACTURE</h1>
          {companyData.logo_url ? (
            <div className="flex items-center justify-start mb-3" style={{maxWidth: '120px'}}>
              <img src={companyData.logo_url} alt="Logo entreprise" className="max-w-full h-auto object-contain" />
            </div>
          ) : (
            <div className="bg-orange-500 rounded-full p-2 w-fit mb-3">
              <span className="text-white font-bold text-base">KR</span>
            </div>
          )}
          <p className="text-gray-600 font-bold mb-2">{companyData.name || 'KARROSSERIE'}</p>
          <div className="text-base text-gray-600 space-y-1">
            <p>{companyData.address || 'Votre adresse'}</p>
            <p>{companyData.zipcode || ''} {companyData.city || ''}</p>
            <p>Téléphone : {companyData.phone || '+33 1 23 45 67 89'}</p>
            <p>E-mail : {companyData.email || 'contact@karrosserie.fr'}</p>
            <p>SIRET : {companyData.siret || '123 456 789 00123'}</p>
            <p>N° TVA : {companyData.tva || 'FR 12 123456789'}</p>
          </div>
        </div>

        {/* Colonne 2 - Détails de la facture */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Détails de la facture</h3>
          <div className="text-base space-y-1">
            <div className="flex justify-between">
              <span className="font-medium">Facture</span>
              <span>{defaultInvoiceData.number}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">N° de sinistre</span>
              <span>{defaultInvoiceData.claimNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date de facturation</span>
              <span>{defaultInvoiceData.billingDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date d&apos;échéance</span>
              <span>{defaultInvoiceData.dueDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Véhicule</span>
              <span>{defaultInvoiceData.vehicle}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Immatriculation</span>
              <span>{defaultInvoiceData.licensePlate}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Kilométrage</span>
              <span>{defaultInvoiceData.mileage}</span>
            </div>
          </div>
          
          {/* Encadré Montant dû */}
          <div className="bg-blue-600 text-white p-2 text-center mt-3">
            <p className="text-base mb-1">Montant dû</p>
            <p className="text-lg font-bold">{defaultInvoiceData.amountDue}</p>
          </div>
        </div>

        {/* Colonne 3 - Facture pour */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Facture pour</h3>
          <div className="text-base space-y-1">
            <p className="font-medium">{defaultClientData.name}</p>
            <p>{defaultClientData.address}</p>
            <p>{defaultClientData.city}</p>
            <p>Téléphone : {defaultClientData.phone}</p>
            <p>E-mail : {defaultClientData.email}</p>
          </div>
        </div>
      </div>

      {/* Tableau complet des articles */}
      <div className="mt-6">
        <table className="w-full text-base bg-white border-collapse">
          <thead>
            <tr style={{ backgroundColor: 'rgba(64,67,72,255)' }} className="text-white">
              <th className="p-3 text-left font-medium">Réf</th>
              <th className="p-3 text-left font-medium">Description</th>
              <th className="p-3 text-center font-medium">Quantité</th>
              <th className="p-3 text-center font-medium">Remise</th>
              <th className="p-3 text-center font-medium">Prix HT</th>
              <th className="p-3 text-center font-medium">TVA</th>
              <th className="p-3 text-center font-medium">Total HT</th>
              <th className="p-3 text-center font-medium">Total TTC</th>
            </tr>
          </thead>
          <tbody>
            {defaultItems.map((item, index) => (
              <tr key={index}>
                <td className="p-3">{item.ref}</td>
                <td className="p-3">{item.description}</td>
                <td className="p-3 text-center">{item.quantity}</td>
                <td className="p-3 text-center">{item.discount}%</td>
                <td className="p-3 text-center">{item.unitPrice.toFixed(2).replace('.', ',')}€</td>
                <td className="p-3 text-center">{item.vat}%</td>
                <td className="p-3 text-center">{item.totalHT.toFixed(2).replace('.', ',')}€</td>
                <td className="p-3 text-center">{item.totalTTC.toFixed(2).replace('.', ',')}€</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       
      {/* Totaux */}
      <div className="mt-4 flex justify-end">
        <div className="w-56">
          <div className="space-y-1 text-base">
            <div className="flex justify-between font-bold">
              <span>Sous-total</span>
              <span>{defaultTotals.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>TVA</span>
              <span>{defaultTotals.vat}</span>
            </div>
            <div className="flex justify-between font-bold text-lg bg-blue-600 text-white p-2">
              <span>TOTAL</span>
              <span>{defaultTotals.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer fixe en bas */}
      <div className="mt-auto pt-4 border-t text-[10px] text-gray-500 text-center">
        <p>
          {companyData.name || 'AUTO PAINT'} - {companyData.address || '25 rue sainte victoire'} {companyData.zipcode || '13006'} {companyData.city || 'MARSEILLE'} - 
          SIRET {companyData.siret || '12345678900010'} - N° TVA : {companyData.tva || 'FR123456789'} - 
          Tel : {companyData.phone || '+330646465242'} - Email : {companyData.email || 'autopaint@yopmail.com'}
        </p>
      </div>
    </div>
  );
};

export default DefaultInvoicePreview;
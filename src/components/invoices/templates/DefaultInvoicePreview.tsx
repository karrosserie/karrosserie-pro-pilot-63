import React from 'react';

interface DefaultInvoicePreviewProps {
  companyData: any;
}

const DefaultInvoicePreview = ({ companyData }: DefaultInvoicePreviewProps) => {
  return (
    <div className="bg-white p-4 rounded shadow-sm h-full flex flex-col" style={{ minHeight: '500px' }}>
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
              <span>N° 5</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">N° de sinistre</span>
              <span>SIN-2024-001</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date de facturation</span>
              <span>11/07/2025</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date d&apos;échéance</span>
              <span>10/08/2025</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Véhicule</span>
              <span>Peugeot 308</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Immatriculation</span>
              <span>AB-123-CD</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Kilométrage</span>
              <span>85 679 km</span>
            </div>
          </div>
          
          {/* Encadré Montant dû */}
          <div className="bg-blue-600 text-white p-2 text-center mt-3">
            <p className="text-base mb-1">Montant dû</p>
            <p className="text-lg font-bold">1 250,00 €</p>
          </div>
        </div>

        {/* Colonne 3 - Facture pour */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Facture pour</h3>
          <div className="text-base space-y-1">
            <p className="font-medium">Jean Dupont</p>
            <p>134 Boulevard Michelet</p>
            <p>13008 MARSEILLE</p>
            <p>Téléphone : +33 6 12 34 56 78</p>
            <p>E-mail : jean.dupont@email.com</p>
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
            <tr>
              <td className="p-3"></td>
              <td className="p-3">T1</td>
              <td className="p-3 text-center">2</td>
              <td className="p-3 text-center">0%</td>
              <td className="p-3 text-center">110,00€</td>
              <td className="p-3 text-center">20%</td>
              <td className="p-3 text-center">220,00€</td>
              <td className="p-3 text-center">264,00€</td>
            </tr>
            <tr>
              <td className="p-3"></td>
              <td className="p-3">T2</td>
              <td className="p-3 text-center">2</td>
              <td className="p-3 text-center">0%</td>
              <td className="p-3 text-center">110,00€</td>
              <td className="p-3 text-center">20%</td>
              <td className="p-3 text-center">220,00€</td>
              <td className="p-3 text-center">264,00€</td>
            </tr>
            <tr>
              <td className="p-3"></td>
              <td className="p-3">GRILLE DE PARE-CHOCS AV</td>
              <td className="p-3 text-center">1</td>
              <td className="p-3 text-center">5%</td>
              <td className="p-3 text-center">95,00€</td>
              <td className="p-3 text-center">20%</td>
              <td className="p-3 text-center">90,25€</td>
              <td className="p-3 text-center">108,30€</td>
            </tr>
            <tr>
              <td className="p-3"></td>
              <td className="p-3">CONDENSEUR DE CLIMATISATION MOTRIO</td>
              <td className="p-3 text-center">5</td>
              <td className="p-3 text-center">0%</td>
              <td className="p-3 text-center">0,00€</td>
              <td className="p-3 text-center">20%</td>
              <td className="p-3 text-center">0,00€</td>
              <td className="p-3 text-center">0,00€</td>
            </tr>
          </tbody>
        </table>
      </div>
       
      {/* Totaux */}
      <div className="mt-4 flex justify-end">
        <div className="w-56">
          <div className="space-y-1 text-base">
            <div className="flex justify-between font-bold">
              <span>Sous-total</span>
              <span>918,75 €</span>
            </div>
            <div className="flex justify-between">
              <span>TVA</span>
              <span>183,75 €</span>
            </div>
            <div className="flex justify-between font-bold text-lg bg-blue-600 text-white p-2">
              <span>TOTAL</span>
              <span>1 102,50 €</span>
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
import React from 'react';

interface AlternativeInvoicePreviewProps {
  companyData: any;
}

const AlternativeInvoicePreview = ({ companyData }: AlternativeInvoicePreviewProps) => {
  return (
    <div className="bg-white p-6 rounded shadow-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* En-tête avec entreprise et FACTURE */}
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
          <h2 className="text-3xl font-bold text-black mb-2">FACTURE N°5</h2>
          
          {/* Informations client déplacées ici */}
          <div className="text-left p-4">
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>JEAN DUPONT</strong></p>
              <p><strong>TEL :</strong> +33 6 12 34 56 78</p>
              <p><strong>EMAIL :</strong> jean.dupont@email.com</p>
              <p><strong>ADRESSE :</strong> 134 Boulevard Michelet</p>
              <p>13008 MARSEILLE</p>
              <p><strong>Immatriculation :</strong> AB-123-CD</p>
              <p><strong>Kilométrage :</strong> 85 678 Km</p>
              <p><strong>Véhicule :</strong> PEUGEOT 308</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dates avec coins arrondis et plus d'espace */}
      <div className="flex justify-center gap-48 mb-8">
        <div className="border-2 border-black rounded-lg px-4 py-2 text-center">
          <div className="font-bold text-sm mb-1">DATE</div>
          <div className="font-bold text-sm">11/12/2024</div>
        </div>
        <div className="border-2 border-black rounded-lg px-4 py-2 text-center">
          <div className="font-bold text-sm mb-1">DATE D'ECHANCE</div>
          <div className="font-bold text-sm">11/12/2024</div>
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
            <tr>
              <td className="border-r-2 border-black p-2 font-bold"></td>
              <td className="border-r-2 border-black p-2 font-bold">T1</td>
              <td className="border-r-2 border-black p-2 font-bold">2</td>
              <td className="border-r-2 border-black p-2 font-bold">0%</td>
              <td className="border-r-2 border-black p-2 font-bold">110,00€</td>
              <td className="border-r-2 border-black p-2 font-bold">20%</td>
              <td className="border-r-2 border-black p-2 font-bold">220,00€</td>
              <td className="p-2 font-bold">264,00€</td>
            </tr>
            <tr>
              <td className="border-r-2 border-black p-2 font-bold"></td>
              <td className="border-r-2 border-black p-2 font-bold">T2</td>
              <td className="border-r-2 border-black p-2 font-bold">2</td>
              <td className="border-r-2 border-black p-2 font-bold">0%</td>
              <td className="border-r-2 border-black p-2 font-bold">110,00€</td>
              <td className="border-r-2 border-black p-2 font-bold">20%</td>
              <td className="border-r-2 border-black p-2 font-bold">220,00€</td>
              <td className="p-2 font-bold">264,00€</td>
            </tr>
            <tr>
              <td className="border-r-2 border-black p-2 font-bold"></td>
              <td className="border-r-2 border-black p-2 font-bold">GRILLE DE PARE-CHOCS AV</td>
              <td className="border-r-2 border-black p-2 font-bold">1</td>
              <td className="border-r-2 border-black p-2 font-bold">5%</td>
              <td className="border-r-2 border-black p-2 font-bold">95,00€</td>
              <td className="border-r-2 border-black p-2 font-bold">20%</td>
              <td className="border-r-2 border-black p-2 font-bold">90,25€</td>
              <td className="p-2 font-bold">108,30€</td>
            </tr>
            <tr>
              <td className="border-r-2 border-black p-2 font-bold"></td>
              <td className="border-r-2 border-black p-2 font-bold">CONDENSEUR DE CLIMATISATION MOTRIO</td>
              <td className="border-r-2 border-black p-2 font-bold">5</td>
              <td className="border-r-2 border-black p-2 font-bold">0%</td>
              <td className="border-r-2 border-black p-2 font-bold">0,00€</td>
              <td className="border-r-2 border-black p-2 font-bold">20%</td>
              <td className="border-r-2 border-black p-2 font-bold">0,00€</td>
              <td className="p-2 font-bold">0,00€</td>
            </tr>
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
                <td className="border-r-2 border-black border-t-2 border-black p-2 font-bold">530,25€</td>
                <td className="border-r-2 border-black border-t-2 border-black p-2 font-bold">106,05€</td>
                <td className="border-r-2 border-black border-t-2 border-black p-2 font-bold">5,30€</td>
                <td className="border-t-2 border-black p-2 font-bold">630,00€</td>
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

export default AlternativeInvoicePreview;
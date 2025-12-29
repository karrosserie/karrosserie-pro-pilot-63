import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import QuoteMobileItemCard from './components/QuoteMobileItemCard';

interface AlternativeQuotePreviewProps {
  companyData: any;
  quoteData?: {
    number?: string;
    date?: string;
    validUntil?: string;
    vehicle?: string;
    licensePlate?: string;
    mileage?: string;
    claimNumber?: string;
    reportNumber?: string;
    policyNumber?: string;
    expertName?: string;
    incidentDate?: string;
    reportDate?: string;
    notes?: string;
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

const AlternativeQuotePreview = ({ companyData, quoteData, clientData, items, totals }: AlternativeQuotePreviewProps) => {
  const isMobile = useIsMobile();
  
  const quoteDataToUse = quoteData || {};
  const clientDataToUse = clientData || {};
  const itemsToUse = items || [];
  const totalsToUse = totals || {};

  return (
    <div className="bg-white p-3 sm:p-6 rounded shadow-sm h-full" style={{ fontFamily: 'Arial, sans-serif', backgroundColor: 'white', minHeight: '100%' }}>
      {/* En-tête avec entreprise et DEVIS - Stack sur mobile */}
      <div className={`${isMobile ? 'flex flex-col space-y-4' : 'flex justify-between items-start'} mb-6 sm:mb-8`}>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-red-600 mb-3 sm:mb-4">{companyData?.name || ''}</h1>
          <div className="text-xs sm:text-sm text-gray-700 space-y-0.5 sm:space-y-1">
            {companyData?.address && <p><strong>ADRESSE :</strong> {companyData.address}</p>}
            {(companyData?.zipcode || companyData?.city) && <p>{companyData?.zipcode || ''} {companyData?.city || ''}</p>}
            {companyData?.phone && <p><strong>TEL :</strong> {companyData.phone}</p>}
            {companyData?.email && <p className="break-all"><strong>EMAIL :</strong> {companyData.email}</p>}
            {companyData?.siret && <p><strong>SIRET :</strong> {companyData.siret}</p>}
            {companyData?.tva && <p><strong>TVA :</strong> {companyData.tva}</p>}
          </div>
        </div>
        <div className={isMobile ? '' : 'text-right'}>
          <h2 className="text-xl sm:text-3xl font-bold text-black">DEVIS N° {quoteDataToUse.number || ''}</h2>
          
          {/* Informations client */}
          <div className={`${isMobile ? 'text-left mt-3' : 'text-left p-4 w-2/3 ml-auto'}`}>
            <div className="text-xs sm:text-sm text-gray-600 space-y-0.5 sm:space-y-1">
              {clientDataToUse.name && <p><strong>{clientDataToUse.name}</strong></p>}
              {clientDataToUse.phone && <p><strong>TEL :</strong> {clientDataToUse.phone}</p>}
              {clientDataToUse.email && <p className="break-all"><strong>EMAIL :</strong> {clientDataToUse.email}</p>}
              {clientDataToUse.address && <p><strong>ADRESSE :</strong> {clientDataToUse.address}</p>}
              {clientDataToUse.city && <p>{clientDataToUse.city}</p>}
              {quoteDataToUse.licensePlate && <p><strong>Immatriculation :</strong> {quoteDataToUse.licensePlate}</p>}
              {quoteDataToUse.mileage && <p><strong>Kilométrage :</strong> {quoteDataToUse.mileage}</p>}
              {quoteDataToUse.vehicle && <p><strong>Véhicule :</strong> {quoteDataToUse.vehicle}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Date avec coins arrondis */}
      {quoteDataToUse.date && (
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="border-2 border-black rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-center">
            <div className="font-bold text-xs sm:text-sm mb-0.5 sm:mb-1">DATE</div>
            <div className="font-bold text-xs sm:text-sm">{quoteDataToUse.date}</div>
          </div>
        </div>
      )}

      {/* Tableau des articles - Cartes sur mobile */}
      {itemsToUse.length > 0 && (
        isMobile ? (
          <div className="space-y-2 mb-4">
            {itemsToUse.map((item, index) => (
              <QuoteMobileItemCard key={index} item={item} />
            ))}
          </div>
        ) : (
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
        )
      )}

      {/* Totaux - Vertical sur mobile */}
      {(totalsToUse.totalHT || totalsToUse.totalVAT || totalsToUse.totalDiscount || totalsToUse.totalTTC) && (
        <div className={isMobile ? '' : 'flex justify-end'}>
          <div className={`border-2 border-black rounded-lg overflow-hidden ${isMobile ? 'w-full' : ''}`}>
            {isMobile ? (
              <div className="text-xs">
                <div className="flex justify-between p-2 border-b border-black">
                  <span className="font-bold">Total HT</span>
                  <span className="font-bold">{totalsToUse.totalHT || '0,00 €'}</span>
                </div>
                <div className="flex justify-between p-2 border-b border-black">
                  <span className="font-bold">Total TVA</span>
                  <span className="font-bold">{totalsToUse.totalVAT || '0,00 €'}</span>
                </div>
                <div className="flex justify-between p-2 border-b border-black">
                  <span className="font-bold">Total Remise</span>
                  <span className="font-bold">{totalsToUse.totalDiscount || '0,00 €'}</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-100">
                  <span className="font-bold">Total TTC</span>
                  <span className="font-bold text-base">{totalsToUse.totalTTC || '0,00 €'}</span>
                </div>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {quoteDataToUse.notes && (
        <div className="mt-4 sm:mt-6">
          <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">Notes</h3>
          <p className="text-xs sm:text-sm">{quoteDataToUse.notes}</p>
        </div>
      )}

      {/* Footer */}
      {(companyData?.name || companyData?.address || companyData?.zipcode || companyData?.city || companyData?.siret || companyData?.tva || companyData?.phone || companyData?.email) && (
        <div className="mt-6 sm:mt-8 text-[10px] sm:text-xs text-center text-gray-500">
          <p className="break-words">
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

export default AlternativeQuotePreview;
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import InvoiceMobileItemCard from './components/InvoiceMobileItemCard';

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
  const isMobile = useIsMobile();
  
  const invoiceDataToUse = invoiceData || {};
  const clientDataToUse = clientData || {};
  const itemsToUse = items || [];
  const totalsToUse = totals || {};

  return (
    <div className="bg-white p-4 md:p-6 rounded shadow-sm h-full relative" style={{ fontFamily: 'Arial, sans-serif', backgroundColor: 'white', minHeight: '100%' }}>
      {/* Tampon ACQUITTÉ pour les factures payées */}
      {isPaid && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className={`transform -rotate-[30deg] border-4 border-green-500 text-green-500 ${isMobile ? 'text-3xl px-4 py-2' : 'text-5xl px-8 py-4'} font-bold rounded-lg opacity-40`}>
            ACQUITTÉ
          </div>
        </div>
      )}

      {/* En-tête avec entreprise et FACTURE */}
      <div className={`${isMobile ? 'flex flex-col space-y-4' : 'flex justify-between items-start'} mb-6 md:mb-8`}>
        <div>
          <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-red-600 mb-3 md:mb-4`}>{companyData?.name || ''}</h1>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 space-y-1`}>
            {companyData?.address && <p><strong>ADRESSE :</strong> {companyData.address}</p>}
            {(companyData?.zipcode || companyData?.city) && <p>{companyData?.zipcode || ''} {companyData?.city || ''}</p>}
            {companyData?.phone && <p><strong>TEL :</strong> {companyData.phone}</p>}
            {companyData?.email && <p><strong>EMAIL :</strong> {companyData.email}</p>}
            {companyData?.siret && <p><strong>SIRET :</strong> {companyData.siret}</p>}
            {companyData?.tva && <p><strong>TVA :</strong> {companyData.tva}</p>}
          </div>
        </div>
        <div className={isMobile ? '' : 'text-right'}>
          <h2 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-black`}>FACTURE N° {invoiceDataToUse.number || ''}</h2>
          
          {/* Informations client */}
          <div className={`text-left p-3 md:p-4 ${isMobile ? 'w-full mt-3' : 'w-2/3 ml-auto min-w-[300px]'}`}>
            <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 space-y-1`}>
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

      {/* Dates avec coins arrondis */}
      <div className={`flex ${isMobile ? 'flex-col gap-2' : 'justify-center gap-48'} mb-6 md:mb-8`}>
        {invoiceDataToUse.date && (
          <div className="border-2 border-black rounded-lg px-3 md:px-4 py-2 text-center">
            <div className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>DATE</div>
            <div className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'}`}>{invoiceDataToUse.date}</div>
          </div>
        )}
        {invoiceDataToUse.dueDate && (
          <div className="border-2 border-black rounded-lg px-3 md:px-4 py-2 text-center">
            <div className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>DATE D'ÉCHÉANCE</div>
            <div className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'}`}>{invoiceDataToUse.dueDate}</div>
          </div>
        )}
      </div>

      {/* Tableau des articles */}
      {itemsToUse.length > 0 && (
        isMobile ? (
          <div className="space-y-2 mb-6">
            {itemsToUse.map((item, index) => (
              <InvoiceMobileItemCard key={index} item={item} />
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

      {/* Totaux */}
      {(totalsToUse.totalHT || totalsToUse.totalVAT || totalsToUse.totalDiscount || totalsToUse.globalDiscount || totalsToUse.totalTTC) && (
        isMobile ? (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total HT:</span>
                <span className="font-semibold">{totalsToUse.totalHT || '0,00 €'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total TVA:</span>
                <span className="font-semibold">{totalsToUse.totalVAT || '0,00 €'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Remise:</span>
                <span className="font-semibold">{totalsToUse.totalDiscount || '0,00 €'}</span>
              </div>
              {totalsToUse.globalDiscount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Remise Globale:</span>
                  <span className="font-semibold text-red-600">-{totalsToUse.globalDiscount}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-300">
                <span className="font-bold">Total TTC:</span>
                <span className="font-bold text-lg">{totalsToUse.totalTTC || '0,00 €'}</span>
              </div>
            </div>
          </div>
        ) : (
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
        )
      )}

      {/* Notes */}
      {invoiceDataToUse.notes && (
        <div className="mt-4 md:mt-6">
          <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold mb-2`}>Notes</h3>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{invoiceDataToUse.notes}</p>
        </div>
      )}

      {/* Détails de paiement */}
      {invoiceDataToUse.payment_details && (
        <div className="mt-4 md:mt-6">
          <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold mb-2`}>Détails de paiement</h3>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{invoiceDataToUse.payment_details}</p>
        </div>
      )}

      {/* Footer */}
      {(companyData?.name || companyData?.address || companyData?.zipcode || companyData?.city || companyData?.siret || companyData?.tva || companyData?.phone || companyData?.email) && (
        <div className={`mt-6 md:mt-8 ${isMobile ? 'text-[10px]' : 'text-xs'} text-center text-gray-500`}>
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

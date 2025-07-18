
import React from 'react';
import DefaultQuoteHeader from './components/DefaultQuoteHeader';
import DefaultQuoteItemsTable from './components/DefaultQuoteItemsTable';
import DefaultQuoteTotals from './components/DefaultQuoteTotals';
import DefaultQuoteFooter from './components/DefaultQuoteFooter';

interface DefaultQuotePreviewProps {
  companyData: any;
  quoteData?: {
    number?: string;
    claimNumber?: string;
    billingDate?: string;
    validUntil?: string;
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
    notes?: string;
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

const DefaultQuotePreview = ({ companyData, quoteData, clientData, items, totals }: DefaultQuotePreviewProps) => {

  return (
    <div className="bg-white p-4 rounded shadow-sm w-full flex flex-col" style={{ minHeight: '100vh', height: 'auto', backgroundColor: 'white' }}>
      <DefaultQuoteHeader 
        companyData={companyData}
        quoteData={quoteData}
        clientData={clientData}
      />
      
      <DefaultQuoteItemsTable items={items} />
      <DefaultQuoteTotals totals={totals} clientData={clientData} />

      <DefaultQuoteFooter companyData={companyData} />
    </div>
  );
};

export default DefaultQuotePreview;

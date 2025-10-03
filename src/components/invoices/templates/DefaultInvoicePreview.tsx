import React from 'react';
import DefaultInvoiceHeader from './components/DefaultInvoiceHeader';
import DefaultInvoiceItemsTable from './components/DefaultInvoiceItemsTable';
import DefaultInvoiceTotals from './components/DefaultInvoiceTotals';
import DefaultInvoicePaymentsTable from './components/DefaultInvoicePaymentsTable';
import DefaultInvoiceFooter from './components/DefaultInvoiceFooter';

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
    notes?: string;
    payment_details?: string;
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
  payments?: any[];
  totalPaidAmount?: number;
  remainingAmount?: number;
}

const DefaultInvoicePreview = ({ companyData, invoiceData, clientData, items, totals, payments, totalPaidAmount, remainingAmount }: DefaultInvoicePreviewProps) => {
  // Utiliser uniquement les données réelles, pas de valeurs par défaut
  const invoiceDataToUse = invoiceData || {};
  const clientDataToUse = clientData || {};
  const itemsToUse = items || [];
  const totalsToUse = totals || {};

  return (
    <div className="bg-white p-2 sm:p-4 rounded shadow-sm w-full flex flex-col" style={{ minHeight: '100vh', height: 'auto', backgroundColor: 'white' }}>
      <DefaultInvoiceHeader
        companyData={companyData}
        invoiceData={invoiceDataToUse}
        clientData={clientDataToUse}
        remainingAmount={remainingAmount}
        totalPaidAmount={totalPaidAmount}
        payments={payments}
      />
      
      <DefaultInvoiceItemsTable items={itemsToUse} />
      <DefaultInvoiceTotals totals={totalsToUse} clientData={{ notes: invoiceDataToUse.notes }} />
      <DefaultInvoicePaymentsTable 
        clientData={{ notes: invoiceDataToUse.notes }} 
        invoiceData={{ payment_details: invoiceDataToUse.payment_details }}
        payments={payments}
        totalPaidAmount={totalPaidAmount}
        remainingAmount={remainingAmount}
      />

      <DefaultInvoiceFooter companyData={companyData} />
    </div>
  );
};

export default DefaultInvoicePreview;
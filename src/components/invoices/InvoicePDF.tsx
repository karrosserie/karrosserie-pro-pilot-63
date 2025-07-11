import React from 'react';
import { Document, Page } from '@react-pdf/renderer';
import { Invoice } from '@/services/supabase/invoices';
import { calculateInvoiceTotals } from '@/utils/invoiceCalculations';
import { pdfStyles } from './pdf/styles';
import InvoicePDFHeader from './pdf/InvoicePDFHeader';
import InvoicePDFItemsTable from './pdf/InvoicePDFItemsTable';
import InvoicePDFTotals from './pdf/InvoicePDFTotals';
import InvoicePDFPaymentsTable from './pdf/InvoicePDFPaymentsTable';
import InvoicePDFFooter from './pdf/InvoicePDFFooter';

interface InvoicePDFProps {
  invoice: Invoice;
  companyData: any;
  receipts?: any[];
}

const InvoicePDF = ({ invoice, companyData, receipts = [] }: InvoicePDFProps) => {
  const totals = calculateInvoiceTotals(invoice.repairs_data, invoice.parts_data);
  
  // Calculer le total des encaissements pour cette facture
  const totalPaidAmount = receipts
    ?.filter(receipt => receipt.invoice_id === invoice.id)
    ?.reduce((total, receipt) => total + (receipt.amount || 0), 0) || 0;

  // Filtrer les encaissements pour cette facture
  const invoicePayments = receipts?.filter(receipt => receipt.invoice_id === invoice.id) || [];

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <InvoicePDFHeader 
          invoice={invoice}
          companyData={companyData}
          totalPaidAmount={totalPaidAmount}
          finalTotal={totals.finalTotal}
        />

        <InvoicePDFItemsTable items={totals.allItems} />

        <InvoicePDFTotals 
          subtotalAfterDiscount={totals.subtotalAfterDiscount}
          totalVAT={totals.totalVAT}
          finalTotal={totals.finalTotal}
        />

        <InvoicePDFPaymentsTable 
          payments={invoicePayments}
          totalPaidAmount={totalPaidAmount}
          remainingAmount={totals.finalTotal - totalPaidAmount}
        />

        <InvoicePDFFooter companyData={companyData} />
      </Page>
    </Document>
  );
};

export default InvoicePDF;
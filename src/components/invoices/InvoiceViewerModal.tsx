import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Invoice } from '@/services/supabase/invoices';
import { useCompany } from '@/hooks/use-company';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { calculateInvoiceTotals } from '@/utils/invoiceCalculations';
import InvoiceHeader from './InvoiceHeader';
import InvoiceItemsTable from './InvoiceItemsTable';
import InvoiceTotals from './InvoiceTotals';
import InvoicePaymentsTable from './InvoicePaymentsTable';
import InvoiceFooter from './InvoiceFooter';

interface InvoiceViewerModalProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvoiceViewerModal = ({ invoice, open, onOpenChange }: InvoiceViewerModalProps) => {
  const { companyData } = useCompany();
  const { preferences } = useUserPreferences();
  
  if (!invoice) return null;

  const totals = calculateInvoiceTotals(invoice.repairs_data, invoice.parts_data);
  const template = preferences?.invoice_template || 'default';

  // Styles conditionnels selon le template
  const getTableClasses = () => {
    if (template === 'alternative') {
      return "border-2 border-black rounded-lg overflow-hidden";
    }
    return "";
  };

  const getTableRowClasses = () => {
    if (template === 'alternative') {
      return "border-b-2 border-black";
    }
    return "";
  };

  const getTableHeaderClasses = () => {
    if (template === 'alternative') {
      return "border-b-2 border-black bg-gray-50";
    }
    return "border-b";
  };

  const getTotalsClasses = () => {
    if (template === 'alternative') {
      return "border-2 border-black rounded-lg overflow-hidden";
    }
    return "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="bg-white">
          <InvoiceHeader 
            invoice={invoice} 
            companyData={companyData} 
            finalTotal={totals.finalTotal} 
          />

          <div className="p-6">
            <div className={getTableClasses()}>
              <InvoiceItemsTable 
                items={totals.allItems}
                tableRowClasses={getTableRowClasses()}
                tableHeaderClasses={getTableHeaderClasses()}
              />
            </div>
            
            <div className={getTotalsClasses()}>
              <InvoiceTotals 
                subtotalAfterDiscount={totals.subtotalAfterDiscount}
                totalVAT={totals.totalVAT}
                totalDiscount={totals.totalDiscount}
                finalTotal={totals.finalTotal}
                template={template}
              />
            </div>
            
            <InvoicePaymentsTable invoiceId={invoice.id} invoiceTotal={totals.finalTotal} />
            <InvoiceFooter companyData={companyData} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceViewerModal;
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Invoice } from '@/services/supabase/invoices';
import { useCompany } from '@/hooks/use-company';
import { calculateInvoiceTotals } from '@/utils/invoiceCalculations';
import InvoiceHeader from './InvoiceHeader';
import InvoiceItemsTable from './InvoiceItemsTable';
import InvoiceTotals from './InvoiceTotals';
import InvoiceFooter from './InvoiceFooter';

interface InvoiceViewerModalProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvoiceViewerModal = ({ invoice, open, onOpenChange }: InvoiceViewerModalProps) => {
  const { companyData } = useCompany();
  
  if (!invoice) return null;

  const totals = calculateInvoiceTotals(invoice.repairs_data, invoice.parts_data);

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
            <InvoiceItemsTable items={totals.allItems} />
            <InvoiceTotals 
              subtotalAfterDiscount={totals.subtotalAfterDiscount}
              totalVAT={totals.totalVAT}
              totalDiscount={totals.totalDiscount}
              finalTotal={totals.finalTotal}
            />
            <InvoiceFooter />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceViewerModal;
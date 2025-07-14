import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Invoice } from '@/services/supabase/invoices';
import { useCompany } from '@/hooks/use-company';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { calculateInvoiceTotals } from '@/utils/invoiceCalculations';
import DefaultInvoicePreview from './templates/DefaultInvoicePreview';
import AlternativeInvoicePreview from './templates/AlternativeInvoicePreview';

interface InvoiceViewerModalProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvoiceViewerModal = ({ invoice, open, onOpenChange }: InvoiceViewerModalProps) => {
  const { companyData } = useCompany();
  const { preferences } = useUserPreferences();
  
  if (!invoice) return null;

  const template = preferences?.invoice_template || 'default';

  // Préparer les données pour les composants de template
  const invoiceData = {
    number: invoice.reference,
    claimNumber: invoice.claim_number || undefined,
    billingDate: invoice.date || undefined,
    dueDate: invoice.due_date || undefined,
    vehicle: undefined, // Ces données peuvent être ajoutées si disponibles
    licensePlate: undefined,
    mileage: undefined,
    amountDue: `${invoice.amount.toFixed(2).replace('.', ',')} €`,
    date: invoice.date || undefined
  };

  // Récupérer les données client depuis l'invoice (à adapter selon votre structure)
  const clientData = {
    name: undefined, // Ces données devront être récupérées depuis la relation client
    address: undefined,
    city: undefined,
    phone: undefined,
    email: undefined
  };

  // Convertir les données des items
  const items = [];
  if (invoice.repairs_data) {
    const repairs = Array.isArray(invoice.repairs_data) ? invoice.repairs_data : [];
    items.push(...repairs.map((repair: any) => ({
      ref: repair.ref || '',
      description: repair.description || '',
      quantity: repair.quantity || 1,
      discount: repair.discount || 0,
      unitPrice: repair.price || 0,
      vat: 20, // À adapter selon vos données
      totalHT: (repair.price || 0) * (repair.quantity || 1) * (1 - (repair.discount || 0) / 100),
      totalTTC: (repair.price || 0) * (repair.quantity || 1) * (1 - (repair.discount || 0) / 100) * 1.2
    })));
  }

  if (invoice.parts_data) {
    const parts = Array.isArray(invoice.parts_data) ? invoice.parts_data : [];
    items.push(...parts.map((part: any) => ({
      ref: part.ref || '',
      description: part.description || '',
      quantity: part.quantity || 1,
      discount: part.discount || 0,
      unitPrice: part.price || 0,
      vat: 20, // À adapter selon vos données
      totalHT: (part.price || 0) * (part.quantity || 1) * (1 - (part.discount || 0) / 100),
      totalTTC: (part.price || 0) * (part.quantity || 1) * (1 - (part.discount || 0) / 100) * 1.2
    })));
  }

  const totals = calculateInvoiceTotals(invoice.repairs_data, invoice.parts_data);
  const totalsData = {
    subtotal: `${totals.subtotalAfterDiscount.toFixed(2).replace('.', ',')} €`,
    vat: `${totals.totalVAT.toFixed(2).replace('.', ',')} €`,
    total: `${totals.finalTotal.toFixed(2).replace('.', ',')} €`,
    totalHT: `${totals.subtotalAfterDiscount.toFixed(2).replace('.', ',')} €`,
    totalVAT: `${totals.totalVAT.toFixed(2).replace('.', ',')} €`,
    totalDiscount: `${totals.totalDiscount.toFixed(2).replace('.', ',')} €`,
    totalTTC: `${totals.finalTotal.toFixed(2).replace('.', ',')} €`
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="w-full h-full">
          {template === 'default' ? (
            <DefaultInvoicePreview 
              companyData={companyData}
              invoiceData={invoiceData}
              clientData={clientData}
              items={items}
              totals={totalsData}
            />
          ) : (
            <AlternativeInvoicePreview 
              companyData={companyData}
              invoiceData={invoiceData}
              clientData={clientData}
              items={items}
              totals={totalsData}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceViewerModal;
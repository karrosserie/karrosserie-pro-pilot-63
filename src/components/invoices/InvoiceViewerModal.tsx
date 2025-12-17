import React, { useEffect, useState, useMemo, memo, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';
import { Invoice } from '@/services/supabase/invoices';
import { calculateInvoiceTotals } from '@/utils/invoiceCalculations';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Printer, Download, Mail, CreditCard, FileX, Pencil, Trash } from 'lucide-react';
import DefaultInvoicePreview from './templates/DefaultInvoicePreview';
import AlternativeInvoicePreview from './templates/AlternativeInvoicePreview';
import { UseMutationResult } from '@tanstack/react-query';

interface InvoiceViewerModalProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deleteInvoice?: UseMutationResult<boolean, Error, string, unknown>;
  onEditInvoice?: (invoice: Invoice) => void;
  onSendEmail?: (invoice: Invoice) => void;
  onCreateReceipt?: (invoice: Invoice) => void;
  onCreateCredit?: (invoice: Invoice) => void;
  companyData?: any;
  preferences?: any;
}

const InvoiceViewerModal = ({ 
  invoice, 
  open, 
  onOpenChange,
  deleteInvoice: externalDeleteInvoice,
  onEditInvoice,
  onSendEmail,
  onCreateReceipt,
  onCreateCredit,
  companyData,
  preferences
}: InvoiceViewerModalProps) => {
  const { confirm } = useConfirmation();
  const isMountedRef = useRef(true);
  
  const handleDeleteMutation = async (id: string) => {
    if (externalDeleteInvoice) {
      return externalDeleteInvoice.mutateAsync(id);
    }
    const { invoicesService } = await import('@/services/supabase/invoices');
    return invoicesService.delete(id);
  };
  
  const [receiptsData, setReceiptsData] = useState<any[]>([]);
  
  // Reset mounted ref on mount/unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);
  
  // Fetch receipts with abort controller
  useEffect(() => {
    if (!invoice?.id || !open) {
      setReceiptsData([]);
      return;
    }
    
    let cancelled = false;
    
    const fetchReceipts = async () => {
      try {
        const { data: receipts } = await supabase
          .from('receipts')
          .select('*')
          .eq('invoice_id', invoice.id)
          .order('date', { ascending: true });
        
        if (!cancelled && isMountedRef.current && receipts) {
          setReceiptsData(receipts);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('[InvoiceViewerModal] fetchReceipts ERROR:', error);
        }
      }
    };
    
    fetchReceipts();
    
    return () => { cancelled = true; };
  }, [invoice?.id, open]);

  const { clientData, vehicleData } = useMemo(() => {
    if (!invoice) return { clientData: null, vehicleData: null };
    return { 
      clientData: (invoice as any).clients || null, 
      vehicleData: (invoice as any).vehicles || null 
    };
  }, [invoice]);

  if (!invoice) return null;

  const template = preferences?.invoice_template || 'default';
  const formatDateFr = (dateString: string | null | undefined) => {
    if (!dateString) return undefined;
    try { return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr }); } catch { return dateString; }
  };

  // Mémoriser les données formatées
  const invoiceData = useMemo(() => ({
    number: invoice.reference,
    claimNumber: invoice.claim_number || undefined,
    billingDate: formatDateFr(invoice.date),
    dueDate: formatDateFr(invoice.due_date),
    vehicle: vehicleData ? `${vehicleData.car_brands?.name || ''} ${vehicleData.car_models?.name || ''}`.trim() : undefined,
    licensePlate: vehicleData?.license_plate || undefined,
    mileage: vehicleData?.mileage ? `${vehicleData.mileage.toLocaleString('fr-FR')} km` : undefined,
    amountDue: `${invoice.amount.toFixed(2).replace('.', ',')} €`,
    date: formatDateFr(invoice.date),
    notes: invoice.notes || undefined,
    payment_details: invoice.payment_details || undefined
  }), [invoice, vehicleData]);

  const clientDataForTemplate = useMemo(() => ({
    name: clientData ? `${clientData.first_name || ''} ${clientData.last_name || ''}`.trim() : undefined,
    address: clientData?.address || undefined,
    city: clientData ? `${clientData.postal_code || ''} ${clientData.city || ''}`.trim() : undefined,
    phone: clientData?.phone || undefined,
    email: clientData?.email || undefined,
    licensePlate: vehicleData?.license_plate || undefined,
    mileage: vehicleData?.mileage ? `${vehicleData.mileage.toLocaleString('fr-FR')} km` : undefined,
    vehicle: vehicleData ? `${vehicleData.car_brands?.name || ''} ${vehicleData.car_models?.name || ''}`.trim() : undefined
  }), [clientData, vehicleData]);

  const items = useMemo(() => {
    const result: any[] = [];
    if (invoice.repairs_data) {
      const repairs = Array.isArray(invoice.repairs_data) ? invoice.repairs_data : [];
      result.push(...repairs.map((r: any) => ({ ref: r.ref || '', description: r.description || r.label || '', quantity: r.quantity || 1, discount: r.discount || 0, unitPrice: r.unitCost || r.price || 0, vat: r.vat || 20, totalHT: (r.unitCost || r.price || 0) * (r.quantity || 1) * (1 - (r.discount || 0) / 100), totalTTC: (r.unitCost || r.price || 0) * (r.quantity || 1) * (1 - (r.discount || 0) / 100) * (1 + (r.vat || 20) / 100) })));
    }
    if (invoice.parts_data) {
      const parts = Array.isArray(invoice.parts_data) ? invoice.parts_data : [];
      result.push(...parts.map((p: any) => ({ ref: p.ref || '', description: p.description || p.label || '', quantity: p.quantity || 1, discount: p.discount || 0, unitPrice: p.unitCost || p.price || 0, vat: p.vat || 20, totalHT: (p.unitCost || p.price || 0) * (p.quantity || 1) * (1 - (p.discount || 0) / 100), totalTTC: (p.unitCost || p.price || 0) * (p.quantity || 1) * (1 - (p.discount || 0) / 100) * (1 + (p.vat || 20) / 100) })));
    }
    return result;
  }, [invoice.repairs_data, invoice.parts_data]);

  const { totalsData, totalPaidAmount, remainingAmount, isPaid } = useMemo(() => {
    const totals = calculateInvoiceTotals(invoice.repairs_data, invoice.parts_data);
    const totalsFormatted = { 
      subtotal: `${totals.subtotalAfterDiscount.toFixed(2).replace('.', ',')} €`, 
      vat: `${totals.totalVAT.toFixed(2).replace('.', ',')} €`, 
      total: `${totals.finalTotal.toFixed(2).replace('.', ',')} €`, 
      totalHT: `${totals.subtotalAfterDiscount.toFixed(2).replace('.', ',')} €`, 
      totalVAT: `${totals.totalVAT.toFixed(2).replace('.', ',')} €`, 
      totalDiscount: `${totals.totalDiscount.toFixed(2).replace('.', ',')} €`, 
      totalTTC: `${totals.finalTotal.toFixed(2).replace('.', ',')} €` 
    };
    const paid = receiptsData.reduce((sum, receipt) => sum + receipt.amount, 0);
    const remaining = invoice.amount - paid;
    return {
      totalsData: totalsFormatted,
      totalPaidAmount: paid,
      remainingAmount: remaining,
      isPaid: (remaining <= 0 && paid > 0) || invoice.status === 'Payée'
    };
  }, [invoice.repairs_data, invoice.parts_data, invoice.amount, invoice.status, receiptsData]);

  const handleEdit = () => { if (onEditInvoice) onEditInvoice(invoice); };
  const handleDelete = async () => {
    const confirmed = await confirm({ title: 'Supprimer la facture', description: `Êtes-vous sûr de vouloir supprimer la facture ${invoice.reference} ?`, confirmText: 'Supprimer', cancelText: 'Annuler', variant: 'destructive' });
    if (confirmed) {
      try { await handleDeleteMutation(invoice.id); onOpenChange(false); toast({ title: "Facture supprimée", description: `La facture ${invoice.reference} a été supprimée.` }); }
      catch { toast({ title: "Erreur", description: "Impossible de supprimer la facture.", variant: "destructive" }); }
    }
  };
  const handleDownload = async () => { const { generateInvoicePDFWithTemplate } = await import('@/utils/invoicePDFGeneration'); const result = await generateInvoicePDFWithTemplate(invoice, companyData); if (result.success) toast({ title: "Téléchargement réussi", description: `La facture ${invoice.reference} a été téléchargée.` }); else toast({ title: "Erreur", description: "Impossible de télécharger.", variant: "destructive" }); };
  const handlePrint = async () => { const { printInvoicePDFWithTemplate } = await import('@/utils/invoicePDFGeneration'); const result = await printInvoicePDFWithTemplate(invoice, companyData); if (result.success) toast({ title: "Impression", description: `La facture ouverte pour impression.` }); else toast({ title: "Erreur", description: "Impossible d'imprimer.", variant: "destructive" }); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto p-0" onInteractOutside={(e) => e.preventDefault()}>
        <VisuallyHidden><DialogTitle>Aperçu facture {invoice.reference}</DialogTitle></VisuallyHidden>
        <div className="p-3 sm:p-4 pr-12 sm:pr-16 border-b bg-background">
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Aperçu de la facture n°{invoice.reference}</h2>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            {onEditInvoice && <Button variant="outline" size="sm" onClick={handleEdit} className="text-xs sm:text-sm h-8 sm:h-9"><Pencil className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" /><span className="hidden xs:inline ml-1">Modifier</span></Button>}
            <Button variant="outline" size="sm" onClick={handleDownload} className="text-xs sm:text-sm h-8 sm:h-9"><Download className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" /><span className="hidden xs:inline ml-1">Télécharger</span></Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs sm:text-sm h-8 sm:h-9"><Printer className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" /><span className="hidden xs:inline ml-1">Imprimer</span></Button>
            {onSendEmail && <Button variant="outline" size="sm" onClick={() => onSendEmail(invoice)} className="text-xs sm:text-sm h-8 sm:h-9"><Mail className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" /><span className="hidden xs:inline ml-1">Envoyer</span></Button>}
            {onCreateReceipt && <Button variant="outline" size="sm" onClick={() => onCreateReceipt(invoice)} className="text-xs sm:text-sm h-8 sm:h-9"><CreditCard className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" /><span className="hidden sm:inline ml-1">Paiement</span></Button>}
            {onCreateCredit && <Button variant="outline" size="sm" onClick={() => onCreateCredit(invoice)} className="text-xs sm:text-sm h-8 sm:h-9"><FileX className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" /><span className="hidden sm:inline ml-1">Avoir</span></Button>}
            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 border-red-500 hover:border-red-700 text-xs sm:text-sm h-8 sm:h-9" onClick={handleDelete}><Trash className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" /><span className="hidden xs:inline ml-1">Supprimer</span></Button>
          </div>
        </div>
        <div className="w-full h-full">
          {template === 'default' ? <DefaultInvoicePreview companyData={companyData} invoiceData={invoiceData} clientData={clientDataForTemplate} items={items} totals={totalsData} payments={receiptsData} totalPaidAmount={totalPaidAmount} remainingAmount={remainingAmount} isPaid={isPaid} /> : <AlternativeInvoicePreview companyData={companyData} invoiceData={invoiceData} clientData={clientDataForTemplate} items={items} totals={totalsData} payments={receiptsData} totalPaidAmount={totalPaidAmount} remainingAmount={remainingAmount} isPaid={isPaid} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Mémoriser le composant pour éviter les re-renders inutiles
export default memo(InvoiceViewerModal);

import React, { useEffect, useState, useMemo } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';
import { Invoice } from '@/services/supabase/invoices';
import { useCompany } from '@/hooks/use-company';
import { useCompanyPreferences } from '@/hooks/use-company-preferences';
import { useInvoices } from '@/hooks/use-invoices';
import { calculateInvoiceTotals } from '@/utils/invoiceCalculations';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Printer, Download, Mail, CreditCard, FileX, Pencil, Trash } from 'lucide-react';
import DefaultInvoicePreview from './templates/DefaultInvoicePreview';
import AlternativeInvoicePreview from './templates/AlternativeInvoicePreview';
import InvoiceDialog from './InvoiceDialog';
import InvoiceEmailDialog from './InvoiceEmailDialog';
import ReceiptDialog from '../receipts/ReceiptDialog';
import { CreditDialog } from '../credits/CreditDialog';

interface InvoiceViewerModalProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvoiceViewerModal = ({ invoice, open, onOpenChange }: InvoiceViewerModalProps) => {
  const { companyData } = useCompany();
  const { preferences } = useCompanyPreferences();
  const { deleteInvoice } = useInvoices();
  const { confirm } = useConfirmation();
  const [receiptsData, setReceiptsData] = useState<any[]>([]);
  
  // States for dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);

  // Utiliser directement la prop invoice - plus de souscription au cache
  const currentInvoice = invoice;
  
  // Récupérer uniquement les encaissements (client/véhicule sont dans invoice)
  useEffect(() => {
    const fetchReceipts = async () => {
      if (!currentInvoice?.id || !open) return;

      try {
        const { data: receipts } = await supabase
          .from('receipts')
          .select('*')
          .eq('invoice_id', currentInvoice.id)
          .order('date', { ascending: true });
        
        if (receipts) {
          setReceiptsData(receipts);
        }
      } catch (error) {
        // Silent fail
      }
    };

    if (open && currentInvoice) {
      fetchReceipts();
    }
  }, [currentInvoice?.id, open]);

  // Memoize les données client et véhicule depuis l'invoice
  const { clientData, vehicleData } = useMemo(() => {
    if (!currentInvoice) return { clientData: null, vehicleData: null };
    
    // Utiliser les données jointes si disponibles
    const client = (currentInvoice as any).clients || null;
    const vehicle = (currentInvoice as any).vehicles || null;
    
    return { clientData: client, vehicleData: vehicle };
  }, [currentInvoice]);

  if (!currentInvoice) return null;

  const template = preferences?.invoice_template || 'default';

  // Fonction pour formater les dates au format français dd/mm/yyyy
  const formatDateFr = (dateString: string | null | undefined) => {
    if (!dateString) return undefined;
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  // Préparer les données pour les composants de template
  const invoiceData = {
    number: currentInvoice.reference,
    claimNumber: currentInvoice.claim_number || undefined,
    billingDate: formatDateFr(currentInvoice.date),
    dueDate: formatDateFr(currentInvoice.due_date),
    vehicle: vehicleData ? `${vehicleData.car_brands?.name || ''} ${vehicleData.car_models?.name || ''}`.trim() : undefined,
    licensePlate: vehicleData?.license_plate || undefined,
    mileage: vehicleData?.mileage ? `${vehicleData.mileage.toLocaleString('fr-FR')} km` : undefined,
    amountDue: `${currentInvoice.amount.toFixed(2).replace('.', ',')} €`,
    date: formatDateFr(currentInvoice.date),
    notes: currentInvoice.notes || undefined,
    payment_details: currentInvoice.payment_details || undefined
  };

  // Préparer les données client pour le template
  const clientDataForTemplate = {
    name: clientData ? `${clientData.first_name || ''} ${clientData.last_name || ''}`.trim() : undefined,
    address: clientData?.address || undefined,
    city: clientData ? `${clientData.postal_code || ''} ${clientData.city || ''}`.trim() : undefined,
    phone: clientData?.phone || undefined,
    email: clientData?.email || undefined,
    licensePlate: vehicleData?.license_plate || undefined,
    mileage: vehicleData?.mileage ? `${vehicleData.mileage.toLocaleString('fr-FR')} km` : undefined,
    vehicle: vehicleData ? `${vehicleData.car_brands?.name || ''} ${vehicleData.car_models?.name || ''}`.trim() : undefined
  };

  // Convertir les données des items
  const items = [];
  if (currentInvoice.repairs_data) {
    const repairs = Array.isArray(currentInvoice.repairs_data) ? currentInvoice.repairs_data : [];
    items.push(...repairs.map((repair: any) => ({
      ref: repair.ref || '',
      description: repair.description || repair.label || '',
      quantity: repair.quantity || 1,
      discount: repair.discount || 0,
      unitPrice: repair.unitCost || repair.price || 0,
      vat: repair.vat || 20,
      totalHT: (repair.unitCost || repair.price || 0) * (repair.quantity || 1) * (1 - (repair.discount || 0) / 100),
      totalTTC: (repair.unitCost || repair.price || 0) * (repair.quantity || 1) * (1 - (repair.discount || 0) / 100) * (1 + (repair.vat || 20) / 100)
    })));
  }

  if (currentInvoice.parts_data) {
    const parts = Array.isArray(currentInvoice.parts_data) ? currentInvoice.parts_data : [];
    items.push(...parts.map((part: any) => ({
      ref: part.ref || '',
      description: part.description || part.label || '',
      quantity: part.quantity || 1,
      discount: part.discount || 0,
      unitPrice: part.unitCost || part.price || 0,
      vat: part.vat || 20,
      totalHT: (part.unitCost || part.price || 0) * (part.quantity || 1) * (1 - (part.discount || 0) / 100),
      totalTTC: (part.unitCost || part.price || 0) * (part.quantity || 1) * (1 - (part.discount || 0) / 100) * (1 + (part.vat || 20) / 100)
    })));
  }

  const totals = calculateInvoiceTotals(currentInvoice.repairs_data, currentInvoice.parts_data);
  const totalsData = {
    subtotal: `${totals.subtotalAfterDiscount.toFixed(2).replace('.', ',')} €`,
    vat: `${totals.totalVAT.toFixed(2).replace('.', ',')} €`,
    total: `${totals.finalTotal.toFixed(2).replace('.', ',')} €`,
    totalHT: `${totals.subtotalAfterDiscount.toFixed(2).replace('.', ',')} €`,
    totalVAT: `${totals.totalVAT.toFixed(2).replace('.', ',')} €`,
    totalDiscount: `${totals.totalDiscount.toFixed(2).replace('.', ',')} €`,
    totalTTC: `${totals.finalTotal.toFixed(2).replace('.', ',')} €`
  };

  // Calculer les montants de paiement
  const totalPaidAmount = receiptsData.reduce((sum, receipt) => sum + receipt.amount, 0);
  const remainingAmount = currentInvoice.amount - totalPaidAmount;
  
  // Vérifier si la facture est entièrement payée
  const isPaid = remainingAmount <= 0 && totalPaidAmount > 0;

  // Mémoriser les objets passés aux dialogues pour éviter les boucles infinies
  const receiptPreselect = useMemo(() => ({
    id: currentInvoice.id,
    amount: remainingAmount > 0 ? remainingAmount : currentInvoice.amount,
  }), [currentInvoice.id, remainingAmount, currentInvoice.amount]);

  const creditPreselect = useMemo(() => ({
    invoice_id: currentInvoice.id,
    reference: '',
    status: 'En attente' as const,
    amount: 0,
    notes: ''
  }), [currentInvoice.id]);

  // Action handlers
  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Supprimer la facture',
      description: `Êtes-vous sûr de vouloir supprimer la facture ${currentInvoice.reference} ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive'
    });

    if (confirmed) {
      try {
        await deleteInvoice.mutateAsync(currentInvoice.id);
        onOpenChange(false);
        toast({
          title: "Facture supprimée",
          description: `La facture ${currentInvoice.reference} a été supprimée avec succès.`,
        });
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la facture.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDownload = async () => {
    const { generateInvoicePDFWithTemplate } = await import('@/utils/invoicePDFGeneration');
    const result = await generateInvoicePDFWithTemplate(currentInvoice, companyData);
    if (result.success) {
      toast({
        title: "Téléchargement réussi",
        description: `La facture ${currentInvoice.reference} a été téléchargée.`
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger la facture.",
        variant: "destructive"
      });
    }
  };

  const handlePrint = async () => {
    const { printInvoicePDFWithTemplate } = await import('@/utils/invoicePDFGeneration');
    const result = await printInvoicePDFWithTemplate(currentInvoice, companyData);
    if (result.success) {
      toast({
        title: "Impression",
        description: `La facture ${currentInvoice.reference} a été ouverte pour impression.`
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'imprimer la facture.",
        variant: "destructive"
      });
    }
  };

  const handleSendEmail = () => {
    setEmailDialogOpen(true);
  };

  const handleCreateCredit = () => {
    setCreditDialogOpen(true);
  };

  const handleCreateReceipt = () => {
    setReceiptDialogOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto p-0">
          {/* Barre d'actions en haut */}
          <div className="p-3 sm:p-4 pr-12 sm:pr-16 border-b bg-background">
            <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Aperçu de la facture n°{currentInvoice.reference}</h2>
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={handleEdit} className="text-xs sm:text-sm h-8 sm:h-9">
                <Pencil className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden xs:inline ml-1">Modifier</span>
              </Button>

              <Button variant="outline" size="sm" onClick={handleDownload} className="text-xs sm:text-sm h-8 sm:h-9">
                <Download className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden xs:inline ml-1">Télécharger</span>
              </Button>

              <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs sm:text-sm h-8 sm:h-9">
                <Printer className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden xs:inline ml-1">Imprimer</span>
              </Button>

              <Button variant="outline" size="sm" onClick={handleSendEmail} className="text-xs sm:text-sm h-8 sm:h-9">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden xs:inline ml-1">Envoyer</span>
              </Button>

              <Button variant="outline" size="sm" onClick={handleCreateReceipt} className="text-xs sm:text-sm h-8 sm:h-9">
                <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden sm:inline ml-1">Paiement</span>
              </Button>

              <Button variant="outline" size="sm" onClick={handleCreateCredit} className="text-xs sm:text-sm h-8 sm:h-9">
                <FileX className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden sm:inline ml-1">Avoir</span>
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500 hover:text-red-700 border-red-500 hover:border-red-700 text-xs sm:text-sm h-8 sm:h-9" 
                onClick={handleDelete}
              >
                <Trash className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden xs:inline ml-1">Supprimer</span>
              </Button>
            </div>
          </div>
          <div className="w-full h-full">
            {template === 'default' ? (
              <DefaultInvoicePreview 
                companyData={companyData}
                invoiceData={invoiceData}
                clientData={clientDataForTemplate}
                items={items}
                totals={totalsData}
                payments={receiptsData}
                totalPaidAmount={totalPaidAmount}
                remainingAmount={remainingAmount}
                isPaid={isPaid}
              />
            ) : (
              <AlternativeInvoicePreview 
                companyData={companyData}
                invoiceData={invoiceData}
                clientData={clientDataForTemplate}
                items={items}
                totals={totalsData}
                payments={receiptsData}
                totalPaidAmount={totalPaidAmount}
                remainingAmount={remainingAmount}
                isPaid={isPaid}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogues pour les actions - rendu conditionnel */}
      {editDialogOpen && (
        <InvoiceDialog
          invoice={currentInvoice}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}

      {emailDialogOpen && (
        <InvoiceEmailDialog
          invoice={currentInvoice}
          open={emailDialogOpen}
          onOpenChange={setEmailDialogOpen}
        />
      )}

      {receiptDialogOpen && (
        <ReceiptDialog
          open={receiptDialogOpen}
          onOpenChange={setReceiptDialogOpen}
          preselectedInvoice={receiptPreselect}
        />
      )}

      {creditDialogOpen && (
        <CreditDialog
          open={creditDialogOpen}
          onOpenChange={setCreditDialogOpen}
          credit={creditPreselect}
        />
      )}
    </>
  );
};

export default InvoiceViewerModal;
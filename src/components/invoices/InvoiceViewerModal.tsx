import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
import { Edit, Trash2, Printer, Download, Mail, FileText, CreditCard } from 'lucide-react';
import DefaultInvoicePreview from './templates/DefaultInvoicePreview';
import AlternativeInvoicePreview from './templates/AlternativeInvoicePreview';
import InvoiceDialog from './InvoiceDialog';
import InvoiceEmailDialog from './InvoiceEmailDialog';
import ReceiptDialog from '../receipts/ReceiptDialog';

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
  const [clientData, setClientData] = useState<any>(null);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [receiptsData, setReceiptsData] = useState<any[]>([]);
  
  // States for dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  
  // Récupérer les données client et véhicule depuis la base de données
  useEffect(() => {
    const fetchRelatedData = async () => {
      if (!invoice) return;

      try {
        // Récupérer les données client
        if (invoice.client_id) {
          const { data: client } = await supabase
            .from('clients')
            .select('*')
            .eq('id', invoice.client_id)
            .single();
          
          if (client) {
            setClientData(client);
          }
        }

        // Récupérer les données véhicule avec les informations de marque et modèle
        if (invoice.vehicle_id) {
          const { data: vehicle } = await supabase
            .from('vehicles')
            .select(`
              *,
              car_brands(name),
              car_models(name)
            `)
            .eq('id', invoice.vehicle_id)
            .single();
          
          if (vehicle) {
            setVehicleData(vehicle);
          }
        }

        // Récupérer les encaissements liés à cette facture
        const { data: receipts } = await supabase
          .from('receipts')
          .select('*')
          .eq('invoice_id', invoice.id)
          .order('date', { ascending: true });
        
        if (receipts) {
          setReceiptsData(receipts);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    if (open && invoice) {
      fetchRelatedData();
    }
  }, [invoice, open]);

  if (!invoice) return null;

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
  if (invoice.repairs_data) {
    const repairs = Array.isArray(invoice.repairs_data) ? invoice.repairs_data : [];
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

  if (invoice.parts_data) {
    const parts = Array.isArray(invoice.parts_data) ? invoice.parts_data : [];
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

  // Calculer les montants de paiement
  const totalPaidAmount = receiptsData.reduce((sum, receipt) => sum + receipt.amount, 0);
  const remainingAmount = invoice.amount - totalPaidAmount;

  // Action handlers
  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Supprimer la facture',
      description: `Êtes-vous sûr de vouloir supprimer la facture ${invoice.reference} ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive'
    });

    if (confirmed) {
      try {
        await deleteInvoice.mutateAsync(invoice.id);
        onOpenChange(false);
        toast({
          title: "Facture supprimée",
          description: `La facture ${invoice.reference} a été supprimée avec succès.`,
        });
      } catch (error: any) {
        console.error('Error deleting invoice:', error);
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
    const result = await generateInvoicePDFWithTemplate(invoice, {});
    if (result.success) {
      toast({
        title: "Téléchargement réussi",
        description: `La facture ${invoice.reference} a été téléchargée.`
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
    const result = await printInvoicePDFWithTemplate(invoice, {});
    if (result.success) {
      toast({
        title: "Impression",
        description: `La facture ${invoice.reference} a été ouverte pour impression.`
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

  const handleRequestDocuments = async () => {
    try {
      const { tokensService } = await import('@/services/supabase/tokens');
      
      await tokensService.createToken({
        company_id: invoice.company_id!,
        client_id: invoice.client_id,
        vehicule_id: invoice.vehicle_id
      });

      toast({
        title: "Demande de justificatifs",
        description: `Demande de justificatifs envoyée pour la facture ${invoice.reference}. Token créé avec succès.`
      });
    } catch (error) {
      console.error('Erreur lors de la création du token:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le token pour la demande de justificatifs.",
        variant: "destructive"
      });
    }
  };

  const handleCreateReceipt = () => {
    setReceiptDialogOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {/* Barre d'actions en haut */}
          <div className="flex items-center justify-between gap-2 p-4 pr-16 border-b bg-background">
            <h2 className="text-lg font-semibold">Aperçu de la facture {invoice.reference}</h2>
            <div className="flex items-center gap-1 mr-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="h-10 w-10 p-0"
                title="Modifier"
              >
                <Edit className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-10 w-10 p-0 text-destructive hover:text-destructive"
                title="Supprimer"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
              <Separator orientation="vertical" className="h-8 mx-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                className="h-10 w-10 p-0"
                title="Imprimer"
              >
                <Printer className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="h-10 w-10 p-0"
                title="Télécharger"
              >
                <Download className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSendEmail}
                className="h-10 w-10 p-0"
                title="Envoyer par e-mail"
              >
                <Mail className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRequestDocuments}
                className="h-10 w-10 p-0"
                title="Demander les justificatifs"
              >
                <FileText className="h-5 w-5" />
              </Button>
              <Separator orientation="vertical" className="h-8 mx-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCreateReceipt}
                className="h-10 w-10 p-0"
                title="Créer un encaissement"
              >
                <CreditCard className="h-5 w-5" />
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
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogues pour les actions */}
      <InvoiceDialog
        invoice={invoice}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <InvoiceEmailDialog
        invoice={invoice}
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
      />

      <ReceiptDialog
        open={receiptDialogOpen}
        onOpenChange={setReceiptDialogOpen}
        preselectedInvoice={{
          id: invoice.id,
          amount: remainingAmount > 0 ? remainingAmount : invoice.amount,
        }}
      />
    </>
  );
};

export default InvoiceViewerModal;
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
import { useQueryClient } from '@tanstack/react-query';
import { calculateInvoiceTotals } from '@/utils/invoiceCalculations';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit, Trash2, Printer, Download, Mail, CreditCard, FileX, Pencil, Trash } from 'lucide-react';
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
  const queryClient = useQueryClient();
  const [clientData, setClientData] = useState<any>(null);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [receiptsData, setReceiptsData] = useState<any[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(invoice);
  
  // States for dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);

  // Mettre à jour la facture actuelle quand la prop change
  useEffect(() => {
    setCurrentInvoice(invoice);
  }, [invoice]);

  // Écouter les mises à jour du cache React Query pour cette facture spécifique
  useEffect(() => {
    if (!currentInvoice?.id) return;

    const refetchInvoiceData = async () => {
      try {
        // Récupérer les données mises à jour depuis le cache React Query
        const cachedInvoices = queryClient.getQueryData(['invoices']) as Invoice[] | undefined;
        if (cachedInvoices) {
          const updatedInvoice = cachedInvoices.find(i => i.id === currentInvoice.id);
          if (updatedInvoice) {
            console.log('Invoice updated from cache:', updatedInvoice);
            setCurrentInvoice(updatedInvoice);
          }
        }
      } catch (error) {
        console.error('Error refreshing invoice data:', error);
      }
    };

    // Écouter les invalidations du cache des factures
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.query?.queryKey?.[0] === 'invoices' && event.type === 'updated') {
        refetchInvoiceData();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentInvoice?.id, queryClient]);
  
  // Récupérer les données client et véhicule depuis la base de données
  useEffect(() => {
    const fetchRelatedData = async () => {
      if (!currentInvoice) return;

      try {
        // Récupérer les données client
        if (currentInvoice.client_id) {
          const { data: client } = await supabase
            .from('clients')
            .select('*')
            .eq('id', currentInvoice.client_id)
            .single();
          
          if (client) {
            setClientData(client);
          }
        }

        // Récupérer les données véhicule avec les informations de marque et modèle
        if (currentInvoice.vehicle_id) {
          const { data: vehicle } = await supabase
            .from('vehicles')
            .select(`
              *,
              car_brands(name),
              car_models(name)
            `)
            .eq('id', currentInvoice.vehicle_id)
            .single();
          
          if (vehicle) {
            setVehicleData(vehicle);
          }
        }

        // Récupérer les encaissements liés à cette facture
        const { data: receipts } = await supabase
          .from('receipts')
          .select('*')
          .eq('invoice_id', currentInvoice.id)
          .order('date', { ascending: true });
        
        if (receipts) {
          setReceiptsData(receipts);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    if (open && currentInvoice) {
      fetchRelatedData();
    }
  }, [currentInvoice, open]);

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
    const result = await generateInvoicePDFWithTemplate(currentInvoice, {});
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
    const result = await printInvoicePDFWithTemplate(currentInvoice, {});
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {/* Barre d'actions en haut */}
          <div className="p-4 pr-16 border-b bg-background">
            <h2 className="text-lg font-semibold mb-3">Aperçu de la facture n°{currentInvoice.reference}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Pencil className="h-4 w-4 mr-1" />
                Modifier
              </Button>

              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                Télécharger
              </Button>

              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-1" />
                Imprimer
              </Button>

              <Button variant="outline" size="sm" onClick={handleSendEmail}>
                <Mail className="h-4 w-4 mr-1" />
                Envoyer
              </Button>

              <Button variant="outline" size="sm" onClick={handleCreateReceipt}>
                <CreditCard className="h-4 w-4 mr-1" />
                Créer un paiement
              </Button>

              <Button variant="outline" size="sm" onClick={handleCreateCredit}>
                <FileX className="h-4 w-4 mr-1" />
                Créer un avoir
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500 hover:text-red-700 border-red-500 hover:border-red-700" 
                onClick={handleDelete}
              >
                <Trash className="h-4 w-4 mr-1" />
                Supprimer
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
        invoice={currentInvoice}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <InvoiceEmailDialog
        invoice={currentInvoice}
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
      />

      <ReceiptDialog
        open={receiptDialogOpen}
        onOpenChange={setReceiptDialogOpen}
        preselectedInvoice={{
          id: currentInvoice.id,
          amount: remainingAmount > 0 ? remainingAmount : currentInvoice.amount,
        }}
      />

      <CreditDialog
        open={creditDialogOpen}
        onOpenChange={setCreditDialogOpen}
        credit={{
          invoice_id: currentInvoice.id,
          reference: '',
          status: 'En attente',
          amount: 0,
          notes: ''
        }}
      />
    </>
  );
};

export default InvoiceViewerModal;
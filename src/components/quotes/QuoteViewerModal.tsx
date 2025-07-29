import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';
import { Quote } from '@/services/supabase/quotes';
import { useCompany } from '@/hooks/use-company';
import { useCompanyPreferences } from '@/hooks/use-company-preferences';
import { useQuotes } from '@/hooks/use-quotes';
import { calculateGlobalTotals } from '@/components/quotes/form/utils/calculations';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit, Trash2, Printer, Download, Mail, FileText, Wrench } from 'lucide-react';
import DefaultQuotePreview from './templates/DefaultQuotePreview';
import AlternativeQuotePreview from './templates/AlternativeQuotePreview';
import QuoteDialog from './QuoteDialog';
import QuoteEmailDialog from './QuoteEmailDialog';
import RepairOrderDialog from '../repair-orders/RepairOrderDialog';
import { RepairOrder } from '@/services/supabase/repair-orders';

interface QuoteViewerModalProps {
  quote: Quote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuoteViewerModal = ({ quote, open, onOpenChange }: QuoteViewerModalProps) => {
  const { companyData } = useCompany();
  const { preferences } = useCompanyPreferences();
  const { deleteQuote } = useQuotes();
  const { confirm } = useConfirmation();
  const [clientData, setClientData] = useState<any>(null);
  const [vehicleData, setVehicleData] = useState<any>(null);
  
  // States for dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [repairOrderDialogOpen, setRepairOrderDialogOpen] = useState(false);
  const [prefilledRepairOrder, setPrefilledRepairOrder] = useState<Partial<RepairOrder> | null>(null);
  
  useEffect(() => {
    const fetchRelatedData = async () => {
      if (!quote) return;

      try {
        // Récupérer les données client
        if (quote.client_id) {
          const { data: client } = await supabase
            .from('clients')
            .select('*')
            .eq('id', quote.client_id)
            .single();
          
          if (client) {
            setClientData(client);
          }
        }

        // Récupérer les données véhicule avec les informations de marque et modèle
        if (quote.vehicle_id) {
          const { data: vehicle } = await supabase
            .from('vehicles')
            .select(`
              *,
              car_brands(name),
              car_models(name)
            `)
            .eq('id', quote.vehicle_id)
            .single();
          
          if (vehicle) {
            setVehicleData(vehicle);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    if (open && quote) {
      fetchRelatedData();
    }
  }, [quote, open]);

  if (!quote) return null;

  const template = preferences?.invoice_template || 'default';

  const formatDateFr = (dateString: string | null | undefined) => {
    if (!dateString) return undefined;
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  let repairs = [];
  let parts = [];
  let discounts = [];
  
  try {
    repairs = quote.repairs_data ? JSON.parse(quote.repairs_data as string) : [];
  } catch (e) {
    console.error('Error parsing repairs data:', e);
  }
  
  try {
    parts = quote.parts_data ? JSON.parse(quote.parts_data as string) : [];
  } catch (e) {
    console.error('Error parsing parts data:', e);
  }
  
  try {
    discounts = quote.discounts_data ? JSON.parse(quote.discounts_data as string) : [];
  } catch (e) {
    console.error('Error parsing discounts data:', e);
  }

  const totals = calculateGlobalTotals(repairs, parts, discounts);

  const quoteData = {
    number: quote.reference,
    claimNumber: quote.claim_number || undefined,
    billingDate: formatDateFr(quote.created_at),
    validUntil: formatDateFr(quote.valid_until),
    vehicle: vehicleData ? `${vehicleData.car_brands?.name || ''} ${vehicleData.car_models?.name || ''}`.trim() : undefined,
    licensePlate: vehicleData?.license_plate || undefined,
    mileage: vehicleData?.mileage ? `${vehicleData.mileage.toLocaleString('fr-FR')} km` : undefined,
    amountDue: `${totals.total.toFixed(2).replace('.', ',')} €`,
    date: formatDateFr(quote.created_at),
    reportNumber: quote.report_number || undefined,
    policyNumber: quote.policy_number || undefined,
    expertName: quote.expert_name || undefined,
    incidentDate: formatDateFr(quote.incident_date),
    reportDate: formatDateFr(quote.report_date),
    notes: quote.notes || undefined
  };

  const clientDataForTemplate = {
    name: clientData ? `${clientData.first_name || ''} ${clientData.last_name || ''}`.trim() : undefined,
    address: clientData?.address || undefined,
    city: clientData ? `${clientData.postal_code || ''} ${clientData.city || ''}`.trim() : undefined,
    phone: clientData?.phone || undefined,
    email: clientData?.email || undefined,
    licensePlate: vehicleData?.license_plate || undefined,
    mileage: vehicleData?.mileage ? `${vehicleData.mileage.toLocaleString('fr-FR')} km` : undefined,
    vehicle: vehicleData ? `${vehicleData.car_brands?.name || ''} ${vehicleData.car_models?.name || ''}`.trim() : undefined,
    notes: quote.notes || undefined
  };

  const items = [];
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

  const totalsData = {
    subtotal: `${totals.subTotal.toFixed(2).replace('.', ',')} €`,
    vat: `${totals.totalVat.toFixed(2).replace('.', ',')} €`,
    total: `${totals.total.toFixed(2).replace('.', ',')} €`,
    totalHT: `${totals.subTotal.toFixed(2).replace('.', ',')} €`,
    totalVAT: `${totals.totalVat.toFixed(2).replace('.', ',')} €`,
    totalDiscount: `${totals.totalDiscount.toFixed(2).replace('.', ',')} €`,
    totalTTC: `${totals.total.toFixed(2).replace('.', ',')} €`
  };

  // Action handlers
  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Supprimer le devis',
      description: `Êtes-vous sûr de vouloir supprimer le devis ${quote.reference} ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive'
    });

    if (confirmed) {
      try {
        await deleteQuote.mutateAsync(quote.id);
        onOpenChange(false);
        toast({
          title: "Devis supprimé",
          description: `Le devis ${quote.reference} a été supprimé avec succès.`,
        });
      } catch (error: any) {
        console.error('Error deleting quote:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le devis.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDownload = async () => {
    const { generateQuotePDFWithTemplate } = await import('@/utils/quotePDFGeneration');
    const result = await generateQuotePDFWithTemplate(quote, {});
    if (result.success) {
      toast({
        title: "Téléchargement réussi",
        description: `Le devis ${quote.reference} a été téléchargé.`
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le devis.",
        variant: "destructive"
      });
    }
  };

  const handlePrint = async () => {
    const { printQuotePDFWithTemplate } = await import('@/utils/quotePDFGeneration');
    const result = await printQuotePDFWithTemplate(quote, {});
    if (result.success) {
      toast({
        title: "Impression",
        description: `Le devis ${quote.reference} a été ouvert pour impression.`
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'imprimer le devis.",
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
        company_id: quote.company_id!,
        client_id: quote.client_id,
        vehicule_id: quote.vehicle_id
      });

      toast({
        title: "Demande de justificatifs",
        description: `Demande de justificatifs envoyée pour le devis ${quote.reference}. Token créé avec succès.`
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

  const handleConvertToRepairOrder = () => {
    const prefilledOrder: Partial<RepairOrder> = {
      client_id: quote.client_id,
      vehicle_id: quote.vehicle_id,
      quote_id: quote.id,
      status: 'En cours',
      notes: quote.notes || '',
      claim_number: quote.claim_number || '',
      report_number: quote.report_number || '',
      policy_number: quote.policy_number || '',
      report_date: quote.report_date || '',
      expert_name: quote.expert_name || '',
      incident_date: quote.incident_date || '',
      repairs_data: JSON.stringify(repairs),
      parts_data: JSON.stringify(parts),
      discounts_data: JSON.stringify(discounts),
    };

    setPrefilledRepairOrder(prefilledOrder);
    setRepairOrderDialogOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {/* Barre d'actions en haut */}
          <div className="flex items-center justify-between gap-2 p-4 border-b bg-background">
            <h2 className="text-lg font-semibold">Aperçu du devis {quote.reference}</h2>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="h-8 w-8 p-0"
                title="Modifier"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                className="h-8 w-8 p-0"
                title="Imprimer"
              >
                <Printer className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="h-8 w-8 p-0"
                title="Télécharger"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSendEmail}
                className="h-8 w-8 p-0"
                title="Envoyer par e-mail"
              >
                <Mail className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRequestDocuments}
                className="h-8 w-8 p-0"
                title="Demander les justificatifs"
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleConvertToRepairOrder}
                className="h-8 w-8 p-0"
                title="Convertir en ordre de réparation"
              >
                <Wrench className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="w-full h-full">
            {template === 'default' ? (
              <DefaultQuotePreview 
                companyData={companyData}
                quoteData={quoteData}
                clientData={clientDataForTemplate}
                items={items}
                totals={totalsData}
              />
            ) : (
              <AlternativeQuotePreview 
                companyData={companyData}
                quoteData={quoteData}
                clientData={clientDataForTemplate}
                items={items}
                totals={totalsData}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogues pour les actions */}
      <QuoteDialog
        quote={quote}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <QuoteEmailDialog
        quote={quote}
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
      />

      <RepairOrderDialog
        order={prefilledRepairOrder as RepairOrder}
        open={repairOrderDialogOpen}
        onOpenChange={setRepairOrderDialogOpen}
        onSuccess={() => {
          setRepairOrderDialogOpen(false);
          toast({
            title: "Ordre de réparation créé",
            description: `L'ordre de réparation a été créé à partir du devis ${quote.reference}.`
          });
        }}
      />
    </>
  );
};

export default QuoteViewerModal;

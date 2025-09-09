import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';
import { Quote } from '@/services/supabase/quotes';
import { useCompany } from '@/hooks/use-company';
import { useCompanyPreferences } from '@/hooks/use-company-preferences';
import { useQuotes } from '@/hooks/use-quotes';
import { useQueryClient } from '@tanstack/react-query';
import { calculateGlobalTotals } from '@/components/quotes/form/utils/calculations';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit, Trash, Printer, Download, Mail, FileText, Wrench, Eye, Pencil, FileCheck, ArrowRight } from 'lucide-react';
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
  const navigate = useNavigate();
  const { companyData } = useCompany();
  const { preferences } = useCompanyPreferences();
  const { deleteQuote } = useQuotes();
  const { confirm } = useConfirmation();
  const queryClient = useQueryClient();
  const [clientData, setClientData] = useState<any>(null);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(quote);
  
  // States for dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [repairOrderDialogOpen, setRepairOrderDialogOpen] = useState(false);
  const [prefilledRepairOrder, setPrefilledRepairOrder] = useState<Partial<RepairOrder> | null>(null);

  // Mettre à jour le devis actuel quand la prop change
  useEffect(() => {
    setCurrentQuote(quote);
  }, [quote]);

  // Écouter les mises à jour du cache React Query pour ce devis spécifique
  useEffect(() => {
    if (!currentQuote?.id) return;

    const refetchQuoteData = async () => {
      try {
        // Récupérer les données mises à jour depuis le cache React Query
        const cachedQuotes = queryClient.getQueryData(['quotes']) as Quote[] | undefined;
        if (cachedQuotes) {
          const updatedQuote = cachedQuotes.find(q => q.id === currentQuote.id);
          if (updatedQuote) {
            console.log('Quote updated from cache:', updatedQuote);
            setCurrentQuote(updatedQuote);
          }
        }
      } catch (error) {
        console.error('Error refreshing quote data:', error);
      }
    };

    // Écouter les invalidations du cache des devis
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.query?.queryKey?.[0] === 'quotes' && event.type === 'updated') {
        refetchQuoteData();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentQuote?.id, queryClient]);
  
  useEffect(() => {
    const fetchRelatedData = async () => {
      if (!currentQuote) return;

      try {
        // Récupérer les données client
        if (currentQuote.client_id) {
          const { data: client } = await supabase
            .from('clients')
            .select('*')
            .eq('id', currentQuote.client_id)
            .single();
          
          if (client) {
            setClientData(client);
          }
        }

        // Récupérer les données véhicule avec les informations de marque et modèle
        if (currentQuote.vehicle_id) {
          const { data: vehicle } = await supabase
            .from('vehicles')
            .select(`
              *,
              car_brands(name),
              car_models(name)
            `)
            .eq('id', currentQuote.vehicle_id)
            .single();
          
          if (vehicle) {
            setVehicleData(vehicle);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    if (open && currentQuote) {
      fetchRelatedData();
    }
  }, [currentQuote, open]);

  if (!currentQuote) return null;

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
  
  // Helper function to clean numeric values and replace NaN with 0
  const cleanNumericValue = (value: any): number => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Helper function to clean data arrays
  const cleanDataArray = (data: any[]): any[] => {
    return data.map(item => ({
      ...item,
      quantity: cleanNumericValue(item.quantity),
      unitCost: cleanNumericValue(item.unitCost),
      discount: cleanNumericValue(item.discount),
      vat: cleanNumericValue(item.vat),
      total: cleanNumericValue(item.total)
    }));
  };

  try {
    const parsedRepairs = currentQuote.repairs_data ? JSON.parse(currentQuote.repairs_data as string) : [];
    repairs = Array.isArray(parsedRepairs) ? cleanDataArray(parsedRepairs) : [];
  } catch (e) {
    console.error('Error parsing repairs data:', e);
    repairs = [];
  }
  
  try {
    const parsedParts = currentQuote.parts_data ? JSON.parse(currentQuote.parts_data as string) : [];
    parts = Array.isArray(parsedParts) ? cleanDataArray(parsedParts) : [];
  } catch (e) {
    console.error('Error parsing parts data:', e);
    parts = [];
  }
  
  try {
    const parsedDiscounts = currentQuote.discounts_data ? JSON.parse(currentQuote.discounts_data as string) : [];
    discounts = Array.isArray(parsedDiscounts) ? parsedDiscounts.map(item => ({
      ...item,
      amount: cleanNumericValue(item.amount)
    })) : [];
  } catch (e) {
    console.error('Error parsing discounts data:', e);
    discounts = [];
  }

  const totals = calculateGlobalTotals(repairs, parts, discounts);

  const quoteData = {
    number: currentQuote.reference,
    claimNumber: currentQuote.claim_number || undefined,
    billingDate: formatDateFr(currentQuote.created_at),
    validUntil: formatDateFr(currentQuote.valid_until),
    vehicle: vehicleData ? `${vehicleData.car_brands?.name || ''} ${vehicleData.car_models?.name || ''}`.trim() : undefined,
    licensePlate: vehicleData?.license_plate || undefined,
    mileage: vehicleData?.mileage ? `${vehicleData.mileage.toLocaleString('fr-FR')} km` : undefined,
    amountDue: `${totals.total.toFixed(2).replace('.', ',')} €`,
    date: formatDateFr(currentQuote.created_at),
    reportNumber: currentQuote.report_number || undefined,
    policyNumber: currentQuote.policy_number || undefined,
    expertName: currentQuote.expert_name || undefined,
    incidentDate: formatDateFr(currentQuote.incident_date),
    reportDate: formatDateFr(currentQuote.report_date),
    notes: currentQuote.notes || undefined
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
    notes: currentQuote.notes || undefined
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
      description: `Êtes-vous sûr de vouloir supprimer le devis ${currentQuote.reference} ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive'
    });

    if (confirmed) {
      try {
        await deleteQuote.mutateAsync(currentQuote.id);
        onOpenChange(false);
        toast({
          title: "Devis supprimé",
          description: `Le devis ${currentQuote.reference} a été supprimé avec succès.`,
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
    const result = await generateQuotePDFWithTemplate(currentQuote, {});
    if (result.success) {
      toast({
        title: "Téléchargement réussi",
        description: `Le devis ${currentQuote.reference} a été téléchargé.`
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
    const result = await printQuotePDFWithTemplate(currentQuote, {});
    if (result.success) {
      toast({
        title: "Impression",
        description: `Le devis ${currentQuote.reference} a été ouvert pour impression.`
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
        company_id: currentQuote.company_id!,
        client_id: currentQuote.client_id,
        vehicule_id: currentQuote.vehicle_id
      });

      toast({
        title: "Demande de justificatifs",
        description: `Demande de justificatifs envoyée pour le devis ${currentQuote.reference}. Token créé avec succès.`
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
      client_id: currentQuote.client_id,
      vehicle_id: currentQuote.vehicle_id,
      quote_id: currentQuote.id,
      status: 'En cours',
      notes: currentQuote.notes || '',
      claim_number: currentQuote.claim_number || '',
      report_number: currentQuote.report_number || '',
      policy_number: currentQuote.policy_number || '',
      report_date: currentQuote.report_date || '',
      expert_name: currentQuote.expert_name || '',
      incident_date: currentQuote.incident_date || '',
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
          <div className="p-4 pr-16 border-b bg-background">
            <h2 className="text-lg font-semibold mb-3">Aperçu du devis n°{currentQuote.reference}</h2>
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
                E-mail
              </Button>

              <Button variant="outline" size="sm" className="hidden" onClick={handleRequestDocuments}>
                <FileCheck className="h-4 w-4 mr-1" />
                Justificatifs
              </Button>

              {!currentQuote.repair_orders || currentQuote.repair_orders.length === 0 ? (
                <Button size="sm" className="bg-karrosserie-orange hover:bg-karrosserie-orange/90" onClick={handleConvertToRepairOrder}>
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Convertir
                </Button>
              ) : null}

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
        quote={currentQuote}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <QuoteEmailDialog
        quote={currentQuote}
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
      />

      <RepairOrderDialog
        order={prefilledRepairOrder as RepairOrder}
        open={repairOrderDialogOpen}
        onOpenChange={setRepairOrderDialogOpen}
        prefillData={prefilledRepairOrder}
        onSuccess={() => {
          // Fermer l'aperçu du devis
          onOpenChange(false);
          
          // Afficher un toast de succès
          toast({
            title: "Conversion réussie",
            description: `L'ordre de réparation a été créé à partir du devis ${currentQuote.reference}.`
          });
        }}
      />
    </>
  );
};

export default QuoteViewerModal;

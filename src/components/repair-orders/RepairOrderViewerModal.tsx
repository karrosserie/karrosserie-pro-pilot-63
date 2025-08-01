import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { useCompany } from '@/hooks/use-company';
import { useCompanyPreferences } from '@/hooks/use-company-preferences';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { useQueryClient } from '@tanstack/react-query';
import { calculateOrderAmount } from './utils/orderCalculations';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit, Trash2, Printer, Download, Mail, FileText, DollarSign, Signature, Pencil, ArrowRight, Trash, FileCheck } from 'lucide-react';
import DefaultRepairOrderPreview from './templates/DefaultRepairOrderPreview';
import AlternativeRepairOrderPreview from './templates/AlternativeRepairOrderPreview';
import RepairOrderDialog from './RepairOrderDialog';
import RepairOrderEmailDialog from './RepairOrderEmailDialog';
import RepairOrderSignatureDialog from './RepairOrderSignatureDialog';
import InvoiceDialog from '../invoices/InvoiceDialog';

interface RepairOrderViewerModalProps {
  repairOrder: RepairOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RepairOrderViewerModal = ({ repairOrder, open, onOpenChange }: RepairOrderViewerModalProps) => {
  const { companyData } = useCompany();
  const { preferences } = useCompanyPreferences();
  const { deleteOrder } = useRepairOrders();
  const { confirm } = useConfirmation();
  const queryClient = useQueryClient();
  const [clientData, setClientData] = useState<any>(null);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [currentRepairOrder, setCurrentRepairOrder] = useState<RepairOrder | null>(repairOrder);
  
  // States for dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [prefilledInvoice, setPrefilledInvoice] = useState<any>(null);

  // Mettre à jour l'ordre de réparation actuel quand la prop change
  useEffect(() => {
    setCurrentRepairOrder(repairOrder);
  }, [repairOrder]);

  // Écouter les mises à jour du cache React Query pour cet ordre de réparation spécifique
  useEffect(() => {
    if (!currentRepairOrder?.id) return;

    const refetchRepairOrderData = async () => {
      try {
        // Récupérer les données mises à jour depuis le cache React Query
        const cachedOrders = queryClient.getQueryData(['repair-orders']) as RepairOrder[] | undefined;
        if (cachedOrders) {
          const updatedOrder = cachedOrders.find(o => o.id === currentRepairOrder.id);
          if (updatedOrder) {
            console.log('Repair order updated from cache:', updatedOrder);
            setCurrentRepairOrder(updatedOrder);
          }
        }
      } catch (error) {
        console.error('Error refreshing repair order data:', error);
      }
    };

    // Écouter les invalidations du cache des ordres de réparation
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.query?.queryKey?.[0] === 'repair-orders' && event.type === 'updated') {
        refetchRepairOrderData();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentRepairOrder?.id, queryClient]);
  
  // Récupérer les données client et véhicule depuis la base de données
  useEffect(() => {
    const fetchRelatedData = async () => {
      if (!currentRepairOrder) return;

      try {
        // Récupérer les données client
        if (currentRepairOrder.client_id) {
          const { data: client } = await supabase
            .from('clients')
            .select('*')
            .eq('id', currentRepairOrder.client_id)
            .single();
          
          if (client) {
            setClientData(client);
          }
        }

        // Récupérer les données véhicule avec les informations de marque et modèle
        if (currentRepairOrder.vehicle_id) {
          const { data: vehicle } = await supabase
            .from('vehicles')
            .select(`
              *,
              car_brands(name),
              car_models(name)
            `)
            .eq('id', currentRepairOrder.vehicle_id)
            .single();
          
          if (vehicle) {
            setVehicleData(vehicle);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    if (open && currentRepairOrder) {
      fetchRelatedData();
    }
  }, [currentRepairOrder, open]);

  if (!currentRepairOrder) return null;

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

  // Parser les données JSON de l'ordre de réparation
  let repairs = [];
  let parts = [];
  let discounts = [];
  
  try {
    repairs = currentRepairOrder.repairs_data ? 
      (Array.isArray(currentRepairOrder.repairs_data) ? currentRepairOrder.repairs_data : JSON.parse(currentRepairOrder.repairs_data as string)) : [];
  } catch (e) {
    console.error('Error parsing repairs data:', e);
  }
  
  try {
    parts = currentRepairOrder.parts_data ? 
      (Array.isArray(currentRepairOrder.parts_data) ? currentRepairOrder.parts_data : JSON.parse(currentRepairOrder.parts_data as string)) : [];
  } catch (e) {
    console.error('Error parsing parts data:', e);
  }
  
  try {
    discounts = currentRepairOrder.discounts_data ? 
      (Array.isArray(currentRepairOrder.discounts_data) ? currentRepairOrder.discounts_data : JSON.parse(currentRepairOrder.discounts_data as string)) : [];
  } catch (e) {
    console.error('Error parsing discounts data:', e);
  }

  const totalAmount = calculateOrderAmount(currentRepairOrder);

  // Préparer les données pour les composants de template
  const orderData = {
    number: currentRepairOrder.reference,
    claimNumber: currentRepairOrder.claim_number || undefined,
    orderDate: formatDateFr(currentRepairOrder.order_date || currentRepairOrder.created_at),
    signatureDate: formatDateFr(currentRepairOrder.signature_date),
    vehicle: vehicleData ? `${vehicleData.car_brands?.name || ''} ${vehicleData.car_models?.name || ''}`.trim() : undefined,
    licensePlate: vehicleData?.license_plate || undefined,
    mileage: vehicleData?.mileage ? `${vehicleData.mileage.toLocaleString('fr-FR')} km` : undefined,
    amountDue: `${totalAmount.toFixed(2).replace('.', ',')} €`,
    date: formatDateFr(currentRepairOrder.created_at),
    reportNumber: currentRepairOrder.report_number || undefined,
    policyNumber: currentRepairOrder.policy_number || undefined,
    expertName: currentRepairOrder.expert_name || undefined,
    incidentDate: formatDateFr(currentRepairOrder.incident_date),
    reportDate: formatDateFr(currentRepairOrder.report_date),
    status: currentRepairOrder.status || 'En attente',
    notes: currentRepairOrder.notes || undefined
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

  // Préparer les données véhicule pour le template
  const vehicleDataForTemplate = {
    start_date: formatDateFr(vehicleData?.start_date),
    end_date: formatDateFr(vehicleData?.end_date)
  };

  // Convertir les données des items
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

  // Calcul des totaux
  const subtotalHT = items.reduce((sum, item) => sum + item.totalHT, 0);
  const totalVAT = items.reduce((sum, item) => sum + (item.totalHT * item.vat / 100), 0);
  const totalTTC = subtotalHT + totalVAT;

  const totalsData = {
    subtotal: `${subtotalHT.toFixed(2).replace('.', ',')} €`,
    vat: `${totalVAT.toFixed(2).replace('.', ',')} €`,
    total: `${totalTTC.toFixed(2).replace('.', ',')} €`,
    totalHT: `${subtotalHT.toFixed(2).replace('.', ',')} €`,
    totalVAT: `${totalVAT.toFixed(2).replace('.', ',')} €`,
    totalTTC: `${totalTTC.toFixed(2).replace('.', ',')} €`
  };

  // Action handlers
  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Supprimer l'ordre de réparation",
      description: `Êtes-vous sûr de vouloir supprimer l'ordre de réparation ${currentRepairOrder.reference} ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive'
    });

    if (confirmed) {
      try {
        await deleteOrder.mutateAsync(currentRepairOrder.id);
        onOpenChange(false);
        toast({
          title: "Ordre de réparation supprimé",
          description: `L'ordre de réparation ${currentRepairOrder.reference} a été supprimé avec succès.`,
        });
      } catch (error: any) {
        console.error('Error deleting repair order:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'ordre de réparation.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDownload = async () => {
    const { generateRepairOrderPDFWithTemplate } = await import('@/utils/repairOrderPDFGeneration');
    const result = await generateRepairOrderPDFWithTemplate(currentRepairOrder, {});
    if (result.success) {
      toast({
        title: "Téléchargement réussi",
        description: `L'ordre de réparation ${currentRepairOrder.reference} a été téléchargé.`
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'ordre de réparation.",
        variant: "destructive"
      });
    }
  };

  const handlePrint = async () => {
    const { printRepairOrderPDFWithTemplate } = await import('@/utils/repairOrderPDFGeneration');
    const result = await printRepairOrderPDFWithTemplate(currentRepairOrder, {});
    if (result.success) {
      toast({
        title: "Impression",
        description: `L'ordre de réparation ${currentRepairOrder.reference} a été ouvert pour impression.`
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'imprimer l'ordre de réparation.",
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
        company_id: currentRepairOrder.company_id!,
        client_id: currentRepairOrder.client_id,
        vehicule_id: currentRepairOrder.vehicle_id
      });

      toast({
        title: "Demande de justificatifs",
        description: `Demande de justificatifs envoyée pour l'ordre de réparation ${currentRepairOrder.reference}. Token créé avec succès.`
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

  const handleConvertToInvoice = () => {
    // Préparer les données de la facture à partir de l'ordre de réparation
    const today = new Date().toISOString().split('T')[0];
    
    const prefilledData = {
      client_id: currentRepairOrder.client_id,
      vehicle_id: currentRepairOrder.vehicle_id,
      repair_order_id: currentRepairOrder.id,
      status: 'En attente de paiement',
      date: today,
      due_date: today,
      notes: currentRepairOrder.notes || '',
      // Informations du sinistre depuis l'ordre de réparation
      claim_number: currentRepairOrder.claim_number || '',
      policy_number: currentRepairOrder.policy_number || '',
      report_date: currentRepairOrder.report_date || '',
      expert_name: currentRepairOrder.expert_name || '',
      report_number: currentRepairOrder.report_number || '',
      incident_date: currentRepairOrder.incident_date || '',
      // Inclure les données de réparations, pièces et remises de l'ordre de réparation
      // Convertir Json en string si nécessaire
      repairs_data: currentRepairOrder.repairs_data ? (typeof currentRepairOrder.repairs_data === 'string' ? currentRepairOrder.repairs_data : JSON.stringify(currentRepairOrder.repairs_data)) : undefined,
      parts_data: currentRepairOrder.parts_data ? (typeof currentRepairOrder.parts_data === 'string' ? currentRepairOrder.parts_data : JSON.stringify(currentRepairOrder.parts_data)) : undefined,
      discounts_data: currentRepairOrder.discounts_data ? (typeof currentRepairOrder.discounts_data === 'string' ? currentRepairOrder.discounts_data : JSON.stringify(currentRepairOrder.discounts_data)) : undefined,
    };

    console.log('Converting repair order to invoice with data:', prefilledData);
    console.log('Original repair order data:', currentRepairOrder);

    // Passer les données de pré-remplissage pour la création d'une nouvelle facture
    setPrefilledInvoice(prefilledData);
    setInvoiceDialogOpen(true);
  };

  const handleClientSignature = () => {
    setSignatureDialogOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {/* Barre d'actions en haut */}
          <div className="p-4 pr-16 border-b bg-background">
            <h2 className="text-lg font-semibold mb-3">Aperçu de l'ordre de réparation n°{currentRepairOrder.reference}</h2>
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

              {currentRepairOrder.status !== 'Signé' && (
                <Button variant="outline" size="sm" onClick={handleClientSignature}>
                  <Signature className="h-4 w-4 mr-1" />
                  Signature du client
                </Button>
              )}

              <Button variant="outline" size="sm" className="hidden">
                <FileCheck className="h-4 w-4 mr-1" />
                Demander docs
              </Button>

              {!currentRepairOrder.invoices || currentRepairOrder.invoices.length === 0 ? (
                <Button size="sm" className="bg-karrosserie-orange hover:bg-karrosserie-orange/90" onClick={handleConvertToInvoice}>
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
              <DefaultRepairOrderPreview 
                companyData={companyData}
                orderData={orderData}
                clientData={clientDataForTemplate}
                vehicleData={vehicleDataForTemplate}
                items={items}
                totals={totalsData}
              />
            ) : (
              <AlternativeRepairOrderPreview 
                companyData={companyData}
                orderData={orderData}
                clientData={clientDataForTemplate}
                vehicleData={vehicleDataForTemplate}
                items={items}
                totals={totalsData}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogues pour les actions */}
      <RepairOrderDialog
        order={currentRepairOrder}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <RepairOrderEmailDialog
        repairOrder={currentRepairOrder}
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
      />

      <InvoiceDialog
        invoice={null}
        open={invoiceDialogOpen}
        onOpenChange={(open) => {
          setInvoiceDialogOpen(open);
          if (!open) {
            setPrefilledInvoice(null);
          }
        }}
        prefillData={prefilledInvoice}
        onSuccess={() => {
          setInvoiceDialogOpen(false);
          toast({
            title: "Facture créée",
            description: `La facture a été créée à partir de l'ordre de réparation ${currentRepairOrder.reference}.`
          });
        }}
      />

      <RepairOrderSignatureDialog
        repairOrder={currentRepairOrder}
        open={signatureDialogOpen}
        onOpenChange={setSignatureDialogOpen}
      />
    </>
  );
};

export default RepairOrderViewerModal;
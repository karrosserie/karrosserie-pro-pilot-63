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
  const [clientData, setClientData] = useState<any>(null);
  const [vehicleData, setVehicleData] = useState<any>(null);
  
  // States for dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  
  // Récupérer les données client et véhicule depuis la base de données
  useEffect(() => {
    const fetchRelatedData = async () => {
      if (!repairOrder) return;

      try {
        // Récupérer les données client
        if (repairOrder.client_id) {
          const { data: client } = await supabase
            .from('clients')
            .select('*')
            .eq('id', repairOrder.client_id)
            .single();
          
          if (client) {
            setClientData(client);
          }
        }

        // Récupérer les données véhicule avec les informations de marque et modèle
        if (repairOrder.vehicle_id) {
          const { data: vehicle } = await supabase
            .from('vehicles')
            .select(`
              *,
              car_brands(name),
              car_models(name)
            `)
            .eq('id', repairOrder.vehicle_id)
            .single();
          
          if (vehicle) {
            setVehicleData(vehicle);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    if (open && repairOrder) {
      fetchRelatedData();
    }
  }, [repairOrder, open]);

  if (!repairOrder) return null;

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
    repairs = repairOrder.repairs_data ? 
      (Array.isArray(repairOrder.repairs_data) ? repairOrder.repairs_data : JSON.parse(repairOrder.repairs_data as string)) : [];
  } catch (e) {
    console.error('Error parsing repairs data:', e);
  }
  
  try {
    parts = repairOrder.parts_data ? 
      (Array.isArray(repairOrder.parts_data) ? repairOrder.parts_data : JSON.parse(repairOrder.parts_data as string)) : [];
  } catch (e) {
    console.error('Error parsing parts data:', e);
  }
  
  try {
    discounts = repairOrder.discounts_data ? 
      (Array.isArray(repairOrder.discounts_data) ? repairOrder.discounts_data : JSON.parse(repairOrder.discounts_data as string)) : [];
  } catch (e) {
    console.error('Error parsing discounts data:', e);
  }

  const totalAmount = calculateOrderAmount(repairOrder);

  // Préparer les données pour les composants de template
  const orderData = {
    number: repairOrder.reference,
    claimNumber: repairOrder.claim_number || undefined,
    orderDate: formatDateFr(repairOrder.order_date || repairOrder.created_at),
    signatureDate: formatDateFr(repairOrder.signature_date),
    vehicle: vehicleData ? `${vehicleData.car_brands?.name || ''} ${vehicleData.car_models?.name || ''}`.trim() : undefined,
    licensePlate: vehicleData?.license_plate || undefined,
    mileage: vehicleData?.mileage ? `${vehicleData.mileage.toLocaleString('fr-FR')} km` : undefined,
    amountDue: `${totalAmount.toFixed(2).replace('.', ',')} €`,
    date: formatDateFr(repairOrder.created_at),
    reportNumber: repairOrder.report_number || undefined,
    policyNumber: repairOrder.policy_number || undefined,
    expertName: repairOrder.expert_name || undefined,
    incidentDate: formatDateFr(repairOrder.incident_date),
    reportDate: formatDateFr(repairOrder.report_date),
    status: repairOrder.status || 'En attente',
    notes: repairOrder.notes || undefined
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
      description: `Êtes-vous sûr de vouloir supprimer l'ordre de réparation ${repairOrder.reference} ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive'
    });

    if (confirmed) {
      try {
        await deleteOrder.mutateAsync(repairOrder.id);
        onOpenChange(false);
        toast({
          title: "Ordre de réparation supprimé",
          description: `L'ordre de réparation ${repairOrder.reference} a été supprimé avec succès.`,
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
    const result = await generateRepairOrderPDFWithTemplate(repairOrder, {});
    if (result.success) {
      toast({
        title: "Téléchargement réussi",
        description: `L'ordre de réparation ${repairOrder.reference} a été téléchargé.`
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
    const result = await printRepairOrderPDFWithTemplate(repairOrder, {});
    if (result.success) {
      toast({
        title: "Impression",
        description: `L'ordre de réparation ${repairOrder.reference} a été ouvert pour impression.`
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
        company_id: repairOrder.company_id!,
        client_id: repairOrder.client_id,
        vehicule_id: repairOrder.vehicle_id
      });

      toast({
        title: "Demande de justificatifs",
        description: `Demande de justificatifs envoyée pour l'ordre de réparation ${repairOrder.reference}. Token créé avec succès.`
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
            <h2 className="text-lg font-semibold mb-3">Aperçu de l'ordre de réparation n°{repairOrder.reference}</h2>
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

              {repairOrder.status !== 'Signé' && (
                <Button variant="outline" size="sm" onClick={handleClientSignature}>
                  <Signature className="h-4 w-4 mr-1" />
                  Signature du client
                </Button>
              )}

              <Button variant="outline" size="sm" className="hidden">
                <FileCheck className="h-4 w-4 mr-1" />
                Demander docs
              </Button>

              <Button size="sm" className="bg-karrosserie-orange hover:bg-karrosserie-orange/90" onClick={handleConvertToInvoice}>
                <ArrowRight className="h-4 w-4 mr-1" />
                Convertir
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
        order={repairOrder}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <RepairOrderEmailDialog
        repairOrder={repairOrder}
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
      />

      <InvoiceDialog
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
        onSuccess={() => {
          setInvoiceDialogOpen(false);
          toast({
            title: "Facture créée",
            description: `La facture a été créée à partir de l'ordre de réparation ${repairOrder.reference}.`
          });
        }}
      />

      <RepairOrderSignatureDialog
        repairOrder={repairOrder}
        open={signatureDialogOpen}
        onOpenChange={setSignatureDialogOpen}
      />
    </>
  );
};

export default RepairOrderViewerModal;
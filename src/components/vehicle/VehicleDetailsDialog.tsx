import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import VehicleForm from './VehicleForm';
import VehicleExpertiseReportsTab from './tabs/VehicleExpertiseReportsTab';
import VehicleQuotesTab from './tabs/VehicleQuotesTab';
import VehicleRepairOrdersTab from './tabs/VehicleRepairOrdersTab';
import VehicleInvoicesTab from './tabs/VehicleInvoicesTab';
import VehicleCreditsTab from './tabs/VehicleCreditsTab';
import VehicleReceiptsTab from './tabs/VehicleReceiptsTab';
import VehicleInterventionSheetsTab from './tabs/VehicleInterventionSheetsTab';
import { useExpertiseReports } from '@/hooks/use-expertise-reports';
import { useQuotes } from '@/hooks/use-quotes';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { useInvoices } from '@/hooks/use-invoices';
import { useCredits } from '@/hooks/use-credits';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { useInterventionSheetsByClient } from '@/hooks/use-intervention-sheets';

interface VehicleDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  defaultValues?: any;
  onSubmit: (data: any) => void;
  mode: 'create' | 'edit' | 'view';
}

const VehicleDetailsDialog: React.FC<VehicleDetailsDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  defaultValues = {},
  onSubmit,
  mode
}) => {
  const { reports } = useExpertiseReports();
  const { quotes } = useQuotes();
  const { orders } = useRepairOrders();
  const { invoices } = useInvoices();
  const { credits } = useCredits();
  const { receipts } = useReceiptsData();
  const { data: interventionSheets } = useInterventionSheetsByClient(defaultValues?.client_id || '');

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSubmit = (data: any) => {
    onSubmit(data);
    onOpenChange(false);
  };

  // Calculer les comptes pour chaque onglet
  const vehicleReports = reports?.filter(report => report.vehicle_id === defaultValues?.id) || [];
  const vehicleQuotes = quotes?.filter(quote => quote.vehicle_id === defaultValues?.id) || [];
  const vehicleOrders = orders?.filter(order => order.vehicle_id === defaultValues?.id) || [];
  const vehicleInvoices = invoices?.filter(invoice => invoice.vehicle_id === defaultValues?.id) || [];
  
  // For credits, include credits via invoices only
  const vehicleCredits = credits?.filter(credit => {
    if (credit.invoice_id && invoices) {
      const relatedInvoice = invoices.find(invoice => invoice.id === credit.invoice_id);
      return relatedInvoice?.vehicle_id === defaultValues?.id;
    }
    return false;
  }) || [];
  
  const vehicleReceipts = receipts?.filter(receipt => {
    if (receipt.invoices && invoices) {
      const relatedInvoice = invoices.find(invoice => invoice.id === receipt.invoice_id);
      return relatedInvoice?.vehicle_id === defaultValues?.id;
    }
    return false;
  }) || [];

  const vehicleInterventionSheets = interventionSheets?.filter(sheet => sheet.vehicle_id === defaultValues?.id) || [];

  // Si c'est en mode visualisation, on affiche les onglets
  if (mode === 'view') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          
          <Tabs defaultValue="details" className="w-full h-full">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="details">Fiche</TabsTrigger>
              <TabsTrigger value="expertise" className="flex items-center gap-2">
                Expertises
                <Badge variant="destructive" className="text-xs bg-orange-500 hover:bg-orange-600">
                  {vehicleReports.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="quotes" className="flex items-center gap-2">
                Devis
                <Badge variant="destructive" className="text-xs bg-orange-500 hover:bg-orange-600">
                  {vehicleQuotes.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="repair-orders" className="flex items-center gap-2">
                Ordres
                <Badge variant="destructive" className="text-xs bg-orange-500 hover:bg-orange-600">
                  {vehicleOrders.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="invoices" className="flex items-center gap-2">
                Factures
                <Badge variant="destructive" className="text-xs bg-orange-500 hover:bg-orange-600">
                  {vehicleInvoices.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="credits" className="flex items-center gap-2">
                Avoirs
                <Badge variant="destructive" className="text-xs bg-orange-500 hover:bg-orange-600">
                  {vehicleCredits.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="receipts" className="flex items-center gap-2">
                Encaissements
                <Badge variant="destructive" className="text-xs bg-orange-500 hover:bg-orange-600">
                  {vehicleReceipts.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="interventions" className="flex items-center gap-2">
                Fiches
                <Badge variant="destructive" className="text-xs bg-orange-500 hover:bg-orange-600">
                  {vehicleInterventionSheets.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-4 overflow-y-auto max-h-[calc(90vh-200px)]">
              <TabsContent value="details">
                <VehicleForm 
                  onSubmit={handleSubmit}
                  defaultValues={defaultValues || {}}
                  isViewMode={true}
                  onCancel={handleCancel}
                />
              </TabsContent>
              
              <TabsContent value="expertise">
                <VehicleExpertiseReportsTab vehicleId={defaultValues?.id} />
              </TabsContent>
              
              <TabsContent value="quotes">
                <VehicleQuotesTab vehicleId={defaultValues?.id} />
              </TabsContent>
              
              <TabsContent value="repair-orders">
                <VehicleRepairOrdersTab vehicleId={defaultValues?.id} />
              </TabsContent>
              
              <TabsContent value="invoices">
                <VehicleInvoicesTab vehicleId={defaultValues?.id} />
              </TabsContent>
              
              <TabsContent value="credits">
                <VehicleCreditsTab vehicleId={defaultValues?.id} />
              </TabsContent>
              
              <TabsContent value="receipts">
                <VehicleReceiptsTab vehicleId={defaultValues?.id} />
              </TabsContent>
              
              <TabsContent value="interventions">
                <VehicleInterventionSheetsTab vehicleId={defaultValues?.id} vehicle={defaultValues} />
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  }

  // Pour les modes create et edit, on garde l'ancien comportement
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <VehicleForm 
          onSubmit={handleSubmit}
          defaultValues={defaultValues || {}}
          isViewMode={false}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailsDialog;
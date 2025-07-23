
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
import ClientForm from './ClientForm';
import ClientVehiclesTab from './tabs/ClientVehiclesTab';
import ClientExpertiseReportsTab from './tabs/ClientExpertiseReportsTab';
import ClientQuotesTab from './tabs/ClientQuotesTab';
import ClientRepairOrdersTab from './tabs/ClientRepairOrdersTab';
import ClientInvoicesTab from './tabs/ClientInvoicesTab';
import ClientCreditsTab from './tabs/ClientCreditsTab';
import ClientReceiptsTab from './tabs/ClientReceiptsTab';
import ClientInterventionSheetsTab from './tabs/ClientInterventionSheetsTab';
import { useVehicles } from '@/hooks/use-vehicles';
import { useExpertiseReports } from '@/hooks/use-expertise-reports';
import { useQuotes } from '@/hooks/use-quotes';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { useInvoices } from '@/hooks/use-invoices';
import { useCredits } from '@/hooks/use-credits';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { useInterventionSheetsByClient } from '@/hooks/use-intervention-sheets';

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  defaultValues?: any;
  onSubmit: (data: any) => void;
  mode: 'create' | 'edit' | 'view';
}

const ClientDialog: React.FC<ClientDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  defaultValues = {},
  onSubmit,
  mode
}) => {
  const { vehicles } = useVehicles();
  const { reports } = useExpertiseReports();
  const { quotes } = useQuotes();
  const { orders } = useRepairOrders();
  const { invoices } = useInvoices();
  const { credits } = useCredits();
  const { receipts } = useReceiptsData();
  const { data: interventionSheets } = useInterventionSheetsByClient(defaultValues?.id || '');

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSubmit = (data: any) => {
    onSubmit(data);
    onOpenChange(false);
  };

  // Calculer les comptes pour chaque onglet
  const clientVehicles = vehicles?.filter(vehicle => vehicle.client_id === defaultValues?.id) || [];
  const clientReports = reports?.filter(report => report.client_id === defaultValues?.id) || [];
  const clientQuotes = quotes?.filter(quote => quote.client_id === defaultValues?.id) || [];
  const clientOrders = orders?.filter(order => order.client_id === defaultValues?.id) || [];
  const clientInvoices = invoices?.filter(invoice => invoice.client_id === defaultValues?.id) || [];
  
  // For credits, include credits via invoices only (since direct client_id is removed)
  const clientCredits = credits?.filter(credit => {
    if (credit.invoice_id && invoices) {
      const relatedInvoice = invoices.find(invoice => invoice.id === credit.invoice_id);
      return relatedInvoice?.client_id === defaultValues?.id;
    }
    return false;
  }) || [];
  
  const clientReceipts = receipts?.filter(receipt => {
    if (receipt.invoices && receipt.invoices.client_id === defaultValues?.id) {
      return true;
    }
    return false;
  }) || [];
  
  const clientInterventionSheets = interventionSheets || [];

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
            <TabsList className="grid w-full grid-cols-9">
              <TabsTrigger value="details">Fiche</TabsTrigger>
              <TabsTrigger value="vehicles" className="flex items-center gap-2">
                Véhicules
                <Badge variant="destructive" className="text-xs bg-orange-500 hover:bg-orange-600">
                  {clientVehicles.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="expertise" className="flex items-center gap-2">
                Expertises
                <Badge variant="destructive" className="text-xs bg-orange-500 hover:bg-orange-600">
                  {clientReports.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="quotes" className="flex items-center gap-2">
                Devis
                <Badge variant="destructive" className="text-xs bg-orange-500 hover:bg-orange-600">
                  {clientQuotes.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="repair-orders" className="flex items-center gap-2">
                Ordres
                <Badge variant="destructive" className="text-xs bg-orange-500 hover:bg-orange-600">
                  {clientOrders.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="invoices" className="flex items-center gap-2">
                Factures
                <Badge variant="destructive" className="text-xs bg-orange-500 hover:bg-orange-600">
                  {clientInvoices.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="credits" className="flex items-center gap-2">
                Avoirs
                <Badge variant="destructive" className="text-xs bg-orange-500 hover:bg-orange-600">
                  {clientCredits.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="receipts" className="flex items-center gap-2">
                Encaissements
                <Badge variant="destructive" className="text-xs bg-orange-500 hover:bg-orange-600">
                  {clientReceipts.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="interventions" className="flex items-center gap-2">
                Fiches
                <Badge variant="destructive" className="text-xs bg-orange-500 hover:bg-orange-600">
                  {clientInterventionSheets.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-4 overflow-y-auto max-h-[calc(90vh-200px)]">
              <TabsContent value="details">
                <ClientForm 
                  onSubmit={handleSubmit}
                  defaultValues={defaultValues || {}}
                  isViewMode={true}
                  onCancel={handleCancel}
                />
              </TabsContent>
              
              <TabsContent value="vehicles">
                <ClientVehiclesTab clientId={defaultValues?.id} />
              </TabsContent>
              
              <TabsContent value="expertise">
                <ClientExpertiseReportsTab clientId={defaultValues?.id} />
              </TabsContent>
              
              <TabsContent value="quotes">
                <ClientQuotesTab clientId={defaultValues?.id} />
              </TabsContent>
              
              <TabsContent value="repair-orders">
                <ClientRepairOrdersTab clientId={defaultValues?.id} />
              </TabsContent>
              
              <TabsContent value="invoices">
                <ClientInvoicesTab clientId={defaultValues?.id} />
              </TabsContent>
              
              <TabsContent value="credits">
                <ClientCreditsTab clientId={defaultValues?.id} />
              </TabsContent>
              
              <TabsContent value="receipts">
                <ClientReceiptsTab clientId={defaultValues?.id} />
              </TabsContent>
              
              <TabsContent value="interventions">
                <ClientInterventionSheetsTab clientId={defaultValues?.id} client={defaultValues} />
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
        <ClientForm 
          onSubmit={handleSubmit}
          defaultValues={defaultValues || {}}
          isViewMode={false}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ClientDialog;


import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFormDialog } from '@/hooks/use-form-dialog';
import ClientForm from './ClientForm';
import ClientVehiclesTab from './tabs/ClientVehiclesTab';
import ClientExpertiseReportsTab from './tabs/ClientExpertiseReportsTab';
import ClientQuotesTab from './tabs/ClientQuotesTab';
import ClientRepairOrdersTab from './tabs/ClientRepairOrdersTab';
import ClientInvoicesTab from './tabs/ClientInvoicesTab';
import ClientCreditsTab from './tabs/ClientCreditsTab';
import ClientReceiptsTab from './tabs/ClientReceiptsTab';
import ClientConversationsTab from './tabs/ClientConversationsTab';

import { ClientDetailsSidebar, getSidebarItems } from './ClientDetailsSidebar';
import { useVehicles } from '@/hooks/use-vehicles';
import { useExpertiseReports } from '@/hooks/use-expertise-reports';
import { useQuotes } from '@/hooks/use-quotes';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { useInvoices } from '@/hooks/use-invoices';
import { useCredits } from '@/hooks/use-credits';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMessageries } from '@/hooks/use-messageries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { handleOpenChange } = useFormDialog({ 
    hasUnsavedChanges: hasUnsavedChanges && mode !== 'view', 
    onOpenChange 
  });
  const { vehicles } = useVehicles();
  const { reports } = useExpertiseReports();
  const { quotes } = useQuotes();
  const { orders } = useRepairOrders();
  const { invoices } = useInvoices();
  const { credits } = useCredits();
  const { receipts } = useReceiptsData();
  const { messageries } = useMessageries();
  const isMobile = useIsMobile();
  

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
  
  const clientConversations = messageries?.filter(msg => msg.client_id === defaultValues?.id) || [];
  

  // État pour gérer l'onglet actif dans la sidebar
  const [activeTab, setActiveTab] = useState('details');

  // Créer les items de la sidebar
  const sidebarItems = getSidebarItems(
    clientVehicles,
    clientReports,
    clientQuotes,
    clientOrders,
    clientInvoices,
    clientCredits,
    clientReceipts,
    clientConversations
  );

  // Fonction pour rendre le contenu selon l'onglet actif
  const renderActiveContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <ClientForm 
            onSubmit={handleSubmit}
            defaultValues={defaultValues || {}}
            isViewMode={true}
            onCancel={handleCancel}
          />
        );
      case 'vehicles':
        return <ClientVehiclesTab clientId={defaultValues?.id} />;
      case 'expertise':
        return <ClientExpertiseReportsTab clientId={defaultValues?.id} />;
      case 'quotes':
        return <ClientQuotesTab clientId={defaultValues?.id} />;
      case 'repair-orders':
        return <ClientRepairOrdersTab clientId={defaultValues?.id} />;
      case 'invoices':
        return <ClientInvoicesTab clientId={defaultValues?.id} />;
      case 'credits':
        return <ClientCreditsTab clientId={defaultValues?.id} />;
      case 'receipts':
        return <ClientReceiptsTab clientId={defaultValues?.id} />;
      case 'conversations':
        return <ClientConversationsTab clientId={defaultValues?.id} />;
      default:
        return null;
    }
  };

  // Si c'est en mode visualisation, on affiche la sidebar
  if (mode === 'view') {
    if (isMobile) {
      return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent className="w-[95vw] h-[95vh] overflow-hidden p-0 max-w-none">
            <DialogHeader className="px-4 pt-4 pb-2">
              <DialogTitle className="text-lg">{title}</DialogTitle>
              {description && <DialogDescription className="text-sm">{description}</DialogDescription>}
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-[calc(95vh-80px)]">
              <TabsList className="grid w-full grid-cols-4 mx-4 mb-2">
                <TabsTrigger value="details" className="text-xs">Détails</TabsTrigger>
                <TabsTrigger value="vehicles" className="text-xs">
                  Véhicules {clientVehicles.length > 0 && `(${clientVehicles.length})`}
                </TabsTrigger>
                <TabsTrigger value="invoices" className="text-xs">
                  Factures {clientInvoices.length > 0 && `(${clientInvoices.length})`}
                </TabsTrigger>
                <TabsTrigger value="quotes" className="text-xs">
                  Devis {clientQuotes.length > 0 && `(${clientQuotes.length})`}
                </TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <TabsContent value="details" className="mt-0">
                  <ClientForm 
                    onSubmit={handleSubmit}
                    defaultValues={defaultValues || {}}
                    isViewMode={true}
                    onCancel={handleCancel}
                  />
                </TabsContent>
                <TabsContent value="vehicles" className="mt-0">
                  <ClientVehiclesTab clientId={defaultValues?.id} />
                </TabsContent>
                <TabsContent value="expertise" className="mt-0">
                  <ClientExpertiseReportsTab clientId={defaultValues?.id} />
                </TabsContent>
                <TabsContent value="quotes" className="mt-0">
                  <ClientQuotesTab clientId={defaultValues?.id} />
                </TabsContent>
                <TabsContent value="repair-orders" className="mt-0">
                  <ClientRepairOrdersTab clientId={defaultValues?.id} />
                </TabsContent>
                <TabsContent value="invoices" className="mt-0">
                  <ClientInvoicesTab clientId={defaultValues?.id} />
                </TabsContent>
                <TabsContent value="credits" className="mt-0">
                  <ClientCreditsTab clientId={defaultValues?.id} />
                </TabsContent>
                <TabsContent value="receipts" className="mt-0">
                  <ClientReceiptsTab clientId={defaultValues?.id} />
                </TabsContent>
                <TabsContent value="conversations" className="mt-0">
                  <ClientConversationsTab clientId={defaultValues?.id} />
                </TabsContent>
              </div>
            </Tabs>
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          
          <div className="flex h-[calc(90vh-120px)]">
            <ClientDetailsSidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              sidebarItems={sidebarItems}
            />
            
            <div className="flex-1 overflow-y-auto p-6">
              {renderActiveContent()}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Pour les modes create et edit, on garde l'ancien comportement
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={isMobile ? "w-[95vw] h-[95vh] max-w-none" : "max-w-4xl"}>
        <DialogHeader>
          <DialogTitle className={isMobile ? "text-lg" : ""}>{title}</DialogTitle>
          {description && <DialogDescription className={isMobile ? "text-sm" : ""}>{description}</DialogDescription>}
        </DialogHeader>
        <div className={isMobile ? "overflow-y-auto flex-1" : ""}>
          <ClientForm 
            onSubmit={handleSubmit}
            defaultValues={defaultValues || {}}
            isViewMode={false}
            onCancel={handleCancel}
            onFormChange={() => setHasUnsavedChanges(true)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDialog;

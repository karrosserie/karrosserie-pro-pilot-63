
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ClientForm from './ClientForm';
import ClientVehiclesTab from './tabs/ClientVehiclesTab';
import ClientExpertiseReportsTab from './tabs/ClientExpertiseReportsTab';
import ClientQuotesTab from './tabs/ClientQuotesTab';
import ClientRepairOrdersTab from './tabs/ClientRepairOrdersTab';
import ClientInvoicesTab from './tabs/ClientInvoicesTab';
import ClientCreditsTab from './tabs/ClientCreditsTab';
import ClientReceiptsTab from './tabs/ClientReceiptsTab';
import ClientInterventionSheetsTab from './tabs/ClientInterventionSheetsTab';
import { ClientDetailsSidebar, getSidebarItems } from './ClientDetailsSidebar';
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
    clientInterventionSheets
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
      case 'interventions':
        return <ClientInterventionSheetsTab clientId={defaultValues?.id} client={defaultValues} />;
      default:
        return null;
    }
  };

  // Si c'est en mode visualisation, on affiche la sidebar
  if (mode === 'view') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
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


import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { cn } from '@/lib/utils';
import { 
  User, 
  Car, 
  FileText, 
  ClipboardList, 
  Wrench, 
  Receipt, 
  CreditCard, 
  Wallet, 
  MessageSquare,
  ChevronRight
} from 'lucide-react';


interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  defaultValues?: any;
  onSubmit: (data: any) => void;
  mode: 'create' | 'edit' | 'view';
}

// Mapping des onglets avec leurs icônes et labels
const TAB_CONFIG = [
  { id: 'details', label: 'Informations client', icon: User },
  { id: 'vehicles', label: 'Véhicules', icon: Car },
  { id: 'expertise', label: 'Rapports d\'expertise', icon: FileText },
  { id: 'quotes', label: 'Devis', icon: ClipboardList },
  { id: 'repair-orders', label: 'Ordres de réparation', icon: Wrench },
  { id: 'invoices', label: 'Factures', icon: Receipt },
  { id: 'credits', label: 'Avoirs', icon: CreditCard },
  { id: 'receipts', label: 'Encaissements', icon: Wallet },
  { id: 'conversations', label: 'Conversations', icon: MessageSquare },
];

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

  // Fonction pour obtenir le compte de chaque onglet
  const getTabCount = (tabId: string): number => {
    switch (tabId) {
      case 'vehicles': return clientVehicles.length;
      case 'expertise': return clientReports.length;
      case 'quotes': return clientQuotes.length;
      case 'repair-orders': return clientOrders.length;
      case 'invoices': return clientInvoices.length;
      case 'credits': return clientCredits.length;
      case 'receipts': return clientReceipts.length;
      case 'conversations': return clientConversations.length;
      default: return 0;
    }
  };

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
        <Sheet open={open} onOpenChange={handleOpenChange}>
          <SheetContent side="bottom" className="h-[95vh] p-0 flex flex-col">
            <SheetHeader className="px-4 pt-4 pb-2 border-b flex-shrink-0">
              <SheetTitle className="text-lg">{title}</SheetTitle>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto">
              {/* Navigation des onglets */}
              <div className="p-3 space-y-1">
                {TAB_CONFIG.map((tab) => {
                  const Icon = tab.icon;
                  const count = getTabCount(tab.id);
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg transition-colors",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted/50 hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span className="font-medium text-sm">{tab.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {tab.id !== 'details' && count > 0 && (
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium",
                            isActive 
                              ? "bg-primary-foreground/20 text-primary-foreground" 
                              : "bg-primary/10 text-primary"
                          )}>
                            {count}
                          </span>
                        )}
                        <ChevronRight className={cn(
                          "h-4 w-4",
                          isActive ? "text-primary-foreground" : "text-muted-foreground"
                        )} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Séparateur */}
              <div className="border-t my-2" />

              {/* Contenu de l'onglet sélectionné */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  {(() => {
                    const currentTab = TAB_CONFIG.find(t => t.id === activeTab);
                    if (currentTab) {
                      const Icon = currentTab.icon;
                      return (
                        <>
                          <Icon className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-foreground">{currentTab.label}</h3>
                        </>
                      );
                    }
                    return null;
                  })()}
                </div>
                {renderActiveContent()}
              </div>
            </div>
          </SheetContent>
        </Sheet>
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

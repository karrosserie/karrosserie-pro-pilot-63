
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Car, 
  FileText, 
  ClipboardList, 
  Wrench, 
  Receipt, 
  CreditCard, 
  Banknote, 
  MessageSquare,
  Pencil,
  Phone,
  Mail,
  MoreHorizontal,
  ArrowLeft
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getClientDisplayName } from '@/utils/clientDisplayUtils';


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

  const clientDisplayName = getClientDisplayName(defaultValues);

  const handleCallClient = () => {
    if (defaultValues?.phone) {
      window.location.href = `tel:${defaultValues.phone}`;
    }
  };

  const handleEmailClient = () => {
    if (defaultValues?.email) {
      window.location.href = `mailto:${defaultValues.email}`;
    }
  };

  const handleEditClient = () => {
    // Switch to edit mode would require parent component handling
    // For now, close view and open edit
    onOpenChange(false);
  };

  // Mobile tabs configuration with icons
  const mobileTabs = [
    { value: 'details', icon: User, label: 'Détails', count: null },
    { value: 'vehicles', icon: Car, label: 'Véhicules', count: clientVehicles.length },
    { value: 'expertise', icon: FileText, label: 'Expertises', count: clientReports.length },
    { value: 'quotes', icon: ClipboardList, label: 'Devis', count: clientQuotes.length },
    { value: 'repair-orders', icon: Wrench, label: 'OR', count: clientOrders.length },
    { value: 'invoices', icon: Receipt, label: 'Factures', count: clientInvoices.length },
    { value: 'credits', icon: CreditCard, label: 'Avoirs', count: clientCredits.length },
    { value: 'receipts', icon: Banknote, label: 'Encaissements', count: clientReceipts.length },
    { value: 'conversations', icon: MessageSquare, label: 'Messages', count: clientConversations.length },
  ];

  // Si c'est en mode visualisation, on affiche la sidebar
  if (mode === 'view') {
    if (isMobile) {
      return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
          <SheetContent side="bottom" className="h-[100vh] p-0 flex flex-col">
            {/* Header sticky */}
            <SheetHeader className="px-4 py-3 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <SheetTitle className="text-base font-semibold truncate">
                  {clientDisplayName || title}
                </SheetTitle>
              </div>
            </SheetHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
              {/* Tabs avec scroll horizontal */}
              <div className="border-b border-border flex-shrink-0">
                <ScrollArea className="w-full">
                  <TabsList className="inline-flex h-10 items-center justify-start gap-1 bg-transparent p-1 w-max">
                    {mobileTabs.map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
                      >
                        <tab.icon className="h-3.5 w-3.5" />
                        <span>{tab.label}</span>
                        {tab.count !== null && tab.count > 0 && (
                          <span className="ml-1 text-[10px] opacity-70">({tab.count})</span>
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <ScrollBar orientation="horizontal" className="h-1.5" />
                </ScrollArea>
              </div>
              
              {/* Contenu scrollable */}
              <div className="flex-1 overflow-y-auto pb-20">
                <div className="p-4">
                  {mobileTabs.map((tab) => (
                    <TabsContent key={tab.value} value={tab.value} className="mt-0 focus-visible:outline-none">
                      {activeTab === tab.value && renderActiveContent()}
                    </TabsContent>
                  ))}
                </div>
              </div>
            </Tabs>

            {/* Footer sticky avec actions */}
            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border bg-background flex-shrink-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleEditClient}
                    className="flex-1"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  {defaultValues?.phone && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCallClient}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Appeler
                    </Button>
                  )}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {defaultValues?.email && (
                      <DropdownMenuItem onClick={handleEmailClient}>
                        <Mail className="h-4 w-4 mr-2" />
                        Envoyer un email
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
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
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="bottom" className="h-[100vh] p-0 flex flex-col">
          <SheetHeader className="px-4 py-3 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onOpenChange(false)}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <SheetTitle className="text-base font-semibold">
                {title}
              </SheetTitle>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-4">
            <ClientForm 
              onSubmit={handleSubmit}
              defaultValues={defaultValues || {}}
              isViewMode={false}
              onCancel={handleCancel}
              onFormChange={() => setHasUnsavedChanges(true)}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
          onFormChange={() => setHasUnsavedChanges(true)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ClientDialog;

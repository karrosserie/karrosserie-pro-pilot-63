
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientForm from './ClientForm';
import ClientVehiclesTab from './tabs/ClientVehiclesTab';
import ClientExpertiseReportsTab from './tabs/ClientExpertiseReportsTab';
import ClientQuotesTab from './tabs/ClientQuotesTab';
import ClientInvoicesTab from './tabs/ClientInvoicesTab';
import ClientCreditsTab from './tabs/ClientCreditsTab';
import ClientReceiptsTab from './tabs/ClientReceiptsTab';

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
  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSubmit = (data: any) => {
    onSubmit(data);
    onOpenChange(false);
  };

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
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="vehicles">Véhicules</TabsTrigger>
              <TabsTrigger value="expertise">Expertises</TabsTrigger>
              <TabsTrigger value="quotes">Devis</TabsTrigger>
              <TabsTrigger value="invoices">Factures</TabsTrigger>
              <TabsTrigger value="credits">Avoirs</TabsTrigger>
              <TabsTrigger value="receipts">Encaissements</TabsTrigger>
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
              
              <TabsContent value="invoices">
                <ClientInvoicesTab clientId={defaultValues?.id} />
              </TabsContent>
              
              <TabsContent value="credits">
                <ClientCreditsTab clientId={defaultValues?.id} />
              </TabsContent>
              
              <TabsContent value="receipts">
                <ClientReceiptsTab clientId={defaultValues?.id} />
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
          isViewMode={mode === 'view'}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ClientDialog;

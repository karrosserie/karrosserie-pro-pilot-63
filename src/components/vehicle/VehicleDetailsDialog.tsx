import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VehicleForm from './VehicleForm';
import VehicleExpertiseReportsTab from './tabs/VehicleExpertiseReportsTab';
import VehicleQuotesTab from './tabs/VehicleQuotesTab';
import VehicleRepairOrdersTab from './tabs/VehicleRepairOrdersTab';
import VehiclePaintWeighingTab from './tabs/VehiclePaintWeighingTab';
import VehicleInvoicesTab from './tabs/VehicleInvoicesTab';
import VehicleCreditsTab from './tabs/VehicleCreditsTab';
import VehicleReceiptsTab from './tabs/VehicleReceiptsTab';

import { VehicleDetailsSidebar, getVehicleSidebarItems } from './VehicleDetailsSidebar';
import { useExpertiseReports } from '@/hooks/use-expertise-reports';
import { useQuotes } from '@/hooks/use-quotes';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { useInvoices } from '@/hooks/use-invoices';
import { useCredits } from '@/hooks/use-credits';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { getVehiclePhotos } from '@/utils/vehiclePhotoService';
import { getTaskPhotosByVehicle } from '@/utils/taskPhotoService';
import { VehicleImagesTab } from './tabs/VehicleImagesTab';
import { useVehiclePaintMetrics } from '@/hooks/dashboard/use-vehicle-paint-metrics';


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

  // Hook pour les métriques de peinture du véhicule
  const { vehiclePaintMetrics } = useVehiclePaintMetrics(defaultValues?.id || null);
  

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

  

  // État pour gérer l'onglet actif dans la sidebar
  const [activeTab, setActiveTab] = useState('details');
  const [totalPhotos, setTotalPhotos] = useState(0);

  // Count total photos for this vehicle
  useEffect(() => {
  const countPhotos = async () => {
    try {
      const vehiclePhotos = await getVehiclePhotos(defaultValues.id);
      const taskPhotos = await getTaskPhotosByVehicle(defaultValues.id);
      setTotalPhotos(vehiclePhotos.length + taskPhotos.length);
    } catch (error) {
      console.error('Erreur lors du comptage des photos:', error);
      setTotalPhotos(0);
    }
  };

    if (mode === 'view' && defaultValues?.id) {
      countPhotos();
    }
  }, [defaultValues?.id, mode]);

  // Créer les items de la sidebar
  const sidebarItems = getVehicleSidebarItems(
    vehicleReports,
    vehicleQuotes,
    vehicleOrders,
    vehicleInvoices,
    vehicleCredits,
    vehicleReceipts,
    totalPhotos,
    vehiclePaintMetrics?.totalReports || 0
  );

  // Fonction pour rendre le contenu selon l'onglet actif
  const renderActiveContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <VehicleForm 
            onSubmit={handleSubmit}
            defaultValues={defaultValues || {}}
            isViewMode={true}
            onCancel={handleCancel}
          />
        );
      case 'expertise':
        return <VehicleExpertiseReportsTab vehicleId={defaultValues?.id} />;
      case 'quotes':
        return <VehicleQuotesTab vehicleId={defaultValues?.id} />;
      case 'repair-orders':
        return <VehicleRepairOrdersTab vehicleId={defaultValues?.id} />;
      case 'paint-weighing':
        return <VehiclePaintWeighingTab vehicleId={defaultValues?.id} />;
      case 'invoices':
        return <VehicleInvoicesTab vehicleId={defaultValues?.id} />;
      case 'credits':
        return <VehicleCreditsTab vehicleId={defaultValues?.id} />;
      case 'receipts':
        return <VehicleReceiptsTab vehicleId={defaultValues?.id} />;
      case 'images':
        return defaultValues?.id ? (
          <VehicleImagesTab vehicleId={defaultValues.id} />
        ) : (
          <div className="p-6">Aucun véhicule sélectionné</div>
        );
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
            <VehicleDetailsSidebar
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

import React, { useState } from 'react';
import { RepairOrdersHeader } from '@/components/repair-orders/RepairOrdersHeader';
import { RepairOrdersTable } from '@/components/repair-orders/RepairOrdersTable';
import RepairOrderDialog from '@/components/repair-orders/RepairOrderDialog';
import RepairOrderEmailDialog from '@/components/repair-orders/RepairOrderEmailDialog';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { RepairOrder } from '@/services/supabase/repair-orders';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { useToast } from '@/hooks/use-toast';

const RepairOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<RepairOrder | null>(null);
  const [selectedOrderForEmail, setSelectedOrderForEmail] = useState<RepairOrder | null>(null);
  const { toast } = useToast();
  
  const { orders, isLoading, error } = useRepairOrders();
  
  const filteredOrders = orders?.filter(order => 
    order.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.clients && `${order.clients.first_name} ${order.clients.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order.vehicles && `${order.vehicles.car_brands?.name || 'Marque inconnue'} ${order.vehicles.car_models?.name || 'Modèle inconnu'} - ${order.vehicles.license_plate}`.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleCreateOrder = () => {
    setSelectedOrder(null);
    setDialogOpen(true);
  };

  const handleEditOrder = (order: RepairOrder) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleDownload = (order: RepairOrder) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement de l'ordre de réparation ${order.reference}...`
    });
  };

  const handlePrint = (order: RepairOrder) => {
    toast({
      title: "Impression",
      description: `Impression de l'ordre de réparation ${order.reference}...`
    });
  };

  const handleSendEmail = (order: RepairOrder) => {
    setSelectedOrderForEmail(order);
    setEmailDialogOpen(true);
  };

  const handleSignOrder = (order: RepairOrder) => {
    toast({
      title: "Signature de l'ordre de réparation",
      description: `L'ordre de réparation ${order.reference} a été signé`
    });
  };

  const handleRequestDocuments = (order: RepairOrder) => {
    toast({
      title: "Demande de justificatifs",
      description: `Demande de justificatifs envoyée pour l'ordre de réparation ${order.reference}`
    });
  };

  const handleConvertToInvoice = (order: RepairOrder) => {
    toast({
      title: "Conversion en facture",
      description: `L'ordre de réparation ${order.reference} a été converti en facture`
    });
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <ErrorMessage message="Erreur lors du chargement des ordres de réparation" />
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <RepairOrdersHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateOrder={handleCreateOrder}
      />
      
      <RepairOrdersTable
        orders={filteredOrders}
        onEditOrder={handleEditOrder}
        contextMenuProps={{
          onDownload: handleDownload,
          onPrint: handlePrint,
          onSendEmail: handleSendEmail,
          onSignOrder: handleSignOrder,
          onRequestDocuments: handleRequestDocuments,
          onConvertToInvoice: handleConvertToInvoice
        }}
      />

      <RepairOrderDialog
        order={selectedOrder}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <RepairOrderEmailDialog
        repairOrder={selectedOrderForEmail}
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
      />
    </div>
  );
};

export default RepairOrders;


import React, { useState } from 'react';
import { RepairOrdersHeader } from '@/components/repair-orders/RepairOrdersHeader';
import { RepairOrdersTable } from '@/components/repair-orders/RepairOrdersTable';
import RepairOrderDialog from '@/components/repair-orders/RepairOrderDialog';
import RepairOrderEmailDialog from '@/components/repair-orders/RepairOrderEmailDialog';
import RepairOrderSignatureDialog from '@/components/repair-orders/RepairOrderSignatureDialog';
import InvoiceDialog from '@/components/invoices/InvoiceDialog';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { RepairOrder } from '@/services/supabase/repair-orders';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { useToast } from '@/hooks/use-toast';

const RepairOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<RepairOrder | null>(null);
  const [selectedOrderForEmail, setSelectedOrderForEmail] = useState<RepairOrder | null>(null);
  const [selectedOrderForSignature, setSelectedOrderForSignature] = useState<RepairOrder | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<any>(null);
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
    setSelectedOrderForSignature(order);
    setSignatureDialogOpen(true);
  };

  const handleRequestDocuments = (order: RepairOrder) => {
    toast({
      title: "Demande de justificatifs",
      description: `Demande de justificatifs envoyée pour l'ordre de réparation ${order.reference}`
    });
  };

  const handleConvertToInvoice = (order: RepairOrder) => {
    // Créer un objet facture avec les données de l'ordre de réparation
    const invoiceData = {
      client_id: order.client_id,
      vehicle_id: order.vehicle_id,
      repair_order_id: order.id,
      repairs_data: order.repairs_data,
      parts_data: order.parts_data,
      discounts_data: order.discounts_data,
      description: order.description,
      current_mileage: order.current_mileage,
      claim_number: order.claim_number,
      clients: order.clients,
      vehicles: order.vehicles,
      notes: JSON.stringify({
        description: order.description || '',
        claimNumber: order.claim_number || '',
        currentMileage: order.current_mileage || '',
        repairs: order.repairs_data ? (typeof order.repairs_data === 'string' ? JSON.parse(order.repairs_data) : order.repairs_data) : [],
        parts: order.parts_data ? (typeof order.parts_data === 'string' ? JSON.parse(order.parts_data) : order.parts_data) : [],
        discounts: order.discounts_data ? (typeof order.discounts_data === 'string' ? JSON.parse(order.discounts_data) : order.discounts_data) : []
      })
    };
    
    setSelectedOrderForInvoice(invoiceData);
    setInvoiceDialogOpen(true);
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

      <RepairOrderSignatureDialog
        repairOrder={selectedOrderForSignature}
        open={signatureDialogOpen}
        onOpenChange={setSignatureDialogOpen}
      />

      <InvoiceDialog
        open={invoiceDialogOpen}
        onOpenChange={(open) => {
          setInvoiceDialogOpen(open);
          if (!open) {
            setSelectedOrderForInvoice(null);
          }
        }}
        invoice={selectedOrderForInvoice}
      />
    </div>
  );
};

export default RepairOrders;

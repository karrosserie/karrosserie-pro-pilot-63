
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
    console.log('Converting repair order to invoice:', order);
    
    // Parser les données de l'ordre de réparation
    let orderData = {
      description: '',
      claimNumber: '',
      currentMileage: '',
      repairs: [],
      parts: [],
      discounts: []
    };

    // Essayer de parser les notes JSON de l'ordre de réparation
    try {
      if (order.notes) {
        const parsedNotes = JSON.parse(order.notes);
        orderData = {
          description: parsedNotes.description || '',
          claimNumber: parsedNotes.claimNumber || '',
          currentMileage: parsedNotes.currentMileage || '',
          repairs: parsedNotes.repairs || [],
          parts: parsedNotes.parts || [],
          discounts: parsedNotes.discounts || []
        };
      }
    } catch (e) {
      console.error('Error parsing repair order notes:', e);
    }

    // Essayer aussi de parser les champs séparés s'ils existent
    try {
      if (order.repairs_data) {
        const repairs = typeof order.repairs_data === 'string' 
          ? JSON.parse(order.repairs_data) 
          : order.repairs_data;
        if (Array.isArray(repairs) && repairs.length > 0) {
          orderData.repairs = repairs;
        }
      }
    } catch (e) {
      console.error('Error parsing repairs_data:', e);
    }

    try {
      if (order.parts_data) {
        const parts = typeof order.parts_data === 'string' 
          ? JSON.parse(order.parts_data) 
          : order.parts_data;
        if (Array.isArray(parts) && parts.length > 0) {
          orderData.parts = parts;
        }
      }
    } catch (e) {
      console.error('Error parsing parts_data:', e);
    }

    try {
      if (order.discounts_data) {
        const discounts = typeof order.discounts_data === 'string' 
          ? JSON.parse(order.discounts_data) 
          : order.discounts_data;
        if (Array.isArray(discounts) && discounts.length > 0) {
          orderData.discounts = discounts;
        }
      }
    } catch (e) {
      console.error('Error parsing discounts_data:', e);
    }

    // Utiliser les champs directs comme fallback
    if (!orderData.description && order.description) {
      orderData.description = order.description;
    }
    if (!orderData.claimNumber && order.claim_number) {
      orderData.claimNumber = order.claim_number;
    }
    if (!orderData.currentMileage && order.current_mileage) {
      orderData.currentMileage = order.current_mileage;
    }

    // Créer un objet facture formaté selon ce que useInvoiceFormLogic attend
    const invoiceData = {
      // Champs de base de la facture
      client_id: order.client_id,
      vehicle_id: order.vehicle_id,
      repair_order_id: order.id,
      status: 'En attente de paiement',
      
      // Relations pour l'affichage
      clients: order.clients,
      vehicles: order.vehicles,
      
      // Données métier dans notes (format attendu par useInvoiceFormLogic)
      notes: JSON.stringify(orderData),
      
      // Champs individuels pour compatibilité
      description: orderData.description,
      claim_number: orderData.claimNumber,
      current_mileage: orderData.currentMileage,
      repairs_data: orderData.repairs,
      parts_data: orderData.parts,
      discounts_data: orderData.discounts
    };
    
    console.log('Invoice data being passed to form:', {
      originalOrder: order,
      parsedOrderData: orderData,
      finalInvoiceData: invoiceData
    });
    
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

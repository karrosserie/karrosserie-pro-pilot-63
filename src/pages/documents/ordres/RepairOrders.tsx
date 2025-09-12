import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus } from 'lucide-react';
import { RepairOrdersTable } from '@/components/repair-orders/RepairOrdersTable';
import RepairOrderDialog from '@/components/repair-orders/RepairOrderDialog';
import RepairOrderEmailDialog from '@/components/repair-orders/RepairOrderEmailDialog';
import RepairOrderSignatureDialog from '@/components/repair-orders/RepairOrderSignatureDialog';
import InvoiceDialog from '@/components/invoices/InvoiceDialog';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { Invoice } from '@/services/supabase/invoices';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { useToast } from '@/hooks/use-toast';
import RepairOrderViewerModal from '@/components/repair-orders/RepairOrderViewerModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from '@/hooks/use-mobile';
import RepairOrderMobileCard from '@/components/repair-orders/RepairOrderMobileCard';

const RepairOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<RepairOrder | null>(null);
  const [selectedOrderForEmail, setSelectedOrderForEmail] = useState<RepairOrder | null>(null);
  const [selectedOrderForSignature, setSelectedOrderForSignature] = useState<RepairOrder | null>(null);
  const [selectedOrderForConversion, setSelectedOrderForConversion] = useState<RepairOrder | null>(null);
  const [selectedOrderForDeletion, setSelectedOrderForDeletion] = useState<RepairOrder | null>(null);
  const [prefilledInvoice, setPrefilledInvoice] = useState<Partial<Invoice> | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const { orders, isLoading, error, deleteOrder, archiveOrder } = useRepairOrders();
  
  const filteredOrders = orders?.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    
    // Search by reference
    let matchesSearch = false;
    if (order.reference?.toLowerCase().includes(searchLower)) {
      matchesSearch = true;
    }
    
    // Search by client name
    if (order.clients && `${order.clients.first_name} ${order.clients.last_name}`.toLowerCase().includes(searchLower)) {
      matchesSearch = true;
    }
    
    // Search by vehicle info
    if (order.vehicles) {
      const brand = order.vehicles.car_brands?.name || '';
      const model = order.vehicles.car_models?.name || '';
      const licensePlate = order.vehicles.license_plate || '';
      const vehicleInfo = `${brand} ${model} - ${licensePlate}`.toLowerCase();
      
      if (vehicleInfo.includes(searchLower)) {
        matchesSearch = true;
      }
    }
    
    // Apply search filter
    if (searchTerm && !matchesSearch) {
      return false;
    }
    
    // Apply archive filter
    const matchesArchiveStatus = showArchived ? order.archived : !order.archived;
    
    return matchesArchiveStatus;
  }) || [];

  // Effet pour ouvrir automatiquement un ordre de réparation depuis l'URL
  useEffect(() => {
    const openOrderId = searchParams.get('openOrder');
    if (openOrderId && orders && orders.length > 0) {
      const orderToOpen = orders.find(order => order.id === openOrderId);
      if (orderToOpen) {
        setSelectedOrder(orderToOpen);
        setViewerModalOpen(true); // Ouvrir la fenêtre d'aperçu
        // Nettoyer le paramètre URL après ouverture
        setSearchParams(params => {
          params.delete('openOrder');
          return params;
        });
      }
    }
  }, [orders, searchParams, setSearchParams]);

  const handleCreateOrder = () => {
    setSelectedOrder(null);
    setDialogOpen(true);
  };

  const handleEditOrder = (order: RepairOrder) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleDownload = async (order: RepairOrder) => {
    try {
      toast({
        title: "Génération du PDF",
        description: "Génération du PDF en cours..."
      });

      const { generateRepairOrderPDFWithTemplate } = await import('@/utils/repairOrderPDFGeneration');
      const result = await generateRepairOrderPDFWithTemplate(order, {});
      
      if (result.success) {
        toast({
          title: "Téléchargement réussi",
          description: `L'ordre de réparation ${order.reference} a été téléchargé.`
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const handlePrint = async (order: RepairOrder) => {
    try {
      toast({
        title: "Ouverture pour impression",
        description: `Ouverture de l'ordre de réparation ${order.reference} pour impression...`
      });

      const { printRepairOrderPDFWithTemplate } = await import('@/utils/repairOrderPDFGeneration');
      const result = await printRepairOrderPDFWithTemplate(order, {});
      
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'impression:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le PDF pour impression. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const handleSendEmail = (order: RepairOrder) => {
    setSelectedOrderForEmail(order);
    setEmailDialogOpen(true);
  };

  const handleSignOrder = (order: RepairOrder) => {
    setSelectedOrderForSignature(order);
    setSignatureDialogOpen(true);
  };

  const handleRequestDocuments = async (order: RepairOrder) => {
    try {
      const { tokensService } = await import('@/services/supabase/tokens');
      
      await tokensService.createToken({
        company_id: order.company_id!,
        client_id: order.client_id,
        vehicule_id: order.vehicle_id
      });

      toast({
        title: "Demande de justificatifs",
        description: `Demande de justificatifs envoyée pour l'ordre de réparation ${order.reference}. Token créé avec succès.`
      });
    } catch (error) {
      console.error('Erreur lors de la création du token:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le token pour la demande de justificatifs.",
        variant: "destructive"
      });
    }
  };

  const handleConvertToInvoice = (order: RepairOrder) => {
    // Préparer les données de la facture à partir de l'ordre de réparation
    const today = new Date().toISOString().split('T')[0];
    
    const prefilledData: Partial<Invoice> = {
      client_id: order.client_id,
      vehicle_id: order.vehicle_id,
      repair_order_id: order.id,
      status: 'En attente de paiement',
      date: today,
      due_date: today,
      notes: order.notes || '',
      // Informations du sinistre depuis l'ordre de réparation
      claim_number: order.claim_number || '',
      policy_number: order.policy_number || '',
      report_date: order.report_date || '',
      expert_name: order.expert_name || '',
      report_number: order.report_number || '',
      incident_date: order.incident_date || '',
      // Inclure les données de réparations, pièces et remises de l'ordre de réparation
      // Convertir Json en string si nécessaire
      repairs_data: order.repairs_data ? (typeof order.repairs_data === 'string' ? order.repairs_data : JSON.stringify(order.repairs_data)) : undefined,
      parts_data: order.parts_data ? (typeof order.parts_data === 'string' ? order.parts_data : JSON.stringify(order.parts_data)) : undefined,
      discounts_data: order.discounts_data ? (typeof order.discounts_data === 'string' ? order.discounts_data : JSON.stringify(order.discounts_data)) : undefined,
      // Ne pas inclure l'ID pour forcer la création d'une nouvelle facture
    };

    console.log('Converting repair order to invoice with data:', prefilledData);
    console.log('Original repair order data:', order);

    // Passer les données de pré-remplissage pour la création d'une nouvelle facture
    setPrefilledInvoice(prefilledData);
    setInvoiceDialogOpen(true);
  };

  const handleArchiveOrder = async (order: RepairOrder) => {
    try {
      await archiveOrder.mutateAsync(order.id);
      toast({
        title: "Ordre de réparation archivé",
        description: "L'ordre de réparation a été archivé avec succès."
      });
    } catch (error: any) {
      console.error('Error archiving repair order:', error);
      toast({
        title: "Erreur",
        description: `Impossible d'archiver l'ordre de réparation: ${error?.message || 'Erreur inconnue'}`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteOrder = (order: RepairOrder) => {
    setSelectedOrderForDeletion(order);
    setDeleteDialogOpen(true);
  };

  const handleViewOrder = (order: RepairOrder) => {
    setSelectedOrder(order);
    setViewerModalOpen(true);
  };

  const confirmDeleteOrder = () => {
    if (selectedOrderForDeletion) {
      if (showArchived) {
        deleteOrder.mutate(selectedOrderForDeletion.id);
      } else {
        handleArchiveOrder(selectedOrderForDeletion);
      }
      setDeleteDialogOpen(false);
      setSelectedOrderForDeletion(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <ErrorMessage message="Erreur lors du chargement des ordres de réparation" />
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Ordres de réparation</h1>
        <p className="text-gray-600 mt-1">
          Consultez et gérez les ordres de réparation
        </p>
        
        {/* Onglets pour basculer entre actifs et archivés */}
        <div className="flex space-x-1 mt-4 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setShowArchived(false)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              !showArchived 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Ordres actifs
          </button>
          <button
            onClick={() => setShowArchived(true)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              showArchived 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Documents archivés
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">      
        <div className="flex-1" />
        
        <div className="flex items-center w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher un ordre..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          {!showArchived && (
            <Button 
              className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
              onClick={handleCreateOrder}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvel ordre
            </Button>
          )}
        </div>
      </div>
      
      {isMobile ? (
        <div className="space-y-3">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <RepairOrderMobileCard
                key={order.id}
                order={order}
                onViewOrder={handleViewOrder}
                onEditOrder={handleEditOrder}
                onDeleteOrder={showArchived ? handleDeleteOrder : handleArchiveOrder}
                contextMenuProps={{
                  onDownload: handleDownload,
                  onPrint: handlePrint,
                  onSendEmail: handleSendEmail,
                  onSignOrder: handleSignOrder,
                  onRequestDocuments: handleRequestDocuments,
                  onConvertToInvoice: handleConvertToInvoice
                }}
              />
            ))
          ) : (
            <div className="card-container">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="h-10 w-10 text-gray-400 mb-2" />
                <h3 className="font-medium text-gray-900">Aucun résultat</h3>
                <p className="text-gray-500 mt-1">
                  Aucun ordre de réparation correspondant à votre recherche n'a été trouvé.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <RepairOrdersTable
          orders={filteredOrders}
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleDeleteOrder}
          onViewOrder={handleViewOrder}
          contextMenuProps={{
            onDownload: handleDownload,
            onPrint: handlePrint,
            onSendEmail: handleSendEmail,
            onSignOrder: handleSignOrder,
            onRequestDocuments: handleRequestDocuments,
            onConvertToInvoice: handleConvertToInvoice
          }}
        />
      )}

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
        invoice={null}
        open={invoiceDialogOpen}
        onOpenChange={(open) => {
          setInvoiceDialogOpen(open);
          if (!open) {
            setPrefilledInvoice(null);
          }
        }}
        prefillData={prefilledInvoice}
        onSuccess={() => {
          navigate('/documents/factures');
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {showArchived ? 'Supprimer définitivement l\'ordre de réparation' : 'Archiver l\'ordre de réparation'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {showArchived 
                ? 'Êtes-vous sûr de vouloir supprimer définitivement cet ordre de réparation ? Cette action est irréversible et supprimera définitivement toutes les données associées.'
                : 'Êtes-vous sûr de vouloir archiver cet ordre de réparation ? Vous pourrez le restaurer depuis l\'onglet "Documents archivés".'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteOrder} 
              className={showArchived ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-700"}
            >
              {showArchived ? 'Supprimer' : 'Archiver'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <RepairOrderViewerModal
        repairOrder={selectedOrder}
        open={viewerModalOpen}
        onOpenChange={setViewerModalOpen}
      />
    </div>
  );
};

export default RepairOrders;
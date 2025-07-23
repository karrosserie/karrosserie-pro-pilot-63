import React, { useState } from 'react';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Wrench, Eye, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { RepairOrderActionsDropdown } from '@/components/repair-orders/RepairOrderActionsDropdown';
import { calculateOrderAmount } from '@/components/repair-orders/utils/orderCalculations';
import RepairOrderDialog from '@/components/repair-orders/RepairOrderDialog';
import RepairOrderViewerModal from '@/components/repair-orders/RepairOrderViewerModal';
import RepairOrderEmailDialog from '@/components/repair-orders/RepairOrderEmailDialog';
import RepairOrderSignatureDialog from '@/components/repair-orders/RepairOrderSignatureDialog';
import InvoiceDialog from '@/components/invoices/InvoiceDialog';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { Invoice } from '@/services/supabase/invoices';
import { useToast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';

interface VehicleRepairOrdersTabProps {
  vehicleId: string;
}

const VehicleRepairOrdersTab: React.FC<VehicleRepairOrdersTabProps> = ({ vehicleId }) => {
  const { orders, isLoading, deleteOrder } = useRepairOrders();
  const { toast } = useToast();
  const { confirm } = useConfirmation();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<RepairOrder | null>(null);
  const [selectedOrderForEmail, setSelectedOrderForEmail] = useState<RepairOrder | null>(null);
  const [selectedOrderForSignature, setSelectedOrderForSignature] = useState<RepairOrder | null>(null);
  const [prefilledInvoice, setPrefilledInvoice] = useState<Partial<Invoice> | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const vehicleOrders = orders?.filter(order => order.vehicle_id === vehicleId) || [];

  const handleViewOrder = (order: RepairOrder) => {
    setSelectedOrder(order);
    setViewerModalOpen(true);
  };

  const handleEditOrder = (order: RepairOrder) => {
    setSelectedOrder(order);
    setEditDialogOpen(true);
  };

  const handleDeleteOrder = async (order: RepairOrder) => {
    const confirmed = await confirm({
      title: 'Supprimer l\'ordre de réparation',
      description: `Êtes-vous sûr de vouloir supprimer l'ordre de réparation ${order.reference} ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive'
    });

    if (confirmed) {
      try {
        await deleteOrder.mutateAsync(order.id);
        toast({
          title: "Ordre supprimé",
          description: "L'ordre de réparation a été supprimé avec succès."
        });
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: `Impossible de supprimer l'ordre de réparation: ${error.message}`,
          variant: "destructive"
        });
      }
    }
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
        user_id: order.user_id!,
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
    };

    setPrefilledInvoice(prefilledData);
    setInvoiceDialogOpen(true);
  };

  const contextMenuProps = {
    onDownload: handleDownload,
    onPrint: handlePrint,
    onSendEmail: handleSendEmail,
    onSignOrder: handleSignOrder,
    onRequestDocuments: handleRequestDocuments,
    onConvertToInvoice: handleConvertToInvoice
  };

  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (error) {
      return '-';
    }
  };

  return (
    <>
      <div className="card-container p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicleOrders.length > 0 ? (
              vehicleOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.reference}</TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>
                    {order.clients 
                      ? `${order.clients.first_name} ${order.clients.last_name}`
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    {order.vehicles 
                      ? `${order.vehicles.car_brands?.name || 'Marque inconnue'} ${order.vehicles.car_models?.name || 'Modèle inconnu'} - ${order.vehicles.license_plate}`
                      : '-'
                    }
                  </TableCell>
                  <TableCell>{formatAmount(calculateOrderAmount(order))}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status || 'En cours'} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditOrder(order)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteOrder(order)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                      <RepairOrderActionsDropdown order={order} contextMenuProps={contextMenuProps} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  <div className="flex flex-col items-center justify-center py-8">
                    <Wrench className="h-10 w-10 text-gray-400 mb-2" />
                    <h3 className="font-medium text-gray-900">Aucun ordre de réparation</h3>
                    <p className="text-gray-500 mt-1">Ce véhicule n'a pas encore d'ordre de réparation.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <RepairOrderDialog
        order={selectedOrder}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <RepairOrderViewerModal
        repairOrder={selectedOrder}
        open={viewerModalOpen}
        onOpenChange={setViewerModalOpen}
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
            setPrefilledInvoice(null);
          }
        }}
        invoice={prefilledInvoice as Invoice}
      />
    </>
  );
};

export default VehicleRepairOrdersTab;
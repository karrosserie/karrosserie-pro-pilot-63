import React, { useState } from 'react';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { useTableSorting } from '@/hooks/use-table-sorting';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { SortableTableHeader } from '@/components/ui/sortable-table-header';
import { Wrench, Eye, Pencil, Archive, Download, Printer, Mail, Signature, ArrowRight, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { UnsignedRepairOrderWarningDialog } from '@/components/repair-orders/UnsignedRepairOrderWarningDialog';

interface VehicleRepairOrdersTabProps {
  vehicleId: string;
}

const VehicleRepairOrdersTab: React.FC<VehicleRepairOrdersTabProps> = ({ vehicleId }) => {
  const { orders, isLoading, archiveOrder } = useRepairOrders();
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
  const [showUnsignedWarning, setShowUnsignedWarning] = useState(false);
  const [orderToConvert, setOrderToConvert] = useState<RepairOrder | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const vehicleOrders = orders?.filter(order => order.vehicle_id === vehicleId) || [];
  const { sortedData, sortConfig, handleSort } = useTableSorting<RepairOrder>(vehicleOrders, 'reference');

  const handleViewOrder = (order: RepairOrder) => {
    setSelectedOrder(order);
    setViewerModalOpen(true);
  };

  const handleEditOrder = (order: RepairOrder) => {
    setSelectedOrder(order);
    setEditDialogOpen(true);
  };

  const handleArchiveOrder = async (order: RepairOrder) => {
    const confirmed = await confirm({
      title: 'Archiver l\'ordre de réparation',
      description: `Êtes-vous sûr de vouloir archiver l'ordre de réparation ${order.reference} ? L'ordre restera visible mais sera marqué comme archivé.`,
      confirmText: 'Archiver',
      cancelText: 'Annuler',
      variant: 'default'
    });

    if (confirmed) {
      try {
        await archiveOrder.mutateAsync(order.id);
        toast({
          title: "Ordre archivé",
          description: `L'ordre de réparation ${order.reference} a été archivé avec succès.`
        });
      } catch (error: any) {
        console.error('Error archiving repair order:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'archiver l'ordre de réparation.",
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

  const handleConvertToInvoice = (order: RepairOrder) => {
    if (order.status !== 'Signé') {
      setOrderToConvert(order);
      setShowUnsignedWarning(true);
      return;
    }
    proceedWithConversion(order);
  };

  const proceedWithConversion = (order: RepairOrder) => {
    const today = new Date().toISOString().split('T')[0];
    
    const prefilledData: Partial<Invoice> = {
      client_id: order.client_id,
      vehicle_id: order.vehicle_id,
      repair_order_id: order.id,
      status: 'En attente de paiement',
      date: today,
      due_date: today,
      notes: order.notes || '',
      claim_number: order.claim_number || '',
      policy_number: order.policy_number || '',
      report_date: order.report_date || '',
      expert_name: order.expert_name || '',
      report_number: order.report_number || '',
      incident_date: order.incident_date || '',
      repairs_data: order.repairs_data ? (typeof order.repairs_data === 'string' ? order.repairs_data : JSON.stringify(order.repairs_data)) : undefined,
      parts_data: order.parts_data ? (typeof order.parts_data === 'string' ? order.parts_data : JSON.stringify(order.parts_data)) : undefined,
      discounts_data: order.discounts_data ? (typeof order.discounts_data === 'string' ? order.discounts_data : JSON.stringify(order.discounts_data)) : undefined,
    };

    setPrefilledInvoice(prefilledData);
    setInvoiceDialogOpen(true);
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
        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <SortableTableHeader sortKey="reference" sortConfig={sortConfig} onSort={handleSort}>
                  Numéro
                </SortableTableHeader>
                <SortableTableHeader sortKey="created_at" sortConfig={sortConfig} onSort={handleSort}>
                  Date
                </SortableTableHeader>
                <SortableTableHeader sortKey="clients.first_name" sortConfig={sortConfig} onSort={handleSort} className="hidden md:table-cell">
                  Client
                </SortableTableHeader>
                <TableHead className="hidden lg:table-cell">Véhicule</TableHead>
                <SortableTableHeader sortKey="amount" sortConfig={sortConfig} onSort={handleSort}>
                  Montant
                </SortableTableHeader>
                <SortableTableHeader sortKey="status" sortConfig={sortConfig} onSort={handleSort}>
                  Statut
                </SortableTableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length > 0 ? (
                sortedData.map((order) => (
                  <React.Fragment key={order.id}>
                    <TableRow className="border-b-0">
                      <TableCell className="font-medium text-xs sm:text-sm py-2 sm:py-4">{order.reference}</TableCell>
                      <TableCell className="text-xs sm:text-sm py-2 sm:py-4">{formatDate(order.created_at)}</TableCell>
                      <TableCell className="hidden md:table-cell text-xs sm:text-sm py-2 sm:py-4">
                        {order.clients 
                          ? `${order.clients.first_name} ${order.clients.last_name}`
                          : '-'
                        }
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs sm:text-sm py-2 sm:py-4">
                        {order.vehicles 
                          ? `${order.vehicles.car_brands?.name || 'Marque inconnue'} ${order.vehicles.car_models?.name || 'Modèle inconnu'} - ${order.vehicles.license_plate}`
                          : '-'
                        }
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm py-2 sm:py-4">{formatAmount(calculateOrderAmount(order))}</TableCell>
                      <TableCell className="py-2 sm:py-4">
                        <StatusBadge status={order.status || 'En cours'} />
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-t-0">
                      <TableCell colSpan={6} className="py-2 sm:py-3 border-t-0">
                        <div className="flex flex-wrap gap-1 sm:gap-2 justify-end px-2 sm:px-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline sm:ml-1">Voir</span>
                          </Button>
                          {(!order.invoices || order.invoices.length === 0) && (
                            <Button 
                              size="sm"
                              className="h-8 px-2 sm:h-9 sm:px-3 bg-karrosserie-orange hover:bg-karrosserie-orange/90"
                              onClick={() => handleConvertToInvoice(order)}
                            >
                              <ArrowRight className="h-4 w-4" />
                              <span className="hidden sm:inline sm:ml-1">Convertir</span>
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3">
                                <MoreVertical className="h-4 w-4" />
                                <span className="hidden sm:inline sm:ml-1">Plus</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-background border shadow-lg z-50">
                              <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownload(order)}>
                                <Download className="h-4 w-4 mr-2" />
                                Télécharger
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePrint(order)}>
                                <Printer className="h-4 w-4 mr-2" />
                                Imprimer
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSendEmail(order)}>
                                <Mail className="h-4 w-4 mr-2" />
                                Envoyer
                              </DropdownMenuItem>
                              {order.status !== 'Signé' && (
                                <DropdownMenuItem onClick={() => handleSignOrder(order)}>
                                  <Signature className="h-4 w-4 mr-2" />
                                  Signature du client
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleArchiveOrder(order)} className="text-orange-600">
                                <Archive className="h-4 w-4 mr-2" />
                                Archiver
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
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

      <UnsignedRepairOrderWarningDialog
        open={showUnsignedWarning}
        onOpenChange={setShowUnsignedWarning}
        orderReference={orderToConvert?.reference}
        onConfirm={() => {
          if (orderToConvert) {
            proceedWithConversion(orderToConvert);
          }
          setShowUnsignedWarning(false);
          setOrderToConvert(null);
        }}
      />
    </>
  );
};

export default VehicleRepairOrdersTab;
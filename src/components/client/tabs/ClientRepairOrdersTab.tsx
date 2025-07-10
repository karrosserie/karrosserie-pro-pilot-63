
import React, { useState } from 'react';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { SimpleTable } from '@/components/ui/simple-table';
import { Wrench, Eye, Pencil, Trash } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { RepairOrderActionsDropdown } from '@/components/repair-orders/RepairOrderActionsDropdown';
import { calculateOrderAmount } from '@/components/repair-orders/utils/orderCalculations';
import RepairOrderDialog from '@/components/repair-orders/RepairOrderDialog';
import RepairOrderEmailDialog from '@/components/repair-orders/RepairOrderEmailDialog';
import RepairOrderSignatureDialog from '@/components/repair-orders/RepairOrderSignatureDialog';
import InvoiceDialog from '@/components/invoices/InvoiceDialog';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { Invoice } from '@/services/supabase/invoices';
import { useToast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';

interface ClientRepairOrdersTabProps {
  clientId: string;
}

const ClientRepairOrdersTab: React.FC<ClientRepairOrdersTabProps> = ({ clientId }) => {
  const { orders, isLoading, deleteOrder } = useRepairOrders();
  const { toast } = useToast();
  const { confirm } = useConfirmation();
  const [dialogOpen, setDialogOpen] = useState(false);
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

  const clientOrders = orders?.filter(order => order.client_id === clientId) || [];

  const handleViewOrder = (order: RepairOrder) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleEditOrder = (order: RepairOrder) => {
    setSelectedOrder(order);
    setDialogOpen(true);
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

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "reference",
      header: "Numéro",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("reference") as string}</span>
      )
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => formatDate(row.getValue("created_at") as string)
    },
    {
      accessorKey: "clients",
      header: "Client",
      cell: ({ row }) => {
        const client = row.getValue("clients") as any;
        return client ? `${client.first_name} ${client.last_name}` : '-';
      }
    },
    {
      accessorKey: "vehicles",
      header: "Véhicule",
      cell: ({ row }) => {
        const vehicle = row.getValue("vehicles") as any;
        if (!vehicle) return '-';
        return `${vehicle.car_brands?.name || 'Marque inconnue'} ${vehicle.car_models?.name || 'Modèle inconnu'} - ${vehicle.license_plate}`;
      }
    },
    {
      accessorKey: "amount",
      header: "Montant",
      cell: ({ row }) => {
        const order = row.original;
        const amount = calculateOrderAmount(order);
        return formatAmount(amount);
      }
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <StatusBadge status={status || 'En cours'} />;
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleViewOrder(order);
              }}
              title="Voir les détails"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleEditOrder(order);
              }}
              title="Modifier"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteOrder(order);
              }}
              title="Supprimer"
            >
              <Trash className="h-4 w-4" />
            </Button>
            <RepairOrderActionsDropdown order={order} contextMenuProps={contextMenuProps} />
          </div>
        );
      }
    }
  ];

  if (clientOrders.length === 0) {
    return (
      <div className="text-center py-8">
        <Wrench className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun ordre de réparation</h3>
        <p className="mt-1 text-sm text-gray-500">Ce client n'a pas encore d'ordre de réparation.</p>
      </div>
    );
  }

  return (
    <>
      <SimpleTable
        columns={columns}
        data={clientOrders}
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
            setPrefilledInvoice(null);
          }
        }}
        invoice={prefilledInvoice as Invoice}
      />
    </>
  );
};

export default ClientRepairOrdersTab;

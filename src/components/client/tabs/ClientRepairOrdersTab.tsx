
import React from 'react';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { SimpleTable } from '@/components/ui/simple-table';
import { Wrench, Eye, Pencil, Trash } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';

interface ClientRepairOrdersTabProps {
  clientId: string;
}

const ClientRepairOrdersTab: React.FC<ClientRepairOrdersTabProps> = ({ clientId }) => {
  const { orders, isLoading, deleteOrder } = useRepairOrders();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const clientOrders = orders?.filter(order => order.client_id === clientId) || [];

  const handleView = (order: any) => {
    console.log('View repair order:', order);
  };

  const handleEdit = (order: any) => {
    console.log('Edit repair order:', order);
  };

  const handleDelete = (order: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'ordre de réparation ${order.reference} ?`)) {
      deleteOrder.mutate(order.id);
    }
  };

  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '-';
    return amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }) + ' €';
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
      header: "Référence",
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
      accessorKey: "total_amount",
      header: "Montant total",
      cell: ({ row }) => {
        const amount = row.getValue("total_amount");
        return formatAmount(amount as number);
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
              onClick={() => handleView(order)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(order)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(order)}
            >
              <Trash className="h-4 w-4" />
            </Button>
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
    <SimpleTable
      columns={columns}
      data={clientOrders}
    />
  );
};

export default ClientRepairOrdersTab;

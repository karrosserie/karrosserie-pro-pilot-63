
import React from 'react';
import { useInvoices } from '@/hooks/use-invoices';
import { SimpleTable } from '@/components/ui/simple-table';
import { Receipt, Eye, Pencil, Trash } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface ClientInvoicesTabProps {
  clientId: string;
}

const ClientInvoicesTab: React.FC<ClientInvoicesTabProps> = ({ clientId }) => {
  const { invoices, isLoading, deleteInvoice } = useInvoices();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const clientInvoices = invoices?.filter(invoice => invoice.client_id === clientId) || [];

  const handleView = (invoice: any) => {
    console.log('View invoice:', invoice);
  };

  const handleEdit = (invoice: any) => {
    console.log('Edit invoice:', invoice);
  };

  const handleDelete = (invoice: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la facture ${invoice.reference} ?`)) {
      deleteInvoice.mutate(invoice.id);
    }
  };

  const contextMenuProps = {
    onDownload: (invoice: any) => console.log('Download invoice:', invoice),
    onPrint: (invoice: any) => console.log('Print invoice:', invoice),
    onSendEmail: (invoice: any) => console.log('Send email invoice:', invoice),
    onCreateCredit: (invoice: any) => console.log('Create credit:', invoice)
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      return '-';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payée':
        return 'bg-green-100 text-green-800';
      case 'En attente de paiement':
        return 'bg-amber-100 text-amber-800';
      case 'Paiement partiel':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      header: "Date de création",
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
      cell: ({ row }) => formatAmount((row.getValue("amount") as number) || 0)
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(status || 'En attente de paiement')}`}>
            {status || 'En attente de paiement'}
          </span>
        );
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(invoice)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(invoice)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(invoice)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  if (clientInvoices.length === 0) {
    return (
      <div className="text-center py-8">
        <Receipt className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucune facture</h3>
        <p className="mt-1 text-sm text-gray-500">Ce client n'a pas encore de facture.</p>
      </div>
    );
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div>
          <SimpleTable
            columns={columns}
            data={clientInvoices}
          />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => contextMenuProps.onDownload(clientInvoices[0])}>
          Télécharger
        </ContextMenuItem>
        <ContextMenuItem onClick={() => contextMenuProps.onPrint(clientInvoices[0])}>
          Imprimer
        </ContextMenuItem>
        <ContextMenuItem onClick={() => contextMenuProps.onSendEmail(clientInvoices[0])}>
          Envoyer par e-mail
        </ContextMenuItem>
        <ContextMenuItem onClick={() => contextMenuProps.onCreateCredit(clientInvoices[0])}>
          Créer un avoir
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ClientInvoicesTab;

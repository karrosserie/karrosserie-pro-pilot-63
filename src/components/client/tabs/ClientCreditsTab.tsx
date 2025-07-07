import React, { useState } from 'react';
import { useCredits } from '@/hooks/use-credits';
import { useInvoices } from '@/hooks/use-invoices';
import { SimpleTable } from '@/components/ui/simple-table';
import { CreditCard, Eye, Pencil, Trash } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ClientCreditsTabProps {
  clientId: string;
}

const ClientCreditsTab: React.FC<ClientCreditsTabProps> = ({ clientId }) => {
  const { credits, isLoading, deleteCredit } = useCredits();
  const { invoices } = useInvoices();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  // Filter credits: direct client assignment OR via invoice belonging to client
  const clientCredits = credits?.filter(credit => {
    // Direct client assignment
    if (credit.client_id === clientId) {
      return true;
    }
    // Credit linked to an invoice belonging to the client
    if (credit.invoice_id && invoices) {
      const relatedInvoice = invoices.find(invoice => invoice.id === credit.invoice_id);
      return relatedInvoice?.client_id === clientId;
    }
    return false;
  }) || [];

  const handleView = (credit: any) => {
    toast({
      title: "Fonctionnalité à implémenter",
      description: `Affichage de l'avoir ${credit.reference}`,
    });
  };

  const handleEdit = (credit: any) => {
    toast({
      title: "Fonctionnalité à implémenter",
      description: `Édition de l'avoir ${credit.reference}`,
    });
  };

  const handleDelete = (credit: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'avoir ${credit.reference} ?`)) {
      deleteCredit.mutate(credit.id);
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Émis':
        return 'bg-blue-100 text-blue-800';
      case 'Utilisé':
        return 'bg-green-100 text-green-800';
      case 'Annulé':
        return 'bg-red-100 text-red-800';
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
      accessorKey: "invoices",
      header: "Facture liée",
      cell: ({ row }) => {
        const invoice = row.getValue("invoices") as any;
        return invoice ? invoice.reference : "-";
      }
    },
    {
      accessorKey: "amount",
      header: "Montant",
      cell: ({ row }) => {
        const amount = row.getValue("amount");
        return formatAmount(amount as number);
      }
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(status || 'Émis')}`}>
            {status || 'Émis'}
          </span>
        );
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const credit = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleView(credit);
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
                handleEdit(credit);
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
                handleDelete(credit);
              }}
              title="Supprimer"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  if (clientCredits.length === 0) {
    return (
      <div className="text-center py-8">
        <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun avoir</h3>
        <p className="mt-1 text-sm text-gray-500">Ce client n'a pas encore d'avoir.</p>
      </div>
    );
  }

  return (
    <SimpleTable
      columns={columns}
      data={clientCredits}
    />
  );
};

export default ClientCreditsTab;

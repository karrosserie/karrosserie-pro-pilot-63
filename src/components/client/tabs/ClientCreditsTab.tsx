import React, { useState } from 'react';
import { useCredits } from '@/hooks/use-credits';
import { useInvoices } from '@/hooks/use-invoices';
import { SimpleTable } from '@/components/ui/simple-table';
import { CreditCard, Eye, Pencil, Trash, MoreVertical } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Printer, Mail } from 'lucide-react';
import { EditCreditDialog } from '@/components/credits/EditCreditDialog';

interface ClientCreditsTabProps {
  clientId: string;
}

const ClientCreditsTab: React.FC<ClientCreditsTabProps> = ({ clientId }) => {
  const { credits, isLoading, deleteCredit } = useCredits();
  const { invoices } = useInvoices();
  const { toast } = useToast();
  const { confirm } = useConfirmation();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  // Filter credits: credit linked to an invoice belonging to the client
  const clientCredits = credits?.filter(credit => {
    if (credit.invoice_id && invoices) {
      const relatedInvoice = invoices.find(invoice => invoice.id === credit.invoice_id);
      return relatedInvoice?.client_id === clientId;
    }
    return false;
  }) || [];

  const formatVehicleDisplay = (credit: any) => {
    // First, try to get vehicle data from the credit itself
    if (credit.vehicles) {
      let brand = '';
      let model = '';
      
      if (credit.vehicles.car_brands?.name) {
        brand = credit.vehicles.car_brands.name;
      } else if (credit.vehicles.brand) {
        brand = credit.vehicles.brand;
      }
      
      if (credit.vehicles.car_models?.name) {
        model = credit.vehicles.car_models.name;
      } else if (credit.vehicles.model) {
        model = credit.vehicles.model;
      }
      
      const licensePlate = credit.vehicles.license_plate || '';
      
      if (brand || model || licensePlate) {
        return `${brand} ${model}${licensePlate ? ` - ${licensePlate}` : ''}`.trim() || '-';
      }
    }
    
    // If no vehicle data in credit, try to get it from the linked invoice
    if (credit.invoice_id && invoices) {
      const linkedInvoice = invoices.find(invoice => invoice.id === credit.invoice_id);
      
      if (linkedInvoice?.vehicles) {
        let brand = '';
        let model = '';
        
        if (linkedInvoice.vehicles.car_brands?.name) {
          brand = linkedInvoice.vehicles.car_brands.name;
        }
        
        if (linkedInvoice.vehicles.car_models?.name) {
          model = linkedInvoice.vehicles.car_models.name;
        }
        
        const licensePlate = linkedInvoice.vehicles.license_plate || '';
        
        if (brand || model || licensePlate) {
          return `${brand} ${model}${licensePlate ? ` - ${licensePlate}` : ''}`.trim() || '-';
        }
      }
    }
    
    return '-';
  };

  const getInvoiceDisplay = (invoiceId: string | null) => {
    if (!invoiceId || !invoices) {
      return 'Sans facture';
    }
    
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) {
      return 'Facture introuvable';
    }
    
    const clientName = invoice.clients 
      ? `${invoice.clients.first_name} ${invoice.clients.last_name}` 
      : 'Client non assigné';
    
    const amount = typeof invoice.amount === 'number' 
      ? invoice.amount.toFixed(2).replace('.', ',')
      : '0,00';
    
    return `Facture n°${invoice.reference} - ${clientName} - ${amount} €`;
  };

  const handleView = (credit: any) => {
    // Parse items_data if it exists
    let items = [];
    if (credit.items_data) {
      try {
        items = JSON.parse(credit.items_data);
      } catch (error) {
        console.error('Error parsing items_data:', error);
      }
    }

    setSelectedCredit({
      ...credit,
      items
    });
    setViewDialogOpen(true);
  };

  const handleEdit = (credit: any) => {
    // Parse items_data if it exists
    let items = [];
    if (credit.items_data) {
      try {
        items = JSON.parse(credit.items_data);
      } catch (error) {
        console.error('Error parsing items_data:', error);
      }
    }

    setSelectedCredit({
      ...credit,
      items
    });
    setEditDialogOpen(true);
  };

  const handleDelete = async (credit: any) => {
    const confirmed = await confirm({
      title: 'Supprimer l\'avoir',
      description: `Êtes-vous sûr de vouloir supprimer l'avoir ${credit.reference} ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive'
    });

    if (confirmed) {
      try {
        await deleteCredit.mutateAsync(credit.id);
      } catch (error) {
        console.error('Error deleting credit:', error);
      }
    }
  };

  const handleDownload = (credit: any) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement de l'avoir ${credit.reference}...`
    });
  };

  const handlePrint = (credit: any) => {
    toast({
      title: "Impression",
      description: `Impression de l'avoir ${credit.reference}...`
    });
  };

  const handleSendEmail = (credit: any) => {
    toast({
      title: "Envoi par e-mail",
      description: `Envoi de l'avoir ${credit.reference} par e-mail...`
    });
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
      case 'Payé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
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
      accessorKey: "vehicles",
      header: "Véhicule",
      cell: ({ row }) => {
        const credit = row.original;
        return formatVehicleDisplay(credit);
      }
    },
    {
      accessorKey: "invoice_id",
      header: "Facture d'origine",
      cell: ({ row }) => {
        const credit = row.original;
        return getInvoiceDisplay(credit.invoice_id);
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
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(status || 'En attente')}`}>
            {status || 'En attente'}
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
              disabled={deleteCredit.isPending}
            >
              <Trash className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={() => handleDownload(credit)}>
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePrint(credit)}>
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSendEmail(credit)}>
                  <Mail className="mr-2 h-4 w-4" />
                  Envoyer par e-mail
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
    <>
      <SimpleTable
        columns={columns}
        data={clientCredits}
      />

      {selectedCredit && (
        <>
          <EditCreditDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            creditId={selectedCredit.id}
            initialData={{
              reference: selectedCredit.reference,
              invoice_id: selectedCredit.invoice_id,
              status: selectedCredit.status,
              notes: selectedCredit.notes,
              items: selectedCredit.items
            }}
          />

          <EditCreditDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            creditId={selectedCredit.id}
            initialData={{
              reference: selectedCredit.reference,
              invoice_id: selectedCredit.invoice_id,
              status: selectedCredit.status,
              notes: selectedCredit.notes,
              items: selectedCredit.items
            }}
            readOnly={true}
          />
        </>
      )}
    </>
  );
};

export default ClientCreditsTab;


import React, { useState } from 'react';
import { useQuotes } from '@/hooks/use-quotes';
import { SimpleTable } from '@/components/ui/simple-table';
import { FileText, Eye, Pencil, Trash, MoreVertical, FileImage } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Download, Printer, Mail, FileCheck, ArrowRight } from 'lucide-react';
import QuoteDialog from '@/components/quotes/QuoteDialog';
import QuoteEmailDialog from '@/components/quotes/QuoteEmailDialog';
import RepairOrderDialog from '@/components/repair-orders/RepairOrderDialog';
import QuoteViewerDialog from '@/components/quotes/QuoteViewerDialog';
import { Quote } from '@/services/supabase/quotes';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { useToast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';

interface ClientQuotesTabProps {
  clientId: string;
}

const ClientQuotesTab: React.FC<ClientQuotesTabProps> = ({ clientId }) => {
  const { quotes, isLoading, deleteQuote } = useQuotes();
  const { toast } = useToast();
  const { confirm } = useConfirmation();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [repairOrderDialogOpen, setRepairOrderDialogOpen] = useState(false);
  const [viewerDialogOpen, setViewerDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedQuoteForEmail, setSelectedQuoteForEmail] = useState<Quote | null>(null);
  const [selectedQuoteForViewer, setSelectedQuoteForViewer] = useState<Quote | null>(null);
  const [prefilledRepairOrder, setPrefilledRepairOrder] = useState<Partial<RepairOrder> | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const clientQuotes = quotes?.filter(quote => quote.client_id === clientId) || [];

  const handleView = (quote: any) => {
    setSelectedQuote(quote);
    setEditDialogOpen(true);
  };

  const handleEdit = (quote: any) => {
    setSelectedQuote(quote);
    setEditDialogOpen(true);
  };

  const handleDelete = async (quote: any) => {
    const confirmed = await confirm({
      title: 'Supprimer le devis',
      description: `Êtes-vous sûr de vouloir supprimer le devis ${quote.reference} ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive'
    });

    if (confirmed) {
      try {
        await deleteQuote.mutateAsync(quote.id);
      } catch (error: any) {
        console.error('Error deleting quote:', error);
      }
    }
  };

  const handleDownload = (quote: Quote) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement du devis ${quote.reference}...`
    });
  };

  const handlePrint = (quote: Quote) => {
    toast({
      title: "Impression",
      description: `Impression du devis ${quote.reference}...`
    });
  };

  const handleSendEmail = (quote: Quote) => {
    setSelectedQuoteForEmail(quote);
    setEmailDialogOpen(true);
  };

  const handleRequestDocuments = (quote: Quote) => {
    toast({
      title: "Demande de justificatifs",
      description: `Demande de justificatifs envoyée pour le devis ${quote.reference}`
    });
  };

  const handleViewPDF = (quote: Quote) => {
    setSelectedQuoteForViewer(quote);
    setViewerDialogOpen(true);
  };

  const handleConvertToRepairOrder = (quote: Quote) => {
    // Parser les données JSON du devis
    let repairs = [];
    let parts = [];
    let discounts = [];
    
    try {
      repairs = quote.repairs_data ? JSON.parse(quote.repairs_data as string) : [];
    } catch (e) {
      console.error('Error parsing repairs data:', e);
    }
    
    try {
      parts = quote.parts_data ? JSON.parse(quote.parts_data as string) : [];
    } catch (e) {
      console.error('Error parsing parts data:', e);
    }
    
    try {
      discounts = quote.discounts_data ? JSON.parse(quote.discounts_data as string) : [];
    } catch (e) {
      console.error('Error parsing discounts data:', e);
    }
    
    const prefilledData: Partial<RepairOrder> = {
      client_id: quote.client_id,
      vehicle_id: quote.vehicle_id,
      quote_id: quote.id,
      status: 'En cours',
      notes: quote.notes || '',
      claim_number: quote.claim_number || '',
      report_number: quote.report_number || '',
      policy_number: quote.policy_number || '',
      report_date: quote.report_date || '',
      expert_name: quote.expert_name || '',
      incident_date: quote.incident_date || '',
      // Convertir les données JSON en string pour l'ordre de réparation
      repairs_data: JSON.stringify(repairs),
      parts_data: JSON.stringify(parts),
      discounts_data: JSON.stringify(discounts),
    };

    setPrefilledRepairOrder(prefilledData);
    setRepairOrderDialogOpen(true);
  };

  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '-';
    return amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }) + ' €';
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
      cell: ({ row }) => new Date(row.getValue("created_at") as string).toLocaleDateString('fr-FR')
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
        const amount = row.getValue("amount");
        return formatAmount(amount as number);
      }
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <StatusBadge status={status || 'En attente'} />;
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const quote = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleViewPDF(quote);
              }}
              title="Visualiser le PDF"
            >
              <FileImage className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleView(quote);
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
                handleEdit(quote);
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
                handleDelete(quote);
              }}
              title="Supprimer"
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
                <DropdownMenuItem onClick={() => handleDownload(quote)}>
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePrint(quote)}>
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSendEmail(quote)}>
                  <Mail className="mr-2 h-4 w-4" />
                  Envoyer par e-mail
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleRequestDocuments(quote)}>
                  <FileCheck className="mr-2 h-4 w-4" />
                  Demander les justificatifs
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleConvertToRepairOrder(quote)}>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Convertir en ordre de réparation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      }
    }
  ];

  if (clientQuotes.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun devis</h3>
        <p className="mt-1 text-sm text-gray-500">Ce client n'a pas encore de devis.</p>
      </div>
    );
  }

  return (
    <>
      <SimpleTable
        columns={columns}
        data={clientQuotes}
      />

      <QuoteDialog
        quote={selectedQuote}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <QuoteEmailDialog
        quote={selectedQuoteForEmail}
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
      />

      <RepairOrderDialog
        order={prefilledRepairOrder as RepairOrder}
        open={repairOrderDialogOpen}
        onOpenChange={(open) => {
          setRepairOrderDialogOpen(open);
          if (!open) {
            setPrefilledRepairOrder(null);
          }
        }}
      />

      <QuoteViewerDialog
        quote={selectedQuoteForViewer}
        open={viewerDialogOpen}
        onOpenChange={setViewerDialogOpen}
      />
    </>
  );
};

export default ClientQuotesTab;

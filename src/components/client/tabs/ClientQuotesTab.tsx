
import React, { useState } from 'react';
import { useQuotes } from '@/hooks/use-quotes';
import { useTableSorting } from '@/hooks/use-table-sorting';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { SortableTableHeader } from '@/components/ui/sortable-table-header';
import { FileText, Eye, Pencil, Trash, Download, Printer, Mail, FileCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import ClientQuoteMobileCard from './ClientQuoteMobileCard';

import QuoteDialog from '@/components/quotes/QuoteDialog';
import QuoteViewerModal from '@/components/quotes/QuoteViewerModal';
import QuoteEmailDialog from '@/components/quotes/QuoteEmailDialog';
import RepairOrderDialog from '@/components/repair-orders/RepairOrderDialog';
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
  const isMobile = useIsMobile();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [repairOrderDialogOpen, setRepairOrderDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedQuoteForEmail, setSelectedQuoteForEmail] = useState<Quote | null>(null);
  const [prefilledRepairOrder, setPrefilledRepairOrder] = useState<Partial<RepairOrder> | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const clientQuotes = quotes?.filter(quote => quote.client_id === clientId) || [];
  const { sortedData, sortConfig, handleSort } = useTableSorting(clientQuotes, 'reference');

  const handleView = (quote: Quote) => {
    setSelectedQuote(quote);
    setViewerModalOpen(true);
  };

  const handleEdit = (quote: Quote) => {
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

  const handleDownload = async (quote: Quote) => {
    const { generateQuotePDFWithTemplate } = await import('@/utils/quotePDFGeneration');
    const result = await generateQuotePDFWithTemplate(quote, {});
    if (result.success) {
      toast({
        title: "Téléchargement réussi",
        description: `Le devis ${quote.reference} a été téléchargé.`
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le devis.",
        variant: "destructive"
      });
    }
  };

  const handlePrint = async (quote: Quote) => {
    const { printQuotePDFWithTemplate } = await import('@/utils/quotePDFGeneration');
    const result = await printQuotePDFWithTemplate(quote, {});
    if (result.success) {
      toast({
        title: "Impression",
        description: `Le devis ${quote.reference} a été ouvert pour impression.`
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'imprimer le devis.",
        variant: "destructive"
      });
    }
  };

  const handleSendEmail = (quote: Quote) => {
    setSelectedQuoteForEmail(quote);
    setEmailDialogOpen(true);
  };

  const handleRequestDocuments = async (quote: Quote) => {
    try {
      const { tokensService } = await import('@/services/supabase/tokens');
      
      await tokensService.createToken({
        company_id: quote.company_id!,
        client_id: quote.client_id,
        vehicule_id: quote.vehicle_id
      });

      toast({
        title: "Demande de justificatifs",
        description: `Demande de justificatifs envoyée pour le devis ${quote.reference}. Token créé avec succès.`
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

  if (isMobile) {
    return (
      <>
        <div className="space-y-4 p-4">
          {sortedData.length > 0 ? (
            sortedData.map((quote) => (
              <ClientQuoteMobileCard
                key={quote.id}
                quote={quote}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onPrint={handlePrint}
                onSendEmail={handleSendEmail}
                onRequestDocuments={handleRequestDocuments}
                onConvertToRepairOrder={handleConvertToRepairOrder}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <FileText className="h-10 w-10 text-gray-400 mb-2" />
              <h3 className="font-medium text-gray-900">Aucun devis</h3>
              <p className="text-gray-500 mt-1">Ce client n'a pas encore de devis.</p>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="card-container p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHeader sortKey="reference" sortConfig={sortConfig} onSort={handleSort}>
                Numéro
              </SortableTableHeader>
              <SortableTableHeader sortKey="created_at" sortConfig={sortConfig} onSort={handleSort}>
                Date
              </SortableTableHeader>
              <SortableTableHeader sortKey="clients.last_name" sortConfig={sortConfig} onSort={handleSort}>
                Client
              </SortableTableHeader>
              <SortableTableHeader sortKey="vehicles.license_plate" sortConfig={sortConfig} onSort={handleSort}>
                Véhicule
              </SortableTableHeader>
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
              sortedData.map((quote) => (
                <React.Fragment key={quote.id}>
                  <TableRow className="border-b-0">
                    <TableCell className="font-medium">{quote.reference}</TableCell>
                    <TableCell>{new Date(quote.created_at).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>{quote.clients ? `${quote.clients.first_name} ${quote.clients.last_name}` : '-'}</TableCell>
                    <TableCell>
                      {quote.vehicles 
                        ? `${quote.vehicles.car_brands?.name || 'Marque inconnue'} ${quote.vehicles.car_models?.name || 'Modèle inconnu'} - ${quote.vehicles.license_plate}`
                        : '-'
                      }
                    </TableCell>
                    <TableCell>{formatAmount(quote.amount)}</TableCell>
                    <TableCell>
                      <StatusBadge status={quote.status === 'draft' ? 'En attente' : (quote.status || 'En attente')} />
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-t-0">
                    <TableCell colSpan={6} className="py-3 border-t-0">
                      <div className="flex flex-wrap gap-2 justify-end px-4">
                        <Button variant="view" size="sm" onClick={() => handleView(quote)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="edit" size="sm" onClick={() => handleEdit(quote)}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button variant="download" size="sm" onClick={() => handleDownload(quote)}>
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                        <Button variant="print" size="sm" onClick={() => handlePrint(quote)}>
                          <Printer className="h-4 w-4 mr-1" />
                          Imprimer
                        </Button>
                        <Button variant="send" size="sm" onClick={() => handleSendEmail(quote)}>
                          <Mail className="h-4 w-4 mr-1" />
                          E-mail
                        </Button>
                        <Button variant="create" size="sm" onClick={() => handleRequestDocuments(quote)}>
                          <FileCheck className="h-4 w-4 mr-1" />
                          Justificatifs
                        </Button>
                        {!quote.repair_orders || quote.repair_orders.length === 0 ? (
                          <Button size="sm" variant="validation" onClick={() => handleConvertToRepairOrder(quote)}>
                            <ArrowRight className="h-4 w-4 mr-1" />
                            Convertir
                          </Button>
                        ) : null}
                        <Button variant="delete" size="sm" onClick={() => handleDelete(quote)}>
                          <Trash className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  <div className="flex flex-col items-center justify-center py-8">
                    <FileText className="h-10 w-10 text-gray-400 mb-2" />
                    <h3 className="font-medium text-gray-900">Aucun devis</h3>
                    <p className="text-gray-500 mt-1">Ce client n'a pas encore de devis.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <QuoteDialog
        quote={selectedQuote}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <QuoteViewerModal
        quote={selectedQuote}
        open={viewerModalOpen}
        onOpenChange={setViewerModalOpen}
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
    </>
  );
};

export default ClientQuotesTab;

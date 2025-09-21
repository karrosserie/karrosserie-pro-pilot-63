import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuotes } from '@/hooks/use-quotes';
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
import { FileText, Eye, Pencil, Archive, MoreVertical } from 'lucide-react';
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
import QuoteViewerModal from '@/components/quotes/QuoteViewerModal';
import QuoteEmailDialog from '@/components/quotes/QuoteEmailDialog';
import RepairOrderDialog from '@/components/repair-orders/RepairOrderDialog';
import { Quote } from '@/services/supabase/quotes';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { useToast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';

interface VehicleQuotesTabProps {
  vehicleId: string;
}

const VehicleQuotesTab: React.FC<VehicleQuotesTabProps> = ({ vehicleId }) => {
  const navigate = useNavigate();
  const { quotes, isLoading, archiveQuote } = useQuotes();
  const { toast } = useToast();
  const { confirm } = useConfirmation();
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

  const vehicleQuotes = quotes?.filter(quote => quote.vehicle_id === vehicleId) || [];
  const { sortedData, sortConfig, handleSort } = useTableSorting(vehicleQuotes, 'reference');

  const handleView = (quote: Quote) => {
    setSelectedQuote(quote);
    setViewerModalOpen(true);
  };

  const handleEdit = (quote: Quote) => {
    setSelectedQuote(quote);
    setEditDialogOpen(true);
  };

  const handleArchive = async (quote: any) => {
    const confirmed = await confirm({
      title: 'Archiver le devis',
      description: `Êtes-vous sûr de vouloir archiver le devis ${quote.reference} ? Le devis restera visible mais sera marqué comme archivé.`,
      confirmText: 'Archiver',
      cancelText: 'Annuler',
      variant: 'default'
    });

    if (confirmed) {
      try {
        await archiveQuote.mutateAsync(quote.id);
        toast({
          title: "Devis archivé",
          description: `Le devis ${quote.reference} a été archivé avec succès.`
        });
      } catch (error: any) {
        console.error('Error archiving quote:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'archiver le devis.",
          variant: "destructive"
        });
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
              <SortableTableHeader sortKey="clients.first_name" sortConfig={sortConfig} onSort={handleSort}>
                Client
              </SortableTableHeader>
              <TableHead>Véhicule</TableHead>
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleView(quote)}
                          title="Voir"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(quote)}
                          title="Modifier"
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDownload(quote)}
                          title="Télécharger"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handlePrint(quote)}
                          title="Imprimer"
                        >
                          <Printer className="h-4 w-4 mr-1" />
                          Imprimer
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSendEmail(quote)}
                          title="E-mail"
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          E-mail
                        </Button>
                        <Button size="sm" className="bg-karrosserie-orange hover:bg-karrosserie-orange/90" onClick={() => handleConvertToRepairOrder(quote)}>
                          <ArrowRight className="h-4 w-4 mr-1" />
                            Convertir
                          </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-orange-600 hover:text-orange-700 border-orange-600 hover:border-orange-700"
                          onClick={() => handleArchive(quote)}
                          title="Archiver"
                        >
                          <Archive className="h-4 w-4 mr-1" />
                          Archiver
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
                    <p className="text-gray-500 mt-1">Ce véhicule n'a pas encore de devis.</p>
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
        onSuccess={() => {
          navigate('/documents/ordres');
        }}
      />
    </>
  );
};

export default VehicleQuotesTab;
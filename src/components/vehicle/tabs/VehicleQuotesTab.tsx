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
import { Download, Printer, Mail, ArrowRight } from 'lucide-react';
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

  const handleConvertToRepairOrder = (quote: Quote) => {
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
      <div className="w-full max-w-full overflow-hidden">
        {/* Mobile: Cards empilées */}
        <div className="md:hidden space-y-3 p-2">
          {sortedData.map((quote) => (
            <div key={quote.id} className="bg-white border rounded-lg p-3 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-sm">{quote.reference}</p>
                  <p className="text-xs text-gray-500">{new Date(quote.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <StatusBadge status={quote.status === 'draft' ? 'En attente' : (quote.status || 'En attente')} />
              </div>
              <p className="text-sm font-semibold text-karrosserie-orange mb-3">{formatAmount(quote.amount)}</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleView(quote)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" className="h-8 px-2 bg-karrosserie-orange hover:bg-karrosserie-orange/90" onClick={() => handleConvertToRepairOrder(quote)}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border shadow-lg z-50">
                    <DropdownMenuItem onClick={() => handleEdit(quote)}><Pencil className="h-4 w-4 mr-2" />Modifier</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(quote)}><Download className="h-4 w-4 mr-2" />Télécharger</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePrint(quote)}><Printer className="h-4 w-4 mr-2" />Imprimer</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSendEmail(quote)}><Mail className="h-4 w-4 mr-2" />E-mail</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleArchive(quote)} className="text-orange-600"><Archive className="h-4 w-4 mr-2" />Archiver</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
          {sortedData.length === 0 && (
            <div className="text-center py-8">
              <FileText className="mx-auto h-10 w-10 text-gray-400 mb-2" />
              <h3 className="font-medium text-gray-900 text-sm">Aucun devis</h3>
              <p className="text-gray-500 text-xs mt-1">Ce véhicule n'a pas encore de devis.</p>
            </div>
          )}
        </div>

        {/* Desktop: Table */}
        <div className="hidden md:block card-container p-0">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <SortableTableHeader sortKey="reference" sortConfig={sortConfig} onSort={handleSort}>Numéro</SortableTableHeader>
                  <SortableTableHeader sortKey="created_at" sortConfig={sortConfig} onSort={handleSort}>Date</SortableTableHeader>
                  <SortableTableHeader sortKey="clients.first_name" sortConfig={sortConfig} onSort={handleSort}>Client</SortableTableHeader>
                  <TableHead>Véhicule</TableHead>
                  <SortableTableHeader sortKey="amount" sortConfig={sortConfig} onSort={handleSort}>Montant</SortableTableHeader>
                  <SortableTableHeader sortKey="status" sortConfig={sortConfig} onSort={handleSort}>Statut</SortableTableHeader>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.length > 0 ? sortedData.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">{quote.reference}</TableCell>
                    <TableCell>{new Date(quote.created_at).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>{quote.clients ? `${quote.clients.first_name} ${quote.clients.last_name}` : '-'}</TableCell>
                    <TableCell>{quote.vehicles ? `${quote.vehicles.car_brands?.name || ''} ${quote.vehicles.car_models?.name || ''} - ${quote.vehicles.license_plate}` : '-'}</TableCell>
                    <TableCell>{formatAmount(quote.amount)}</TableCell>
                    <TableCell><StatusBadge status={quote.status === 'draft' ? 'En attente' : (quote.status || 'En attente')} /></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleView(quote)}><Eye className="h-4 w-4 mr-1" />Voir</Button>
                        <Button size="sm" className="bg-karrosserie-orange hover:bg-karrosserie-orange/90" onClick={() => handleConvertToRepairOrder(quote)}><ArrowRight className="h-4 w-4 mr-1" />Convertir</Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-background border shadow-lg z-50">
                            <DropdownMenuItem onClick={() => handleEdit(quote)}><Pencil className="h-4 w-4 mr-2" />Modifier</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(quote)}><Download className="h-4 w-4 mr-2" />Télécharger</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePrint(quote)}><Printer className="h-4 w-4 mr-2" />Imprimer</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendEmail(quote)}><Mail className="h-4 w-4 mr-2" />E-mail</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleArchive(quote)} className="text-orange-600"><Archive className="h-4 w-4 mr-2" />Archiver</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <FileText className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                      <h3 className="font-medium text-gray-900">Aucun devis</h3>
                      <p className="text-gray-500 mt-1">Ce véhicule n'a pas encore de devis.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <QuoteDialog quote={selectedQuote} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
      <QuoteViewerModal quote={selectedQuote} open={viewerModalOpen} onOpenChange={setViewerModalOpen} />
      <QuoteEmailDialog quote={selectedQuoteForEmail} open={emailDialogOpen} onOpenChange={setEmailDialogOpen} />
      <RepairOrderDialog
        order={prefilledRepairOrder as RepairOrder}
        open={repairOrderDialogOpen}
        onOpenChange={(open) => { setRepairOrderDialogOpen(open); if (!open) setPrefilledRepairOrder(null); }}
        onSuccess={() => navigate('/documents/ordres')}
      />
    </>
  );
};

export default VehicleQuotesTab;
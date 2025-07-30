
import React, { useState, useEffect } from 'react';
import { calculateGlobalTotals } from '@/components/quotes/form/utils/calculations';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useConfirmation } from '@/hooks/use-confirmation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, FileText, Plus, Filter, Eye, Pencil, Trash, Download, Printer, Mail, FileCheck, ArrowRight } from 'lucide-react';
import { useQuotes } from '@/hooks/use-quotes';
import { useToast } from '@/hooks/use-toast';
import QuoteViewerModal from '@/components/quotes/QuoteViewerModal';
import QuoteDialog from '@/components/quotes/QuoteDialog';
import QuoteEmailDialog from '@/components/quotes/QuoteEmailDialog';
import RepairOrderDialog from '@/components/repair-orders/RepairOrderDialog';
import { Quote } from '@/services/supabase/quotes';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

const Quotes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { confirm } = useConfirmation();
  const { quotes, isLoading, error, deleteQuote } = useQuotes();
  const [searchTerm, setSearchTerm] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [repairOrderDialogOpen, setRepairOrderDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedQuoteForEmail, setSelectedQuoteForEmail] = useState<Quote | null>(null);
  const [prefilledRepairOrder, setPrefilledRepairOrder] = useState<Partial<RepairOrder> | null>(null);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const { toast } = useToast();
  
  const filteredQuotes = quotes?.filter(quote => 
    quote.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (quote.clients && `${quote.clients.first_name} ${quote.clients.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (quote.vehicles && `${quote.vehicles.car_brands?.name || 'Marque inconnue'} ${quote.vehicles.car_models?.name || 'Modèle inconnu'} - ${quote.vehicles.license_plate}`.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleCreateQuote = () => {
    setSelectedQuote(null);
    setEditDialogOpen(true);
  };

  const handleEditQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setEditDialogOpen(true);
  };

  const handleDeleteQuote = async (id: string) => {
    const confirmed = await confirm({
      title: 'Supprimer le devis',
      description: 'Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive'
    });

    if (confirmed) {
      try {
        await deleteQuote.mutateAsync(id);
      } catch (error: any) {
        console.error('Error deleting quote:', error);
      }
    }
  };

  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '-';
    return amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }) + ' €';
  };

  const calculateQuoteAmount = (quote: Quote): number => {
    // Si le devis a des données de réparations et de pièces, calculer le total
    let repairs = [];
    let parts = [];
    let discounts = [];

    try {
      if (quote.repairs_data && typeof quote.repairs_data === 'string') {
        repairs = JSON.parse(quote.repairs_data);
      } else if (Array.isArray(quote.repairs_data)) {
        repairs = quote.repairs_data;
      }
    } catch (error) {
      console.error('Error parsing repairs_data:', error);
      repairs = [];
    }

    try {
      if (quote.parts_data && typeof quote.parts_data === 'string') {
        parts = JSON.parse(quote.parts_data);
      } else if (Array.isArray(quote.parts_data)) {
        parts = quote.parts_data;
      }
    } catch (error) {
      console.error('Error parsing parts_data:', error);
      parts = [];
    }

    try {
      if ((quote as any).discounts_data && typeof (quote as any).discounts_data === 'string') {
        discounts = JSON.parse((quote as any).discounts_data);
      } else if (Array.isArray((quote as any).discounts_data)) {
        discounts = (quote as any).discounts_data;
      }
    } catch (error) {
      console.error('Error parsing discounts_data:', error);
      discounts = [];
    }

    if (repairs.length > 0 || parts.length > 0) {
      const totals = calculateGlobalTotals(repairs, parts, discounts);
      return totals.total;
    }

    // Sinon, utiliser le montant stocké dans amount
    return quote.amount || 0;
  };

  // Effet pour ouvrir automatiquement un devis depuis l'URL
  useEffect(() => {
    const openQuoteId = searchParams.get('openQuote');
    if (openQuoteId && quotes && quotes.length > 0) {
      const quoteToOpen = quotes.find(quote => quote.id === openQuoteId);
      if (quoteToOpen) {
        setSelectedQuote(quoteToOpen);
        setViewerModalOpen(true); // Ouvrir la fenêtre d'aperçu au lieu de modification
        // Nettoyer le paramètre URL après ouverture
        setSearchParams(params => {
          params.delete('openQuote');
          return params;
        });
      }
    }
  }, [quotes, searchParams, setSearchParams]);

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

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setViewerModalOpen(true);
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
    // Préparer les données de l'ordre de réparation à partir du devis
    
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
      status: 'En attente',
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
      // Ne pas inclure l'ID pour forcer la création d'un nouvel ordre
    };

    console.log('Converting quote to repair order with data:', prefilledData);
    console.log('Original quote data:', quote);
    console.log('Parsed repairs:', repairs);
    console.log('Parsed parts:', parts);
    console.log('Parsed discounts:', discounts);

    // Passer les données de pré-remplissage pour la création d'un nouvel ordre
    setPrefilledRepairOrder(prefilledData);
    setRepairOrderDialogOpen(true);
  };
  
  return (
    <TooltipProvider>
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Devis</h1>
        <p className="text-gray-600 mt-1">
            Consultez et gérez les devis de réparation
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">      
        <div className="flex-1" />
        
        <div className="flex items-center w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher un devis..." 
              className="pl-10 bg-white border border-gray-200 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon" className="bg-white">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button 
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
            onClick={handleCreateQuote}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau devis
          </Button>
        </div>
      </div>
      
      <div className="card-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Chargement des devis...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-red-500">
                  Erreur lors du chargement des devis: {error.message}
                </TableCell>
              </TableRow>
            ) : filteredQuotes.length > 0 ? (
              filteredQuotes.map((quote) => (
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
                    <TableCell>{formatAmount(calculateQuoteAmount(quote))}</TableCell>
                    <TableCell>
                      <StatusBadge status={quote.status === 'draft' ? 'En attente' : (quote.status || 'En attente')} />
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-t-0">
                    <TableCell colSpan={6} className="py-3 border-t-0">
                      <div className="flex flex-wrap gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => handleViewQuote(quote)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Aperçu
                        </Button>

                        <Button variant="outline" size="sm" onClick={() => handleEditQuote(quote)}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>

                        <Button variant="outline" size="sm" onClick={() => handleDownload(quote)}>
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>

                        <Button variant="outline" size="sm" onClick={() => handlePrint(quote)}>
                          <Printer className="h-4 w-4 mr-1" />
                          Imprimer
                        </Button>

                        <Button variant="outline" size="sm" onClick={() => handleSendEmail(quote)}>
                          <Mail className="h-4 w-4 mr-1" />
                          E-mail
                        </Button>

                        <Button variant="outline" size="sm" className="hidden" onClick={() => handleRequestDocuments(quote)}>
                          <FileCheck className="h-4 w-4 mr-1" />
                          Justificatifs
                        </Button>

                        <Button variant="outline" size="sm" onClick={() => handleConvertToRepairOrder(quote)}>
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Ordre
                        </Button>

                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 border-red-500 hover:border-red-700" 
                          onClick={() => handleDeleteQuote(quote.id)}
                        >
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
                    <h3 className="font-medium text-gray-900">Aucun résultat</h3>
                    <p className="text-gray-500 mt-1">
                      Aucun devis correspondant à votre recherche n'a été trouvé.
                    </p>
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

      <QuoteEmailDialog
        quote={selectedQuoteForEmail}
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
      />

      <RepairOrderDialog
        order={null}
        open={repairOrderDialogOpen}
        onOpenChange={(open) => {
          setRepairOrderDialogOpen(open);
          if (!open) {
            setPrefilledRepairOrder(null);
          }
        }}
        prefillData={prefilledRepairOrder}
        onSuccess={() => {
          navigate('/documents/ordres');
        }}
      />

      <QuoteViewerModal
        quote={selectedQuote}
        open={viewerModalOpen}
        onOpenChange={setViewerModalOpen}
      />
    </div>
    </TooltipProvider>
  );
};

export default Quotes;

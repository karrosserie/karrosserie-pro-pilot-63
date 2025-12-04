
import React, { useState, useEffect, useMemo } from 'react';
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
import { FileText, Plus, Eye, Pencil, Trash, Download, Printer, Mail, FileCheck, ArrowRight, RotateCcw, ShoppingCart, Paperclip } from 'lucide-react';
import { useTableSorting, SortDirection } from '@/hooks/use-table-sorting';
import { useQuotes } from '@/hooks/use-quotes';
import { useToast } from '@/hooks/use-toast';
import QuoteViewerModal from '@/components/quotes/QuoteViewerModal';
import QuoteDialog from '@/components/quotes/QuoteDialog';
import QuoteEmailDialog from '@/components/quotes/QuoteEmailDialog';
import BonCommandeModal from '@/components/quotes/BonCommandeModal';
import { AttachModificatifDialog } from '@/components/quotes/AttachModificatifDialog';
import RepairOrderDialog from '@/components/repair-orders/RepairOrderDialog';
import { Quote } from '@/services/supabase/quotes';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import QuoteMobileCard from '@/components/quotes/QuoteMobileCard';
import { useUserOnboardingProgress } from '@/hooks/use-user-onboarding-progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { QuotesFilters, QuoteSortOption } from '@/components/quotes/QuotesFilters';

const Quotes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { confirm } = useConfirmation();
  const { quotes, isLoading, error, deleteQuote, archiveQuote, restoreQuote } = useQuotes();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<QuoteSortOption>('recent-first');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [repairOrderDialogOpen, setRepairOrderDialogOpen] = useState(false);
  const [bonCommandeModalOpen, setBonCommandeModalOpen] = useState(false);
  const [attachModificatifDialogOpen, setAttachModificatifDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedQuoteForEmail, setSelectedQuoteForEmail] = useState<Quote | null>(null);
  const [selectedQuoteForBonCommande, setSelectedQuoteForBonCommande] = useState<Quote | null>(null);
  const [prefilledRepairOrder, setPrefilledRepairOrder] = useState<Partial<RepairOrder> | null>(null);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [showConvertPopover, setShowConvertPopover] = useState(false);
  const [showConvertDrawer, setShowConvertDrawer] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { shouldShowQuoteConvertHelp, markHelpAsSeen } = useUserOnboardingProgress();

  // Ajouter le nom complet du client pour le tri alphabétique
  const quotesWithClientName = useMemo(() => {
    return (quotes || []).map(quote => ({
      ...quote,
      clientFullName: quote.clients 
        ? `${quote.clients.first_name || ''} ${quote.clients.last_name || ''}`.trim().toLowerCase()
        : ''
    }));
  }, [quotes]);

  // Convertir l'option de tri en clé/direction
  const getSortConfig = (option: QuoteSortOption): { key: string; direction: SortDirection } => {
    switch (option) {
      case 'alphabetical-asc':
        return { key: 'clientFullName', direction: 'asc' };
      case 'alphabetical-desc':
        return { key: 'clientFullName', direction: 'desc' };
      case 'recent-first':
        return { key: 'created_at', direction: 'desc' };
      case 'oldest-first':
        return { key: 'created_at', direction: 'asc' };
      default:
        return { key: 'created_at', direction: 'desc' };
    }
  };

  const { key: sortKey, direction: sortDirection } = useMemo(() => getSortConfig(sortOption), [sortOption]);
  const { sortedData: sortedQuotes } = useTableSorting(quotesWithClientName, sortKey, sortDirection);
  
  const filteredQuotes = sortedQuotes?.filter(quote => {
    const matchesSearch = quote.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quote.clients && `${quote.clients.first_name} ${quote.clients.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (quote.vehicles && `${quote.vehicles.car_brands?.name || 'Marque inconnue'} ${quote.vehicles.car_models?.name || 'Modèle inconnu'} - ${quote.vehicles.license_plate}`.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesArchiveStatus = showArchived ? quote.archived : !quote.archived;
    
    return matchesSearch && matchesArchiveStatus;
  }) || [];

  // Afficher le popover d'aide au chargement
  useEffect(() => {
    if (shouldShowQuoteConvertHelp && filteredQuotes.length > 0) {
      const timer = setTimeout(() => {
        if (isMobile) {
          setShowConvertDrawer(true);
        } else {
          setShowConvertPopover(true);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldShowQuoteConvertHelp, filteredQuotes.length, isMobile]);

  const handleCreateQuote = () => {
    setSelectedQuote(null);
    setEditDialogOpen(true);
  };

  const handleEditQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setEditDialogOpen(true);
  };

  const handleRestoreQuote = async (id: string) => {
    const confirmed = await confirm({
      title: 'Restaurer le devis',
      description: 'Êtes-vous sûr de vouloir restaurer ce devis dans les documents actifs ?',
      confirmText: 'Restaurer',
      cancelText: 'Annuler',
      variant: 'default'
    });

    if (confirmed) {
      try {
        await restoreQuote.mutateAsync(id);
        toast({
          title: "Devis restauré",
          description: "Le devis a été restauré avec succès."
        });
      } catch (error) {
        console.error('Error restoring quote:', error);
        toast({
          title: "Erreur",
          description: "Impossible de restaurer le devis.",
          variant: "destructive"
        });
      }
    }
  };

  const handleArchiveQuote = async (id: string) => {
    const confirmed = await confirm({
      title: 'Archiver le devis',
      description: 'Êtes-vous sûr de vouloir archiver ce devis ? Vous pourrez le restaurer depuis l\'onglet "Documents archivés".',
      confirmText: 'Archiver',
      cancelText: 'Annuler',
      variant: 'default'
    });

    if (confirmed) {
      try {
        await archiveQuote.mutateAsync(id);
        toast({
          title: "Devis archivé",
          description: "Le devis a été archivé avec succès."
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

  const handleDeleteQuote = async (id: string) => {
    const confirmed = await confirm({
      title: 'Supprimer définitivement le devis',
      description: 'Êtes-vous sûr de vouloir supprimer définitivement ce devis ? Cette action est irréversible.',
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

  const handleBonCommande = (quote: Quote) => {
    setSelectedQuoteForBonCommande(quote);
    setBonCommandeModalOpen(true);
  };

  const handleAttachModificatif = (quote: Quote) => {
    setSelectedQuote(quote);
    setAttachModificatifDialogOpen(true);
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
        
        {/* Onglets pour basculer entre actifs et archivés */}
        <div className="flex space-x-1 mt-4 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setShowArchived(false)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              !showArchived 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Devis actifs
          </button>
          <button
            onClick={() => setShowArchived(true)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              showArchived 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Documents archivés
          </button>
        </div>
      </div>
      
      <QuotesFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateQuote={handleCreateQuote}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />
      
      {isMobile ? (
        <div className="space-y-3">
          {filteredQuotes.length > 0 ? (
            filteredQuotes.map((quote, index) => (
              <QuoteMobileCard
                key={quote.id}
                quote={quote}
                onViewQuote={handleViewQuote}
                onEditQuote={handleEditQuote}
                onArchiveQuote={showArchived ? handleDeleteQuote : handleArchiveQuote}
                onDownload={handleDownload}
                onPrint={handlePrint}
                onSendEmail={handleSendEmail}
                onRequestDocuments={handleRequestDocuments}
                onConvertToRepairOrder={handleConvertToRepairOrder}
                showConvertHelp={index === 0 && shouldShowQuoteConvertHelp}
              />
            ))
          ) : (
            <div className="card-container">
              <div className="flex flex-col items-center justify-center py-8">
                <FileText className="h-10 w-10 text-gray-400 mb-2" />
                <h3 className="font-medium text-gray-900">Aucun résultat</h3>
                <p className="text-gray-500 mt-1">
                  Aucun devis correspondant à votre recherche n'a été trouvé.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
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
              filteredQuotes.map((quote, index) => (
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
                      <div className="flex flex-wrap gap-2 justify-end px-4">
                        <Button variant="view" size="sm" onClick={() => handleViewQuote(quote)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>

                        <Button variant="edit" size="sm" onClick={() => handleEditQuote(quote)}>
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

                        <Button variant="outline" size="sm" onClick={() => handleBonCommande(quote)}>
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Bon de commande
                        </Button>

                        {/* Bouton pour attacher le modificatif si demandé mais pas encore reçu */}
                        {quote.is_modified_from_report && !quote.modificatif_received_at && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleAttachModificatif(quote)}
                            className="border-success text-success hover:bg-success/10"
                          >
                            <Paperclip className="h-4 w-4 mr-1" />
                            Joindre modificatif
                          </Button>
                        )}

                        <Popover open={index === 0 && showConvertPopover && shouldShowQuoteConvertHelp} onOpenChange={setShowConvertPopover}>
                          <PopoverTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="validation" 
                              onClick={() => handleConvertToRepairOrder(quote)}
                              className={shouldShowQuoteConvertHelp ? "animate-blink-bright shadow-lg ring-2 ring-primary ring-offset-2" : ""}
                            >
                              <ArrowRight className="h-4 w-4 mr-1" />
                              Convertir en OR
                            </Button>
                          </PopoverTrigger>
                          {index === 0 && shouldShowQuoteConvertHelp && showConvertPopover && (
                            <PopoverContent 
                              className="w-80 z-[100] pointer-events-auto bg-background border-primary shadow-xl" 
                              side="left" 
                              align="center"
                              onOpenAutoFocus={(e) => e.preventDefault()}
                            >
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">💡 Transformez votre devis !</h4>
                                <p className="text-sm text-muted-foreground">
                                  Cliquez sur ce bouton pour convertir automatiquement votre devis en ordre de réparation.
                                </p>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="w-full mt-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowConvertPopover(false);
                                    markHelpAsSeen('quote_convert_help_seen');
                                  }}
                                >
                                  J'ai compris
                                </Button>
                              </div>
                            </PopoverContent>
                          )}
                        </Popover>

                        {showArchived ? (
                          <Button 
                            variant="validation"
                            size="sm" 
                            onClick={() => handleRestoreQuote(quote.id)}
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Restaurer
                          </Button>
                        ) : (
                          <Button 
                            variant="delete" 
                            size="sm" 
                            onClick={() => handleArchiveQuote(quote.id)}
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Archiver
                          </Button>
                        )}
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
      )}

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
          // La redirection est gérée dans le RepairOrderDialog pour les conversions
          if (!prefilledRepairOrder?.quote_id) {
            navigate('/documents/ordres');
          }
        }}
      />

      <QuoteViewerModal
        quote={selectedQuote}
        open={viewerModalOpen}
        onOpenChange={setViewerModalOpen}
      />

      <BonCommandeModal
        open={bonCommandeModalOpen}
        onOpenChange={setBonCommandeModalOpen}
        quoteId={selectedQuoteForBonCommande?.id || ''}
        quoteReference={selectedQuoteForBonCommande?.reference || ''}
        clientId={selectedQuoteForBonCommande?.client_id || undefined}
      />

      <AttachModificatifDialog
        quote={selectedQuote}
        open={attachModificatifDialogOpen}
        onOpenChange={setAttachModificatifDialogOpen}
      />

      <Drawer open={showConvertDrawer} onOpenChange={setShowConvertDrawer}>
        <DrawerContent>
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-xl">
              💡 Transformez votre devis !
            </DrawerTitle>
            <DrawerDescription className="text-base leading-relaxed pt-2">
              Cliquez sur le bouton "Convertir" pour transformer automatiquement votre devis en ordre de réparation.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex justify-center px-4 pb-6 pt-2">
            <Button 
              onClick={() => {
                setShowConvertDrawer(false);
                markHelpAsSeen('quote_convert_help_seen');
              }}
              className="min-w-[100px]"
            >
              J'ai compris
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
    </TooltipProvider>
  );
};

export default Quotes;

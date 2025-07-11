
import React, { useState, useEffect } from 'react';
import { calculateGlobalTotals } from '@/components/quotes/form/utils/calculations';
import { useSearchParams } from 'react-router-dom';
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
import { Search, FileText, Plus, Filter, Eye, Pencil, Trash, MoreVertical, FileImage } from 'lucide-react';
import { useQuotes } from '@/hooks/use-quotes';
import { useToast } from '@/hooks/use-toast';
import QuoteDialog from '@/components/quotes/QuoteDialog';
import QuoteEmailDialog from '@/components/quotes/QuoteEmailDialog';
import RepairOrderDialog from '@/components/repair-orders/RepairOrderDialog';
import QuoteViewerDialog from '@/components/quotes/QuoteViewerDialog';
import { Quote } from '@/services/supabase/quotes';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Printer, Mail, FileCheck, ArrowRight, Download } from 'lucide-react';

const Quotes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { confirm } = useConfirmation();
  const { quotes, isLoading, error, deleteQuote } = useQuotes();
  const [searchTerm, setSearchTerm] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [repairOrderDialogOpen, setRepairOrderDialogOpen] = useState(false);
  const [viewerDialogOpen, setViewerDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedQuoteForEmail, setSelectedQuoteForEmail] = useState<Quote | null>(null);
  const [selectedQuoteForViewer, setSelectedQuoteForViewer] = useState<Quote | null>(null);
  const [prefilledRepairOrder, setPrefilledRepairOrder] = useState<Partial<RepairOrder> | null>(null);
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
        setEditDialogOpen(true);
        // Nettoyer le paramètre URL après ouverture
        setSearchParams(params => {
          params.delete('openQuote');
          return params;
        });
      }
    }
  }, [quotes, searchParams, setSearchParams]);

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
    <div className="page-container">
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Chargement des devis...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-red-500">
                  Erreur lors du chargement des devis: {error.message}
                </TableCell>
              </TableRow>
            ) : filteredQuotes.length > 0 ? (
              filteredQuotes.map((quote) => (
                <TableRow key={quote.id}>
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
                   <TableCell className="text-right">
                     <div className="flex justify-end space-x-1">
                       <Button variant="ghost" size="icon" onClick={() => handleViewPDF(quote)}>
                         <FileImage className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon">
                         <Eye className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" onClick={() => handleEditQuote(quote)}>
                         <Pencil className="h-4 w-4" />
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="text-red-500 hover:text-red-700" 
                         onClick={() => handleDeleteQuote(quote.id)}
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
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
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
    </div>
  );
};

export default Quotes;

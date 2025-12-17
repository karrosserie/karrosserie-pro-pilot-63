import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { Search, FileText, Plus, Filter, Eye, Pencil, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SortableTableHeader } from '@/components/ui/sortable-table-header';
import { useTableSorting } from '@/hooks/use-table-sorting';
import InvoiceDialog from '@/components/invoices/InvoiceDialog';
import InvoiceEmailDialog from '@/components/invoices/InvoiceEmailDialog';
import ReceiptDialog from '@/components/receipts/ReceiptDialog';
import { CreditDialog } from '@/components/credits/CreditDialog';
import { useInvoices } from '@/hooks/use-invoices';
import { useCredits } from '@/hooks/use-credits';
// useReceiptsData import supprimé - non utilisé sur cette page
import { useCompany } from '@/hooks/use-company';
import { Invoice } from '@/services/supabase/invoices';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import InvoiceViewerModal from '@/components/invoices/InvoiceViewerModal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { generateInvoicePDFWithTemplate, printInvoicePDFWithTemplate } from '@/utils/invoicePDFGeneration';
import { useConfirmation } from '@/hooks/use-confirmation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Printer, Mail, Signature, CreditCard, FileX, Download, Send, MoreVertical } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import InvoiceMobileCard from '@/components/invoices/InvoiceMobileCard';
import RelanceModal from '@/components/invoices/RelanceModal';
import { useSendRelance } from '@/hooks/use-send-relance';

const Invoices = () => {
  console.log('[Invoices] COMPONENT RENDER START');
  const renderStart = performance.now();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [relanceModalOpen, setRelanceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();
  const { confirm } = useConfirmation();

  console.log('[Invoices] Dialog states:', { dialogOpen, emailDialogOpen, receiptDialogOpen, creditDialogOpen, viewerModalOpen, relanceModalOpen });

  // Hook avec queryKey stable - retourne TOUTES les factures + toutes les mutations
  const { invoices: allInvoices, isLoading, error, deleteInvoice, createInvoice, updateInvoice, archiveInvoice, restoreInvoice } = useInvoices();
  const { credits, createCredit } = useCredits();
  const { companyData } = useCompany();
  
  console.log('[Invoices] useInvoices returned:', { count: allInvoices?.length, isLoading, hasError: !!error });
  
  // Filtrage côté client selon showArchived
  const invoices = React.useMemo(() => {
    if (!allInvoices) return [];
    return allInvoices.filter(inv => showArchived ? inv.archived : !inv.archived);
  }, [allInvoices, showArchived]);
  
  const { sortedData: sortedInvoices, sortConfig, handleSort } = useTableSorting(invoices, 'reference');
  const isMobile = useIsMobile();
  const { sendRelance } = useSendRelance();

  console.log('[Invoices] COMPONENT RENDER took', (performance.now() - renderStart).toFixed(0), 'ms');

  // Mémoriser les objets passés aux dialogues pour éviter les re-renders
  const preselectedInvoiceData = useMemo(() => {
    if (!selectedInvoice) return null;
    return {
      id: selectedInvoice.id,
      amount: selectedInvoice.amount || 0
    };
  }, [selectedInvoice?.id, selectedInvoice?.amount]);

  const preselectedCreditData = useMemo(() => {
    if (!selectedInvoice) return null;
    return {
      invoice_id: selectedInvoice.id,
      reference: '',
      status: 'Émis' as const,
      amount: 0,
      notes: ''
    };
  }, [selectedInvoice?.id]);
  const normalizedSearchTerm = useMemo(() => searchTerm.trim().toLowerCase(), [searchTerm]);

  const creditsByInvoiceId = useMemo(() => {
    const map = new Map<string, any[]>();

    for (const credit of credits || []) {
      const invoiceId = credit?.invoice_id;
      if (!invoiceId) continue;

      const existing = map.get(invoiceId) || [];
      existing.push(credit);
      map.set(invoiceId, existing);
    }

    // Garder le tri existant (par référence croissante) mais en ne le faisant qu'une seule fois.
    for (const [invoiceId, list] of map.entries()) {
      map.set(
        invoiceId,
        list.sort((a, b) => {
          const refA = a?.reference || '';
          const refB = b?.reference || '';
          return String(refA).localeCompare(String(refB), 'fr', { numeric: true });
        })
      );
    }

    return map;
  }, [credits]);

  const getInvoiceCredits = useCallback(
    (invoiceId: string) => creditsByInvoiceId.get(invoiceId) || [],
    [creditsByInvoiceId]
  );

  const filteredInvoices = useMemo(() => {
    const list = sortedInvoices || [];
    if (!list.length) return [];

    // Les factures sont déjà filtrées par showArchived via le useMemo ci-dessus
    // On applique uniquement le filtre de recherche
    return list.filter((invoice) => {
      if (!normalizedSearchTerm) return true;

      const ref = invoice.reference?.toLowerCase() || '';
      const client = invoice.clients ? `${invoice.clients.first_name} ${invoice.clients.last_name}`.toLowerCase() : '';
      const vehicle = invoice.vehicles
        ? `${invoice.vehicles.car_brands?.name || 'Marque inconnue'} ${invoice.vehicles.car_models?.name || 'Modèle inconnu'} - ${invoice.vehicles.license_plate}`.toLowerCase()
        : '';

      return ref.includes(normalizedSearchTerm) || client.includes(normalizedSearchTerm) || vehicle.includes(normalizedSearchTerm);
    });
  }, [sortedInvoices, normalizedSearchTerm]);

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

  const renderCreditsBadges = (invoiceCredits: any[]) => {
    if (invoiceCredits.length === 0) {
      return <span className="text-gray-500 text-sm">-</span>;
    }

    return (
      <div className="flex flex-col gap-1">
        {invoiceCredits.map((credit) => (
          <Badge
            key={credit.id}
            variant="secondary"
            className="bg-orange-100 text-orange-800 hover:bg-orange-100 text-xs"
          >
            Avoir n°{credit.reference} - {formatAmount(credit.amount || 0)}
          </Badge>
        ))}
      </div>
    );
  };

  const handleCreateInvoice = () => {
    setSelectedInvoice(null);
    setDialogOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDialogOpen(true);
  };

  const handleDelete = async (invoice: Invoice) => {
    const confirmed = await confirm({
      title: showArchived ? 'Supprimer définitivement la facture' : 'Archiver la facture',
      description: showArchived 
        ? `Êtes-vous sûr de vouloir supprimer définitivement la facture ${invoice.reference} ? Cette action est irréversible.`
        : `Êtes-vous sûr de vouloir archiver la facture ${invoice.reference} ? Vous pourrez la restaurer plus tard.`,
      confirmText: showArchived ? 'Supprimer définitivement' : 'Archiver',
      cancelText: 'Annuler',
      variant: 'destructive'
    });

    if (confirmed) {
      if (showArchived) {
        await deleteInvoice.mutateAsync(invoice.id);
      } else {
        await archiveInvoice.mutateAsync(invoice.id);
      }
    }
  };

  const handleRestore = async (invoice: Invoice) => {
    const confirmed = await confirm({
      title: 'Restaurer la facture',
      description: `Êtes-vous sûr de vouloir restaurer la facture ${invoice.reference} ?`,
      confirmText: 'Restaurer',
      cancelText: 'Annuler'
    });

    if (confirmed) {
      await restoreInvoice.mutateAsync(invoice.id);
    }
  };

  const handleDownload = async (invoice: Invoice) => {
    try {
      toast({
        title: "Génération du PDF",
        description: "Génération du PDF en cours..."
      });

      const result = await generateInvoicePDFWithTemplate(invoice, companyData);
      
      if (result.success) {
        toast({
          title: "Téléchargement réussi",
          description: `La facture ${invoice.reference} a été téléchargée.`
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const handlePrint = async (invoice: Invoice) => {
    try {
      toast({
        title: "Ouverture pour impression",
        description: `Ouverture de la facture ${invoice.reference} pour impression...`
      });

      const result = await printInvoicePDFWithTemplate(invoice, companyData);
      
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'impression:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le PDF pour impression. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const handleSendEmail = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setEmailDialogOpen(true);
  };

  const handleAddPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setReceiptDialogOpen(true);
  };

  const handleAddCredit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setCreditDialogOpen(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setViewerModalOpen(true);
  };

  const handleRelance = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setRelanceModalOpen(true);
  };

  const handleSendRelance = async (invoice: Invoice, channel: string, relanceNumber: string) => {
    try {
      const success = await sendRelance({
        invoice,
        channel,
        message: `Relance n°${relanceNumber} pour la facture ${invoice.reference}`,
        relanceNumber,
      });

      if (success) {
        toast({
          title: "Relance envoyée",
          description: `La relance n°${relanceNumber} a été envoyée avec succès via ${channel}.`
        });
      } else {
        throw new Error("Échec de l'envoi de la relance");
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la relance:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la relance. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  // Effet pour ouvrir automatiquement une facture depuis l'URL
  useEffect(() => {
    const openInvoiceId = searchParams.get('openInvoice');
    if (openInvoiceId && invoices && invoices.length > 0) {
      const invoiceToOpen = invoices.find(invoice => invoice.id === openInvoiceId);
      if (invoiceToOpen) {
        setSelectedInvoice(invoiceToOpen);
        setViewerModalOpen(true); // Ouvrir la fenêtre d'aperçu
        // Nettoyer le paramètre URL après ouverture
        setSearchParams(params => {
          params.delete('openInvoice');
          return params;
        });
      }
    }
  }, [invoices, searchParams, setSearchParams]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <ErrorMessage message="Erreur lors du chargement des factures" />
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Factures</h1>
        <p className="text-gray-600 mt-1">
          Consultez et gérez les factures de réparation.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Button
            variant={!showArchived ? "default" : "outline"}
            onClick={() => setShowArchived(false)}
            className={
              !showArchived 
                ? "bg-karrosserie-orange hover:bg-karrosserie-orange/90" 
                : ""
            }
          >
            Factures actives
          </Button>
          <Button
            variant={showArchived ? "default" : "outline"}
            onClick={() => setShowArchived(true)}
            className={
              showArchived 
                ? "bg-karrosserie-orange hover:bg-karrosserie-orange/90" 
                : ""
            }
          >
            Factures archivées
          </Button>
        </div>
        
        <div className="flex items-center w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher une facture..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          {!showArchived && (
            <Button 
              className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
              onClick={handleCreateInvoice}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle facture
            </Button>
          )}
        </div>
      </div>
      
      {isMobile ? (
        <div className="space-y-3">
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice) => {
              const invoiceCredits = getInvoiceCredits(invoice.id);
              return (
                 <InvoiceMobileCard
                   key={invoice.id}
                   invoice={invoice}
                   onViewInvoice={handleViewInvoice}
                   onEditInvoice={handleEditInvoice}
                   onRelance={handleRelance}
                   onDownload={handleDownload}
                   onPrint={handlePrint}
                   onSendEmail={handleSendEmail}
                   onAddPayment={handleAddPayment}
                   onAddCredit={handleAddCredit}
                   onDeleteInvoice={handleDelete}
                   onRestoreInvoice={showArchived ? handleRestore : undefined}
                   invoiceCredits={invoiceCredits}
                   showArchived={showArchived}
                 />
              );
            })
          ) : (
            <div className="card-container">
              <div className="flex flex-col items-center justify-center py-8">
                <FileText className="h-10 w-10 text-gray-400 mb-2" />
                <h3 className="font-medium text-gray-900">Aucun résultat</h3>
                <p className="text-gray-500 mt-1">
                  Aucune facture correspondant à votre recherche n'a été trouvée.
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
              <SortableTableHeader sortKey="reference" sortConfig={sortConfig} onSort={handleSort}>
                Numéro
              </SortableTableHeader>
              <SortableTableHeader sortKey="created_at" sortConfig={sortConfig} onSort={handleSort}>
                Date de création
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
              <TableHead>Avoirs</TableHead>
              <SortableTableHeader sortKey="status" sortConfig={sortConfig} onSort={handleSort}>
                Statut
              </SortableTableHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => {
                const invoiceCredits = getInvoiceCredits(invoice.id);
                return (
                  <TableRow key={invoice.id} className="hover:bg-gray-50 border-b-0">
                    <TableCell className="font-medium">{invoice.reference}</TableCell>
                    <TableCell>{formatDate(invoice.created_at)}</TableCell>
                    <TableCell>
                      {invoice.clients 
                        ? `${invoice.clients.first_name} ${invoice.clients.last_name}`
                        : '-'
                      }
                     </TableCell>
                     <TableCell>
                       {invoice.vehicles 
                         ? `${invoice.vehicles.car_brands?.name || 'Marque inconnue'} ${invoice.vehicles.car_models?.name || 'Modèle inconnu'} - ${invoice.vehicles.license_plate}`
                         : '-'
                       }
                     </TableCell>
                     <TableCell className="text-right font-medium">
                       {formatAmount(invoice.amount || 0)}
                     </TableCell>
                     <TableCell>
                       {invoiceCredits.length > 0 ? (
                         <div className="flex items-center gap-1">
                           <span className="text-orange-600">
                             {formatAmount(invoiceCredits.reduce((sum, credit) => sum + (credit.amount || 0), 0))}
                           </span>
                         </div>
                       ) : '-'}
                     </TableCell>
                     <TableCell>
                       <div className="flex items-center gap-1">
                         <Badge 
                           variant="secondary"
                           className={`${getStatusColor(invoice.status)} text-white border-0 font-normal text-xs px-2 py-1`}
                         >
                           {invoice.status}
                         </Badge>
                       </div>
                     </TableCell>
                     <TableCell>
                       <div className="flex items-center gap-1">
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" className="h-8 w-8 p-0">
                               <span className="sr-only">Ouvrir le menu</span>
                               <MoreVertical className="h-4 w-4" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewInvoice(invoice)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDownload(invoice)}>
                                <Download className="mr-2 h-4 w-4" />
                                Télécharger PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePrint(invoice)}>
                                <Printer className="mr-2 h-4 w-4" />
                                Imprimer
                              </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleSendEmail(invoice)}>
                               <Mail className="mr-2 h-4 w-4" />
                               Envoyer par email
                             </DropdownMenuItem>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem onClick={() => handleAddPayment(invoice)}>
                               <CreditCard className="mr-2 h-4 w-4" />
                               Encaisser
                             </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAddCredit(invoice)}>
                                <FileX className="mr-2 h-4 w-4" />
                                Avoir
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRelance(invoice)}>
                                <Send className="mr-2 h-4 w-4" />
                                Relance de paiement
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                             {!showArchived && (
                               <DropdownMenuItem onClick={() => handleDelete(invoice)}>
                                 <FileText className="mr-2 h-4 w-4" />
                                 Archiver
                               </DropdownMenuItem>
                             )}
                             {showArchived && (
                               <DropdownMenuItem onClick={() => handleRestore(invoice)}>
                                 <FileText className="mr-2 h-4 w-4" />
                                 Restaurer
                               </DropdownMenuItem>
                             )}
                           </DropdownMenuContent>
                         </DropdownMenu>
                       </div>
                  </TableCell>
                </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  <div className="flex flex-col items-center justify-center py-8">
                    <FileText className="h-10 w-10 text-gray-400 mb-2" />
                    <h3 className="font-medium text-gray-900">Aucun résultat</h3>
                    <p className="text-gray-500 mt-1">
                      Aucune facture correspondant à votre recherche n'a été trouvée.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      )}

      {/* Modales SANS conditional rendering - comme Quotes.tsx */}
      <InvoiceDialog
        invoice={selectedInvoice}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        createInvoice={createInvoice}
        updateInvoice={updateInvoice}
      />

      <InvoiceEmailDialog
        invoice={selectedInvoice}
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
      />

      <ReceiptDialog
        receipt={null}
        open={receiptDialogOpen}
        onOpenChange={setReceiptDialogOpen}
        preselectedInvoice={preselectedInvoiceData}
        invoices={allInvoices || []}
        invoicesLoading={isLoading}
      />

      <CreditDialog
        credit={preselectedCreditData}
        open={creditDialogOpen}
        onOpenChange={setCreditDialogOpen}
        createCredit={createCredit}
      />

      <InvoiceViewerModal
        invoice={selectedInvoice}
        open={viewerModalOpen}
        onOpenChange={setViewerModalOpen}
        deleteInvoice={deleteInvoice}
        onEditInvoice={handleEditInvoice}
        onSendEmail={handleSendEmail}
        onCreateReceipt={handleAddPayment}
        onCreateCredit={handleAddCredit}
      />

      <RelanceModal
        invoice={selectedInvoice}
        open={relanceModalOpen}
        onOpenChange={setRelanceModalOpen}
        onRelance={handleSendRelance}
      />
    </div>
  );
};

export default Invoices;

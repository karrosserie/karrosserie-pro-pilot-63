import React, { useState, useEffect } from 'react';
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
import { Search, FileText, Plus, Filter, Eye, Pencil, Trash, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SortableTableHeader } from '@/components/ui/sortable-table-header';
import { useTableSorting } from '@/hooks/use-table-sorting';
import InvoiceDialog from '@/components/invoices/InvoiceDialog';
import InvoiceEmailDialog from '@/components/invoices/InvoiceEmailDialog';
import ReceiptDialog from '@/components/receipts/ReceiptDialog';
import { CreditDialog } from '@/components/credits/CreditDialog';
import { useInvoices } from '@/hooks/use-invoices';
import { useCredits } from '@/hooks/use-credits';
import { useReceiptsData } from '@/hooks/use-receipts-data';
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
import { Printer, Mail, Signature, CreditCard, FileX, Download } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import InvoiceMobileCard from '@/components/invoices/InvoiceMobileCard';

const Invoices = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();
  const { confirm } = useConfirmation();
  
  const { invoices, isLoading, error, deleteInvoice, createInvoice } = useInvoices();
  const { credits } = useCredits();
  const { receipts } = useReceiptsData();
  const { companyData } = useCompany();
  const { sortedData: sortedInvoices, sortConfig, handleSort } = useTableSorting(invoices || [], 'reference');
  const isMobile = useIsMobile();
  
  console.log('=== DONNÉES FACTURES DANS LE COMPOSANT ===');
  console.log('invoices:', invoices);
  console.log('Premier invoice (si existant):', invoices?.[0]);
  console.log('Premier invoice.clients:', invoices?.[0]?.clients);
  
  const filteredInvoices = sortedInvoices?.filter(invoice => 
    invoice.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (invoice.clients && `${invoice.clients.first_name} ${invoice.clients.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (invoice.vehicles && `${invoice.vehicles.car_brands?.name || 'Marque inconnue'} ${invoice.vehicles.car_models?.name || 'Modèle inconnu'} - ${invoice.vehicles.license_plate}`.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];
  
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

  const getInvoiceCredits = (invoiceId: string) => {
    return credits?.filter(credit => credit.invoice_id === invoiceId)
      .sort((a, b) => {
        // Tri par ordre croissant de la référence
        const refA = a.reference || '';
        const refB = b.reference || '';
        return refA.localeCompare(refB, 'fr', { numeric: true });
      }) || [];
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
      title: 'Supprimer la facture',
      description: `Êtes-vous sûr de vouloir supprimer la facture ${invoice.reference} ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive'
    });

    if (confirmed) {
      await deleteInvoice.mutateAsync(invoice.id);
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
      <div className="flex-1" />
        
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
          
          <Button 
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
            onClick={handleCreateInvoice}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle facture
          </Button>
          
          <Button 
            variant="outline"
            onClick={async () => {
              try {
                const testInvoice = {
                  reference: `TEST-${Date.now().toString().slice(-6)}`,
                  created_at: new Date().toISOString(),
                  status: "En attente de paiement",
                  amount: 1250.00,
                  description: "Facture de test pour vérifier l'affichage du logo",
                  client_id: null,
                  vehicle_id: null,
                  client_name: "Jean Dupont",
                  client_email: "jean.dupont@email.com",
                  client_phone: "06 12 34 56 78",
                  client_address: "123 Rue de la Paix\n75001 Paris",
                  vehicle_brand: "Peugeot",
                  vehicle_model: "308",
                  vehicle_license_plate: "AB-123-CD",
                  vehicle_vin: "VF3XXXXXXXXXXXXXXX",
                  repairs: [{
                    id: '1',
                    description: 'Réparation pare-choc avant',
                    quantity: 1,
                    unit_price: 800.00,
                    total: 800.00
                  }],
                  parts: [{
                    id: '1',
                    description: 'Pare-choc avant',
                    quantity: 1,
                    unit_price: 450.00,
                    total: 450.00
                  }]
                };
                
                await createInvoice.mutateAsync(testInvoice);
                
                toast({
                  title: "Facture test créée",
                  description: "Une facture fictive a été créée pour tester le logo."
                });
              } catch (error) {
                console.error('Erreur lors de la création de la facture test:', error);
                toast({
                  title: "Erreur",
                  description: "Impossible de créer la facture test.",
                  variant: "destructive"
                });
              }
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            Créer facture test
          </Button>
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
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                  onPrint={handlePrint}
                  onSendEmail={handleSendEmail}
                  onAddPayment={handleAddPayment}
                  onAddCredit={handleAddCredit}
                  invoiceCredits={invoiceCredits}
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
                <React.Fragment key={invoice.id}>
                  <TableRow className="hover:bg-gray-50 border-b-0">
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
                    <TableCell>{formatAmount(invoice.amount || 0)}</TableCell>
                    <TableCell>
                      {renderCreditsBadges(invoiceCredits)}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status || 'En attente de paiement')}`}>
                        {invoice.status || 'En attente de paiement'}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-t-0">
                    <TableCell colSpan={7} className="py-3 border-t-0">
                      <div className="flex flex-wrap gap-2 justify-end px-4">
                        <Button variant="view" size="sm" onClick={() => handleViewInvoice(invoice)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="edit" size="sm" onClick={() => handleEditInvoice(invoice)}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button variant="download" size="sm" onClick={() => handleDownload(invoice)}>
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                        <Button variant="print" size="sm" onClick={() => handlePrint(invoice)}>
                          <Printer className="h-4 w-4 mr-1" />
                          Imprimer
                        </Button>
                        <Button variant="send" size="sm" onClick={() => handleSendEmail(invoice)}>
                          <Mail className="h-4 w-4 mr-1" />
                          Envoyer
                        </Button>
                        <Button variant="payment" size="sm" onClick={() => handleAddPayment(invoice)}>
                          <CreditCard className="h-4 w-4 mr-1" />
                          Créer un paiement
                        </Button>
                        <Button variant="create" size="sm" onClick={() => handleAddCredit(invoice)}>
                          <FileX className="h-4 w-4 mr-1" />
                          Créer un avoir
                        </Button>
                        <Button variant="delete" size="sm" onClick={() => handleDelete(invoice)}>
                          <Trash className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
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

      <InvoiceDialog
        invoice={selectedInvoice}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
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
        preselectedInvoice={selectedInvoice ? {
          id: selectedInvoice.id,
          amount: selectedInvoice.amount || 0
        } : null}
      />

      <CreditDialog
        credit={selectedInvoice ? {
          invoice_id: selectedInvoice.id,
          reference: '',
          status: 'Émis',
          amount: 0,
          notes: ''
        } : null}
        open={creditDialogOpen}
        onOpenChange={setCreditDialogOpen}
      />

      <InvoiceViewerModal
        invoice={selectedInvoice}
        open={viewerModalOpen}
        onOpenChange={setViewerModalOpen}
      />
    </div>
  );
};

export default Invoices;

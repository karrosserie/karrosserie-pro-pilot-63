import React, { useState } from 'react';
import { useInvoices } from '@/hooks/use-invoices';
import { useCredits } from '@/hooks/use-credits';
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
import { Receipt, Eye, Pencil, Trash, Download, Printer, Mail, CreditCard, FileX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import ClientInvoiceMobileCard from './ClientInvoiceMobileCard';

import InvoiceDialog from '@/components/invoices/InvoiceDialog';
import InvoiceViewerModal from '@/components/invoices/InvoiceViewerModal';
import InvoiceEmailDialog from '@/components/invoices/InvoiceEmailDialog';
import ReceiptDialog from '@/components/receipts/ReceiptDialog';
import { CreditDialog } from '@/components/credits/CreditDialog';
import { Invoice } from '@/services/supabase/invoices';
import { useToast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';
import { useCompany } from '@/hooks/use-company';
import { generateInvoicePDFWithTemplate, printInvoicePDFWithTemplate } from '@/utils/invoicePDFGeneration';

interface ClientInvoicesTabProps {
  clientId: string;
}

const ClientInvoicesTab: React.FC<ClientInvoicesTabProps> = ({ clientId }) => {
  const { invoices, isLoading, deleteInvoice, createInvoice, updateInvoice } = useInvoices();
  const { credits, createCredit } = useCredits();
  const { toast } = useToast();
  const { confirm } = useConfirmation();
  const { companyData } = useCompany();
  const isMobile = useIsMobile();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const clientInvoices = invoices?.filter(invoice => invoice.client_id === clientId) || [];
  const { sortedData, sortConfig, handleSort } = useTableSorting(clientInvoices, 'reference');

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setViewerModalOpen(true);
  };

  const handleEdit = (invoice: Invoice) => {
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
      try {
        await deleteInvoice.mutateAsync(invoice.id);
        toast({
          title: "Facture supprimée",
          description: "La facture a été supprimée avec succès."
        });
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: `Impossible de supprimer la facture: ${error.message}`,
          variant: "destructive"
        });
      }
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

  const contextMenuProps = {
    onDownload: handleDownload,
    onPrint: handlePrint,
    onSendEmail: handleSendEmail,
    onCreateCredit: handleAddCredit
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

  if (isMobile) {
    return (
      <>
        <div className="space-y-4 p-4">
          {sortedData.length > 0 ? (
            sortedData.map((invoice) => {
              const invoiceCredits = getInvoiceCredits(invoice.id);
              return (
                <ClientInvoiceMobileCard
                  key={invoice.id}
                  invoice={invoice}
                  credits={invoiceCredits}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                  onPrint={handlePrint}
                  onSendEmail={handleSendEmail}
                  onAddPayment={handleAddPayment}
                  onAddCredit={handleAddCredit}
                />
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Receipt className="h-10 w-10 text-gray-400 mb-2" />
              <h3 className="font-medium text-gray-900">Aucune facture</h3>
              <p className="text-gray-500 mt-1">Ce client n'a pas encore de facture.</p>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div>
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
              <TableHead>Avoirs</TableHead>
              <SortableTableHeader sortKey="status" sortConfig={sortConfig} onSort={handleSort}>
                Statut
              </SortableTableHeader>
                  </TableRow>
                </TableHeader>
          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((invoice) => {
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
                        <Button variant="view" size="sm" onClick={() => handleView(invoice)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="edit" size="sm" onClick={() => handleEdit(invoice)}>
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
                          <Receipt className="h-10 w-10 text-gray-400 mb-2" />
                          <h3 className="font-medium text-gray-900">Aucune facture</h3>
                          <p className="text-gray-500 mt-1">Ce client n'a pas encore de facture.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => contextMenuProps.onDownload(clientInvoices[0])}>
            Télécharger
          </ContextMenuItem>
          <ContextMenuItem onClick={() => contextMenuProps.onPrint(clientInvoices[0])}>
            Imprimer
          </ContextMenuItem>
          <ContextMenuItem onClick={() => contextMenuProps.onSendEmail(clientInvoices[0])}>
            Envoyer par e-mail
          </ContextMenuItem>
          <ContextMenuItem onClick={() => contextMenuProps.onCreateCredit(clientInvoices[0])}>
            Créer un avoir
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {dialogOpen && (
        <InvoiceDialog
          invoice={selectedInvoice}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          createInvoice={createInvoice}
          updateInvoice={updateInvoice}
        />
      )}

      {viewerModalOpen && (
        <InvoiceViewerModal
          invoice={selectedInvoice}
          open={viewerModalOpen}
          onOpenChange={setViewerModalOpen}
          deleteInvoice={deleteInvoice}
        />
      )}

      {emailDialogOpen && (
        <InvoiceEmailDialog
          invoice={selectedInvoice}
          open={emailDialogOpen}
          onOpenChange={setEmailDialogOpen}
        />
      )}

      {receiptDialogOpen && selectedInvoice && (
        <ReceiptDialog
          receipt={{
            invoice: selectedInvoice.id,
            reference: '',
            date: new Date().toISOString().split('T')[0],
            amount: selectedInvoice.amount || 0,
            status: 'Encaissé',
            payment_method: 'Virement',
            bank_account: '',
            notes: '',
            payment_proofs: []
          }}
          open={receiptDialogOpen}
          onOpenChange={setReceiptDialogOpen}
          invoices={invoices || []}
          invoicesLoading={isLoading}
        />
      )}

      {creditDialogOpen && selectedInvoice && (
        <CreditDialog
          credit={{
            invoice_id: selectedInvoice.id,
            reference: '',
            status: 'Émis',
            amount: 0,
            notes: ''
          }}
          open={creditDialogOpen}
          onOpenChange={setCreditDialogOpen}
          createCredit={createCredit}
        />
      )}
    </>
  );
};

export default ClientInvoicesTab;
import React, { useState } from 'react';
import { useInvoices } from '@/hooks/use-invoices';
import { useCredits } from '@/hooks/use-credits';
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
import { Receipt, Eye, Archive, Download, Printer, Mail, CreditCard, FileX, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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

interface VehicleInvoicesTabProps {
  vehicleId: string;
}

const VehicleInvoicesTab: React.FC<VehicleInvoicesTabProps> = ({ vehicleId }) => {
  const { invoices, isLoading, archiveInvoice } = useInvoices();
  const { credits } = useCredits();
  const { toast } = useToast();
  const { confirm } = useConfirmation();
  const { companyData } = useCompany();
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

  const vehicleInvoices = invoices?.filter(invoice => invoice.vehicle_id === vehicleId) || [];
  const { sortedData, sortConfig, handleSort } = useTableSorting(vehicleInvoices, 'reference');

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setViewerModalOpen(true);
  };

  const handleArchive = async (invoice: Invoice) => {
    const confirmed = await confirm({
      title: 'Archiver la facture',
      description: `Êtes-vous sûr de vouloir archiver la facture ${invoice.reference} ? La facture restera visible mais sera marquée comme archivée.`,
      confirmText: 'Archiver',
      cancelText: 'Annuler',
      variant: 'default'
    });

    if (confirmed) {
      try {
        await archiveInvoice.mutateAsync(invoice.id);
        toast({
          title: "Facture archivée",
          description: `La facture ${invoice.reference} a été archivée avec succès.`
        });
      } catch (error: any) {
        console.error('Error archiving invoice:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'archiver la facture.",
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

  return (
    <>
      <div className="card-container p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <SortableTableHeader sortKey="reference" sortConfig={sortConfig} onSort={handleSort}>
                  Numéro
                </SortableTableHeader>
                <SortableTableHeader sortKey="created_at" sortConfig={sortConfig} onSort={handleSort}>
                  Date
                </SortableTableHeader>
                <SortableTableHeader sortKey="clients.first_name" sortConfig={sortConfig} onSort={handleSort} className="hidden md:table-cell">
                  Client
                </SortableTableHeader>
                <TableHead className="hidden lg:table-cell">Véhicule</TableHead>
                <SortableTableHeader sortKey="amount" sortConfig={sortConfig} onSort={handleSort}>
                  Montant
                </SortableTableHeader>
                <TableHead className="hidden md:table-cell">Avoirs</TableHead>
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
                        <TableCell className="font-medium text-xs sm:text-sm py-2 sm:py-4">{invoice.reference}</TableCell>
                        <TableCell className="text-xs sm:text-sm py-2 sm:py-4">{formatDate(invoice.created_at)}</TableCell>
                        <TableCell className="hidden md:table-cell text-xs sm:text-sm py-2 sm:py-4">
                          {invoice.clients 
                            ? `${invoice.clients.first_name} ${invoice.clients.last_name}`
                            : '-'
                          }
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs sm:text-sm py-2 sm:py-4">
                          {invoice.vehicles 
                            ? `${invoice.vehicles.car_brands?.name || 'Marque inconnue'} ${invoice.vehicles.car_models?.name || 'Modèle inconnu'} - ${invoice.vehicles.license_plate}`
                            : '-'
                          }
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm py-2 sm:py-4">{formatAmount(invoice.amount || 0)}</TableCell>
                        <TableCell className="hidden md:table-cell py-2 sm:py-4">
                          {renderCreditsBadges(invoiceCredits)}
                        </TableCell>
                        <TableCell className="py-2 sm:py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status || 'En attente de paiement')}`}>
                            {invoice.status || 'En attente de paiement'}
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-t-0">
                        <TableCell colSpan={7} className="py-2 sm:py-3 border-t-0">
                          <div className="flex flex-wrap gap-1 sm:gap-2 justify-end px-2 sm:px-4">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                              onClick={() => handleView(invoice)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="hidden sm:inline sm:ml-1">Voir</span>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="hidden sm:inline sm:ml-1">Plus</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-background border shadow-lg z-50">
                                <DropdownMenuItem onClick={() => handleDownload(invoice)}>
                                  <Download className="h-4 w-4 mr-2" />
                                  Télécharger
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePrint(invoice)}>
                                  <Printer className="h-4 w-4 mr-2" />
                                  Imprimer
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSendEmail(invoice)}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Envoyer
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleAddPayment(invoice)}>
                                  <CreditCard className="h-4 w-4 mr-2" />
                                  Créer un paiement
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAddCredit(invoice)}>
                                  <FileX className="h-4 w-4 mr-2" />
                                  Créer un avoir
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleArchive(invoice)} className="text-orange-600">
                                  <Archive className="h-4 w-4 mr-2" />
                                  Archiver
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
                      <p className="text-gray-500 mt-1">Ce véhicule n'a pas encore de facture.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <InvoiceDialog
        invoice={selectedInvoice}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <InvoiceViewerModal
        invoice={selectedInvoice}
        open={viewerModalOpen}
        onOpenChange={setViewerModalOpen}
      />

      <InvoiceEmailDialog
        invoice={selectedInvoice}
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
      />

      <ReceiptDialog
        receipt={selectedInvoice ? {
          invoice: selectedInvoice.id,
          reference: '',
          date: new Date().toISOString().split('T')[0],
          amount: selectedInvoice.amount || 0,
          status: 'Encaissé',
          payment_method: 'Virement',
          bank_account: '',
          notes: '',
          payment_proofs: []
        } : null}
        open={receiptDialogOpen}
        onOpenChange={setReceiptDialogOpen}
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
    </>
  );
};

export default VehicleInvoicesTab;
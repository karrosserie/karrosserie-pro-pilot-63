import React, { useState } from 'react';
import { useCredits } from '@/hooks/use-credits';
import { useInvoices } from '@/hooks/use-invoices';
import { useTableSorting } from '@/hooks/use-table-sorting';
import { generateCreditPDFWithTemplate, printCreditPDFWithTemplate } from '@/utils/creditPDFGeneration';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { SortableTableHeader } from '@/components/ui/sortable-table-header';
import { CreditCard, Eye, Trash, Download, Printer, Mail, MoreVertical, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { EditCreditDialog } from '@/components/credits/EditCreditDialog';
import InvoiceViewerModal from '@/components/invoices/InvoiceViewerModal';
import { CreditEmailDialog } from '@/components/credits/email/CreditEmailDialog';

interface VehicleCreditsTabProps {
  vehicleId: string;
}

const VehicleCreditsTab: React.FC<VehicleCreditsTabProps> = ({ vehicleId }) => {
  const { credits, isLoading, deleteCredit } = useCredits();
  const { invoices } = useInvoices();
  const { toast } = useToast();
  const { confirm } = useConfirmation();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [invoiceViewerModalOpen, setInvoiceViewerModalOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState<any>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const vehicleCredits = credits?.filter(credit => {
    if (credit.invoice_id && invoices) {
      const relatedInvoice = invoices.find(invoice => invoice.id === credit.invoice_id);
      return relatedInvoice?.vehicle_id === vehicleId;
    }
    return false;
  }) || [];
  const { sortedData, sortConfig, handleSort } = useTableSorting(vehicleCredits, 'reference');

  const formatVehicleDisplay = (credit: any) => {
    if (credit.vehicles) {
      let brand = '';
      let model = '';
      
       if (credit.vehicles.car_brands?.name) {
         brand = credit.vehicles.car_brands.name;
       }
       
       if (credit.vehicles.car_models?.name) {
         model = credit.vehicles.car_models.name;
       }
      
      const licensePlate = credit.vehicles.license_plate || '';
      
      if (brand || model || licensePlate) {
        return `${brand} ${model}${licensePlate ? ` - ${licensePlate}` : ''}`.trim() || '-';
      }
    }
    
    if (credit.invoice_id && invoices) {
      const linkedInvoice = invoices.find(invoice => invoice.id === credit.invoice_id);
      
      if (linkedInvoice?.vehicles) {
        let brand = '';
        let model = '';
        
        if (linkedInvoice.vehicles.car_brands?.name) {
          brand = linkedInvoice.vehicles.car_brands.name;
        }
        
        if (linkedInvoice.vehicles.car_models?.name) {
          model = linkedInvoice.vehicles.car_models.name;
        }
        
        const licensePlate = linkedInvoice.vehicles.license_plate || '';
        
        if (brand || model || licensePlate) {
          return `${brand} ${model}${licensePlate ? ` - ${licensePlate}` : ''}`.trim() || '-';
        }
      }
    }
    
    return '-';
  };

  const getInvoiceDisplay = (invoiceId: string | null) => {
    if (!invoiceId || !invoices) {
      return 'Sans facture';
    }
    
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) {
      return 'Facture introuvable';
    }
    
    const clientName = invoice.clients 
      ? `${invoice.clients.first_name} ${invoice.clients.last_name}` 
      : 'Client non assigné';
    
    const amount = typeof invoice.amount === 'number' 
      ? invoice.amount.toFixed(2).replace('.', ',')
      : '0,00';
    
    return `Facture n°${invoice.reference} - ${clientName} - ${amount} €`;
  };

  const handleView = (credit: any) => {
    if (credit.invoice_id && invoices) {
      const relatedInvoice = invoices.find(invoice => invoice.id === credit.invoice_id);
      if (relatedInvoice) {
        setSelectedInvoice(relatedInvoice);
        setInvoiceViewerModalOpen(true);
      } else {
        toast({
          title: "Facture introuvable",
          description: "La facture associée à cet avoir n'a pas été trouvée.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Aucune facture associée",
        description: "Cet avoir n'est pas lié à une facture.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (credit: any) => {
    let items = [];
    if (credit.items_data) {
      try {
        items = JSON.parse(credit.items_data);
      } catch (error) {
        console.error('Error parsing items_data:', error);
      }
    }

    setSelectedCredit({
      ...credit,
      items
    });
    setEditDialogOpen(true);
  };

  const handleDelete = async (credit: any) => {
    const confirmed = await confirm({
      title: 'Supprimer l\'avoir',
      description: `Êtes-vous sûr de vouloir supprimer l'avoir ${credit.reference} ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive'
    });

    if (confirmed) {
      try {
        await deleteCredit.mutateAsync(credit.id);
      } catch (error) {
        console.error('Error deleting credit:', error);
      }
    }
  };

  const handleDownload = async (credit: any) => {
    try {
      toast({
        title: "Génération du PDF",
        description: "Génération du PDF en cours..."
      });

      const result = await generateCreditPDFWithTemplate(credit, {});
      
      if (result.success) {
        toast({
          title: "Téléchargement réussi",
          description: `L'avoir ${credit.reference} a été téléchargé.`
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

  const handlePrint = async (credit: any) => {
    try {
      toast({
        title: "Ouverture pour impression",
        description: `Ouverture de l'avoir ${credit.reference} pour impression...`
      });

      const result = await printCreditPDFWithTemplate(credit, {});
      
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

  const handleSendEmail = (credit: any) => {
    setSelectedCredit(credit);
    setEmailDialogOpen(true);
  };

  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (error) {
      return '-';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'Annulé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="w-full max-w-full overflow-hidden">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2 md:px-0">Avoirs</h3>
        {/* Mobile: Cards empilées */}
        <div className="md:hidden space-y-3 p-2">
          {sortedData.map((credit) => (
            <div key={credit.id} className="bg-white border rounded-lg p-3 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-sm">{credit.reference}</p>
                  <p className="text-xs text-gray-500">{formatDate(credit.created_date || credit.created_at)}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(credit.status || 'En attente')}`}>
                  {credit.status || 'En attente'}
                </span>
              </div>
              <p className="text-sm font-semibold text-karrosserie-orange mb-3">{formatAmount(credit.amount)}</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleView(credit)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border shadow-lg z-50">
                    <DropdownMenuItem onClick={() => handleEdit(credit)}><Pencil className="h-4 w-4 mr-2" />Modifier</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(credit)}><Download className="h-4 w-4 mr-2" />Télécharger</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePrint(credit)}><Printer className="h-4 w-4 mr-2" />Imprimer</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSendEmail(credit)}><Mail className="h-4 w-4 mr-2" />Envoyer</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDelete(credit)} className="text-red-600"><Trash className="h-4 w-4 mr-2" />Supprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
          {sortedData.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="mx-auto h-10 w-10 text-gray-400 mb-2" />
              <h3 className="font-medium text-gray-900 text-sm">Aucun avoir</h3>
              <p className="text-gray-500 text-xs mt-1">Ce véhicule n'a pas encore d'avoir.</p>
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
                  <SortableTableHeader sortKey="created_date" sortConfig={sortConfig} onSort={handleSort}>Date</SortableTableHeader>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Facture d'origine</TableHead>
                  <SortableTableHeader sortKey="amount" sortConfig={sortConfig} onSort={handleSort}>Montant</SortableTableHeader>
                  <SortableTableHeader sortKey="status" sortConfig={sortConfig} onSort={handleSort}>Statut</SortableTableHeader>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.length > 0 ? sortedData.map((credit) => (
                  <TableRow key={credit.id}>
                    <TableCell className="font-medium">{credit.reference}</TableCell>
                    <TableCell>{formatDate(credit.created_date || credit.created_at)}</TableCell>
                    <TableCell>{formatVehicleDisplay(credit)}</TableCell>
                    <TableCell>{getInvoiceDisplay(credit.invoice_id)}</TableCell>
                    <TableCell>{formatAmount(credit.amount)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(credit.status || 'En attente')}`}>
                        {credit.status || 'En attente'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleView(credit)}><Eye className="h-4 w-4 mr-1" />Voir</Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-background border shadow-lg z-50">
                            <DropdownMenuItem onClick={() => handleEdit(credit)}><Pencil className="h-4 w-4 mr-2" />Modifier</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(credit)}><Download className="h-4 w-4 mr-2" />Télécharger</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePrint(credit)}><Printer className="h-4 w-4 mr-2" />Imprimer</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendEmail(credit)}><Mail className="h-4 w-4 mr-2" />Envoyer</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(credit)} className="text-red-600"><Trash className="h-4 w-4 mr-2" />Supprimer</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <CreditCard className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                      <h3 className="font-medium text-gray-900">Aucun avoir</h3>
                      <p className="text-gray-500 mt-1">Ce véhicule n'a pas encore d'avoir.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {selectedCredit && (
        <EditCreditDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} creditId={selectedCredit.id}
          initialData={{ reference: selectedCredit.reference, invoice_id: selectedCredit.invoice_id, status: selectedCredit.status, notes: selectedCredit.notes, items: selectedCredit.items }} />
      )}
      <InvoiceViewerModal invoice={selectedInvoice} open={invoiceViewerModalOpen} onOpenChange={setInvoiceViewerModalOpen} />
      <CreditEmailDialog credit={selectedCredit} open={emailDialogOpen} onOpenChange={setEmailDialogOpen} />
    </>
  );
};

export default VehicleCreditsTab;
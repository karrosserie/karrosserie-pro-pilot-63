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
import { CreditCard, Eye, Pencil, Trash, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Printer, Mail } from 'lucide-react';
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

  // Filter credits: credit linked to an invoice belonging to the vehicle
  const vehicleCredits = credits?.filter(credit => {
    if (credit.invoice_id && invoices) {
      const relatedInvoice = invoices.find(invoice => invoice.id === credit.invoice_id);
      return relatedInvoice?.vehicle_id === vehicleId;
    }
    return false;
  }) || [];
  const { sortedData, sortConfig, handleSort } = useTableSorting(vehicleCredits, 'reference');

  const formatVehicleDisplay = (credit: any) => {
    // First, try to get vehicle data from the credit itself
    if (credit.vehicles) {
      let brand = '';
      let model = '';
      
      if (credit.vehicles.car_brands?.name) {
        brand = credit.vehicles.car_brands.name;
      } else if (credit.vehicles.brand) {
        brand = credit.vehicles.brand;
      }
      
      if (credit.vehicles.car_models?.name) {
        model = credit.vehicles.car_models.name;
      } else if (credit.vehicles.model) {
        model = credit.vehicles.model;
      }
      
      const licensePlate = credit.vehicles.license_plate || '';
      
      if (brand || model || licensePlate) {
        return `${brand} ${model}${licensePlate ? ` - ${licensePlate}` : ''}`.trim() || '-';
      }
    }
    
    // If no vehicle data in credit, try to get it from the linked invoice
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
    // Find the related invoice to display
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
    // Parse items_data if it exists
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
      <div className="card-container p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHeader sortKey="reference" sortConfig={sortConfig} onSort={handleSort}>
                Numéro
              </SortableTableHeader>
              <SortableTableHeader sortKey="created_date" sortConfig={sortConfig} onSort={handleSort}>
                Date
              </SortableTableHeader>
              <TableHead>Véhicule</TableHead>
              <TableHead>Facture d'origine</TableHead>
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
              sortedData.map((credit) => (
                <React.Fragment key={credit.id}>
                  <TableRow className="border-b-0">
                    <TableCell className="font-medium">{credit.reference}</TableCell>
                    <TableCell>{formatDate(credit.created_date || credit.created_at)}</TableCell>
                    <TableCell>
                      {formatVehicleDisplay(credit)}
                    </TableCell>
                    <TableCell>
                      {getInvoiceDisplay(credit.invoice_id)}
                    </TableCell>
                    <TableCell>{formatAmount(credit.amount)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(credit.status || 'En attente')}`}>
                        {credit.status || 'En attente'}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-t-0">
                    <TableCell colSpan={6} className="py-3 border-t-0">
                      <div className="flex flex-wrap gap-2 justify-end px-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleView(credit)}
                          title="Visualiser"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Visualiser
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(credit)}
                          title="Modifier"
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDownload(credit)}
                          title="Télécharger"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handlePrint(credit)}
                          title="Imprimer"
                        >
                          <Printer className="h-4 w-4 mr-1" />
                          Imprimer
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSendEmail(credit)}
                          title="Envoyer par e-mail"
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Envoyer par e-mail
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 border-red-500 hover:border-red-700"
                          onClick={() => handleDelete(credit)}
                          disabled={deleteCredit.isPending}
                          title="Supprimer"
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
                    <CreditCard className="h-10 w-10 text-gray-400 mb-2" />
                    <h3 className="font-medium text-gray-900">Aucun avoir</h3>
                    <p className="text-gray-500 mt-1">Ce véhicule n'a pas encore d'avoir.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedCredit && (
        <EditCreditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          creditId={selectedCredit.id}
          initialData={{
            reference: selectedCredit.reference,
            invoice_id: selectedCredit.invoice_id,
            status: selectedCredit.status,
            notes: selectedCredit.notes,
            items: selectedCredit.items
          }}
        />
      )}

      <InvoiceViewerModal
        invoice={selectedInvoice}
        open={invoiceViewerModalOpen}
        onOpenChange={setInvoiceViewerModalOpen}
      />

      <CreditEmailDialog
        credit={selectedCredit}
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
      />
    </>
  );
};

export default VehicleCreditsTab;
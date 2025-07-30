import React, { useState } from 'react';
import { generateCreditPDFWithTemplate, printCreditPDFWithTemplate } from '@/utils/creditPDFGeneration';
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
import { Search, FileText, Plus, Filter, Download, Eye, Pencil, Trash, MoreVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CreditViewerModal from '@/components/credits/CreditViewerModal';
import { useConfirmation } from '@/hooks/use-confirmation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Printer, Mail } from 'lucide-react';
import { CreditDialog } from '@/components/credits/CreditDialog';
import { EditCreditDialog } from '@/components/credits/EditCreditDialog';
import { CreditEmailDialog } from '@/components/credits/email/CreditEmailDialog';
import { useCredits } from '@/hooks/use-credits';
import { useInvoices } from '@/hooks/use-invoices';
import { useTableSorting } from '@/hooks/use-table-sorting';
import { SortableTableHeader } from '@/components/ui/sortable-table-header';

// Mock data for credits - to be replaced with real data later
const mockCredits = [
  {
    id: '1',
    reference: 'AV2024-001',
    created_at: '2024-01-15T10:00:00Z',
    amount: 250.50,
    status: 'Validé',
    clients: { first_name: 'Jean', last_name: 'Dupont' },
    vehicles: { brand: 'Peugeot', model: '308', license_plate: 'AB-123-CD' },
    original_invoice: 'F2024-045',
    invoice_id: 'e79f5109-04a0-408b-a5b3-9ed7d3c8b238',
    notes: 'Remboursement partiel',
    items: [
      {
        id: '1',
        description: 'Pièce défectueuse',
        quantity: 1,
        unit_price: 208.75,
        discount: 0,
        vat: 20,
        total: 250.50
      }
    ]
  },
  {
    id: '2',
    reference: 'AV2024-002',
    created_at: '2024-01-20T14:30:00Z',
    amount: 150.00,
    status: 'En attente',
    clients: { first_name: 'Marie', last_name: 'Martin' },
    vehicles: { brand: 'Renault', model: 'Clio', license_plate: 'EF-456-GH' },
    original_invoice: 'F2024-052',
    invoice_id: 'f79f5109-04a0-408b-a5b3-9ed7d3c8b239',
    notes: '',
    items: [
      {
        id: '2',
        description: 'Service non effectué',
        quantity: 1,
        unit_price: 125.00,
        discount: 0,
        vat: 20,
        total: 150.00
      }
    ]
  }
];

const Credits = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState<any>(null);
  const { toast } = useToast();
  const { confirm } = useConfirmation();
  
  const { credits = [], isLoading, deleteCredit, error } = useCredits();
  const { invoices } = useInvoices();
  const { sortedData, sortConfig, handleSort } = useTableSorting(credits, 'created_at');
  
  const formatVehicleDisplay = (credit: any) => {
    console.log('Formatting vehicle display for credit:', credit.id, 'credit data:', credit);
    
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
        const result = `${brand} ${model}${licensePlate ? ` - ${licensePlate}` : ''}`.trim();
        console.log('Vehicle display result from credit vehicle:', result);
        return result || '-';
      }
    }
    
    // If no vehicle data in credit, try to get it from the linked invoice
    if (credit.invoice_id && invoices) {
      console.log('Looking for invoice with id:', credit.invoice_id, 'in invoices:', invoices);
      const linkedInvoice = invoices.find(invoice => invoice.id === credit.invoice_id);
      
      if (linkedInvoice?.vehicles) {
        console.log('Found linked invoice with vehicle:', linkedInvoice.vehicles);
        
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
          const result = `${brand} ${model}${licensePlate ? ` - ${licensePlate}` : ''}`.trim();
          console.log('Vehicle display result from invoice vehicle:', result);
          return result || '-';
        }
      }
    }
    
    console.log('No vehicle data found for credit:', credit.id);
    return '-';
  };
  
  const filteredCredits = sortedData?.filter(credit => 
    credit.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (credit.clients && `${credit.clients.first_name} ${credit.clients.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
    formatVehicleDisplay(credit).toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
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
  
  const handleCreateCredit = () => {
    // Check if there's an error indicating missing table
    if (error && (error as any)?.code === '42P01') {
      toast({
        title: "Table manquante",
        description: "La table des avoirs n'existe pas encore. Veuillez exécuter la migration de base de données.",
        variant: "destructive"
      });
      return;
    }
    setIsDialogOpen(true);
  };

  const handleViewCredit = (credit: any) => {
    setSelectedCredit(credit);
    setViewerModalOpen(true);
  };

  const handleEditCredit = (credit: any) => {
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

  const handleApplyToInvoice = (credit: any) => {
    toast({
      title: "Appliquer à une facture",
      description: `Application de l'avoir ${credit.reference} à une facture`
    });
  };
  
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-karrosserie-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des avoirs...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error message if table doesn't exist
  if (error && (error as any)?.code === '42P01') {
    return (
      <div className="p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Avoirs</h1>
          <p className="text-gray-600 mt-1">
            Consultez et gérez les avoirs émis pour vos clients.
          </p>
        </div>
        
        <div className="card-container">
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Table des avoirs non trouvée</h3>
            <p className="text-gray-500 text-center max-w-md">
              La table des avoirs n'existe pas encore dans votre base de données. 
              Veuillez exécuter la migration <code>013_create_credits_table.sql</code> 
              dans votre dashboard Supabase.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Avoirs</h1>
        <p className="text-gray-600 mt-1">
          Consultez et gérez les avoirs émis pour vos clients.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div className="flex-1" />
        
        <div className="flex items-center w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher un avoir..." 
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
            onClick={handleCreateCredit}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel avoir
          </Button>
        </div>
      </div>
      
      <div className="card-container">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHeader sortKey="reference" sortConfig={sortConfig} onSort={handleSort}>
                Numéro
              </SortableTableHeader>
              <SortableTableHeader sortKey="created_at" sortConfig={sortConfig} onSort={handleSort}>
                Date
              </SortableTableHeader>
              <SortableTableHeader sortKey="vehicle" sortConfig={sortConfig} onSort={handleSort}>
                Véhicule
              </SortableTableHeader>
              <SortableTableHeader sortKey="invoice" sortConfig={sortConfig} onSort={handleSort}>
                Facture d'origine
              </SortableTableHeader>
              <SortableTableHeader sortKey="amount" sortConfig={sortConfig} onSort={handleSort}>
                Montant
              </SortableTableHeader>
              <SortableTableHeader sortKey="status" sortConfig={sortConfig} onSort={handleSort}>
                Statut
              </SortableTableHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCredits.length > 0 ? (
              filteredCredits.map((credit) => (
                <React.Fragment key={credit.id}>
                  <TableRow className="hover:bg-gray-50 border-b-0">
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
                        <Button variant="outline" size="sm" onClick={() => handleViewCredit(credit)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditCredit(credit)}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownload(credit)}>
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handlePrint(credit)}>
                          <Printer className="h-4 w-4 mr-1" />
                          Imprimer
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleSendEmail(credit)}>
                          <Mail className="h-4 w-4 mr-1" />
                          Envoyer
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 border-red-500 hover:border-red-700"
                          onClick={() => handleDelete(credit)}
                          disabled={deleteCredit.isPending}
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
                      Aucun avoir correspondant à votre recherche n'a été trouvé.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CreditDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />

      {selectedCredit && (
        <>
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

          <EditCreditDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            creditId={selectedCredit.id}
            initialData={{
              reference: selectedCredit.reference,
              invoice_id: selectedCredit.invoice_id,
              status: selectedCredit.status,
              notes: selectedCredit.notes,
              items: selectedCredit.items
            }}
            readOnly={true}
          />
        </>
      )}

      <CreditViewerModal
        credit={selectedCredit}
        open={viewerModalOpen}
        onOpenChange={setViewerModalOpen}
      />

      <CreditEmailDialog
        credit={selectedCredit}
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
      />
    </div>
  );
};

export default Credits;

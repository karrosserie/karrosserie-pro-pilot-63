import React, { useState } from 'react';
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
import InvoiceDialog from '@/components/invoices/InvoiceDialog';
import InvoiceEmailDialog from '@/components/invoices/InvoiceEmailDialog';
import ReceiptDialog from '@/components/receipts/ReceiptDialog';
import { CreditDialog } from '@/components/credits/CreditDialog';
import { useInvoices } from '@/hooks/use-invoices';
import { useCredits } from '@/hooks/use-credits';
import { Invoice } from '@/services/supabase/invoices';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Printer, Mail, Signature, CreditCard, FileX, Download } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { InvoicePDF } from '@/components/pdf/InvoiceViewer';

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();
  const { confirm } = useConfirmation();
  
  const { invoices, isLoading, error, deleteInvoice } = useInvoices();
  const { credits } = useCredits();
  
  const filteredInvoices = invoices?.filter(invoice => 
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
      const invoiceData = {
        reference: invoice.reference || '',
        date: formatDate(invoice.created_at),
        due_date: formatDate(invoice.due_date),
        vehicle: {
          model: invoice.vehicles?.car_models?.name || 'Modèle inconnu',
          brand: invoice.vehicles?.car_brands?.name || 'Marque inconnue',
          license_plate: invoice.vehicles?.license_plate || '',
          mileage: '0',
          fuel_level: ''
        },
        company: {
          name: "DEMO GEOFFREY MOYA",
          address: "10 rue courteissade",
          zipCode: "13320",
          city: "Bouc bel air",
          country: "France",
          siren: "567890123",
          siret: "56789012300013",
          tva: "FR 567890123",
          phone: "+33650363126",
          email: "geoffrey.moya@gmail.com"
        },
        client: {
          name: invoice.clients ? `${invoice.clients.first_name} ${invoice.clients.last_name}` : '',
          phone: '',
          email: '',
          address: '',
          zipCode: '',
          city: ''
        },
        articles: [
          {
            description: 'Facture de réparation',
            quantity: '1',
            discount: '0',
            unitCost: ((invoice.amount || 0) / 1.2).toFixed(2),
            vat: '20',
            total: ((invoice.amount || 0) / 1.2).toFixed(2)
          }
        ],
        receipts: [],
        notes: invoice.notes || '',
        amountHT: ((invoice.amount || 0) / 1.2).toFixed(2),
        amountVat: ((invoice.amount || 0) * 0.2 / 1.2).toFixed(2),
        amount: (invoice.amount || 0).toString(),
        payment_method: 'espèces',
        paidAmount: '0.00',
        remainAmount: (invoice.amount || 0).toString()
      };

      const blob = await pdf(<InvoicePDF invoice={invoiceData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Facture_${invoice.reference}_${formatDate(invoice.created_at)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Téléchargement réussi",
        description: `La facture ${invoice.reference} a été téléchargée.`
      });
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la génération du PDF.",
        variant: "destructive"
      });
    }
  };

  const handlePrint = (invoice: Invoice) => {
    toast({
      title: "Impression",
      description: `Impression de la facture ${invoice.reference}...`
    });
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

  if (isLoading) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <ErrorMessage message="Erreur lors du chargement des factures" />
      </div>
    );
  }
  
  return (
    <div className="page-container">
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
        </div>
      </div>
      
      <div className="card-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Avoirs</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => {
                const invoiceCredits = getInvoiceCredits(invoice.id);
                return (
                <TableRow key={invoice.id}>
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
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditInvoice(invoice)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(invoice)}
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
                          <DropdownMenuItem onClick={() => handleDownload(invoice)}>
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePrint(invoice)}>
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendEmail(invoice)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Envoyer par e-mail
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleAddPayment(invoice)}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Ajouter un paiement
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddCredit(invoice)}>
                            <FileX className="mr-2 h-4 w-4" />
                            Ajouter un avoir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
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
    </div>
  );
};

export default Invoices;

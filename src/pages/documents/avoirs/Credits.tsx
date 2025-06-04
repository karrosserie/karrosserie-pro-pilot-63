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
import { Search, FileText, Plus, Filter, Download, Eye, Pencil, Trash, MoreVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Printer, Mail, FileX } from 'lucide-react';
import { CreditDialog } from '@/components/credits/CreditDialog';

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
    original_invoice: 'F2024-045'
  },
  {
    id: '2',
    reference: 'AV2024-002',
    created_at: '2024-01-20T14:30:00Z',
    amount: 150.00,
    status: 'En attente',
    clients: { first_name: 'Marie', last_name: 'Martin' },
    vehicles: { brand: 'Renault', model: 'Clio', license_plate: 'EF-456-GH' },
    original_invoice: 'F2024-052'
  }
];

const Credits = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const filteredCredits = mockCredits.filter(credit => 
    credit.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (credit.clients && `${credit.clients.first_name} ${credit.clients.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (credit.vehicles && `${credit.vehicles.brand} ${credit.vehicles.model} - ${credit.vehicles.license_plate}`.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Validé':
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
  
  const handleCreateCredit = () => {
    setIsDialogOpen(true);
  };

  const handleEditCredit = (credit: any) => {
    toast({
      title: "Édition d'avoir",
      description: `Édition de l'avoir ${credit.reference}`
    });
  };

  const handleDelete = (credit: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'avoir ${credit.reference} ?`)) {
      toast({
        title: "Suppression",
        description: `L'avoir ${credit.reference} a été supprimé`
      });
    }
  };

  const handleDownload = (credit: any) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement de l'avoir ${credit.reference}...`
    });
  };

  const handlePrint = (credit: any) => {
    toast({
      title: "Impression",
      description: `Impression de l'avoir ${credit.reference}...`
    });
  };

  const handleSendEmail = (credit: any) => {
    toast({
      title: "Envoi par e-mail",
      description: `Envoi de l'avoir ${credit.reference} par e-mail...`
    });
  };

  const handleApplyToInvoice = (credit: any) => {
    toast({
      title: "Appliquer à une facture",
      description: `Application de l'avoir ${credit.reference} à une facture`
    });
  };
  
  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Avoirs</h1>
        <p className="text-gray-600 mt-1">
          Consultez et gérez les avoirs émis pour vos clients.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <Button variant="outline" size="sm" className="mr-2">
            Tous
          </Button>
          <Button variant="outline" size="sm" className="mr-2">
            Validés
          </Button>
          <Button variant="outline" size="sm" className="mr-2">
            En attente
          </Button>
          <Button variant="outline" size="sm">
            Annulés
          </Button>
        </div>
        
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
              <TableHead>Référence</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Facture d'origine</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCredits.length > 0 ? (
              filteredCredits.map((credit) => (
                <TableRow key={credit.id}>
                  <TableCell className="font-medium">{credit.reference}</TableCell>
                  <TableCell>{formatDate(credit.created_at)}</TableCell>
                  <TableCell>
                    {credit.clients 
                      ? `${credit.clients.first_name} ${credit.clients.last_name}`
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    {credit.vehicles 
                      ? `${credit.vehicles.brand} ${credit.vehicles.model} - ${credit.vehicles.license_plate}`
                      : '-'
                    }
                  </TableCell>
                  <TableCell>{credit.original_invoice}</TableCell>
                  <TableCell>{formatAmount(credit.amount)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(credit.status || 'En attente')}`}>
                      {credit.status || 'En attente'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditCredit(credit)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(credit)}
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
                          <DropdownMenuItem onClick={() => handleDownload(credit)}>
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePrint(credit)}>
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendEmail(credit)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Envoyer par e-mail
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleApplyToInvoice(credit)}>
                            <FileX className="mr-2 h-4 w-4" />
                            Appliquer à une facture
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
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
    </div>
  );
};

export default Credits;

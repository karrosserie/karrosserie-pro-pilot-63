
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
import { Search, TrendingUp, Plus, Filter, Download, Eye, Pencil, Trash, MoreVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Printer, Mail } from 'lucide-react';

// Mock data for receipts
const mockReceipts = [
  {
    id: '1',
    reference: 'ENC2024-001',
    date: '2024-01-15',
    amount: 1250.00,
    status: 'Encaissé',
    client: 'Jean Dupont',
    invoice: 'F2024-045',
    payment_method: 'Virement',
    bank_account: 'Compte Principal'
  },
  {
    id: '2',
    reference: 'ENC2024-002',
    date: '2024-01-20',
    amount: 850.50,
    status: 'En attente',
    client: 'Marie Martin',
    invoice: 'F2024-052',
    payment_method: 'Chèque',
    bank_account: 'Compte Principal'
  }
];

const Receipts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const filteredReceipts = mockReceipts.filter(receipt => 
    receipt.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.invoice.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Encaissé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'Annulé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleCreateReceipt = () => {
    toast({
      title: "Nouveau encaissement",
      description: "Fonctionnalité en cours de développement"
    });
  };

  const handleEdit = (receipt: any) => {
    toast({
      title: "Édition",
      description: `Édition de l'encaissement ${receipt.reference}`
    });
  };

  const handleDelete = (receipt: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'encaissement ${receipt.reference} ?`)) {
      toast({
        title: "Suppression",
        description: `Encaissement ${receipt.reference} supprimé`
      });
    }
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Encaissements</h1>
        <p className="text-gray-600 mt-1">
          Gérez les paiements des factures que vous avez émises.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <Button variant="outline" size="sm" className="mr-2">
            Tous
          </Button>
          <Button variant="outline" size="sm" className="mr-2">
            Encaissés
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
              placeholder="Rechercher un encaissement..." 
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
            onClick={handleCreateReceipt}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel encaissement
          </Button>
        </div>
      </div>
      
      <div className="card-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Facture</TableHead>
              <TableHead>Méthode de paiement</TableHead>
              <TableHead>Compte</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReceipts.length > 0 ? (
              filteredReceipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-medium">{receipt.reference}</TableCell>
                  <TableCell>{new Date(receipt.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{receipt.client}</TableCell>
                  <TableCell>{receipt.invoice}</TableCell>
                  <TableCell>{receipt.payment_method}</TableCell>
                  <TableCell>{receipt.bank_account}</TableCell>
                  <TableCell>{formatAmount(receipt.amount)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(receipt.status)}`}>
                      {receipt.status}
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
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(receipt)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(receipt)}
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
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimer
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Envoyer par e-mail
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  <div className="flex flex-col items-center justify-center py-8">
                    <TrendingUp className="h-10 w-10 text-gray-400 mb-2" />
                    <h3 className="font-medium text-gray-900">Aucun résultat</h3>
                    <p className="text-gray-500 mt-1">
                      Aucun encaissement correspondant à votre recherche n'a été trouvé.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Receipts;

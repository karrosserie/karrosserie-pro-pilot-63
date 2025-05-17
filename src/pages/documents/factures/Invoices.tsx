
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
import { Search, FileText, Plus, Filter, Download, Eye, Pencil, Trash } from 'lucide-react';

// Données mockées pour les factures
const mockInvoices = [
  { 
    id: 1, 
    reference: 'F-2023-001', 
    date: '20/05/2023', 
    client: 'Jean Dupont',
    vehicle: 'Peugeot 308 - AB-123-CD', 
    amount: '3 785,00 €',
    status: 'Payée',
    paymentMethod: 'Carte bancaire'
  },
  { 
    id: 2, 
    reference: 'F-2023-002', 
    date: '18/05/2023', 
    client: 'Marie Martin',
    vehicle: 'Renault Clio - EF-456-GH', 
    amount: '2 950,00 €',
    status: 'En attente',
    paymentMethod: 'Virement'
  },
  { 
    id: 3, 
    reference: 'F-2023-003', 
    date: '15/05/2023', 
    client: 'Pierre Durand',
    vehicle: 'Citroën C3 - IJ-789-KL', 
    amount: '2 100,00 €',
    status: 'Payée',
    paymentMethod: 'Chèque'
  },
  { 
    id: 4, 
    reference: 'F-2023-004', 
    date: '10/05/2023', 
    client: 'Sophie Bernard',
    vehicle: 'Toyota Yaris - MN-012-OP', 
    amount: '1 850,00 €',
    status: 'Annulée',
    paymentMethod: '-'
  }
];

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredInvoices = mockInvoices.filter(invoice => 
    invoice.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payée':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'Annulée':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Factures</h1>
        <p className="text-gray-600 mt-1">
          Consultez et gérez les factures de réparation.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <Button variant="outline" size="sm" className="mr-2">
            Toutes
          </Button>
          <Button variant="outline" size="sm" className="mr-2">
            Payées
          </Button>
          <Button variant="outline" size="sm" className="mr-2">
            En attente
          </Button>
          <Button variant="outline" size="sm">
            Annulées
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
          
          <Button className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle facture
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
              <TableHead>Véhicule</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Paiement</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.reference}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>{invoice.vehicle}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </TableCell>
                  <TableCell>{invoice.paymentMethod}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                        <Trash className="h-4 w-4" />
                      </Button>
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
                      Aucune facture correspondant à votre recherche n'a été trouvée.
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

export default Invoices;

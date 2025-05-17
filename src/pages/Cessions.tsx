
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

// Données mockées pour les cessions de créance
const mockCessions = [
  { 
    id: 1, 
    reference: 'CC-2023-001', 
    date: '20/05/2023', 
    client: 'Jean Dupont',
    vehicle: 'Peugeot 308 - AB-123-CD', 
    insurance: 'AXA Assurances',
    amount: '3 785,00 €',
    status: 'En attente de signature'
  },
  { 
    id: 2, 
    reference: 'CC-2023-002', 
    date: '18/05/2023', 
    client: 'Marie Martin',
    vehicle: 'Renault Clio - EF-456-GH', 
    insurance: 'MAIF',
    amount: '2 950,00 €',
    status: 'Signée'
  },
  { 
    id: 3, 
    reference: 'CC-2023-003', 
    date: '15/05/2023', 
    client: 'Pierre Durand',
    vehicle: 'Citroën C3 - IJ-789-KL', 
    insurance: 'Groupama',
    amount: '2 100,00 €',
    status: 'Envoyée à l\'assurance'
  },
  { 
    id: 4, 
    reference: 'CC-2023-004', 
    date: '10/05/2023', 
    client: 'Sophie Bernard',
    vehicle: 'Toyota Yaris - MN-012-OP', 
    insurance: 'Allianz',
    amount: '1 850,00 €',
    status: 'Payée'
  }
];

const Cessions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCessions = mockCessions.filter(cession => 
    cession.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cession.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cession.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cession.insurance.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente d\'envoi':
        return 'bg-gray-100 text-gray-800';
      case 'En attente de signature':
        return 'bg-amber-100 text-amber-800';
      case 'Signée':
        return 'bg-blue-100 text-blue-800';
      case 'Envoyée à l\'assurance':
        return 'bg-purple-100 text-purple-800';
      case 'Payée':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Cession de créance</h1>
        <p className="text-gray-600 mt-1">
          Gérez vos cessions de créance avec les compagnies d'assurance.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0 overflow-x-auto pb-2">
          <Button variant="outline" size="sm" className="mr-2 whitespace-nowrap">
            Toutes
          </Button>
          <Button variant="outline" size="sm" className="mr-2 whitespace-nowrap">
            En attente d'envoi
          </Button>
          <Button variant="outline" size="sm" className="mr-2 whitespace-nowrap">
            En attente de signature
          </Button>
          <Button variant="outline" size="sm" className="mr-2 whitespace-nowrap">
            Signées
          </Button>
          <Button variant="outline" size="sm" className="mr-2 whitespace-nowrap">
            Envoyées
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Payées
          </Button>
        </div>
        
        <div className="flex items-center w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher une cession..." 
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
            Nouvelle cession
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
              <TableHead>Assurance</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCessions.length > 0 ? (
              filteredCessions.map((cession) => (
                <TableRow key={cession.id}>
                  <TableCell className="font-medium">{cession.reference}</TableCell>
                  <TableCell>{cession.date}</TableCell>
                  <TableCell>{cession.client}</TableCell>
                  <TableCell>{cession.vehicle}</TableCell>
                  <TableCell>{cession.insurance}</TableCell>
                  <TableCell>{cession.amount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(cession.status)}`}>
                      {cession.status}
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
                      Aucune cession de créance correspondant à votre recherche n'a été trouvée.
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

export default Cessions;

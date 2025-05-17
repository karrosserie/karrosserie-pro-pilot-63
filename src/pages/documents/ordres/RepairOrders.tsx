
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Données mockées pour les ordres de réparation
const mockOrders = [
  { 
    id: 1, 
    reference: 'OR-2023-001', 
    date: '18/05/2023', 
    client: 'Jean Dupont',
    vehicle: 'Peugeot 308 - AB-123-CD', 
    amount: '3 785,00 €',
    status: 'En cours',
    deadline: '25/05/2023' 
  },
  { 
    id: 2, 
    reference: 'OR-2023-002', 
    date: '15/05/2023', 
    client: 'Marie Martin',
    vehicle: 'Renault Clio - EF-456-GH', 
    amount: '2 950,00 €',
    status: 'En attente de pièces',
    deadline: '22/05/2023'
  },
  { 
    id: 3, 
    reference: 'OR-2023-003', 
    date: '12/05/2023', 
    client: 'Pierre Durand',
    vehicle: 'Citroën C3 - IJ-789-KL', 
    amount: '2 100,00 €',
    status: 'Terminé',
    deadline: '18/05/2023'
  }
];

const RepairOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  const filteredOrders = mockOrders.filter(order => 
    order.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'En attente de pièces':
        return 'bg-amber-100 text-amber-800';
      case 'Terminé':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateOrder = () => {
    setSelectedOrder(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleEditOrder = (order: any) => {
    setSelectedOrder(order);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleOrderSubmit = (data: any) => {
    console.log('Order data submitted:', data);
    setDialogOpen(false);
  };
  
  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Ordres de réparation</h1>
        <p className="text-gray-600 mt-1">
          Consultez et gérez les ordres de réparation.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <Button variant="outline" size="sm" className="mr-2">
            Tous
          </Button>
          <Button variant="outline" size="sm" className="mr-2">
            En cours
          </Button>
          <Button variant="outline" size="sm" className="mr-2">
            En attente
          </Button>
          <Button variant="outline" size="sm">
            Terminés
          </Button>
        </div>
        
        <div className="flex items-center w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher un ordre de réparation..." 
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
            onClick={handleCreateOrder}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel ordre
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
              <TableHead>Échéance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.reference}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.client}</TableCell>
                  <TableCell>{order.vehicle}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>{order.deadline}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditOrder(order)}>
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
                      Aucun ordre de réparation correspondant à votre recherche n'a été trouvé.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Repair Order Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Nouvel ordre de réparation' : dialogMode === 'edit' ? 'Modifier l\'ordre de réparation' : 'Détails de l\'ordre de réparation'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'create' ? 'Créer un nouvel ordre de réparation.' : dialogMode === 'edit' ? 'Modifier les informations de l\'ordre de réparation.' : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Order form would go here in a real implementation */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="reference" className="text-sm font-medium">Référence</label>
                <Input id="reference" defaultValue={selectedOrder?.reference} readOnly={dialogMode === 'view'} />
              </div>
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">Date</label>
                <Input id="date" type="date" defaultValue={selectedOrder?.date} readOnly={dialogMode === 'view'} />
              </div>
              <div className="space-y-2">
                <label htmlFor="client" className="text-sm font-medium">Client</label>
                <Input id="client" defaultValue={selectedOrder?.client} readOnly={dialogMode === 'view'} />
              </div>
              <div className="space-y-2">
                <label htmlFor="vehicle" className="text-sm font-medium">Véhicule</label>
                <Input id="vehicle" defaultValue={selectedOrder?.vehicle} readOnly={dialogMode === 'view'} />
              </div>
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">Montant</label>
                <Input id="amount" defaultValue={selectedOrder?.amount} readOnly={dialogMode === 'view'} />
              </div>
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">Statut</label>
                <Input id="status" defaultValue={selectedOrder?.status} readOnly={dialogMode === 'view'} />
              </div>
              <div className="space-y-2">
                <label htmlFor="deadline" className="text-sm font-medium">Échéance</label>
                <Input id="deadline" defaultValue={selectedOrder?.deadline} readOnly={dialogMode === 'view'} />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                {dialogMode === 'view' ? 'Fermer' : 'Annuler'}
              </Button>
              {dialogMode !== 'view' && (
                <Button onClick={() => handleOrderSubmit(selectedOrder)}>
                  {dialogMode === 'create' ? 'Créer' : 'Enregistrer'}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RepairOrders;

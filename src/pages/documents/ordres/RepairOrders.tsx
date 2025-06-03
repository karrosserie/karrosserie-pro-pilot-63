
import React, { useState } from 'react';
import { RepairOrdersHeader } from '@/components/repair-orders/RepairOrdersHeader';
import { RepairOrdersTable } from '@/components/repair-orders/RepairOrdersTable';
import RepairOrderDialog from '@/components/repair-orders/RepairOrderDialog';

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
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  const filteredOrders = mockOrders.filter(order => 
    order.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateOrder = () => {
    setSelectedOrder(null);
    setDialogOpen(true);
  };

  const handleEditOrder = (order: any) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };
  
  return (
    <div className="page-container">
      <RepairOrdersHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateOrder={handleCreateOrder}
      />
      
      <RepairOrdersTable
        orders={filteredOrders}
        onEditOrder={handleEditOrder}
      />

      <RepairOrderDialog
        order={selectedOrder}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default RepairOrders;

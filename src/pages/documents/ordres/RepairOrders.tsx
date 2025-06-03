
import React, { useState } from 'react';
import { RepairOrdersHeader } from '@/components/repair-orders/RepairOrdersHeader';
import { RepairOrdersTable } from '@/components/repair-orders/RepairOrdersTable';
import RepairOrderDialog from '@/components/repair-orders/RepairOrderDialog';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { RepairOrder } from '@/services/supabase/repair-orders';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';

const RepairOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<RepairOrder | null>(null);
  
  const { orders, isLoading, error } = useRepairOrders();
  
  const filteredOrders = orders?.filter(order => 
    order.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.clients && `${order.clients.first_name} ${order.clients.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order.vehicles && `${order.vehicles.brand} ${order.vehicles.model} - ${order.vehicles.license_plate}`.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleCreateOrder = () => {
    setSelectedOrder(null);
    setDialogOpen(true);
  };

  const handleEditOrder = (order: RepairOrder) => {
    setSelectedOrder(order);
    setDialogOpen(true);
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
        <ErrorMessage message="Erreur lors du chargement des ordres de réparation" />
      </div>
    );
  }
  
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

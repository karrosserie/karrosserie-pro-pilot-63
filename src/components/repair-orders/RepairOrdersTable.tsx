
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { RepairOrder } from '@/services/supabase/repair-orders';

interface RepairOrdersTableProps {
  orders: RepairOrder[];
  onView: (order: RepairOrder) => void;
  onEdit: (order: RepairOrder) => void;
  onDelete: (order: RepairOrder) => void;
}

export const RepairOrdersTable = ({ orders, onView, onEdit, onDelete }: RepairOrdersTableProps) => {
  // Calculate order amount from quotes or return 0
  const getOrderAmount = (order: RepairOrder) => {
    // Check if quotes exist and have amount
    if (order.quotes && Array.isArray(order.quotes) && order.quotes.length > 0) {
      return order.quotes.reduce((total, quote) => total + (quote.amount || 0), 0);
    }
    
    return 0;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount).replace('.', ',');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'En attente': 'outline',
      'Réservé': 'secondary', 
      'En cours': 'default',
      'Terminé': 'secondary',
      'Annulé': 'destructive'
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status}
      </Badge>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Référence</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Véhicule</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.reference}</TableCell>
            <TableCell>{formatDate(order.created_at)}</TableCell>
            <TableCell>
              {order.clients 
                ? `${order.clients.first_name} ${order.clients.last_name}`
                : 'N/A'
              }
            </TableCell>
            <TableCell>
              {order.vehicles 
                ? `${order.vehicles.brand} ${order.vehicles.model} - ${order.vehicles.license_plate}`
                : 'N/A'
              }
            </TableCell>
            <TableCell>{formatAmount(getOrderAmount(order))}</TableCell>
            <TableCell>{getStatusBadge(order.status || 'En attente')}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onView(order)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit(order)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(order)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

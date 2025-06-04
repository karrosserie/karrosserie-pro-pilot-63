
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil, Trash2, FileText } from 'lucide-react';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { DocumentContextMenu } from '@/components/ui/document-context-menu';

interface RepairOrdersTableProps {
  orders: RepairOrder[];
  onEditOrder: (order: RepairOrder) => void;
  contextMenuProps?: {
    onDownload: (order: RepairOrder) => void;
    onPrint: (order: RepairOrder) => void;
    onSendEmail: (order: RepairOrder) => void;
  };
}

export const RepairOrdersTable = ({ orders, onEditOrder, contextMenuProps }: RepairOrdersTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'Terminé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'Annulé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (orders.length === 0) {
    return (
      <div className="card-container">
        <div className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun ordre de réparation</h3>
          <p className="text-gray-500 text-center max-w-md">
            Aucun ordre de réparation n'a été trouvé. Créez-en un nouveau pour commencer.
          </p>
        </div>
      </div>
    );
  }

  return (
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
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <DocumentContextMenu
              key={order.id}
              onDownload={() => contextMenuProps?.onDownload(order)}
              onPrint={() => contextMenuProps?.onPrint(order)}
              onSendEmail={() => contextMenuProps?.onSendEmail(order)}
            >
              <TableRow>
                <TableCell className="font-medium">{order.reference}</TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>
                  {order.clients 
                    ? `${order.clients.first_name} ${order.clients.last_name}`
                    : '-'
                  }
                </TableCell>
                <TableCell>
                  {order.vehicles 
                    ? `${order.vehicles.brand} ${order.vehicles.model} - ${order.vehicles.license_plate}`
                    : '-'
                  }
                </TableCell>
                <TableCell>{formatAmount(order.amount || 0)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status || 'En attente')}>
                    {order.status || 'En attente'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEditOrder(order)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </DocumentContextMenu>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

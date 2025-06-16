import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil, Trash } from 'lucide-react';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { RepairOrderActionsDropdown } from './RepairOrderActionsDropdown';
import { calculateOrderAmount, formatAmount } from './utils/orderCalculations';

interface RepairOrderTableRowProps {
  order: RepairOrder;
  onEditOrder: (order: RepairOrder) => void;
  contextMenuProps?: {
    onDownload: (order: RepairOrder) => void;
    onPrint: (order: RepairOrder) => void;
    onSendEmail: (order: RepairOrder) => void;
    onSignOrder?: (order: RepairOrder) => void;
    onRequestDocuments?: (order: RepairOrder) => void;
    onConvertToInvoice?: (order: RepairOrder) => void;
  };
}

export const RepairOrderTableRow = ({ order, onEditOrder, contextMenuProps }: RepairOrderTableRowProps) => {
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

  const formatVehicleDisplay = (order: RepairOrder) => {
    console.log('Formatting vehicle display for order:', order.id, 'vehicle data:', order.vehicles);
    
    if (order.vehicles) {
      const brand = order.vehicles.car_brands?.name || '';
      const model = order.vehicles.car_models?.name || '';
      const licensePlate = order.vehicles.license_plate || '';
      
      if (brand && model) {
        return `${brand} ${model}${licensePlate ? ` - ${licensePlate}` : ''}`;
      } else if (licensePlate) {
        return licensePlate;
      }
    }
    
    return '-';
  };

  return (
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
        {formatVehicleDisplay(order)}
      </TableCell>
      <TableCell>{formatAmount(calculateOrderAmount(order))}</TableCell>
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
            <Trash className="h-4 w-4" />
          </Button>
          <RepairOrderActionsDropdown order={order} contextMenuProps={contextMenuProps} />
        </div>
      </TableCell>
    </TableRow>
  );
};

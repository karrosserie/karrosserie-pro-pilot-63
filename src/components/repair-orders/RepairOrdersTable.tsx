
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText } from 'lucide-react';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { RepairOrderTableRow } from './RepairOrderTableRow';

interface RepairOrdersTableProps {
  orders: RepairOrder[];
  onEditOrder: (order: RepairOrder) => void;
  onDeleteOrder: (order: RepairOrder) => void;
  onViewOrder?: (order: RepairOrder) => void;
  contextMenuProps?: {
    onDownload: (order: RepairOrder) => void;
    onPrint: (order: RepairOrder) => void;
    onSendEmail: (order: RepairOrder) => void;
    onSignOrder?: (order: RepairOrder) => void;
    onRequestDocuments?: (order: RepairOrder) => void;
    onConvertToInvoice?: (order: RepairOrder) => void;
  };
}

export const RepairOrdersTable = ({ orders, onEditOrder, onDeleteOrder, onViewOrder, contextMenuProps }: RepairOrdersTableProps) => {
  return (
    <div className="card-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Véhicule</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <RepairOrderTableRow
                key={order.id}
                order={order}
                onEditOrder={onEditOrder}
                onDeleteOrder={onDeleteOrder}
                onViewOrder={onViewOrder}
                contextMenuProps={contextMenuProps}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
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
  );
};

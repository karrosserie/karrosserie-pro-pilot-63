
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SortableTableHeader } from '@/components/ui/sortable-table-header';
import { useTableSorting } from '@/hooks/use-table-sorting';
import { FileText } from 'lucide-react';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { RepairOrderTableRow } from './RepairOrderTableRow';

interface RepairOrdersTableProps {
  orders: RepairOrder[];
  onEditOrder: (order: RepairOrder) => void;
  onDeleteOrder: (order: RepairOrder) => void;
  onRestoreOrder?: (order: RepairOrder) => void;
  onViewOrder?: (order: RepairOrder) => void;
  contextMenuProps?: {
    onDownload: (order: RepairOrder) => void;
    onPrint: (order: RepairOrder) => void;
    onSendEmail: (order: RepairOrder) => void;
    onSignOrder?: (order: RepairOrder) => void;
    onSendForOodriveSignature?: (order: RepairOrder) => void;
    onRequestDocuments?: (order: RepairOrder) => void;
    onConvertToInvoice?: (order: RepairOrder) => void;
  };
}

export const RepairOrdersTable = ({ orders, onEditOrder, onDeleteOrder, onRestoreOrder, onViewOrder, contextMenuProps }: RepairOrdersTableProps) => {
  const { sortedData: sortedOrders, sortConfig, handleSort } = useTableSorting(orders || [], 'created_at', 'desc');
  return (
    <div className="card-container">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHeader sortKey="reference" sortConfig={sortConfig} onSort={handleSort}>
              Numéro
            </SortableTableHeader>
            <SortableTableHeader sortKey="created_at" sortConfig={sortConfig} onSort={handleSort}>
              Date
            </SortableTableHeader>
            <SortableTableHeader sortKey="clients.last_name" sortConfig={sortConfig} onSort={handleSort}>
              Client
            </SortableTableHeader>
            <SortableTableHeader sortKey="vehicles.license_plate" sortConfig={sortConfig} onSort={handleSort}>
              Véhicule
            </SortableTableHeader>
            <SortableTableHeader sortKey="amount" sortConfig={sortConfig} onSort={handleSort}>
              Montant
            </SortableTableHeader>
            <SortableTableHeader sortKey="status" sortConfig={sortConfig} onSort={handleSort}>
              Statut
            </SortableTableHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrders.length > 0 ? (
            sortedOrders.map((order) => (
              <RepairOrderTableRow
                key={order.id}
                order={order}
                onEditOrder={onEditOrder}
                onDeleteOrder={onDeleteOrder}
                onRestoreOrder={onRestoreOrder}
                onViewOrder={onViewOrder}
                contextMenuProps={contextMenuProps}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
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

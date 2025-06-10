
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { FileText } from 'lucide-react';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { RepairOrderTableRow } from './RepairOrderTableRow';

interface RepairOrdersTableProps {
  orders: RepairOrder[];
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

export const RepairOrdersTable = ({ orders, onEditOrder, contextMenuProps }: RepairOrdersTableProps) => {
  if (orders.length === 0) {
    return (
      <div className="card-container">
        <EmptyState
          icon={FileText}
          title="Aucun ordre de réparation"
          description="Aucun ordre de réparation n'a été trouvé. Créez-en un nouveau pour commencer."
        />
      </div>
    );
  }

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
          {orders.map((order) => (
            <RepairOrderTableRow
              key={order.id}
              order={order}
              onEditOrder={onEditOrder}
              contextMenuProps={contextMenuProps}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

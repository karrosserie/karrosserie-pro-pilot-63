
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Eye, Pencil, Trash, FileText, MoreVertical } from 'lucide-react';
import { RepairOrder } from '@/services/supabase/repair-orders';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Download, Printer, Mail, Signature, FileCheck, Receipt } from 'lucide-react';

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

  const formatAmount = (amount: number | null | undefined) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

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
                  : '-'
                }
              </TableCell>
              <TableCell>
                {order.vehicles 
                  ? `${order.vehicles.brand} ${order.vehicles.model} - ${order.vehicles.license_plate}`
                  : '-'
                }
              </TableCell>
              <TableCell>{formatAmount(order.quotes?.amount)}</TableCell>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuItem onClick={() => contextMenuProps?.onDownload(order)}>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => contextMenuProps?.onPrint(order)}>
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => contextMenuProps?.onSendEmail(order)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Envoyer par e-mail
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => contextMenuProps?.onSignOrder?.(order)}>
                        <Signature className="mr-2 h-4 w-4" />
                        Signature du client
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => contextMenuProps?.onRequestDocuments?.(order)}>
                        <FileCheck className="mr-2 h-4 w-4" />
                        Demander les justificatifs
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => contextMenuProps?.onConvertToInvoice?.(order)}>
                        <Receipt className="mr-2 h-4 w-4" />
                        Convertir en facture
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

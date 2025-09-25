import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil, Trash, Download, Printer, Mail, Signature, FileCheck, ArrowRight, RotateCcw, Send } from 'lucide-react';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { RepairOrderActionsDropdown } from './RepairOrderActionsDropdown';
import { calculateOrderAmount, formatAmount } from './utils/orderCalculations';
import { isValidFrenchMobilePhone } from '@/utils/phoneValidation';

interface RepairOrderTableRowProps {
  order: RepairOrder;
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

export const RepairOrderTableRow = ({ order, onEditOrder, onDeleteOrder, onRestoreOrder, onViewOrder, contextMenuProps }: RepairOrderTableRowProps) => {
  const hasValidClientPhone = isValidFrenchMobilePhone(order.clients?.phone);
  const isSignatureInProgress = order.oodrive_contract_id && !order.signed_document_url;
  const isAlreadySignedOodrive = order.signed_document_url;

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
    <React.Fragment>
      <TableRow className="hover:bg-gray-50 border-b-0">
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
      </TableRow>
      <TableRow className="border-t-0">
        <TableCell colSpan={6} className="py-3 border-t-0">
          <div className="flex flex-wrap gap-2 justify-end px-4">
            <Button variant="view" size="sm" onClick={() => onViewOrder?.(order)}>
              <Eye className="h-4 w-4 mr-1" />
              Voir
            </Button>
            <Button variant="edit" size="sm" onClick={() => onEditOrder(order)}>
              <Pencil className="h-4 w-4 mr-1" />
              Modifier
            </Button>
            <Button variant="download" size="sm" onClick={() => contextMenuProps?.onDownload(order)}>
              <Download className="h-4 w-4 mr-1" />
              Télécharger
            </Button>
            <Button variant="print" size="sm" onClick={() => contextMenuProps?.onPrint(order)}>
              <Printer className="h-4 w-4 mr-1" />
              Imprimer
            </Button>
            <Button variant="send" size="sm" onClick={() => contextMenuProps?.onSendEmail(order)}>
              <Mail className="h-4 w-4 mr-1" />
              Envoyer
            </Button>
            {order.status !== 'Signé' && (
              <Button variant="create" size="sm" onClick={() => contextMenuProps?.onSignOrder?.(order)}>
                <Signature className="h-4 w-4 mr-1" />
                Signature du client
              </Button>
            )}
            {hasValidClientPhone && !isAlreadySignedOodrive && !isSignatureInProgress && contextMenuProps?.onSendForOodriveSignature && (
              <Button variant="create" size="sm" onClick={() => contextMenuProps.onSendForOodriveSignature!(order)}>
                <Send className="h-4 w-4 mr-1" />
                Envoyer pour signature
              </Button>
            )}
            {isSignatureInProgress && (
              <Button variant="create" size="sm" disabled>
                <Send className="h-4 w-4 mr-1" />
                Signature en cours...
              </Button>
            )}
            {isAlreadySignedOodrive && (
              <Button
                variant="validation"
                size="sm"
                onClick={() => window.open(order.signed_document_url, '_blank')}
              >
                <FileCheck className="h-4 w-4 mr-1 text-green-600" />
                Document signé
              </Button>
            )}
            <Button variant="create" size="sm" onClick={() => contextMenuProps?.onRequestDocuments?.(order)} className="hidden">
              <FileCheck className="h-4 w-4 mr-1" />
              Demander docs
            </Button>
            {!order.invoices || order.invoices.length === 0 ? (
              <Button 
                size="sm"
                variant="validation"
                onClick={() => contextMenuProps?.onConvertToInvoice?.(order)}
              >
                <ArrowRight className="h-4 w-4 mr-1" />
                Convertir
              </Button>
            ) : null}
            {order.archived ? (
              <Button 
                variant="validation"
                size="sm" 
                onClick={() => onRestoreOrder?.(order)}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Restaurer
              </Button>
            ) : (
              <Button 
                variant="delete"
                size="sm" 
                onClick={() => onDeleteOrder(order)}
              >
                <Trash className="h-4 w-4 mr-1" />
                Archiver
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

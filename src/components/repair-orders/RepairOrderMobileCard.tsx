import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Archive, Download, Printer, Mail, Signature, FileCheck, ArrowRight, Calendar, User, Car, Euro, Send } from 'lucide-react';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { StatusBadge } from '@/components/ui/status-badge';
import { calculateOrderAmount, formatAmount } from './utils/orderCalculations';
import { isValidFrenchMobilePhone } from '@/utils/phoneValidation';

interface RepairOrderMobileCardProps {
  order: RepairOrder;
  onViewOrder: (order: RepairOrder) => void;
  onEditOrder: (order: RepairOrder) => void;
  onArchiveOrder: (order: RepairOrder) => void;
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

const RepairOrderMobileCard: React.FC<RepairOrderMobileCardProps> = ({
  order,
  onViewOrder,
  onEditOrder,
  onArchiveOrder,
  contextMenuProps
}) => {
  const hasValidClientPhone = isValidFrenchMobilePhone(order.clients?.phone);
  const isSignatureInProgress = order.oodrive_contract_id && !order.signed_document_url;
  const isAlreadySignedOodrive = order.signed_document_url;

  return (
    <div className="card-container p-4 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{order.reference}</h3>
          <p className="text-sm text-gray-500">
            <Calendar className="h-4 w-4 inline mr-1" />
            {new Date(order.created_at).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <StatusBadge status={order.status || 'En attente'} />
      </div>

      {/* Client and Vehicle Info */}
      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <User className="h-4 w-4 mr-2 text-gray-400" />
          <span>
            {order.clients 
              ? `${order.clients.first_name} ${order.clients.last_name}` 
              : '-'
            }
          </span>
        </div>
        
        <div className="flex items-center text-sm">
          <Car className="h-4 w-4 mr-2 text-gray-400" />
          <span>
            {order.vehicles 
              ? `${order.vehicles.car_brands?.name || 'Marque inconnue'} ${order.vehicles.car_models?.name || 'Modèle inconnu'} - ${order.vehicles.license_plate}`
              : '-'
            }
          </span>
        </div>

        <div className="flex items-center text-sm font-medium">
          <Euro className="h-4 w-4 mr-2 text-gray-400" />
          <span>{formatAmount(calculateOrderAmount(order))}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-1.5 pt-3 border-t">
        {/* Primary Actions */}
        <Button variant="view" size="sm" onClick={() => onViewOrder(order)} className="w-28 truncate">
          <Eye className="h-3 w-3 mr-1" />
          Voir
        </Button>
        <Button variant="edit" size="sm" onClick={() => onEditOrder(order)} className="w-28 truncate">
          <Pencil className="h-3 w-3 mr-1" />
          Modifier
        </Button>
        
        {/* Secondary Actions */}
        {contextMenuProps?.onDownload && (
          <Button variant="download" size="sm" onClick={() => contextMenuProps.onDownload(order)} className="w-28 truncate">
            <Download className="h-3 w-3 mr-1" />
            Télécharger
          </Button>
        )}
        {contextMenuProps?.onPrint && (
          <Button variant="print" size="sm" onClick={() => contextMenuProps.onPrint(order)} className="w-28 truncate">
            <Printer className="h-3 w-3 mr-1" />
            Imprimer
          </Button>
        )}
        {contextMenuProps?.onSendEmail && (
          <Button variant="send" size="sm" onClick={() => contextMenuProps.onSendEmail(order)} className="w-28 truncate">
            <Mail className="h-3 w-3 mr-1" />
            E-mail
          </Button>
        )}
        
        {/* Signature Actions */}
        {contextMenuProps?.onSignOrder && (
          <Button variant="create" size="sm" onClick={() => contextMenuProps.onSignOrder(order)} className="w-28 truncate">
            <Signature className="h-3 w-3 mr-1" />
            Signer
          </Button>
        )}
        {hasValidClientPhone && !isAlreadySignedOodrive && !isSignatureInProgress && contextMenuProps?.onSendForOodriveSignature && (
          <Button variant="create" size="sm" onClick={() => contextMenuProps.onSendForOodriveSignature!(order)} className="w-28 truncate">
            <Send className="h-3 w-3 mr-1" />
            Signature
          </Button>
        )}
        {isSignatureInProgress && (
          <Button variant="create" size="sm" disabled className="w-28 truncate">
            <Send className="h-3 w-3 mr-1" />
            En cours...
          </Button>
        )}
        {isAlreadySignedOodrive && (
          <Button variant="validation" size="sm" disabled className="w-28 truncate">
            <FileCheck className="h-3 w-3 mr-1 text-green-600" />
            Signé
          </Button>
        )}
        
        {/* Additional Actions */}
        {contextMenuProps?.onRequestDocuments && (
          <Button variant="create" size="sm" onClick={() => contextMenuProps.onRequestDocuments!(order)} className="w-28 truncate">
            <FileCheck className="h-3 w-3 mr-1" />
            Justificatifs
          </Button>
        )}
        {contextMenuProps?.onConvertToInvoice && (
          <Button variant="validation" size="sm" onClick={() => contextMenuProps.onConvertToInvoice(order)} className="w-28 truncate">
            <ArrowRight className="h-3 w-3 mr-1" />
            Facturer
          </Button>
        )}
        
        {/* Destructive Action */}
        <Button variant="secondary" size="sm" onClick={() => onArchiveOrder(order)} className="w-28 truncate">
          <Archive className="h-3 w-3 mr-1" />
          Archiver
        </Button>
      </div>
    </div>
  );
};

export default RepairOrderMobileCard;
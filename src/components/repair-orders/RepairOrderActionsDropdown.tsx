
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Download, Printer, Mail, Signature, FileCheck, ArrowRight, Send } from 'lucide-react';
import { RepairOrder } from '@/services/supabase/repair-orders';

interface RepairOrderActionsDropdownProps {
  order: RepairOrder;
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

export const RepairOrderActionsDropdown = ({ order, contextMenuProps }: RepairOrderActionsDropdownProps) => {
  const isAlreadySigned = order.status === 'Signé';
  const hasClientPhone = order.clients?.phone;
  const isSignatureInProgress = order.oodrive_contract_id && !order.signed_document_url;
  const isAlreadySignedOodrive = order.signed_document_url;

  // Debug logs
  console.log('RepairOrder Debug:', {
    orderId: order.id,
    hasClientPhone,
    clientPhone: order.clients?.phone,
    isAlreadySignedOodrive,
    isSignatureInProgress,
    oodrive_contract_id: order.oodrive_contract_id,
    signed_document_url: order.signed_document_url,
    hasOodriveSignatureAction: !!contextMenuProps?.onSendForOodriveSignature,
    shouldShowButton: hasClientPhone && !isAlreadySignedOodrive && !isSignatureInProgress && !!contextMenuProps?.onSendForOodriveSignature
  });

  return (
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
        {!isAlreadySigned && (
          <DropdownMenuItem onClick={() => contextMenuProps?.onSignOrder?.(order)}>
            <Signature className="mr-2 h-4 w-4" />
            Signature du client
          </DropdownMenuItem>
        )}
        {hasClientPhone && !isAlreadySignedOodrive && !isSignatureInProgress && (
          <DropdownMenuItem onClick={() => contextMenuProps?.onSendForOodriveSignature?.(order)}>
            <Send className="mr-2 h-4 w-4" />
            Envoyer pour signature
          </DropdownMenuItem>
        )}
        {isSignatureInProgress && (
          <DropdownMenuItem disabled>
            <Send className="mr-2 h-4 w-4" />
            Signature en cours...
          </DropdownMenuItem>
        )}
        {isAlreadySignedOodrive && (
          <DropdownMenuItem disabled>
            <FileCheck className="mr-2 h-4 w-4 text-green-600" />
            Document signé
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => contextMenuProps?.onRequestDocuments?.(order)}>
          <FileCheck className="mr-2 h-4 w-4" />
          Demander les justificatifs
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => contextMenuProps?.onConvertToInvoice?.(order)}>
          <ArrowRight className="mr-2 h-4 w-4" />
          Convertir en facture
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

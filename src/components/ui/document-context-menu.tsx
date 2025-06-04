
import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Download, Printer, Mail } from 'lucide-react';

interface DocumentContextMenuProps {
  children: React.ReactNode;
  onDownload?: () => void;
  onPrint?: () => void;
  onSendEmail?: () => void;
}

export const DocumentContextMenu = ({ 
  children, 
  onDownload, 
  onPrint, 
  onSendEmail 
}: DocumentContextMenuProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Télécharger
        </ContextMenuItem>
        <ContextMenuItem onClick={onPrint}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimer
        </ContextMenuItem>
        <ContextMenuItem onClick={onSendEmail}>
          <Mail className="mr-2 h-4 w-4" />
          Envoyer par e-mail
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

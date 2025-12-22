import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmailSentBadge } from "@/components/ui/email-sent-badge";
import { Eye, Pencil, Download, Printer, Mail, FileCheck, ArrowRight, Trash, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ClientQuoteMobileCardProps {
  quote: any;
  onView: (quote: any) => void;
  onEdit: (quote: any) => void;
  onDelete: (quote: any) => void;
  onDownload: (quote: any) => void;
  onPrint: (quote: any) => void;
  onSendEmail: (quote: any) => void;
  onRequestDocuments: (quote: any) => void;
  onConvertToRepairOrder: (quote: any) => void;
}

const ClientQuoteMobileCard: React.FC<ClientQuoteMobileCardProps> = ({
  quote,
  onView,
  onEdit,
  onDelete,
  onDownload,
  onPrint,
  onSendEmail,
  onRequestDocuments,
  onConvertToRepairOrder
}) => {
  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '-';
    return amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }) + ' €';
  };

  const canConvert = !quote.repair_orders || quote.repair_orders.length === 0;

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{quote.reference}</h3>
              {quote.email_sent && <EmailSentBadge />}
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(quote.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={quote.status === 'draft' ? 'En attente' : (quote.status || 'En attente')} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(quote)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Voir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(quote)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDownload(quote)}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onPrint(quote)}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSendEmail(quote)}>
                  <Mail className="h-4 w-4 mr-2" />
                  E-mail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onRequestDocuments(quote)}>
                  <FileCheck className="h-4 w-4 mr-2" />
                  Demander justificatifs
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {canConvert && (
                  <DropdownMenuItem onClick={() => onConvertToRepairOrder(quote)}>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Convertir
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onDelete(quote)} className="text-destructive">
                  <Trash className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Client:</span>
            <span className="font-medium">
              {quote.clients ? `${quote.clients.first_name} ${quote.clients.last_name}` : '-'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Véhicule:</span>
            <span className="font-medium text-right">
              {quote.vehicles 
                ? `${quote.vehicles.car_brands?.name || 'Marque inconnue'} ${quote.vehicles.car_models?.name || 'Modèle inconnu'} - ${quote.vehicles.license_plate}`
                : '-'
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Montant:</span>
            <span className="font-semibold text-lg">{formatAmount(quote.amount)}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="view" size="sm" onClick={() => onView(quote)} className="flex-1">
            <Eye className="h-4 w-4 mr-1" />
            Voir
          </Button>
          <Button variant="edit" size="sm" onClick={() => onEdit(quote)} className="flex-1">
            <Pencil className="h-4 w-4 mr-1" />
            Modifier
          </Button>
          {canConvert && (
            <Button size="sm" variant="validation" onClick={() => onConvertToRepairOrder(quote)} className="flex-1">
              <ArrowRight className="h-4 w-4 mr-1" />
              Convertir
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientQuoteMobileCard;
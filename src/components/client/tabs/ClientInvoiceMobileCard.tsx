import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Download, Printer, Mail, CreditCard, FileX, Trash, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ClientInvoiceMobileCardProps {
  invoice: any;
  credits: any[];
  onView: (invoice: any) => void;
  onEdit: (invoice: any) => void;
  onDelete: (invoice: any) => void;
  onDownload: (invoice: any) => void;
  onPrint: (invoice: any) => void;
  onSendEmail: (invoice: any) => void;
  onAddPayment: (invoice: any) => void;
  onAddCredit: (invoice: any) => void;
}

const ClientInvoiceMobileCard: React.FC<ClientInvoiceMobileCardProps> = ({
  invoice,
  credits,
  onView,
  onEdit,
  onDelete,
  onDownload,
  onPrint,
  onSendEmail,
  onAddPayment,
  onAddCredit
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      return '-';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payée':
        return 'bg-green-100 text-green-800';
      case 'En attente de paiement':
        return 'bg-amber-100 text-amber-800';
      case 'Paiement partiel':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCreditsBadges = (invoiceCredits: any[]) => {
    if (invoiceCredits.length === 0) {
      return <span className="text-muted-foreground text-sm">-</span>;
    }
    
    return (
      <div className="flex flex-wrap gap-1">
        {invoiceCredits.map((credit) => (
          <Badge
            key={credit.id}
            variant="secondary"
            className="bg-orange-100 text-orange-800 hover:bg-orange-100 text-xs"
           >
             Avoir n°{credit.reference} - {formatAmount(credit.amount || 0)}
           </Badge>
        ))}
      </div>
    );
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{invoice.reference}</h3>
            <p className="text-sm text-muted-foreground">{formatDate(invoice.created_at)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status || 'En attente de paiement')}`}>
              {invoice.status || 'En attente de paiement'}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(invoice)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Voir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(invoice)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDownload(invoice)}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onPrint(invoice)}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSendEmail(invoice)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onAddPayment(invoice)}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Créer un paiement
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddCredit(invoice)}>
                  <FileX className="h-4 w-4 mr-2" />
                  Créer un avoir
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(invoice)} className="text-destructive">
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
              {invoice.clients 
                ? `${invoice.clients.first_name} ${invoice.clients.last_name}`
                : '-'
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Véhicule:</span>
            <span className="font-medium text-right">
              {invoice.vehicles 
                ? `${invoice.vehicles.car_brands?.name || 'Marque inconnue'} ${invoice.vehicles.car_models?.name || 'Modèle inconnu'} - ${invoice.vehicles.license_plate}`
                : '-'
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Montant:</span>
            <span className="font-semibold text-lg">{formatAmount(invoice.amount || 0)}</span>
          </div>
          {credits.length > 0 && (
            <div className="pt-2 border-t">
              <span className="text-muted-foreground text-sm">Avoirs:</span>
              <div className="mt-1">
                {renderCreditsBadges(credits)}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="view" size="sm" onClick={() => onView(invoice)} className="flex-1">
            <Eye className="h-4 w-4 mr-1" />
            Voir
          </Button>
          <Button variant="edit" size="sm" onClick={() => onEdit(invoice)} className="flex-1">
            <Pencil className="h-4 w-4 mr-1" />
            Modifier
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInvoiceMobileCard;
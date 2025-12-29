import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Pencil, 
  Download, 
  Mail, 
  MoreHorizontal,
  Printer,
  Trash
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClientCreditMobileCardProps {
  credit: any;
  invoiceDisplay: string;
  vehicleDisplay: string;
  onView: (credit: any) => void;
  onEdit: (credit: any) => void;
  onDownload: (credit: any) => void;
  onPrint: (credit: any) => void;
  onSendEmail: (credit: any) => void;
  onDelete: (credit: any) => void;
  isDeleting?: boolean;
}

const ClientCreditMobileCard: React.FC<ClientCreditMobileCardProps> = ({
  credit,
  invoiceDisplay,
  vehicleDisplay,
  onView,
  onEdit,
  onDownload,
  onPrint,
  onSendEmail,
  onDelete,
  isDeleting = false
}) => {
  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (error) {
      return '-';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'Annulé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-semibold text-foreground">{credit.reference}</p>
            <p className="text-sm text-muted-foreground">{formatDate(credit.created_date || credit.created_at)}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(credit.status || 'En attente')}`}>
            {credit.status || 'En attente'}
          </span>
        </div>

        <div className="space-y-2 text-sm mb-3">
          <div>
            <span className="text-muted-foreground">Véhicule:</span>
            <p className="font-medium truncate">{vehicleDisplay}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Facture:</span>
            <p className="font-medium truncate">{invoiceDisplay}</p>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground">Montant:</span>
            <p className="font-semibold text-primary">{formatAmount(credit.amount)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onView(credit)} title="Voir">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onEdit(credit)} title="Modifier">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDownload(credit)} title="Télécharger">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onSendEmail(credit)} title="Envoyer">
              <Mail className="h-4 w-4" />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onPrint(credit)}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimer
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(credit)}
                className="text-destructive focus:text-destructive"
                disabled={isDeleting}
              >
                <Trash className="h-4 w-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCreditMobileCard;

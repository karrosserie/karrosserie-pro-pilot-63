import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';

interface ClientReceiptMobileCardProps {
  receipt: any;
  invoiceDisplay: string;
  onEdit: (receipt: any) => void;
  onDelete: (receipt: any) => void;
}

const ClientReceiptMobileCard: React.FC<ClientReceiptMobileCardProps> = ({
  receipt,
  invoiceDisplay,
  onEdit,
  onDelete
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
      case 'Encaissé':
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
            <p className="font-semibold text-foreground">{receipt.reference || 'N/A'}</p>
            <p className="text-sm text-muted-foreground">{formatDate(receipt.date)}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(receipt.status)}`}>
            {receipt.status}
          </span>
        </div>

        <div className="space-y-2 text-sm mb-3">
          <div>
            <span className="text-muted-foreground">Facture:</span>
            <p className="font-medium truncate">{invoiceDisplay}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-muted-foreground">Méthode:</span>
              <p className="font-medium">{receipt.payment_method}</p>
            </div>
            <div className="text-right">
              <span className="text-muted-foreground">Montant:</span>
              <p className="font-semibold text-primary">{formatAmount(receipt.amount)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button variant="ghost" size="icon" onClick={() => onEdit(receipt)} title="Modifier">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(receipt)} 
            title="Supprimer"
            className="text-destructive hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientReceiptMobileCard;

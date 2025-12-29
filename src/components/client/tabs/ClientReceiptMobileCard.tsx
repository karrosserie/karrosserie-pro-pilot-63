import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, Calendar, Euro, CreditCard, FileText } from 'lucide-react';

interface ClientReceiptMobileCardProps {
  receipt: any;
  onEdit: (receipt: any) => void;
  onDelete: (receipt: any) => void;
  getInvoiceDisplay?: (invoiceId: string | null) => string;
}

const ClientReceiptMobileCard: React.FC<ClientReceiptMobileCardProps> = ({
  receipt,
  onEdit,
  onDelete,
  getInvoiceDisplay
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (error) {
      return '-';
    }
  };

  const formatAmount = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Validé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'Annulé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="card-container p-4 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-foreground">{receipt.reference}</h3>
          <p className="text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 inline mr-1" />
            {formatDate(receipt.date)}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(receipt.status)}`}>
          {receipt.status}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-2">
        {/* Invoice Info */}
        {getInvoiceDisplay && (
          <div className="flex items-start text-sm">
            <FileText className="h-4 w-4 mr-2 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-xs">{getInvoiceDisplay(receipt.invoice_id)}</span>
          </div>
        )}

        {/* Amount */}
        <div className="flex items-center text-sm font-medium">
          <Euro className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{formatAmount(receipt.amount)}</span>
        </div>

        {/* Payment Method */}
        <div className="flex items-center text-sm">
          <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{receipt.payment_method || 'Non spécifié'}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2 border-t">
        <Button variant="edit" size="sm" onClick={() => onEdit(receipt)} className="flex-1">
          <Pencil className="h-3 w-3 mr-1" />
          Modifier
        </Button>
        <Button variant="delete" size="sm" onClick={() => onDelete(receipt)} className="flex-1">
          <Trash className="h-3 w-3 mr-1" />
          Supprimer
        </Button>
      </div>
    </div>
  );
};

export default ClientReceiptMobileCard;

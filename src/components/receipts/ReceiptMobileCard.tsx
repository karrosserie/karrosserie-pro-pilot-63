import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, Calendar, Euro, CreditCard, FileText, User, Car } from 'lucide-react';

interface ReceiptMobileCardProps {
  receipt: any;
  onEdit: (receipt: any) => void;
  onDelete: (receipt: any) => void;
  getInvoiceDisplay?: (invoiceId: string | null) => string;
  formatAmount: (amount: number | null | undefined) => string;
  formatDate: (dateString: string | null) => string;
  getStatusColor: (status: string) => string;
}

const ReceiptMobileCard: React.FC<ReceiptMobileCardProps> = ({
  receipt,
  onEdit,
  onDelete,
  getInvoiceDisplay,
  formatAmount,
  formatDate,
  getStatusColor
}) => {
  return (
    <div className="card-container p-4 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{receipt.reference}</h3>
          <p className="text-sm text-gray-500">
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
            <FileText className="h-4 w-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-xs">{getInvoiceDisplay(receipt.invoice_id)}</span>
          </div>
        )}

        {/* Amount */}
        <div className="flex items-center text-sm font-medium">
          <Euro className="h-4 w-4 mr-2 text-gray-400" />
          <span>{formatAmount(receipt.amount)}</span>
        </div>

        {/* Payment Method */}
        <div className="flex items-center text-sm">
          <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
          <span>{receipt.payment_method || 'Non spécifié'}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2 border-t">
        <Button variant="edit" size="sm" onClick={() => onEdit(receipt)}>
          <Pencil className="h-3 w-3 mr-1" />
          Modifier
        </Button>
        <Button variant="delete" size="sm" onClick={() => onDelete(receipt)}>
          <Trash className="h-3 w-3 mr-1" />
          Supprimer
        </Button>
      </div>
    </div>
  );
};

export default ReceiptMobileCard;
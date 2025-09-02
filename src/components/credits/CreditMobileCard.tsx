import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash, Download, Printer, Mail, Calendar, User, Car, Euro, FileText } from 'lucide-react';

interface CreditMobileCardProps {
  credit: any;
  onViewCredit: (credit: any) => void;
  onEditCredit: (credit: any) => void;
  onDelete: (credit: any) => void;
  onDownload: (credit: any) => void;
  onPrint: (credit: any) => void;
  onSendEmail: (credit: any) => void;
  getInvoiceDisplay: (invoiceId: string | null) => string;
  formatVehicleDisplay: (credit: any) => string;
}

const CreditMobileCard: React.FC<CreditMobileCardProps> = ({
  credit,
  onViewCredit,
  onEditCredit,
  onDelete,
  onDownload,
  onPrint,
  onSendEmail,
  getInvoiceDisplay,
  formatVehicleDisplay
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
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
    <div className="card-container p-4 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{credit.reference}</h3>
          <p className="text-sm text-gray-500">
            <Calendar className="h-4 w-4 inline mr-1" />
            {formatDate(credit.created_date || credit.created_at)}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(credit.status || 'En attente')}`}>
          {credit.status || 'En attente'}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-2">
        {/* Vehicle */}
        <div className="flex items-center text-sm">
          <Car className="h-4 w-4 mr-2 text-gray-400" />
          <span>{formatVehicleDisplay(credit)}</span>
        </div>

        {/* Original Invoice */}
        <div className="flex items-center text-sm">
          <FileText className="h-4 w-4 mr-2 text-gray-400" />
          <span className="text-xs">{getInvoiceDisplay(credit.invoice_id)}</span>
        </div>

        {/* Amount */}
        <div className="flex items-center text-sm font-medium">
          <Euro className="h-4 w-4 mr-2 text-gray-400" />
          <span>{formatAmount(credit.amount)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2 border-t">
        <Button variant="view" size="sm" onClick={() => onViewCredit(credit)}>
          <Eye className="h-3 w-3 mr-1" />
          Voir
        </Button>
        <Button variant="edit" size="sm" onClick={() => onEditCredit(credit)}>
          <Pencil className="h-3 w-3 mr-1" />
          Modifier
        </Button>
        <Button variant="download" size="sm" onClick={() => onDownload(credit)}>
          <Download className="h-3 w-3 mr-1" />
          Télécharger
        </Button>
        <Button variant="print" size="sm" onClick={() => onPrint(credit)}>
          <Printer className="h-3 w-3 mr-1" />
          Imprimer
        </Button>
        <Button variant="send" size="sm" onClick={() => onSendEmail(credit)}>
          <Mail className="h-3 w-3 mr-1" />
          Envoyer
        </Button>
        <Button variant="delete" size="sm" onClick={() => onDelete(credit)}>
          <Trash className="h-3 w-3 mr-1" />
          Supprimer
        </Button>
      </div>
    </div>
  );
};

export default CreditMobileCard;
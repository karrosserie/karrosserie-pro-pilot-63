import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, Euro, FileText, Car } from 'lucide-react';

interface ClientCreditMobileCardProps {
  credit: any;
  onViewCredit: (credit: any) => void;
  getInvoiceDisplay: (invoiceId: string | null) => string;
  formatVehicleDisplay: (credit: any) => string;
}

const ClientCreditMobileCard: React.FC<ClientCreditMobileCardProps> = ({
  credit,
  onViewCredit,
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
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="card-container p-4 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-foreground">{credit.reference}</h3>
          <p className="text-sm text-muted-foreground">
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
          <Car className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{formatVehicleDisplay(credit)}</span>
        </div>

        {/* Original Invoice */}
        <div className="flex items-center text-sm">
          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-xs">{getInvoiceDisplay(credit.invoice_id)}</span>
        </div>

        {/* Amount */}
        <div className="flex items-center text-sm font-medium">
          <Euro className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{formatAmount(credit.amount)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-1.5 pt-3 border-t">
        <Button variant="view" size="sm" onClick={() => onViewCredit(credit)} className="w-full">
          <Eye className="h-3 w-3 mr-1" />
          Voir l'avoir
        </Button>
      </div>
    </div>
  );
};

export default ClientCreditMobileCard;

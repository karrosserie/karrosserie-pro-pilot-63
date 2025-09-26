import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil, Send, Download, Printer, Mail, CreditCard, FileX, Calendar, User, Car, Euro, Trash } from 'lucide-react';
import { Invoice } from '@/services/supabase/invoices';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InvoiceMobileCardProps {
  invoice: Invoice;
  onViewInvoice: (invoice: Invoice) => void;
  onEditInvoice: (invoice: Invoice) => void;
  onRelance: (invoice: Invoice) => void;
  onDownload: (invoice: Invoice) => void;
  onPrint: (invoice: Invoice) => void;
  onSendEmail: (invoice: Invoice) => void;
  onAddPayment: (invoice: Invoice) => void;
  onAddCredit: (invoice: Invoice) => void;
  onDeleteInvoice?: (invoice: Invoice) => void;
  onRestoreInvoice?: (invoice: Invoice) => void;
  invoiceCredits?: any[];
  showArchived?: boolean;
}

const InvoiceMobileCard: React.FC<InvoiceMobileCardProps> = ({
  invoice,
  onViewInvoice,
  onEditInvoice,
  onRelance,
  onDownload,
  onPrint,
  onSendEmail,
  onAddPayment,
  onAddCredit,
  onDeleteInvoice,
  onRestoreInvoice,
  invoiceCredits = [],
  showArchived = false
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

  return (
    <div className="card-container p-4 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{invoice.reference}</h3>
          <p className="text-sm text-gray-500">
            <Calendar className="h-4 w-4 inline mr-1" />
            {formatDate(invoice.created_at)}
          </p>
        </div>
        <Badge className={`${getStatusColor(invoice.status || 'En attente de paiement')}`}>
          {invoice.status || 'En attente de paiement'}
        </Badge>
      </div>

      {/* Client Info */}
      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <User className="h-4 w-4 mr-2 text-gray-400" />
          <span>
            {invoice.clients 
              ? `${invoice.clients.first_name} ${invoice.clients.last_name}`
              : '-'
            }
          </span>
        </div>
        
        {/* Vehicle Info */}
        <div className="flex items-center text-sm">
          <Car className="h-4 w-4 mr-2 text-gray-400" />
          <span>
            {invoice.vehicles 
              ? `${invoice.vehicles.car_brands?.name || 'Marque inconnue'} ${invoice.vehicles.car_models?.name || 'Modèle inconnu'} - ${invoice.vehicles.license_plate}`
              : '-'
            }
          </span>
        </div>

        {/* Amount */}
        <div className="flex items-center text-sm font-medium">
          <Euro className="h-4 w-4 mr-2 text-gray-400" />
          <span>{formatAmount(invoice.amount || 0)}</span>
        </div>

        {/* Credits */}
        {invoiceCredits.length > 0 && (
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Avoirs associés:</p>
            {invoiceCredits.map((credit) => (
              <Badge
                key={credit.id}
                variant="secondary"
                className="bg-orange-100 text-orange-800 hover:bg-orange-100 text-xs mr-1"
              >
                Avoir n°{credit.reference} - {formatAmount(credit.amount || 0)}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-1.5 pt-3 border-t">
        {/* Primary Actions */}
        <Button variant="view" size="sm" onClick={() => onViewInvoice(invoice)} className="w-24">
          <Eye className="h-3 w-3 mr-1" />
          Voir
        </Button>
        <Button variant="edit" size="sm" onClick={() => onEditInvoice(invoice)} className="w-24">
          <Pencil className="h-3 w-3 mr-1" />
          Modifier
        </Button>
        
        {/* Secondary Actions */}
        <Button variant="download" size="sm" onClick={() => onDownload(invoice)} className="w-28">
          <Download className="h-3 w-3 mr-1" />
          Télécharger
        </Button>
        <Button variant="print" size="sm" onClick={() => onPrint(invoice)} className="w-24">
          <Printer className="h-3 w-3 mr-1" />
          Imprimer
        </Button>
        <Button variant="send" size="sm" onClick={() => onSendEmail(invoice)} className="w-24">
          <Mail className="h-3 w-3 mr-1" />
          E-mail
        </Button>
        
        {/* Invoice Specific Actions */}
        <Button variant="payment" size="sm" onClick={() => onAddPayment(invoice)} className="w-24">
          <CreditCard className="h-3 w-3 mr-1" />
          Paiement
        </Button>
        <Button variant="create" size="sm" onClick={() => onAddCredit(invoice)} className="w-24">
          <FileX className="h-3 w-3 mr-1" />
          Avoir
        </Button>
        <Button variant="send" size="sm" onClick={() => onRelance(invoice)} className="w-24">
          <Send className="h-3 w-3 mr-1" />
          Relance
        </Button>
        
        {/* Conditional Actions */}
        {showArchived && onRestoreInvoice && (
          <Button variant="edit" size="sm" onClick={() => onRestoreInvoice(invoice)} className="w-24">
            <FileX className="h-3 w-3 mr-1" />
            Restaurer
          </Button>
        )}
        
        {/* Destructive Action */}
        {onDeleteInvoice && (
          <Button variant="delete" size="sm" onClick={() => onDeleteInvoice(invoice)} className="w-24">
            <Trash className="h-3 w-3 mr-1" />
            {showArchived ? 'Supprimer' : 'Archiver'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default InvoiceMobileCard;

import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash, Eye } from 'lucide-react';
import { Invoice } from '@/services/supabase/invoices';
import { formatCurrency } from '@/lib/utils';
import { DocumentContextMenu } from '@/components/ui/document-context-menu';

interface InvoiceTableRowProps {
  invoice: Invoice;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
}

export const InvoiceTableRow = ({ invoice, onEdit, onDelete }: InvoiceTableRowProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Brouillon':
        return 'bg-gray-100 text-gray-800';
      case 'Envoyée':
        return 'bg-blue-100 text-blue-800';
      case 'Payée':
        return 'bg-green-100 text-green-800';
      case 'En retard':
        return 'bg-red-100 text-red-800';
      case 'Annulée':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const handleDownload = () => {
    console.log('Télécharger la facture:', invoice.reference);
  };

  const handlePrint = () => {
    console.log('Imprimer la facture:', invoice.reference);
  };

  const handleSendEmail = () => {
    console.log('Envoyer par e-mail la facture:', invoice.reference);
  };

  return (
    <DocumentContextMenu
      onDownload={handleDownload}
      onPrint={handlePrint}
      onSendEmail={handleSendEmail}
    >
      <TableRow>
        <TableCell className="font-medium">{invoice.reference}</TableCell>
        <TableCell>{formatDate(invoice.created_at)}</TableCell>
        <TableCell>
          {invoice.clients 
            ? `${invoice.clients.first_name} ${invoice.clients.last_name}`
            : '-'
          }
        </TableCell>
        <TableCell>
          {invoice.vehicles 
            ? `${invoice.vehicles.brand} ${invoice.vehicles.model} - ${invoice.vehicles.license_plate}`
            : '-'
          }
        </TableCell>
        <TableCell>{formatCurrency(invoice.amount || 0)}</TableCell>
        <TableCell>
          <Badge className={getStatusColor(invoice.status || 'Brouillon')}>
            {invoice.status || 'Brouillon'}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end space-x-1">
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onEdit(invoice)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-red-500 hover:text-red-700"
              onClick={() => onDelete(invoice)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </DocumentContextMenu>
  );
};

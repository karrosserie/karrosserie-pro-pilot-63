
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash } from 'lucide-react';
import { Quote } from '@/services/supabase/quotes';
import { formatCurrency } from '@/lib/utils';

interface QuoteTableRowProps {
  quote: Quote;
  onEdit: (quote: Quote) => void;
  onDelete: (quote: Quote) => void;
}

export const QuoteTableRow = ({ quote, onEdit, onDelete }: QuoteTableRowProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Brouillon':
        return 'bg-gray-100 text-gray-800';
      case 'Envoyé':
        return 'bg-blue-100 text-blue-800';
      case 'Accepté':
        return 'bg-green-100 text-green-800';
      case 'Refusé':
        return 'bg-red-100 text-red-800';
      case 'Expiré':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{quote.reference}</TableCell>
      <TableCell>{formatDate(quote.created_at)}</TableCell>
      <TableCell>
        {quote.clients 
          ? `${quote.clients.first_name} ${quote.clients.last_name}`
          : '-'
        }
      </TableCell>
      <TableCell>
        {quote.vehicles 
          ? `${quote.vehicles.brand} ${quote.vehicles.model} - ${quote.vehicles.license_plate}`
          : '-'
        }
      </TableCell>
      <TableCell>{formatCurrency(quote.amount || 0)}</TableCell>
      <TableCell>
        <Badge className={getStatusColor(quote.status || 'Brouillon')}>
          {quote.status || 'Brouillon'}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(quote)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-red-500 hover:text-red-700"
            onClick={() => onDelete(quote)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

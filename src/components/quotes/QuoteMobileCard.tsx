import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash, Download, Printer, Mail, FileCheck, ArrowRight, Calendar, User, Car, Euro } from 'lucide-react';
import { Quote } from '@/services/supabase/quotes';
import { StatusBadge } from '@/components/ui/status-badge';
import { calculateGlobalTotals } from '@/components/quotes/form/utils/calculations';

interface QuoteMobileCardProps {
  quote: Quote;
  onViewQuote: (quote: Quote) => void;
  onEditQuote: (quote: Quote) => void;
  onDeleteQuote: (id: string) => void;
  onDownload: (quote: Quote) => void;
  onPrint: (quote: Quote) => void;
  onSendEmail: (quote: Quote) => void;
  onRequestDocuments?: (quote: Quote) => void;
  onConvertToRepairOrder?: (quote: Quote) => void;
}

const QuoteMobileCard: React.FC<QuoteMobileCardProps> = ({
  quote,
  onViewQuote,
  onEditQuote,
  onDeleteQuote,
  onDownload,
  onPrint,
  onSendEmail,
  onRequestDocuments,
  onConvertToRepairOrder
}) => {
  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '-';
    return amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }) + ' €';
  };

  const calculateQuoteAmount = (quote: Quote): number => {
    let repairs = [];
    let parts = [];
    let discounts = [];

    try {
      if (quote.repairs_data && typeof quote.repairs_data === 'string') {
        repairs = JSON.parse(quote.repairs_data);
      } else if (Array.isArray(quote.repairs_data)) {
        repairs = quote.repairs_data;
      }
    } catch (error) {
      repairs = [];
    }

    try {
      if (quote.parts_data && typeof quote.parts_data === 'string') {
        parts = JSON.parse(quote.parts_data);
      } else if (Array.isArray(quote.parts_data)) {
        parts = quote.parts_data;
      }
    } catch (error) {
      parts = [];
    }

    try {
      if ((quote as any).discounts_data && typeof (quote as any).discounts_data === 'string') {
        discounts = JSON.parse((quote as any).discounts_data);
      } else if (Array.isArray((quote as any).discounts_data)) {
        discounts = (quote as any).discounts_data;
      }
    } catch (error) {
      discounts = [];
    }

    if (repairs.length > 0 || parts.length > 0) {
      const totals = calculateGlobalTotals(repairs, parts, discounts);
      return totals.total;
    }

    return quote.amount || 0;
  };

  return (
    <div className="card-container p-4 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{quote.reference}</h3>
          <p className="text-sm text-gray-500">
            <Calendar className="h-4 w-4 inline mr-1" />
            {new Date(quote.created_at).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <StatusBadge status={quote.status === 'draft' ? 'En attente' : (quote.status || 'En attente')} />
      </div>

      {/* Client and Vehicle Info */}
      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <User className="h-4 w-4 mr-2 text-gray-400" />
          <span>
            {quote.clients 
              ? `${quote.clients.first_name} ${quote.clients.last_name}` 
              : '-'
            }
          </span>
        </div>
        
        <div className="flex items-center text-sm">
          <Car className="h-4 w-4 mr-2 text-gray-400" />
          <span>
            {quote.vehicles 
              ? `${quote.vehicles.car_brands?.name || 'Marque inconnue'} ${quote.vehicles.car_models?.name || 'Modèle inconnu'} - ${quote.vehicles.license_plate}`
              : '-'
            }
          </span>
        </div>

        <div className="flex items-center text-sm font-medium">
          <Euro className="h-4 w-4 mr-2 text-gray-400" />
          <span>{formatAmount(calculateQuoteAmount(quote))}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-1.5 pt-3 border-t">
        {/* Primary Actions */}
        <Button variant="view" size="sm" onClick={() => onViewQuote(quote)} className="flex-1 min-w-[80px]">
          <Eye className="h-3 w-3 mr-1" />
          Voir
        </Button>
        <Button variant="edit" size="sm" onClick={() => onEditQuote(quote)} className="flex-1 min-w-[80px]">
          <Pencil className="h-3 w-3 mr-1" />
          Modifier
        </Button>
        
        {/* Secondary Actions */}
        <Button variant="download" size="sm" onClick={() => onDownload(quote)} className="min-w-[100px]">
          <Download className="h-3 w-3 mr-1" />
          Télécharger
        </Button>
        <Button variant="print" size="sm" onClick={() => onPrint(quote)} className="min-w-[90px]">
          <Printer className="h-3 w-3 mr-1" />
          Imprimer
        </Button>
        <Button variant="send" size="sm" onClick={() => onSendEmail(quote)} className="min-w-[80px]">
          <Mail className="h-3 w-3 mr-1" />
          E-mail
        </Button>
        
        {/* Conditional Actions */}
        {onRequestDocuments && (
          <Button variant="create" size="sm" onClick={() => onRequestDocuments(quote)} className="min-w-[100px]">
            <FileCheck className="h-3 w-3 mr-1" />
            Justificatifs
          </Button>
        )}
        {onConvertToRepairOrder && (
          <Button variant="validation" size="sm" onClick={() => onConvertToRepairOrder(quote)} className="min-w-[90px]">
            <ArrowRight className="h-3 w-3 mr-1" />
            Convertir
          </Button>
        )}
        
        {/* Destructive Action */}
        <Button variant="delete" size="sm" onClick={() => onDeleteQuote(quote.id)} className="min-w-[90px]">
          <Trash className="h-3 w-3 mr-1" />
          Supprimer
        </Button>
      </div>
    </div>
  );
};

export default QuoteMobileCard;
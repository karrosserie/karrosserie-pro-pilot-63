import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Archive, Download, Printer, Mail, FileCheck, ArrowRight, Calendar, User, Car, Euro } from 'lucide-react';
import { Quote } from '@/services/supabase/quotes';
import { StatusBadge } from '@/components/ui/status-badge';
import { calculateGlobalTotals } from '@/components/quotes/form/utils/calculations';
import { getClientDisplayName } from '@/utils/clientDisplayUtils';
import { EmailSentBadge } from '@/components/ui/email-sent-badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface QuoteMobileCardProps {
  quote: Quote;
  onViewQuote: (quote: Quote) => void;
  onEditQuote: (quote: Quote) => void;
  onArchiveQuote: (id: string) => void;
  onDownload: (quote: Quote) => void;
  onPrint: (quote: Quote) => void;
  onSendEmail: (quote: Quote) => void;
  onRequestDocuments?: (quote: Quote) => void;
  onConvertToRepairOrder?: (quote: Quote) => void;
  showConvertHelp?: boolean;
}

const QuoteMobileCard: React.FC<QuoteMobileCardProps> = ({
  quote,
  onViewQuote,
  onEditQuote,
  onArchiveQuote,
  onDownload,
  onPrint,
  onSendEmail,
  onRequestDocuments,
  onConvertToRepairOrder,
  showConvertHelp = false
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
    <TooltipProvider>
    <div className="card-container p-3 sm:p-4 space-y-3 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{quote.reference}</h3>
            {(quote as any).email_sent && <EmailSentBadge />}
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
            {new Date(quote.created_at).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <StatusBadge status={quote.status === 'draft' ? 'En attente' : (quote.status || 'En attente')} />
      </div>

      {/* Client and Vehicle Info */}
      <div className="space-y-2">
        <div className="flex items-center text-xs sm:text-sm">
          <User className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate">
            {quote.clients ? getClientDisplayName(quote.clients) : '-'}
          </span>
        </div>
        
        <div className="flex items-center text-xs sm:text-sm">
          <Car className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate">
            {quote.vehicles 
              ? `${quote.vehicles.car_brands?.name || 'Marque inconnue'} ${quote.vehicles.car_models?.name || 'Modèle inconnu'} - ${quote.vehicles.license_plate}`
              : '-'
            }
          </span>
        </div>

        <div className="flex items-center text-xs sm:text-sm font-medium">
          <Euro className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-400 flex-shrink-0" />
          <span>{formatAmount(calculateQuoteAmount(quote))}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 xs:flex xs:flex-wrap gap-1.5 pt-3 border-t">
        {/* Primary Actions */}
        <Button variant="view" size="sm" onClick={() => onViewQuote(quote)} className="text-xs h-8 justify-center">
          <Eye className="h-3 w-3 mr-1" />
          <span className="hidden xs:inline">Voir</span>
          <span className="xs:hidden">Vue</span>
        </Button>
        <Button variant="edit" size="sm" onClick={() => onEditQuote(quote)} className="text-xs h-8 justify-center">
          <Pencil className="h-3 w-3 mr-1" />
          <span className="hidden xs:inline">Modifier</span>
          <span className="xs:hidden">Edit</span>
        </Button>
        
        {/* Secondary Actions */}
        <Button variant="download" size="sm" onClick={() => onDownload(quote)} className="text-xs h-8 justify-center">
          <Download className="h-3 w-3 mr-1" />
          <span className="hidden xs:inline">Télécharger</span>
          <span className="xs:hidden">DL</span>
        </Button>
        <Button variant="print" size="sm" onClick={() => onPrint(quote)} className="text-xs h-8 justify-center">
          <Printer className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Imprimer</span>
          <span className="sm:hidden">Print</span>
        </Button>
        <Button variant="send" size="sm" onClick={() => onSendEmail(quote)} className="text-xs h-8 justify-center">
          <Mail className="h-3 w-3 mr-1" />
          <span className="hidden xs:inline">E-mail</span>
          <span className="xs:hidden">Mail</span>
        </Button>
        
        {/* Conditional Actions */}
        {onRequestDocuments && (
          <Button variant="create" size="sm" onClick={() => onRequestDocuments(quote)} className="text-xs h-8 justify-center">
            <FileCheck className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Justificatifs</span>
            <span className="sm:hidden">Docs</span>
          </Button>
        )}
        {onConvertToRepairOrder && (
          <Button 
            variant="validation" 
            size="sm" 
            onClick={() => onConvertToRepairOrder(quote)} 
            className={`text-xs h-8 justify-center ${showConvertHelp ? 'animate-blink-bright shadow-lg ring-2 ring-primary ring-offset-2' : ''}`}
          >
            <ArrowRight className="h-3 w-3 mr-1" />
            <span className="hidden xs:inline">Convertir</span>
            <span className="xs:hidden">Conv.</span>
          </Button>
        )}
        
        {/* Destructive Action */}
        <Button variant="secondary" size="sm" onClick={() => onArchiveQuote(quote.id)} className="text-xs h-8 justify-center col-span-2 xs:col-span-1">
          <Archive className="h-3 w-3 mr-1" />
          Archiver
        </Button>
      </div>
    </div>
    </TooltipProvider>
  );
};

export default QuoteMobileCard;
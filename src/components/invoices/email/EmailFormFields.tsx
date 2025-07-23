
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Paperclip, FileText } from 'lucide-react';
import { InvoiceEmailFormData } from './types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EmailFormFieldsProps {
  data: InvoiceEmailFormData;
  onChange: (field: keyof InvoiceEmailFormData, value: string) => void;
  isLoading: boolean;
  invoiceReference?: string;
  documentType?: 'invoice' | 'quote' | 'credit' | 'repair_order' | 'report';
  reportType?: 'monthly' | 'quarterly' | 'yearly' | 'fec' | 'csv' | 'excel';
  reportFromDate?: Date;
  reportToDate?: Date;
}

export const EmailFormFields = ({ data, onChange, isLoading, invoiceReference, documentType = 'invoice', reportType, reportFromDate, reportToDate }: EmailFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="to">Destinataire</Label>
        <Input
          id="to"
          type="email"
          value={data.to}
          onChange={(e) => onChange('to', e.target.value)}
          placeholder="email@exemple.com"
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <Label htmlFor="subject">Objet</Label>
        <Input
          id="subject"
          value={data.subject}
          onChange={(e) => onChange('subject', e.target.value)}
          placeholder="Objet de l'e-mail"
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={data.message}
          onChange={(e) => onChange('message', e.target.value)}
          placeholder="Contenu du message..."
          rows={8}
          disabled={isLoading}
          required
        />
      </div>

      {/* Section Pièces jointes */}
      <div className="border rounded-lg p-4 bg-muted/50">
        <div className="flex items-center gap-2 mb-2">
          <Paperclip className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Pièce jointe</Label>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>
            {(() => {
              if (documentType === 'report' && reportFromDate && reportToDate) {
                // Utiliser la même logique de nommage que dans useReportEmail
                if (reportType === 'monthly' || reportType === 'quarterly' || reportType === 'yearly') {
                  const fromDateStr = format(reportFromDate, 'dd/MM/yyyy', { locale: fr });
                  const toDateStr = format(reportToDate, 'dd/MM/yyyy', { locale: fr });
                  const fileName = `${invoiceReference?.toLowerCase().replace(/\s+/g, '-')}-${fromDateStr.replace(/\//g, '-')}-${toDateStr.replace(/\//g, '-')}.pdf`;
                  return fileName;
                } else if (reportType === 'csv' || reportType === 'excel') {
                  const fromDateStr = format(reportFromDate, 'dd-MM-yyyy', { locale: fr });
                  const toDateStr = format(reportToDate, 'dd-MM-yyyy', { locale: fr });
                  return `export-comptable-${fromDateStr}-${toDateStr}.csv`;
                } else if (reportType === 'fec') {
                  const fromDateStr = format(reportFromDate, 'dd-MM-yyyy', { locale: fr });
                  const toDateStr = format(reportToDate, 'dd-MM-yyyy', { locale: fr });
                  return `export-fec-${fromDateStr}-${toDateStr}.txt`;
                }
                return `${invoiceReference || 'XXX'}.pdf`;
              }
              
              switch (documentType) {
                case 'quote': return `Devis_${invoiceReference || 'XXX'}.pdf`;
                case 'credit': return `Avoir_${invoiceReference || 'XXX'}.pdf`;
                case 'repair_order': return `Ordre_de_reparation_${invoiceReference || 'XXX'}.pdf`;
                default: return `Facture_${invoiceReference || 'XXX'}.pdf`;
              }
            })()}
          </span>
        </div>
      </div>
    </div>
  );
};

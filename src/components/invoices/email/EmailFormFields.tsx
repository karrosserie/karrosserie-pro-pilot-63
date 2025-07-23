
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Paperclip, FileText } from 'lucide-react';
import { InvoiceEmailFormData } from './types';

interface EmailFormFieldsProps {
  data: InvoiceEmailFormData;
  onChange: (field: keyof InvoiceEmailFormData, value: string) => void;
  isLoading: boolean;
  invoiceReference?: string;
  documentType?: 'invoice' | 'quote' | 'credit' | 'repair_order' | 'report';
  reportType?: 'monthly' | 'quarterly' | 'yearly' | 'fec' | 'csv' | 'excel';
}

export const EmailFormFields = ({ data, onChange, isLoading, invoiceReference, documentType = 'invoice', reportType }: EmailFormFieldsProps) => {
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
              if (documentType === 'report') {
                const extension = reportType === 'fec' ? 'txt' : (reportType === 'csv' || reportType === 'excel') ? 'csv' : 'pdf';
                return `${invoiceReference || 'XXX'}.${extension}`;
              }
              
              switch (documentType) {
                case 'quote': return `Devis_${invoiceReference || 'XXX'}.pdf`;
                case 'credit': return `Avoir_${invoiceReference || 'XXX'}.pdf`;
                case 'repair_order': return `Ordre_de_reparation_${invoiceReference || 'XXX'}.pdf`;
                default: return `Facture_${invoiceReference || 'XXX'}.pdf`;
              }
            })()}
          </span>
          <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            Générée automatiquement
          </span>
        </div>
      </div>
    </div>
  );
};

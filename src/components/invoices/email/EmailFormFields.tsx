
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { InvoiceEmailFormData } from './types';

interface EmailFormFieldsProps {
  data: InvoiceEmailFormData;
  onChange: (field: keyof InvoiceEmailFormData, value: string) => void;
  isLoading: boolean;
}

export const EmailFormFields = ({ data, onChange, isLoading }: EmailFormFieldsProps) => {
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
    </div>
  );
};

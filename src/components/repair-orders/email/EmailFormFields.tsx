
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { EmailFormData } from './types';

interface EmailFormFieldsProps {
  formData: EmailFormData;
  onUpdateFormData: (field: keyof EmailFormData, value: string) => void;
  disabled?: boolean;
}

const EmailFormFields: React.FC<EmailFormFieldsProps> = ({
  formData,
  onUpdateFormData,
  disabled = false
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="recipient">Destinataire *</Label>
        <Input
          id="recipient"
          type="email"
          value={formData.recipient}
          onChange={(e) => onUpdateFormData('recipient', e.target.value)}
          placeholder="email@exemple.com"
          disabled={disabled}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="subject">Sujet *</Label>
        <Input
          id="subject"
          type="text"
          value={formData.subject}
          onChange={(e) => onUpdateFormData('subject', e.target.value)}
          placeholder="Sujet de l'email"
          disabled={disabled}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => onUpdateFormData('message', e.target.value)}
          placeholder="Votre message..."
          rows={8}
          disabled={disabled}
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default EmailFormFields;

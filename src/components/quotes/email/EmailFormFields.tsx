
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmailFormData } from './types';

interface EmailFormFieldsProps {
  formData: EmailFormData;
  onUpdateFormData: (field: keyof EmailFormData, value: string) => void;
  disabled: boolean;
}

const EmailFormFields: React.FC<EmailFormFieldsProps> = ({
  formData,
  onUpdateFormData,
  disabled
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="recipient" className="text-sm font-medium">
          Destinataire <span className="text-red-500">*</span>
        </Label>
        <Input
          id="recipient"
          type="email"
          placeholder="email@exemple.com"
          value={formData.recipient}
          onChange={(e) => onUpdateFormData('recipient', e.target.value)}
          disabled={disabled}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-medium">
          Sujet <span className="text-red-500">*</span>
        </Label>
        <Input
          id="subject"
          placeholder="Sujet de l'e-mail"
          value={formData.subject}
          onChange={(e) => onUpdateFormData('subject', e.target.value)}
          disabled={disabled}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium">
          Message <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="message"
          placeholder="Votre message..."
          value={formData.message}
          onChange={(e) => onUpdateFormData('message', e.target.value)}
          disabled={disabled}
          rows={4}
        />
      </div>
    </div>
  );
};

export default EmailFormFields;


import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Paperclip, FileText } from 'lucide-react';
import { EmailFormData } from './types';

interface EmailFormFieldsProps {
  formData: EmailFormData;
  onUpdateFormData: (field: keyof EmailFormData, value: string) => void;
  disabled?: boolean;
  repairOrderReference?: string;
}

const EmailFormFields: React.FC<EmailFormFieldsProps> = ({
  formData,
  onUpdateFormData,
  disabled = false,
  repairOrderReference
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="recipient" required>Destinataire</Label>
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
        <Label htmlFor="subject" required>Sujet</Label>
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
        <Label htmlFor="message" required>Message</Label>
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

      {/* Section Pièces jointes */}
      <div className="border rounded-lg p-4 bg-muted/50">
        <div className="flex items-center gap-2 mb-2">
          <Paperclip className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Pièce jointe</Label>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>Ordre_de_reparation_{repairOrderReference || 'XXX'}.pdf</span>
          <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            Générée automatiquement
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmailFormFields;

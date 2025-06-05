
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DocumentUploader } from '@/components/shared/DocumentUploader';
import { Expense } from './types';

interface TypeProofFieldsProps {
  formData: Expense;
  onChange: (field: keyof Expense, value: any) => void;
}

export const TypeProofFields = ({ formData, onChange }: TypeProofFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label required>Type</Label>
        <RadioGroup 
          value={formData.type || 'Note de frais'} 
          onValueChange={(value) => onChange('type', value)}
          className="flex gap-6 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Note de frais" id="note-frais" />
            <Label htmlFor="note-frais">Note de frais</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Facture d'achat" id="facture-achat" />
            <Label htmlFor="facture-achat">Facture d'achat</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>Preuve d'achat</Label>
        <DocumentUploader
          documentType="expense-proof"
          documentId={formData.id || 'new-expense'}
          currentDocumentUrl={formData.proof_url || ''}
          onUploadComplete={(url) => onChange('proof_url', url)}
          isViewMode={false}
        />
      </div>
    </div>
  );
};

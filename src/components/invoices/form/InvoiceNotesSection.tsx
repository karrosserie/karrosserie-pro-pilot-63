import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface InvoiceNotesSectionProps {
  notes: string;
  onFieldChange: (field: string, value: any) => void;
  isReadOnly?: boolean;
}

export const InvoiceNotesSection = ({ 
  notes, 
  onFieldChange, 
  isReadOnly 
}: InvoiceNotesSectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <FileText className="h-5 w-5 mr-2" />
          Notes
        </CardTitle>
        <CardDescription>
          Notes et observations concernant la facture
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => onFieldChange('notes', e.target.value)}
            placeholder="Notes et observations concernant la facture..."
            rows={4}
            readOnly={isReadOnly}
          />
        </div>
      </CardContent>
    </Card>
  );
};
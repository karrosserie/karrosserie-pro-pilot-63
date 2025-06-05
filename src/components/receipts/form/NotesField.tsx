
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NotesFieldProps {
  notes: string;
  onChange: (value: string) => void;
}

export const NotesField = ({ notes, onChange }: NotesFieldProps) => {
  return (
    <div>
      <Label htmlFor="notes">Notes</Label>
      <Textarea
        id="notes"
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Informations complémentaires..."
        rows={3}
      />
    </div>
  );
};

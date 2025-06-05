
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BasicInfoFieldsProps {
  reference: string;
  date: string;
  onReferenceChange: (value: string) => void;
  onDateChange: (value: string) => void;
}

export const BasicInfoFields = ({
  reference,
  date,
  onReferenceChange,
  onDateChange
}: BasicInfoFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="reference">Référence</Label>
        <Input
          id="reference"
          value={reference}
          onChange={(e) => onReferenceChange(e.target.value)}
          placeholder="ENC2024-001"
        />
      </div>
      
      <div>
        <Label htmlFor="date" required>Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

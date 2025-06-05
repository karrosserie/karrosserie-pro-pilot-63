
import React from 'react';
import { Label } from '@/components/ui/label';
import { Receipt } from './types';

interface DateAmountFieldsProps {
  formData: Receipt;
  onChange: (field: keyof Receipt, value: any) => void;
}

export const DateAmountFields = ({ formData, onChange }: DateAmountFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date <span className="text-red-500">*</span>
        </label>
        <input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => onChange('date', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-karrosserie-orange focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Montant <span className="text-red-500">*</span>
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => onChange('amount', parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-karrosserie-orange focus:border-transparent"
          required
        />
      </div>
    </div>
  );
};


import React from 'react';
import { Receipt } from './types';

interface DateAmountFieldsProps {
  formData: Receipt;
  onChange: (field: keyof Receipt, value: any) => void;
}

export const DateAmountFields = ({ formData, onChange }: DateAmountFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      <div className="md:grid-col-2">
        <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-1">
          Méthode de paiement <span className="text-red-500">*</span>
        </label>
        <select
          id="payment_method"
          value={formData.payment_method}
          onChange={(e) => onChange('payment_method', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-karrosserie-orange focus:border-transparent"
          required
        >
          <option value="Virement">Virement</option>
          <option value="Chèque">Chèque</option>
          <option value="Espèces">Espèces</option>
          <option value="Carte bancaire">Carte bancaire</option>
          <option value="Argent mobile">Argent mobile</option>
          <option value="Paiement en ligne">Paiement en ligne</option>
          <option value="Autres">Autres</option>
        </select>
      </div>
    </div>
  );
};

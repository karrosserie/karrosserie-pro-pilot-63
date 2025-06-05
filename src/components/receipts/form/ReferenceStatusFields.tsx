
import React from 'react';
import { Receipt } from './types';

interface ReferenceStatusFieldsProps {
  formData: Receipt;
  onChange: (field: keyof Receipt, value: any) => void;
}

export const ReferenceStatusFields = ({ formData, onChange }: ReferenceStatusFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
          Référence
        </label>
        <input
          id="reference"
          value={formData.reference}
          onChange={(e) => onChange('reference', e.target.value)}
          placeholder="ENC2024-001"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-karrosserie-orange focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Statut <span className="text-red-500">*</span>
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => onChange('status', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-karrosserie-orange focus:border-transparent"
          required
        >
          <option value="En attente">En attente</option>
          <option value="Encaissé">Encaissé</option>
          <option value="Annulé">Annulé</option>
        </select>
      </div>
    </div>
  );
};


import React from 'react';
import { Receipt } from './types';

interface PaymentMethodFieldsProps {
  formData: Receipt;
  onChange: (field: keyof Receipt, value: any) => void;
}

export const PaymentMethodFields = ({ formData, onChange }: PaymentMethodFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
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

      <div>
        <label htmlFor="bank_account" className="block text-sm font-medium text-gray-700 mb-1">
          Compte bancaire <span className="text-red-500">*</span>
        </label>
        <select
          id="bank_account"
          value={formData.bank_account}
          onChange={(e) => onChange('bank_account', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-karrosserie-orange focus:border-transparent"
          required
        >
          <option value="Compte Principal">Compte Principal</option>
          <option value="Compte Épargne">Compte Épargne</option>
          <option value="Compte Professionnel">Compte Professionnel</option>
        </select>
      </div>
    </div>
  );
};

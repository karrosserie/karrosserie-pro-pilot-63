
import React, { useState, useEffect } from 'react';
import { InvoiceSelect } from './form/InvoiceSelect';
import { PaymentFields } from './form/PaymentFields';
import { NotesField } from './form/NotesField';
import MultiplePaymentProofs from './form/MultiplePaymentProofs';
import { FormActions } from './form/FormActions';
import { Receipt, ReceiptFormProps } from './form/types';

export const ReceiptForm = ({
  receipt,
  onSubmit,
  onCancel,
  isSubmitting
}: ReceiptFormProps) => {
  const [formData, setFormData] = useState<Receipt>({
    reference: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    status: 'En attente',
    invoice: '',
    payment_method: 'Virement',
    bank_account: 'Compte Principal',
    notes: '',
    payment_proofs: []
  });

  useEffect(() => {
    if (receipt) {
      setFormData(receipt);
    }
  }, [receipt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (field: keyof Receipt, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentProofsUpdate = (proofs: string[]) => {
    setFormData(prev => ({
      ...prev,
      payment_proofs: proofs
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InvoiceSelect
        value={formData.invoice}
        onChange={(value) => handleChange('invoice', value)}
      />

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date <span className="text-red-500">*</span>
        </label>
        <input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
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
          onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-karrosserie-orange focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-1">
          Méthode de paiement <span className="text-red-500">*</span>
        </label>
        <select
          id="payment_method"
          value={formData.payment_method}
          onChange={(e) => handleChange('payment_method', e.target.value)}
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
          onChange={(e) => handleChange('bank_account', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-karrosserie-orange focus:border-transparent"
          required
        >
          <option value="Compte Principal">Compte Principal</option>
          <option value="Compte Épargne">Compte Épargne</option>
          <option value="Compte Professionnel">Compte Professionnel</option>
        </select>
      </div>

      <div>
        <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
          Référence
        </label>
        <input
          id="reference"
          value={formData.reference}
          onChange={(e) => handleChange('reference', e.target.value)}
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
          onChange={(e) => handleChange('status', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-karrosserie-orange focus:border-transparent"
          required
        >
          <option value="En attente">En attente</option>
          <option value="Encaissé">Encaissé</option>
          <option value="Annulé">Annulé</option>
        </select>
      </div>

      <NotesField
        notes={formData.notes || ''}
        onChange={(value) => handleChange('notes', value)}
      />

      <MultiplePaymentProofs
        receiptId={formData.id || 'new-receipt'}
        paymentProofs={formData.payment_proofs || ['']}
        isViewMode={false}
        onProofAdd={(url) => {
          const currentProofs = formData.payment_proofs || [''];
          if (currentProofs[currentProofs.length - 1] === '') {
            const updatedProofs = [...currentProofs];
            updatedProofs[updatedProofs.length - 1] = url;
            handlePaymentProofsUpdate(updatedProofs);
          } else {
            handlePaymentProofsUpdate([...currentProofs, url]);
          }
        }}
        onProofRemove={(index) => {
          const currentProofs = formData.payment_proofs || [''];
          const updatedProofs = currentProofs.filter((_, i) => i !== index);
          if (updatedProofs.length === 0) {
            handlePaymentProofsUpdate(['']);
          } else {
            handlePaymentProofsUpdate(updatedProofs);
          }
        }}
        onProofUpdate={(index, url) => {
          const currentProofs = formData.payment_proofs || [''];
          const updatedProofs = [...currentProofs];
          updatedProofs[index] = url;
          handlePaymentProofsUpdate(updatedProofs);
        }}
      />

      <FormActions
        isSubmitting={isSubmitting}
        isEditMode={!!receipt}
        onCancel={onCancel}
      />
    </form>
  );
};

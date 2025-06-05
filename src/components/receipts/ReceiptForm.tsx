
import React, { useState, useEffect } from 'react';
import { InvoiceSelect } from './form/InvoiceSelect';
import { BasicInfoFields } from './form/BasicInfoFields';
import { PaymentFields } from './form/PaymentFields';
import { AmountAccountFields } from './form/AmountAccountFields';
import { NotesField } from './form/NotesField';
import { MultiplePaymentProofs } from './form/MultiplePaymentProofs';
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

      <PaymentFields
        status={formData.status}
        paymentMethod={formData.payment_method}
        bankAccount={formData.bank_account}
        onStatusChange={(value) => handleChange('status', value)}
        onPaymentMethodChange={(value) => handleChange('payment_method', value)}
        onBankAccountChange={(value) => handleChange('bank_account', value)}
      />

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

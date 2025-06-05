
import React, { useState, useEffect } from 'react';
import { InvoiceSelect } from './form/InvoiceSelect';
import { DateAmountFields } from './form/DateAmountFields';
import { PaymentMethodFields } from './form/PaymentMethodFields';
import { ReferenceStatusFields } from './form/ReferenceStatusFields';
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
    amount: '',
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

      <DateAmountFields
        formData={formData}
        onChange={handleChange}
      />

      <PaymentMethodFields
        formData={formData}
        onChange={handleChange}
      />

      <ReferenceStatusFields
        formData={formData}
        onChange={handleChange}
      />

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

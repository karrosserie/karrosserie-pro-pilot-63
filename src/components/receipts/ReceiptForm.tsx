
import React, { useState, useEffect } from 'react';
import { InvoiceSelect } from './form/InvoiceSelect';
import { BasicInfoFields } from './form/BasicInfoFields';
import { PaymentFields } from './form/PaymentFields';
import { AmountAccountFields } from './form/AmountAccountFields';
import { NotesField } from './form/NotesField';
import { PaymentProofsUpload } from './form/PaymentProofsUpload';
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setFormData(prev => ({
        ...prev,
        payment_proofs: [...(prev.payment_proofs || []), ...fileNames]
      }));
    }
  };

  const removeProof = (index: number) => {
    setFormData(prev => ({
      ...prev,
      payment_proofs: prev.payment_proofs?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InvoiceSelect
        value={formData.invoice}
        onChange={(value) => handleChange('invoice', value)}
      />

      <BasicInfoFields
        reference={formData.reference}
        date={formData.date}
        onReferenceChange={(value) => handleChange('reference', value)}
        onDateChange={(value) => handleChange('date', value)}
      />

      <PaymentFields
        status={formData.status}
        paymentMethod={formData.payment_method}
        onStatusChange={(value) => handleChange('status', value)}
        onPaymentMethodChange={(value) => handleChange('payment_method', value)}
      />

      <AmountAccountFields
        amount={formData.amount}
        bankAccount={formData.bank_account}
        onAmountChange={(value) => handleChange('amount', value)}
        onBankAccountChange={(value) => handleChange('bank_account', value)}
      />

      <NotesField
        notes={formData.notes || ''}
        onChange={(value) => handleChange('notes', value)}
      />

      <PaymentProofsUpload
        paymentProofs={formData.payment_proofs || []}
        onFileUpload={handleFileUpload}
        onRemoveProof={removeProof}
      />

      <FormActions
        isSubmitting={isSubmitting}
        isEditMode={!!receipt}
        onCancel={onCancel}
      />
    </form>
  );
};

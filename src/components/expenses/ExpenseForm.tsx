
import React, { useState, useEffect } from 'react';
import { BasicFields } from './form/BasicFields';
import { SupplierCategoryFields } from './form/SupplierCategoryFields';
import { DescriptionField } from './form/DescriptionField';
import { AmountStatusFields } from './form/AmountStatusFields';
import { PaymentFields } from './form/PaymentFields';
import { FormActions } from './form/FormActions';
import { Expense, ExpenseFormProps } from './form/types';

export const ExpenseForm = ({
  expense,
  onSubmit,
  onCancel,
  isSubmitting
}: ExpenseFormProps) => {
  const [formData, setFormData] = useState<Expense>({
    reference: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    status: 'En attente',
    supplier: '',
    category: 'Pièces détachées',
    payment_method: 'Virement',
    bank_account: 'Compte Principal',
    description: ''
  });

  useEffect(() => {
    if (expense) {
      setFormData(expense);
    }
  }, [expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (field: keyof Expense, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <BasicFields
        formData={formData}
        onChange={handleChange}
      />

      <SupplierCategoryFields
        formData={formData}
        onChange={handleChange}
      />

      <DescriptionField
        formData={formData}
        onChange={handleChange}
      />

      <AmountStatusFields
        formData={formData}
        onChange={handleChange}
      />

      <PaymentFields
        formData={formData}
        onChange={handleChange}
      />

      <FormActions
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        expense={expense}
      />
    </form>
  );
};

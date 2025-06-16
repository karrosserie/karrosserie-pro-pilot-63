import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { CreditBasicInfoSection } from './CreditBasicInfoSection';
import { CreditItemsSection } from './CreditItemsSection';
import { CreditTotalsSection } from './CreditTotalsSection';
import { useCreditFormState } from './hooks/useCreditFormState';
import { useCredits } from '@/hooks/use-credits';

interface CreditFormProps {
  onClose: () => void;
  preselectedInvoice?: { invoice_id: string; reference: string; status: string; amount: number; notes: string } | null;
}

export const CreditForm = ({ onClose, preselectedInvoice }: CreditFormProps) => {
  const { createCredit } = useCredits();
  const {
    formData,
    items,
    errors,
    handleChange,
    addItem,
    updateItem,
    removeItem,
    calculateTotal,
    setErrors,
    setFormData
  } = useCreditFormState();

  useEffect(() => {
    if (preselectedInvoice) {
      setFormData(prev => ({
        ...prev,
        invoice_id: preselectedInvoice.invoice_id,
        reference: preselectedInvoice.reference,
        status: preselectedInvoice.status,
        notes: preselectedInvoice.notes
      }));
    }
  }, [preselectedInvoice, setFormData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.invoice_id) {
      newErrors.invoice_id = 'La sélection d\'une facture est obligatoire';
    }

    if (items.length === 0) {
      newErrors.items = 'Au moins un article est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('Form data:', formData);
    console.log('Items:', items);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    const submitData = {
      reference: formData.reference,
      invoice_id: formData.invoice_id,
      status: formData.status,
      amount: calculateTotal(),
      items_data: JSON.stringify(items),
      notes: formData.notes || ''
    };

    console.log('Submitting credit data:', submitData);

    try {
      await createCredit.mutateAsync(submitData);
      console.log('Credit creation successful');
      onClose();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CreditBasicInfoSection
        formData={formData}
        errors={errors}
        onFieldChange={handleChange}
      />

      <CreditItemsSection
        items={items}
        onAddItem={addItem}
        onUpdateItem={updateItem}
        onRemoveItem={removeItem}
      />

      {errors.items && (
        <p className="text-sm text-red-500 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {errors.items}
        </p>
      )}

      <CreditTotalsSection items={items} />

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={createCredit.isPending}
          className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
        >
          {createCredit.isPending ? 'Création...' : 'Créer l\'avoir'}
        </Button>
      </div>
    </form>
  );
};

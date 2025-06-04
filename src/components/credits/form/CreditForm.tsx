
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditBasicInfoSection } from './CreditBasicInfoSection';
import { CreditItemsSection } from './CreditItemsSection';
import { useCreditFormState } from './hooks/useCreditFormState';
import { useToast } from '@/hooks/use-toast';
import { useCredits } from '@/hooks/use-credits';

interface CreditFormProps {
  onClose: () => void;
}

export const CreditForm = ({ onClose }: CreditFormProps) => {
  const { toast } = useToast();
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
    setErrors
  } = useCreditFormState();

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
    
    if (!validateForm()) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs dans le formulaire.",
        variant: "destructive"
      });
      return;
    }

    try {
      const creditData = {
        reference: formData.reference,
        invoice_id: formData.invoice_id,
        status: formData.status,
        amount: calculateTotal(),
        items_data: JSON.stringify(items),
        notes: formData.notes
      };

      await createCredit.mutateAsync(creditData);
      onClose();
    } catch (error) {
      console.error('Error creating credit:', error);
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
        calculateTotal={calculateTotal}
      />

      {errors.items && (
        <p className="text-sm text-red-500 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {errors.items}
        </p>
      )}

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button 
          type="submit" 
          className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
          disabled={createCredit.isPending}
        >
          {createCredit.isPending ? 'Création...' : 'Créer l\'avoir'}
        </Button>
      </div>
    </form>
  );
};

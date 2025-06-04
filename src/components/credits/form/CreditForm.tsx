
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { CreditBasicInfoSection } from './CreditBasicInfoSection';
import { CreditItemsSection } from './CreditItemsSection';
import { useCreditFormState } from './hooks/useCreditFormState';
import { useToast } from '@/hooks/use-toast';

interface CreditFormProps {
  onClose: () => void;
}

export const CreditForm = ({ onClose }: CreditFormProps) => {
  const { toast } = useToast();
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
      // Pour l'instant, on simule la création
      console.log('Creating credit with data:', {
        reference: formData.reference,
        invoice_id: formData.invoice_id,
        status: formData.status,
        amount: calculateTotal(),
        items_data: JSON.stringify(items),
        notes: formData.notes
      });

      toast({
        title: "Avoir créé",
        description: "L'avoir a été créé avec succès.",
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating credit:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'avoir.",
        variant: "destructive"
      });
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
        >
          Créer l'avoir
        </Button>
      </div>
    </form>
  );
};

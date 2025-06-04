
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditBasicInfoSection } from './CreditBasicInfoSection';
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

    if (!formData.reference.trim()) {
      newErrors.reference = 'La référence est obligatoire';
    }

    if (!formData.original_invoice_reference.trim()) {
      newErrors.original_invoice_reference = 'La référence de la facture d\'origine est obligatoire';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Le motif de l\'avoir est obligatoire';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs dans le formulaire.",
        variant: "destructive"
      });
      return;
    }

    // TODO: Implement actual creation logic
    console.log('Credit data:', { formData, items, total: calculateTotal() });
    
    toast({
      title: "Avoir créé",
      description: `L'avoir ${formData.reference} a été créé avec succès.`
    });
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CreditBasicInfoSection
        formData={formData}
        errors={errors}
        onFieldChange={handleChange}
      />

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
          Créer l'avoir
        </Button>
      </div>
    </form>
  );
};

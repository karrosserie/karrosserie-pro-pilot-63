
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useClients } from '@/hooks/use-clients';
import { Quote } from '@/services/supabase/quotes';
import { QuoteBasicInfoSection } from './form/QuoteBasicInfoSection';
import { QuoteAssignmentSection } from './form/QuoteAssignmentSection';
import { QuoteDetailsSection } from './form/QuoteDetailsSection';
import { QuoteRepairsSection } from './form/QuoteRepairsSection';
import { QuotePartsSection } from './form/QuotePartsSection';
import { QuoteFormActions } from './form/QuoteFormActions';
import { useQuoteFormLogic } from './form/useQuoteFormLogic';

interface QuoteFormProps {
  quote?: Quote | null;
  onSubmit: (formData: Partial<Quote>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const QuoteForm = ({
  quote,
  onSubmit,
  onCancel,
  isSubmitting
}: QuoteFormProps) => {
  const { toast } = useToast();
  const { clients, isLoading: isLoadingClients } = useClients();
  
  const {
    formData,
    repairs,
    parts,
    errors,
    isReadOnly,
    setRepairs,
    setParts,
    handleChange,
    validateForm,
    calculateGlobalTotals
  } = useQuoteFormLogic({ quote });

  const globalTotals = calculateGlobalTotals();

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
      // Inclure les données de réparations et pièces dans la soumission
      const submitData = {
        ...formData,
        repairs_data: JSON.stringify(repairs),
        parts_data: JSON.stringify(parts),
        total_amount: globalTotals.total
      };
      
      await onSubmit(submitData);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de ${quote ? 'mettre à jour' : 'créer'} le devis: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const clientOptions = clients?.filter(client => !!client) || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Élément invisible pour capturer le focus initial */}
      <div 
        tabIndex={0} 
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          width: '1px', 
          height: '1px', 
          opacity: 0 
        }}
        onFocus={(e) => e.target.blur()}
      />
      
      <QuoteBasicInfoSection 
        formData={formData}
        errors={errors}
        onFieldChange={handleChange}
      />

      <QuoteAssignmentSection 
        formData={formData}
        onFieldChange={handleChange}
        clientOptions={clientOptions}
        isLoadingClients={isLoadingClients}
      />

      <QuoteDetailsSection 
        formData={formData}
        onFieldChange={handleChange}
        globalTotals={globalTotals}
      />

      <QuoteRepairsSection 
        repairs={repairs}
        onRepairsChange={setRepairs}
        isReadOnly={isReadOnly}
      />

      <QuotePartsSection 
        parts={parts}
        onPartsChange={setParts}
        isReadOnly={isReadOnly}
      />

      <QuoteFormActions 
        quote={quote}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
};

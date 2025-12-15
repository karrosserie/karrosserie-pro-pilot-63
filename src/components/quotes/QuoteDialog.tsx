
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuoteForm } from '@/components/quotes/QuoteForm';
import { useQuotes } from '@/hooks/use-quotes';
import { Quote } from '@/services/supabase/quotes';
import { useToast } from '@/hooks/use-toast';

interface QuoteDialogProps {
  quote?: Quote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillData?: any;
}

const QuoteDialog = ({
  quote,
  open,
  onOpenChange,
  prefillData
}: QuoteDialogProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { updateQuote, createQuote } = useQuotes();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Déterminer si c'est une conversion depuis un rapport d'expertise
  const isConversionFromReport = prefillData?.report_number;
  // Déterminer si c'est une modification (devis existant avec ID)
  const isEditing = quote && quote.id;

  const handleSubmit = async (formData: Partial<Quote>) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      let createdQuote;
      
      if (quote && quote.id) {
        await updateQuote.mutateAsync({ id: quote.id, data: formData });
      } else {
        createdQuote = await createQuote.mutateAsync(formData as any);
      }
      
      onOpenChange(false);
      
      if (isConversionFromReport && createdQuote) {
        setTimeout(() => {
          navigate(`/documents/devis?openQuote=${createdQuote.id}`);
        }, 100);
      }
    } catch (error: any) {
      // Error handled by mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={!isSubmitting ? onOpenChange : undefined}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto p-3 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            {isEditing 
              ? "Modifier le devis" 
              : isConversionFromReport 
                ? "Convertir en devis" 
                : "Créer un nouveau devis"
            }
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {isEditing
              ? "Modifiez les détails du devis."
              : isConversionFromReport
                ? "Convertissez ce rapport d'expertise en devis en ajustant les informations si nécessaire."
                : "Créez un nouveau devis en remplissant les informations ci-dessous."
            }
          </DialogDescription>
        </DialogHeader>
        
        <QuoteForm
          quote={quote}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          prefillData={prefillData}
          isConversionFromReport={isConversionFromReport}
        />
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDialog;

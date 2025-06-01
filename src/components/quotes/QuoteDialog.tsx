
import React, { useState } from 'react';
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
}

const QuoteDialog = ({
  quote,
  open,
  onOpenChange
}: QuoteDialogProps) => {
  const { toast } = useToast();
  const { updateQuote, createQuote } = useQuotes();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: Partial<Quote>) => {
    setIsSubmitting(true);
    
    try {
      if (quote && quote.id) {
        await updateQuote.mutateAsync({ id: quote.id, data: formData });
        toast({
          title: "Devis mis à jour",
          description: "Le devis a été mis à jour avec succès."
        });
      } else {
        await createQuote.mutateAsync(formData as any);
        toast({
          title: "Devis créé",
          description: "Le nouveau devis a été créé avec succès."
        });
      }
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de ${quote ? 'mettre à jour' : 'créer'} le devis: ${error.message}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={!isSubmitting ? onOpenChange : undefined}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {quote ? `Modifier le devis - ${quote.reference}` : "Créer un nouveau devis"}
          </DialogTitle>
          <DialogDescription>
            {quote
              ? "Modifiez les détails du devis."
              : "Créez un nouveau devis en remplissant les informations ci-dessous."
            }
          </DialogDescription>
        </DialogHeader>
        
        <QuoteForm
          quote={quote}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDialog;

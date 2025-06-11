
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
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
    if (isSubmitting) return; // Prevent multiple submissions
    
    setIsSubmitting(true);
    
    try {
      if (quote && quote.id) {
        await updateQuote.mutateAsync({ id: quote.id, data: formData });
      } else {
        await createQuote.mutateAsync(formData as any);
      }
      onOpenChange(false);
      // Don't show toast here as it's already handled in the hooks
    } catch (error: any) {
      // Only show error toast here, success toasts are handled in hooks
      console.error('Dialog submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={!isSubmitting ? onOpenChange : undefined}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
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
        
        <div className="flex-1 overflow-hidden min-h-0">
          <ScrollArea className="h-full pr-4">
            <QuoteForm
              quote={quote}
              onSubmit={handleSubmit}
              onCancel={() => onOpenChange(false)}
              isSubmitting={isSubmitting}
            />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDialog;

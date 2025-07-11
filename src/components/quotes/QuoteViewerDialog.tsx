import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Quote } from '@/services/supabase/quotes';
import QuoteViewer from '@/components/pdf/QuoteViewer';

interface QuoteViewerDialogProps {
  quote: Quote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuoteViewerDialog: React.FC<QuoteViewerDialogProps> = ({
  quote,
  open,
  onOpenChange,
}) => {
  if (!quote) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Visualisation du devis {quote.reference}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <QuoteViewer />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteViewerDialog;
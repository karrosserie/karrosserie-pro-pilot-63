import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Quote } from '@/services/supabase/quotes';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { Invoice } from '@/services/supabase/invoices';
import { Cession } from '@/services/supabase/cessions';
import QuoteViewerModal from '@/components/quotes/QuoteViewerModal';
import RepairOrderViewerModal from '@/components/repair-orders/RepairOrderViewerModal';
import InvoiceViewerModal from '@/components/invoices/InvoiceViewerModal';
import { CessionPreview } from '@/components/cessions/CessionPreview';
import { ExpertisePreviewContent } from './ExpertisePreviewContent';
import { FleetReservationPreviewContent } from './FleetReservationPreviewContent';

export type DocumentType = 'expertise' | 'quote' | 'repair_order' | 'invoice' | 'cession' | 'fleet';

interface DocumentPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: DocumentType;
  data: any;
}

export const DocumentPreviewModal = ({ 
  open, 
  onOpenChange, 
  type, 
  data 
}: DocumentPreviewModalProps) => {
  // For document types that have their own viewer modals, use them directly
  // This ensures 100% CTA parity with the main Documents module
  
  switch (type) {
    case 'quote':
      return (
        <QuoteViewerModal
          quote={data as Quote}
          open={open}
          onOpenChange={onOpenChange}
        />
      );
    
    case 'repair_order':
      return (
        <RepairOrderViewerModal
          repairOrder={data as RepairOrder}
          open={open}
          onOpenChange={onOpenChange}
        />
      );
    
    case 'invoice':
      return (
        <InvoiceViewerModal
          invoice={data as Invoice}
          open={open}
          onOpenChange={onOpenChange}
        />
      );
    
    case 'cession':
      return (
        <CessionPreview
          cession={data as Cession}
          open={open}
          onOpenChange={onOpenChange}
        />
      );
    
    case 'expertise':
      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Rapport d'expertise</DialogTitle>
              <VisuallyHidden>
                <DialogDescription>Aperçu du rapport d'expertise</DialogDescription>
              </VisuallyHidden>
            </DialogHeader>
            <ExpertisePreviewContent data={data} onClose={() => onOpenChange(false)} />
          </DialogContent>
        </Dialog>
      );
    
    case 'fleet':
      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Réservation véhicule de remplacement</DialogTitle>
              <VisuallyHidden>
                <DialogDescription>Aperçu de la réservation</DialogDescription>
              </VisuallyHidden>
            </DialogHeader>
            <FleetReservationPreviewContent data={data} onClose={() => onOpenChange(false)} />
          </DialogContent>
        </Dialog>
      );
    
    default:
      return null;
  }
};

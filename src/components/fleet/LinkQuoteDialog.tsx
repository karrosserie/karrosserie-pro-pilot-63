import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { quotesService } from '@/services/supabase/quotes';
import { fleetReservationsService } from '@/services/supabase/fleet-reservations';
import { useFleetReservations } from '@/hooks/use-fleet-reservations';
import { FileText, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface LinkQuoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reservationId: string | null;
  clientId: string | null;
}

const LinkQuoteDialog: React.FC<LinkQuoteDialogProps> = ({
  isOpen,
  onClose,
  reservationId,
  clientId,
}) => {
  const { toast } = useToast();
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const { updateReservation } = useFleetReservations();

  // Fetch quotes for this client
  const { data: allQuotes, isLoading: isLoadingQuotes } = useQuery({
    queryKey: ['quotes'],
    queryFn: () => quotesService.getAll(),
    enabled: isOpen && !!clientId,
  });

  // Filter quotes for this client
  const clientQuotes = allQuotes?.filter(q => q.client_id === clientId) || [];

  const handleLink = async () => {
    if (!reservationId || !selectedQuoteId) return;

    setIsLinking(true);
    try {
      await updateReservation.mutateAsync({
        id: reservationId,
        data: { quote_id: selectedQuoteId },
      });

      toast({
        title: 'Devis associé',
        description: 'Le devis a été lié au prêt avec succès.',
      });

      onClose();
    } catch (error) {
      console.error('Error linking quote:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de lier le devis au prêt.',
        variant: 'destructive',
      });
    } finally {
      setIsLinking(false);
    }
  };

  const handleClose = () => {
    setSelectedQuoteId(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Associer un devis au prêt</DialogTitle>
          <DialogDescription>
            Sélectionnez un devis du client pour l'associer à ce prêt de véhicule.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoadingQuotes ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Chargement des devis...
            </p>
          ) : clientQuotes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucun devis trouvé pour ce client.
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {clientQuotes.map((quote) => (
                <div
                  key={quote.id}
                  onClick={() => setSelectedQuoteId(quote.id)}
                  className={`
                    flex items-center justify-between p-3 rounded-lg border cursor-pointer
                    transition-colors
                    ${selectedQuoteId === quote.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-muted/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{quote.reference}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(quote.created_at), 'dd MMM yyyy', { locale: fr })}
                        {quote.amount && ` • ${quote.amount.toFixed(2)} €`}
                      </p>
                    </div>
                  </div>
                  {selectedQuoteId === quote.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button
            onClick={handleLink}
            disabled={!selectedQuoteId || isLinking}
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
          >
            {isLinking ? 'Association...' : 'Associer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LinkQuoteDialog;

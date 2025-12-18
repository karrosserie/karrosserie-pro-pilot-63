import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Quote } from '@/services/supabase/quotes';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getClientDisplayName } from '@/utils/clientDisplayUtils';

interface QuoteConversionWarningDialogProps {
  open: boolean;
  onClose: () => void;
  unconvertedQuotes: Quote[];
}

export function QuoteConversionWarningDialog({
  open,
  onClose,
  unconvertedQuotes,
}: QuoteConversionWarningDialogProps) {
  const navigate = useNavigate();

  const handleViewQuotes = () => {
    onClose();
    navigate('/documents/devis');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-950 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <DialogTitle className="text-xl">
              Protection juridique : Devis en attente de conversion
            </DialogTitle>
          </div>
          <DialogDescription className="text-base leading-relaxed space-y-3 pt-2">
            <p>
              Vous avez <strong className="text-foreground">{unconvertedQuotes.length}</strong> devis{' '}
              {unconvertedQuotes.length > 1 ? 'créés' : 'créé'} depuis des rapports d'expertise qui{' '}
              {unconvertedQuotes.length > 1 ? 'ne sont' : "n'est"} pas encore{' '}
              {unconvertedQuotes.length > 1 ? 'convertis' : 'converti'} en ordres de réparation signés.
            </p>
            <div className="p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg">
              <p className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                ⚠️ IMPORTANT
              </p>
              <p className="text-orange-800 dark:text-orange-200">
                Un devis seul ne vous protège pas juridiquement en cas de litige. Seul un{' '}
                <strong>Ordre de Réparation signé par le client</strong> constitue une preuve
                d'engagement valable.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Nous vous recommandons de convertir ces devis en OR dès que possible.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <h4 className="font-semibold text-sm text-muted-foreground mb-3">
            Devis concernés :
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {unconvertedQuotes.map((quote) => (
              <div
                key={quote.id}
                className="p-3 bg-muted/50 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="font-medium">
                      Devis n°{quote.reference}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                    {quote.clients && (
                        <div>
                          Client : {getClientDisplayName(quote.clients)}
                        </div>
                      )}
                      {quote.vehicles && (
                        <div>
                          Véhicule : {quote.vehicles.license_plate}
                          {quote.vehicles.car_brands?.name && ` - ${quote.vehicles.car_brands.name}`}
                          {quote.vehicles.car_models?.name && ` ${quote.vehicles.car_models.name}`}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {quote.created_at && format(new Date(quote.created_at), 'dd/MM/yyyy', { locale: fr })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            Je comprends
          </Button>
          <Button onClick={handleViewQuotes}>
            Voir les devis
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

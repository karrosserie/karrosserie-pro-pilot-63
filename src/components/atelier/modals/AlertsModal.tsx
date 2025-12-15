import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bell, CheckCircle } from 'lucide-react';
import { Alert, Dossier, ALERT_CONFIG } from '@/types/atelier';

interface AlertsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alerts: Alert[];
  onSelectDossier: (dossier: Dossier) => void;
  formatCountdown: (ms: number) => string;
}

export const AlertsModal = ({ 
  open, 
  onOpenChange, 
  alerts, 
  onSelectDossier,
  formatCountdown 
}: AlertsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alertes
          </DialogTitle>
        </DialogHeader>

        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
            <p className="text-muted-foreground mt-4">Aucune alerte</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((a, i) => {
              const config = ALERT_CONFIG[a.type];
              const isUrgent = config.priority <= 1;
              const AlertIcon = config.Icon;
              
              return (
                <div
                  key={i}
                  onClick={() => {
                    onSelectDossier(a.dossier);
                    onOpenChange(false);
                  }}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    isUrgent 
                      ? 'bg-destructive/10 border-l-4 border-destructive hover:bg-destructive/20' 
                      : 'bg-orange-50 dark:bg-orange-950/30 border-l-4 border-orange-500 hover:bg-orange-100 dark:hover:bg-orange-950/50'
                  }`}
                >
                  <p className={`font-semibold flex items-center gap-2 ${config.color}`}>
                    <AlertIcon className="h-4 w-4" />
                    {config.label}
                  </p>
                  <p className="font-bold">{a.dossier.immatriculation}</p>
                  <p className="text-sm text-muted-foreground">
                    {a.dossier.prenom} {a.dossier.nom}
                  </p>
                  {a.countdown && (
                    <p className="font-mono text-sm mt-1">{formatCountdown(a.countdown)}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

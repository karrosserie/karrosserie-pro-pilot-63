import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
            🔔 Alertes
          </DialogTitle>
        </DialogHeader>

        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-5xl">✅</span>
            <p className="text-muted-foreground mt-4">Aucune alerte</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((a, i) => {
              const config = ALERT_CONFIG[a.type];
              const isUrgent = config.priority <= 1;
              
              return (
                <div
                  key={i}
                  onClick={() => {
                    onSelectDossier(a.dossier);
                    onOpenChange(false);
                  }}
                  className={`p-4 rounded-xl cursor-pointer transition-colors ${
                    isUrgent 
                      ? 'bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 hover:bg-red-100 dark:hover:bg-red-950/50' 
                      : 'bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 hover:bg-amber-100 dark:hover:bg-amber-950/50'
                  }`}
                >
                  <p className={`font-semibold ${config.color}`}>
                    {config.icon} {config.label}
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

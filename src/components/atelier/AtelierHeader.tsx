import { Button } from '@/components/ui/button';
import { Bell, Car, AlertTriangle, Wrench } from 'lucide-react';
import { Alert, ALERT_CONFIG } from '@/types/atelier';

interface AtelierHeaderProps {
  allAlerts: Alert[];
  onShowAlerts: () => void;
  onNewDossier: () => void;
}

export const AtelierHeader = ({ allAlerts, onShowAlerts, onNewDossier }: AtelierHeaderProps) => {
  const urgentAlertsCount = allAlerts.filter(a => ALERT_CONFIG[a.type].priority <= 1).length;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Wrench className="h-7 w-7 text-karrosserie-orange" />
            Gestion Atelier
          </h1>
          <p className="text-muted-foreground mt-1">Suivi des véhicules en réparation</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={onShowAlerts}
          >
            <Bell className="h-5 w-5" />
            {allAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {allAlerts.length}
              </span>
            )}
          </Button>
          <Button onClick={onNewDossier} className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
            <Car className="mr-2 h-4 w-4" />
            Nouveau
          </Button>
        </div>
      </div>

      {urgentAlertsCount > 0 && (
        <div 
          onClick={onShowAlerts} 
          className="mt-4 bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-destructive/20 transition-colors"
        >
          <AlertTriangle className="h-6 w-6 text-destructive animate-pulse" />
          <div>
            <p className="font-semibold text-destructive">
              {urgentAlertsCount} alerte{urgentAlertsCount > 1 ? 's' : ''} urgente{urgentAlertsCount > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

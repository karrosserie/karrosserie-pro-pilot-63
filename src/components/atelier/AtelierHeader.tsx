import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell, Car } from 'lucide-react';
import { Alert, ALERT_CONFIG } from '@/types/atelier';

interface AtelierHeaderProps {
  allAlerts: Alert[];
  onShowAlerts: () => void;
  onNewDossier: () => void;
}

export const AtelierHeader = ({ allAlerts, onShowAlerts, onNewDossier }: AtelierHeaderProps) => {
  const urgentAlertsCount = allAlerts.filter(a => ALERT_CONFIG[a.type].priority <= 1).length;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            🔧 Gestion Atelier
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
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {allAlerts.length}
              </span>
            )}
          </Button>
          <Button onClick={onNewDossier} className="bg-gradient-to-r from-karrosserie-orange to-orange-500">
            <Car className="mr-2 h-4 w-4" />
            Nouveau
          </Button>
        </div>
      </div>

      {urgentAlertsCount > 0 && (
        <div 
          onClick={onShowAlerts} 
          className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
        >
          <span className="text-3xl animate-bounce">🚨</span>
          <div>
            <p className="font-semibold text-red-600">
              {urgentAlertsCount} alerte{urgentAlertsCount > 1 ? 's' : ''} urgente{urgentAlertsCount > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

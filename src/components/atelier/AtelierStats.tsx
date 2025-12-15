import { Card } from '@/components/ui/card';
import { Dossier, Alert, STATUS_CONFIG, ALERT_CONFIG } from '@/types/atelier';

interface AtelierStatsProps {
  dossiers: Dossier[];
  allAlerts: Alert[];
}

export const AtelierStats = ({ dossiers, allAlerts }: AtelierStatsProps) => {
  const visibleStatuses = Object.entries(STATUS_CONFIG)
    .filter(([k]) => !['cloture', 'expertise_effectuee'].includes(k))
    .slice(0, 5);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      {visibleStatuses.map(([k, v]) => {
        const count = dossiers.filter(d => d.status === k).length;
        const hasUrgentAlert = allAlerts.some(
          a => a.dossier.status === k && ALERT_CONFIG[a.type].priority <= 1
        );
        
        return (
          <Card 
            key={k} 
            className={`p-3 ${hasUrgentAlert ? 'ring-2 ring-destructive' : ''}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground truncate">{v.label}</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
              <v.Icon className="h-6 w-6 text-muted-foreground" />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

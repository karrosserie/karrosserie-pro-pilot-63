import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  FolderOpen,
  Clock
} from 'lucide-react';
import { DossierWithDetails, DOSSIER_STATUS_CONFIG, DossierOverallStatus } from '@/types/dossier';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface DossierHistoryProps {
  dossier: DossierWithDetails;
}

export const DossierHistory = ({ dossier }: DossierHistoryProps) => {
  // For now, we show basic timeline based on available data
  // In a full implementation, this would fetch from an audit log table
  
  const historyEvents = [
    {
      id: 'created',
      type: 'creation',
      title: 'Dossier créé',
      date: dossier.created_at,
      status: 'ouvert' as DossierOverallStatus,
    },
    ...(dossier.updated_at && dossier.updated_at !== dossier.created_at ? [{
      id: 'updated',
      type: 'update',
      title: 'Dossier mis à jour',
      date: dossier.updated_at,
      status: dossier.overall_status as DossierOverallStatus,
    }] : []),
  ];

  // Sort by date descending
  const sortedEvents = historyEvents.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-6 text-foreground flex items-center gap-2">
        <History className="h-5 w-5 text-primary" />
        Historique du dossier
      </h3>

      {sortedEvents.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucun historique disponible</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />
          
          <div className="space-y-6">
            {sortedEvents.map((event, index) => {
              const statusConfig = event.status ? DOSSIER_STATUS_CONFIG[event.status] : null;
              
              return (
                <div key={event.id} className="relative flex gap-4 pl-10">
                  {/* Timeline dot */}
                  <div 
                    className={cn(
                      "absolute left-2 w-4 h-4 rounded-full border-2 bg-background",
                      index === 0 ? "border-primary" : "border-muted"
                    )}
                  />
                  
                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground">{event.title}</span>
                      {statusConfig && (
                        <Badge className={cn(statusConfig.bgColor, statusConfig.color, 'border-0 text-xs')}>
                          {statusConfig.label}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(event.date), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Note about full audit log */}
      <div className="mt-6 pt-4 border-t">
        <p className="text-xs text-muted-foreground italic">
          L'historique complet des modifications sera disponible prochainement.
        </p>
      </div>
    </Card>
  );
};

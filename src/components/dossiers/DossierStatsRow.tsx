import { Card } from '@/components/ui/card';
import { 
  FolderOpen, 
  Clock, 
  ClipboardCheck, 
  FileText, 
  Wrench, 
  Receipt 
} from 'lucide-react';
import { DOSSIER_STATUS_CONFIG, DossierOverallStatus } from '@/types/dossier';
import { cn } from '@/lib/utils';

interface DossierStatsRowProps {
  counts: Record<string, number>;
  isLoading?: boolean;
}

const STATS_CONFIG: Array<{
  status: DossierOverallStatus;
  icon: React.ElementType;
}> = [
  { status: 'ouvert', icon: FolderOpen },
  { status: 'en_cours', icon: Clock },
  { status: 'expertise', icon: ClipboardCheck },
  { status: 'devis', icon: FileText },
  { status: 'reparation', icon: Wrench },
  { status: 'facturation', icon: Receipt },
];

export const DossierStatsRow = ({ counts, isLoading }: DossierStatsRowProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {STATS_CONFIG.map(({ status, icon: Icon }) => {
        const config = DOSSIER_STATUS_CONFIG[status];
        const count = counts[status] || 0;
        
        return (
          <Card 
            key={status}
            className={cn(
              "p-4 flex items-center justify-between transition-shadow hover:shadow-md",
              "border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]"
            )}
          >
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">
                {config.label}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {isLoading ? '—' : count}
              </p>
            </div>
            <div className={cn(
              "p-2 rounded-lg",
              config.bgColor
            )}>
              <Icon className={cn("h-5 w-5", config.color)} />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

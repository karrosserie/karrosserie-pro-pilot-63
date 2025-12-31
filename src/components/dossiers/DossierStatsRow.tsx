import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { DOSSIER_STATUS_CONFIG, DossierOverallStatus } from '@/types/dossier';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface DossierStatsRowProps {
  counts: Record<string, number>;
  isLoading?: boolean;
  onStatusClick?: (status: DossierOverallStatus) => void;
}

const STATS_CONFIG: Array<{
  status: DossierOverallStatus;
}> = [
  { status: 'ouvert' },
  { status: 'en_cours' },
  { status: 'expertise' },
  { status: 'devis' },
  { status: 'reparation' },
  { status: 'facturation' },
];

export const DossierStatsRow = ({ counts, isLoading, onStatusClick }: DossierStatsRowProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4 border-border/60">
            <Skeleton className="h-4 w-16 mb-3" />
            <Skeleton className="h-8 w-8" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {STATS_CONFIG.map(({ status }) => {
        const config = DOSSIER_STATUS_CONFIG[status];
        const count = counts[status] || 0;
        
        return (
          <Card 
            key={status}
            onClick={() => onStatusClick?.(status)}
            className={cn(
              "p-4 flex items-center justify-between transition-all duration-200",
              "border-border/60 bg-card",
              "hover:border-[hsl(var(--karrosserie-orange))]/40 hover:shadow-md",
              onStatusClick && "cursor-pointer active:scale-[0.98]"
            )}
          >
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">
                {config.label}
              </p>
              <p className="text-3xl font-bold text-foreground tabular-nums">
                {count}
              </p>
            </div>
            <div className="text-muted-foreground/40">
              <FileText className="h-8 w-8" />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

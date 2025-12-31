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
import { Skeleton } from '@/components/ui/skeleton';

interface DossierStatsRowProps {
  counts: Record<string, number>;
  isLoading?: boolean;
  onStatusClick?: (status: DossierOverallStatus) => void;
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

export const DossierStatsRow = ({ counts, isLoading, onStatusClick }: DossierStatsRowProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-8 w-12" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {STATS_CONFIG.map(({ status, icon: Icon }) => {
        const config = DOSSIER_STATUS_CONFIG[status];
        const count = counts[status] || 0;
        
        return (
          <Card 
            key={status}
            onClick={() => onStatusClick?.(status)}
            className={cn(
              "p-4 flex items-center justify-between transition-all duration-200",
              "border hover:border-[hsl(var(--karrosserie-orange))/40]",
              "shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]",
              onStatusClick && "cursor-pointer active:scale-[0.98]"
            )}
          >
            <div className="space-y-0.5">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                {config.label}
              </p>
              {/* 32px numeric display per spec */}
              <p className="text-[32px] leading-tight font-bold text-foreground tabular-nums">
                {count}
              </p>
            </div>
            <div className={cn(
              "p-2.5 rounded-xl transition-transform",
              config.bgColor,
              onStatusClick && "group-hover:scale-110"
            )}>
              <Icon className={cn("h-6 w-6", config.color)} />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

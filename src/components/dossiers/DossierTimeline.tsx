import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FolderOpen, 
  ClipboardCheck, 
  FileText, 
  Wrench, 
  Receipt, 
  CheckCircle,
  Circle
} from 'lucide-react';
import { DossierWithDetails, DOSSIER_STATUS_CONFIG, DossierOverallStatus } from '@/types/dossier';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DossierTimelineProps {
  dossier: DossierWithDetails;
}

// Timeline steps configuration
const TIMELINE_STEPS = [
  { status: 'ouvert', label: 'Ouvert', icon: FolderOpen },
  { status: 'expertise', label: 'Expertise', icon: ClipboardCheck },
  { status: 'devis', label: 'Devis', icon: FileText },
  { status: 'reparation', label: 'Réparation', icon: Wrench },
  { status: 'facturation', label: 'Facturation', icon: Receipt },
  { status: 'cloture', label: 'Clôturé', icon: CheckCircle },
] as const;

const getStepIndex = (status: DossierOverallStatus | null): number => {
  if (!status) return 0;
  const statusMap: Record<string, number> = {
    'ouvert': 0,
    'en_cours': 1,
    'expertise': 1,
    'devis': 2,
    'reparation': 3,
    'facturation': 4,
    'cloture': 5,
    'archive': 5,
  };
  return statusMap[status] ?? 0;
};

export const DossierTimeline = ({ dossier }: DossierTimelineProps) => {
  const currentStepIndex = getStepIndex(dossier.overall_status as DossierOverallStatus | null);

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-6 text-foreground">Progression du dossier</h3>
      
      {/* Desktop Timeline */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />
          <div 
            className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
            style={{ width: `${(currentStepIndex / (TIMELINE_STEPS.length - 1)) * 100}%` }}
          />
          
          {/* Steps */}
          <div className="relative flex justify-between">
            {TIMELINE_STEPS.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const Icon = step.icon;
              
              return (
                <div key={step.status} className="flex flex-col items-center">
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                      isCompleted 
                        ? "bg-primary border-primary text-primary-foreground" 
                        : "bg-background border-muted text-muted-foreground",
                      isCurrent && "ring-4 ring-primary/20"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span 
                    className={cn(
                      "mt-2 text-sm font-medium",
                      isCompleted ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Mobile Timeline */}
      <div className="md:hidden space-y-4">
        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const Icon = step.icon;
          
          return (
            <div key={step.status} className="flex items-center gap-3">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0",
                  isCompleted 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : "bg-background border-muted text-muted-foreground",
                  isCurrent && "ring-2 ring-primary/20"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span 
                className={cn(
                  "text-sm font-medium",
                  isCompleted ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
              {isCurrent && (
                <Badge variant="outline" className="ml-auto text-xs">
                  Actuel
                </Badge>
              )}
            </div>
          );
        })}
      </div>

      {/* Linked Documents Summary */}
      <div className="mt-8 pt-6 border-t">
        <h4 className="font-medium text-sm text-muted-foreground mb-4">Documents liés</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dossier.expertise_reports && (
            <div className="text-center p-3 bg-[hsl(var(--status-expertise-bg))] rounded-lg">
              <ClipboardCheck className="h-5 w-5 mx-auto mb-1 text-[hsl(var(--status-expertise-text))]" />
              <p className="text-sm font-medium">{Array.isArray(dossier.expertise_reports) ? dossier.expertise_reports.length : 1}</p>
              <p className="text-xs text-muted-foreground">Expertise(s)</p>
            </div>
          )}
          {dossier.quotes && (
            <div className="text-center p-3 bg-[hsl(var(--status-devis-bg))] rounded-lg">
              <FileText className="h-5 w-5 mx-auto mb-1 text-[hsl(var(--status-devis-text))]" />
              <p className="text-sm font-medium">{Array.isArray(dossier.quotes) ? dossier.quotes.length : 1}</p>
              <p className="text-xs text-muted-foreground">Devis</p>
            </div>
          )}
          {dossier.repair_orders && (
            <div className="text-center p-3 bg-[hsl(var(--status-reparation-bg))] rounded-lg">
              <Wrench className="h-5 w-5 mx-auto mb-1 text-[hsl(var(--status-reparation-text))]" />
              <p className="text-sm font-medium">{Array.isArray(dossier.repair_orders) ? dossier.repair_orders.length : 1}</p>
              <p className="text-xs text-muted-foreground">OR</p>
            </div>
          )}
          {dossier.invoices && dossier.invoices.length > 0 && (
            <div className="text-center p-3 bg-[hsl(var(--status-facturation-bg))] rounded-lg">
              <Receipt className="h-5 w-5 mx-auto mb-1 text-[hsl(var(--status-facturation-text))]" />
              <p className="text-sm font-medium">{dossier.invoices.length}</p>
              <p className="text-xs text-muted-foreground">Facture(s)</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle, MessageSquare } from "lucide-react";

interface MessageriesHeaderProps {
  onQuickFilterUrgent?: () => void;
  onQuickFilterHigh?: () => void;
  onShowAll?: () => void;
  urgentCount?: number;
  highPriorityCount?: number;
  currentFilter?: string;
}

export function MessageriesHeader({ 
  onQuickFilterUrgent, 
  onQuickFilterHigh, 
  onShowAll,
  urgentCount = 0,
  highPriorityCount = 0,
  currentFilter = "all"
}: MessageriesHeaderProps) {
  return (
    <header className="relative mb-8 overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
      
      <div className="relative z-10 p-6 bg-card/80 backdrop-blur-sm border-2 border-primary/20 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <MessageSquare className="h-10 w-10 text-primary" />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Messageries
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Gérez vos communications clients en temps réel
            </p>
          </div>
          
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{urgentCount}</div>
              <div className="text-xs text-muted-foreground">Urgents</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{highPriorityCount}</div>
              <div className="text-xs text-muted-foreground">Haute</div>
            </div>
          </div>
        </div>
        
        {(onQuickFilterUrgent || onQuickFilterHigh || onShowAll) && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {onQuickFilterUrgent && (
              <Button size="sm" variant={currentFilter === "1" ? "default" : "outline"} onClick={onQuickFilterUrgent} className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                Urgents ({urgentCount})
              </Button>
            )}
            {onQuickFilterHigh && (
              <Button size="sm" variant={currentFilter === "2" ? "default" : "outline"} onClick={onQuickFilterHigh} className="gap-2">
                <AlertCircle className="h-4 w-4" />
                Haute priorité ({highPriorityCount})
              </Button>
            )}
            {onShowAll && (
              <Button size="sm" variant={currentFilter === "all" ? "default" : "outline"} onClick={onShowAll}>
                Tous
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle, MessageSquare } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
  const isMobile = useIsMobile();

  return (
    <header className="relative mb-4 sm:mb-8 overflow-hidden rounded-xl sm:rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
      
      <div className={cn(
        "relative z-10 bg-card/80 backdrop-blur-sm border-2 border-primary/20 shadow-xl",
        isMobile ? "p-4" : "p-6"
      )}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <MessageSquare className={cn(
              "text-primary",
              isMobile ? "h-6 w-6" : "h-10 w-10"
            )} />
            <div>
              <h1 className={cn(
                "font-bold text-foreground",
                isMobile ? "text-lg" : "text-2xl md:text-4xl"
              )}>
                Messageries
              </h1>
              {!isMobile && (
                <p className="text-muted-foreground text-sm md:text-lg">
                  Gérez vos communications clients en temps réel
                </p>
              )}
            </div>
          </div>
          
          {/* Compteurs urgents - toujours visibles */}
          <div className="flex gap-4">
            <div className="text-center">
              <div className={cn(
                "font-bold text-red-600 dark:text-red-400",
                isMobile ? "text-xl" : "text-3xl"
              )}>
                {urgentCount}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Urgents</div>
            </div>
            <div className="text-center">
              <div className={cn(
                "font-bold text-orange-600 dark:text-orange-400",
                isMobile ? "text-xl" : "text-3xl"
              )}>
                {highPriorityCount}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Haute</div>
            </div>
          </div>
        </div>
        
        {/* Boutons de filtre rapide - masqués sur mobile */}
        {!isMobile && (onQuickFilterUrgent || onQuickFilterHigh || onShowAll) && (
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

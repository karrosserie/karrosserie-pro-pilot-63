import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle } from "lucide-react";

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
    <header className="mb-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Historique des Communications Clients</h1>
        <p className="text-muted-foreground mb-4">
          Consultez l'historique complet de vos échanges clients
        </p>
        
        {(onQuickFilterUrgent || onQuickFilterHigh || onShowAll) && (
          <div className="flex gap-2 mt-4">
            {onQuickFilterUrgent && (
              <Button
                size="sm"
                variant={currentFilter === "1" ? "default" : "outline"}
                onClick={onQuickFilterUrgent}
                className="gap-2"
              >
                <AlertTriangle className="h-4 w-4" />
                Urgents ({urgentCount})
              </Button>
            )}
            
            {onQuickFilterHigh && (
              <Button
                size="sm"
                variant={currentFilter === "2" ? "default" : "outline"}
                onClick={onQuickFilterHigh}
                className="gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                Haute priorité ({highPriorityCount})
              </Button>
            )}
            
            {onShowAll && (
              <Button
                size="sm"
                variant={currentFilter === "all" ? "default" : "outline"}
                onClick={onShowAll}
              >
                Tous
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

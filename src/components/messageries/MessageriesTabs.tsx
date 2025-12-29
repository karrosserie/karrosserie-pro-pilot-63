import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MessageriesTabsProps {
  activeView: string;
  onViewChange: (value: string) => void;
  stats: {
    total: number;
    urgent: number;
    new: number;
    pending: number;
    resolved: number;
  };
}

export function MessageriesTabs({ activeView, onViewChange, stats }: MessageriesTabsProps) {
  const isMobile = useIsMobile();

  const tabs = [
    { value: "all", emoji: "📋", label: "Tous", count: stats.total, color: "" },
    { value: "urgent", emoji: "🔴", label: "Urgents", count: stats.urgent, color: "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800" },
    { value: "new", emoji: "🆕", label: "Nouveaux", count: stats.new, color: "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
    { value: "pending", emoji: "⏳", label: "En cours", count: stats.pending, color: "bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800" },
    { value: "resolved", emoji: "✅", label: "Résolus", count: stats.resolved, color: "bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800" },
  ];

  return (
    <Tabs value={activeView} onValueChange={onViewChange} className="mb-4 sm:mb-6">
      <TabsList className={cn(
        "h-auto",
        isMobile 
          ? "flex overflow-x-auto gap-1 w-full justify-start bg-transparent p-0" 
          : "grid w-full grid-cols-5"
      )}>
        {tabs.map(tab => (
          <TabsTrigger 
            key={tab.value}
            value={tab.value} 
            className={cn(
              "gap-1",
              isMobile && "flex-shrink-0 px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
            )}
          >
            <span className="flex items-center gap-1">
              <span>{tab.emoji}</span>
              {!isMobile && <span>{tab.label}</span>}
              <Badge 
                variant="secondary" 
                className={cn(
                  "ml-0.5 h-5 min-w-5 px-1 text-xs",
                  tab.color
                )}
              >
                {tab.count}
              </Badge>
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

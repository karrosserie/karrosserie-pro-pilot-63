import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
  return (
    <Tabs value={activeView} onValueChange={onViewChange} className="mb-6">
      <TabsList className="grid w-full grid-cols-5 h-auto">
        <TabsTrigger value="all" className="gap-2 flex-wrap">
          <span className="flex items-center gap-2">
            📋 Tous
            <Badge variant="secondary" className="ml-1">{stats.total}</Badge>
          </span>
        </TabsTrigger>
        <TabsTrigger value="urgent" className="gap-2 flex-wrap">
          <span className="flex items-center gap-2">
            🔴 Urgents
            <Badge className="bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 ml-1 border-red-200 dark:border-red-800">
              {stats.urgent}
            </Badge>
          </span>
        </TabsTrigger>
        <TabsTrigger value="new" className="gap-2 flex-wrap">
          <span className="flex items-center gap-2">
            🆕 Nouveaux
            <Badge className="bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 ml-1 border-blue-200 dark:border-blue-800">
              {stats.new}
            </Badge>
          </span>
        </TabsTrigger>
        <TabsTrigger value="pending" className="gap-2 flex-wrap">
          <span className="flex items-center gap-2">
            ⏳ En cours
            <Badge className="bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-400 ml-1 border-yellow-200 dark:border-yellow-800">
              {stats.pending}
            </Badge>
          </span>
        </TabsTrigger>
        <TabsTrigger value="resolved" className="gap-2 flex-wrap">
          <span className="flex items-center gap-2">
            ✅ Résolus
            <Badge className="bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 ml-1 border-green-200 dark:border-green-800">
              {stats.resolved}
            </Badge>
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

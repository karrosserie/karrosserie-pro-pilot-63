import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DossierFiltersProps {
  activeTab: 'tous' | 'actifs' | 'archives';
  onTabChange: (tab: 'tous' | 'actifs' | 'archives') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  tousCount: number;
  actifsCount: number;
  archivesCount: number;
}

export const DossierFilters = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  tousCount,
  actifsCount,
  archivesCount,
}: DossierFiltersProps) => {
  const tabs = [
    { id: 'tous' as const, label: 'Tous', count: tousCount },
    { id: 'actifs' as const, label: 'Actifs', count: actifsCount },
    { id: 'archives' as const, label: 'Archives', count: archivesCount },
  ];

  return (
    <div className="space-y-4">
      {/* Tab switcher - Figma style with bg-muted container */}
      <div className="inline-flex bg-muted p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
            )}
          >
            {tab.label}
            <Badge 
              variant="secondary" 
              className={cn(
                "h-5 min-w-5 px-1.5 text-xs",
                activeTab === tab.id 
                  ? "bg-muted text-muted-foreground" 
                  : "bg-muted-foreground/20"
              )}
            >
              {tab.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Search and filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par client, immatriculation, n° sinistre..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
      </div>
    </div>
  );
};

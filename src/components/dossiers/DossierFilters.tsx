import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, X } from 'lucide-react';
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Tab switcher */}
      <div className="inline-flex bg-muted p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            <Badge 
              variant="secondary" 
              className={cn(
                "h-5 min-w-[20px] px-1.5 text-xs font-medium",
                activeTab === tab.id 
                  ? "bg-primary/10 text-primary" 
                  : "bg-muted-foreground/10 text-muted-foreground"
              )}
            >
              {tab.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher client, immat., sinistre..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10 h-10 bg-background"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

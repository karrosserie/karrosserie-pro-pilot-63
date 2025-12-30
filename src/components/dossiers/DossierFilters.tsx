import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DossierFiltersProps {
  activeTab: 'en_cours' | 'clotures';
  onTabChange: (tab: 'en_cours' | 'clotures') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  enCoursCount: number;
  cloturesCount: number;
}

export const DossierFilters = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  enCoursCount,
  cloturesCount,
}: DossierFiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => onTabChange('en_cours')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
            activeTab === 'en_cours'
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          En cours
          <Badge 
            variant="secondary" 
            className={cn(
              "h-5 min-w-5 px-1.5",
              activeTab === 'en_cours' 
                ? "bg-primary-foreground/20 text-primary-foreground" 
                : ""
            )}
          >
            {enCoursCount}
          </Badge>
        </button>
        <button
          onClick={() => onTabChange('clotures')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
            activeTab === 'clotures'
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          Clôturées
          <Badge 
            variant="secondary" 
            className={cn(
              "h-5 min-w-5 px-1.5",
              activeTab === 'clotures' 
                ? "bg-primary-foreground/20 text-primary-foreground" 
                : ""
            )}
          >
            {cloturesCount}
          </Badge>
        </button>
      </div>

      {/* Search input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par client, immatriculation, n° sinistre..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

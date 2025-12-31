import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, X, Filter, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DossierOverallStatus, DOSSIER_STATUS_CONFIG } from '@/types/dossier';
import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';

interface DossierFiltersProps {
  activeTab: 'tous' | 'actifs' | 'archives';
  onTabChange: (tab: 'tous' | 'actifs' | 'archives') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  tousCount: number;
  actifsCount: number;
  archivesCount: number;
  selectedStatuses?: DossierOverallStatus[];
  onStatusFilterChange?: (statuses: DossierOverallStatus[]) => void;
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

const STATUS_FILTER_OPTIONS: DossierOverallStatus[] = [
  'ouvert', 'en_cours', 'expertise', 'devis', 'reparation', 'facturation'
];

export const DossierFilters = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  tousCount,
  actifsCount,
  archivesCount,
  selectedStatuses = [],
  onStatusFilterChange,
  dateRange,
  onDateRangeChange,
}: DossierFiltersProps) => {
  const [showStatusFilters, setShowStatusFilters] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const tabs = [
    { id: 'tous' as const, label: 'Tous', count: tousCount },
    { id: 'actifs' as const, label: 'Actifs', count: actifsCount },
    { id: 'archives' as const, label: 'Archives', count: archivesCount },
  ];

  const toggleStatus = (status: DossierOverallStatus) => {
    if (!onStatusFilterChange) return;
    if (selectedStatuses.includes(status)) {
      onStatusFilterChange(selectedStatuses.filter(s => s !== status));
    } else {
      onStatusFilterChange([...selectedStatuses, status]);
    }
  };

  const hasDateRange = dateRange?.from || dateRange?.to;

  return (
    <div className="space-y-4">
      {/* Main filters row */}
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
                    ? "bg-[hsl(var(--karrosserie-orange))]/10 text-[hsl(var(--karrosserie-orange))]" 
                    : "bg-muted-foreground/10 text-muted-foreground"
                )}
              >
                {tab.count}
              </Badge>
            </button>
          ))}
        </div>

        {/* Search, date range, and filter toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search input */}
          <div className="relative flex-1 sm:w-64">
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

          {/* Date range picker - per Figma spec */}
          {onDateRangeChange && (
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={hasDateRange ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-10 gap-2 min-w-[180px] justify-start font-normal",
                    hasDateRange && "bg-[hsl(var(--karrosserie-orange))] hover:bg-[hsl(var(--karrosserie-orange))]/90"
                  )}
                >
                  <CalendarIcon className="h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <span className="truncate">
                        {format(dateRange.from, 'dd/MM/yy', { locale: fr })} - {format(dateRange.to, 'dd/MM/yy', { locale: fr })}
                      </span>
                    ) : (
                      format(dateRange.from, 'dd MMM yyyy', { locale: fr })
                    )
                  ) : (
                    <span className="text-muted-foreground">Période</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    onDateRangeChange(range);
                    if (range?.from && range?.to) {
                      setDatePickerOpen(false);
                    }
                  }}
                  numberOfMonths={2}
                  locale={fr}
                  className="pointer-events-auto"
                />
                {hasDateRange && (
                  <div className="p-3 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        onDateRangeChange(undefined);
                        setDatePickerOpen(false);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Effacer les dates
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          )}

          {/* Filter toggle button */}
          {onStatusFilterChange && (
            <Button
              variant={showStatusFilters || selectedStatuses.length > 0 ? "default" : "outline"}
              size="icon"
              className={cn(
                "h-10 w-10 shrink-0 relative",
                (showStatusFilters || selectedStatuses.length > 0) && "bg-[hsl(var(--karrosserie-orange))] hover:bg-[hsl(var(--karrosserie-orange))]/90"
              )}
              onClick={() => setShowStatusFilters(!showStatusFilters)}
            >
              <Filter className="h-4 w-4" />
              {selectedStatuses.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">
                  {selectedStatuses.length}
                </span>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Status filter toggles - per Figma spec */}
      {showStatusFilters && onStatusFilterChange && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg border">
          <span className="text-xs font-medium text-muted-foreground mr-2 self-center">Filtrer par statut:</span>
          {STATUS_FILTER_OPTIONS.map((status) => {
            const config = DOSSIER_STATUS_CONFIG[status];
            const isSelected = selectedStatuses.includes(status);
            return (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  isSelected
                    ? "bg-[hsl(var(--karrosserie-orange))] text-white"
                    : cn(config.bgColor, config.color, "hover:opacity-80")
                )}
              >
                {config.label}
              </button>
            );
          })}
          {selectedStatuses.length > 0 && (
            <button
              onClick={() => onStatusFilterChange([])}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Effacer
            </button>
          )}
        </div>
      )}
    </div>
  );
};

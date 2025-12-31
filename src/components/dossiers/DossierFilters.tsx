import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, CalendarIcon, X } from 'lucide-react';
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
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const tabs = [
    { id: 'tous' as const, label: 'Tous', count: tousCount },
    { id: 'actifs' as const, label: 'Actifs', count: actifsCount },
    { id: 'archives' as const, label: 'Archives', count: archivesCount },
  ];

  const handleStatusChange = (value: string) => {
    if (!onStatusFilterChange) return;
    if (value === 'all') {
      onStatusFilterChange([]);
    } else {
      onStatusFilterChange([value as DossierOverallStatus]);
    }
  };

  const hasDateRange = dateRange?.from || dateRange?.to;
  const currentStatusValue = selectedStatuses.length === 1 ? selectedStatuses[0] : 'all';

  return (
    <div className="space-y-4">
      {/* Tabs - standalone, matching design */}
      <div className="inline-flex bg-muted rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-5 py-2 rounded-md text-sm font-medium transition-all duration-200",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters card - matching design */}
      <div className="bg-card border border-border/60 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search input with filter icon */}
          <div className="relative flex-1">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un dossier..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-10 bg-background border-border/60"
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

          {/* Status dropdown */}
          {onStatusFilterChange && (
            <Select value={currentStatusValue} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full sm:w-[180px] h-10 bg-background border-border/60">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {STATUS_FILTER_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {DOSSIER_STATUS_CONFIG[status].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Date picker */}
          {onDateRangeChange && (
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[160px] h-10 justify-start font-normal bg-background border-border/60",
                    hasDateRange && "text-foreground"
                  )}
                >
                  <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <span className="truncate">
                        {format(dateRange.from, 'dd/MM/yy', { locale: fr })} - {format(dateRange.to, 'dd/MM/yy', { locale: fr })}
                      </span>
                    ) : (
                      format(dateRange.from, 'dd/MM/yyyy', { locale: fr })
                    )
                  ) : (
                    <span className="text-muted-foreground">mm/dd/yyyy</span>
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
        </div>
      </div>
    </div>
  );
};

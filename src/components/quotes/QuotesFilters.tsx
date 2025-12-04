
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type QuoteSortOption = 'alphabetical-asc' | 'alphabetical-desc' | 'recent-first' | 'oldest-first';

const SORT_OPTIONS: { value: QuoteSortOption; label: string }[] = [
  { value: 'alphabetical-asc', label: 'Par ordre alphabétique (A → Z)' },
  { value: 'alphabetical-desc', label: 'Par ordre alphabétique (Z → A)' },
  { value: 'recent-first', label: 'Plus récents d\'abord' },
  { value: 'oldest-first', label: 'Plus anciens d\'abord' },
];

interface QuotesFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateQuote: () => void;
  sortOption: QuoteSortOption;
  onSortChange: (option: QuoteSortOption) => void;
}

export const QuotesFilters: React.FC<QuotesFiltersProps> = ({
  searchTerm,
  onSearchChange,
  onCreateQuote,
  sortOption,
  onSortChange,
}) => {
  const currentSortLabel = SORT_OPTIONS.find(opt => opt.value === sortOption)?.label || 'Trier par';

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
      <div className="flex-1" />
      
      <div className="flex items-center w-full md:w-auto space-x-2">
        <div className="relative flex-1 md:w-60">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un devis..." 
            className="pl-10 bg-background border border-border focus:outline-none"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-background whitespace-nowrap">
              <span className="hidden sm:inline">{currentSortLabel}</span>
              <span className="sm:hidden">Trier</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {SORT_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={sortOption === option.value ? 'bg-accent' : ''}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
          onClick={onCreateQuote}
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Nouveau devis</span>
          <span className="sm:hidden">Nouveau</span>
        </Button>
      </div>
    </div>
  );
};

export default QuotesFilters;

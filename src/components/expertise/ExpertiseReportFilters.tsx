
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Upload, ArrowUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type ExpertiseSortOption = 'alphabetical-asc' | 'alphabetical-desc' | 'recent-first' | 'oldest-first';

const SORT_OPTIONS: { value: ExpertiseSortOption; label: string }[] = [
  { value: 'alphabetical-asc', label: 'Par ordre alphabétique (A → Z)' },
  { value: 'alphabetical-desc', label: 'Par ordre alphabétique (Z → A)' },
  { value: 'recent-first', label: 'Plus récents d\'abord' },
  { value: 'oldest-first', label: 'Plus anciens d\'abord' },
];

interface ExpertiseReportFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onImportClick: () => void;
  sortOption?: ExpertiseSortOption;
  onSortChange?: (option: ExpertiseSortOption) => void;
}

const ExpertiseReportFilters: React.FC<ExpertiseReportFiltersProps> = ({
  searchTerm,
  onSearchChange,
  onImportClick,
  sortOption = 'recent-first',
  onSortChange
}) => {
  return (
    <div className="flex flex-col space-y-4 mb-6 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
      <div className="flex-1" />
      
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Rechercher un rapport..." 
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange?.(option.value)}
                  className={sortOption === option.value ? 'bg-accent' : ''}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 shrink-0 text-sm sm:text-base"
            onClick={onImportClick}
          >
            <Upload className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Importer un rapport</span>
            <span className="sm:hidden">Importer</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpertiseReportFilters;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Search, UserPlus, ArrowUpDown, Check } from 'lucide-react';

export type ClientSortOption = 'alphabetical-asc' | 'alphabetical-desc' | 'recent-first' | 'oldest-first';

interface ClientsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateClient: () => void;
  sortOption: ClientSortOption;
  onSortChange: (option: ClientSortOption) => void;
}

const SORT_OPTIONS: { value: ClientSortOption; label: string }[] = [
  { value: 'alphabetical-asc', label: 'Par ordre alphabétique (A → Z)' },
  { value: 'alphabetical-desc', label: 'Par ordre alphabétique (Z → A)' },
  { value: 'recent-first', label: 'Plus récents d\'abord' },
  { value: 'oldest-first', label: 'Plus anciens d\'abord' },
];

const ClientsFilters: React.FC<ClientsFiltersProps> = ({
  searchTerm,
  onSearchChange,
  onCreateClient,
  sortOption,
  onSortChange
}) => {
  const currentSortLabel = SORT_OPTIONS.find(opt => opt.value === sortOption)?.label || 'Trier';

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div className="flex-1" />
      
      <div className="flex items-center w-full md:w-auto space-x-2">
        <div className="relative flex-1 md:w-60">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un client..." 
            className="pl-10 bg-background border border-border focus:outline-none"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-background border-border gap-2">
              <ArrowUpDown className="h-4 w-4" />
              <span className="hidden sm:inline">{currentSortLabel}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover w-64">
            {SORT_OPTIONS.map((option) => (
              <DropdownMenuItem 
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className="flex items-center justify-between"
              >
                {option.label}
                {sortOption === option.value && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white px-4 py-2"
          onClick={onCreateClient}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Nouveau client
        </Button>
      </div>
    </div>
  );
};

export default ClientsFilters;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowUpDown, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type ExpenseSortOption = 'alphabetical-asc' | 'alphabetical-desc' | 'recent-first' | 'oldest-first';

const SORT_OPTIONS: { value: ExpenseSortOption; label: string }[] = [
  { value: 'alphabetical-asc', label: 'Par ordre alphabétique (A → Z)' },
  { value: 'alphabetical-desc', label: 'Par ordre alphabétique (Z → A)' },
  { value: 'recent-first', label: 'Plus récents d\'abord' },
  { value: 'oldest-first', label: 'Plus anciens d\'abord' },
];

interface ExpensesHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateExpense: () => void;
  sortOption?: ExpenseSortOption;
  onSortChange?: (option: ExpenseSortOption) => void;
}

export const ExpensesHeader = ({ 
  searchTerm, 
  onSearchChange, 
  onCreateExpense,
  sortOption = 'recent-first',
  onSortChange
}: ExpensesHeaderProps) => {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dépenses</h1>
        <p className="text-gray-600 mt-1">
          Gérez toutes vos dépenses professionnelles.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex-1" />
        
        <div className="flex items-center w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher une dépense..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
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
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
            onClick={onCreateExpense}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle dépense
          </Button>
        </div>
      </div>
    </>
  );
};

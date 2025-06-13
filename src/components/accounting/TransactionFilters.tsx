
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TransactionFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedFilter: 'all' | 'receipts' | 'expenses' | 'unpaid';
  setSelectedFilter: (filter: 'all' | 'receipts' | 'expenses' | 'unpaid') => void;
}

export const TransactionFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedFilter, 
  setSelectedFilter 
}: TransactionFiltersProps) => {
  const filters = [
    { value: 'all', label: 'Tous', count: 45 },
    { value: 'receipts', label: 'Encaissements', count: 28 },
    { value: 'expenses', label: 'Dépenses', count: 17 },
    { value: 'unpaid', label: 'Impayés', count: 3 }
  ] as const;

  return (
    <div className="space-y-4">
      {/* Filtres principaux */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={selectedFilter === filter.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter(filter.value)}
            className="gap-2"
          >
            {filter.label}
            <Badge variant="secondary" className="text-xs">
              {filter.count}
            </Badge>
          </Button>
        ))}
      </div>
      
      {/* Barre de recherche et filtres avancés */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Rechercher une transaction, client, ou référence..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Période
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Plus de filtres
          </Button>
        </div>
      </div>
    </div>
  );
};

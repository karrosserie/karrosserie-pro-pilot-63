
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/hooks/use-accounting-data';

interface TransactionFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedFilter: 'all' | 'receipts' | 'expenses' | 'unpaid';
  setSelectedFilter: (filter: 'all' | 'receipts' | 'expenses' | 'unpaid') => void;
  transactions: Transaction[];
}

export const TransactionFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedFilter, 
  setSelectedFilter,
  transactions 
}: TransactionFiltersProps) => {
  // Calculer les vrais nombres à partir des données
  const allCount = transactions.length;
  const receiptsCount = transactions.filter(t => t.type === 'Encaissement').length;
  const expensesCount = transactions.filter(t => t.type === 'Dépense').length;
  const unpaidCount = transactions.filter(t => t.status === 'En attente').length;

  const filters = [
    { value: 'all', label: 'Tous', count: allCount },
    { value: 'receipts', label: 'Encaissements', count: receiptsCount },
    { value: 'expenses', label: 'Dépenses', count: expensesCount },
    { value: 'unpaid', label: 'En attente de paiement', count: unpaidCount }
  ] as const;

  return (
    <div className="space-y-4">
      {/* Sous-onglets principaux */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-50 rounded-lg">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={selectedFilter === filter.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedFilter(filter.value)}
            className={`gap-2 flex-1 sm:flex-none ${
              selectedFilter === filter.value 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            {filter.label}
            <Badge 
              variant="secondary" 
              className={`text-xs ${
                selectedFilter === filter.value 
                  ? 'bg-gray-100 text-gray-700' 
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
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

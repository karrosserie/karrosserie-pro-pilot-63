
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Calendar } from 'lucide-react';

interface TransactionFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedFilter: 'all' | 'receipts' | 'expenses';
  setSelectedFilter: (filter: 'all' | 'receipts' | 'expenses') => void;
}

const TransactionFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedFilter, 
  setSelectedFilter 
}: TransactionFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
      <div className="flex items-center mb-4 md:mb-0">
        <Button 
          variant={selectedFilter === 'all' ? 'default' : 'outline'} 
          size="sm" 
          className="mr-2"
          onClick={() => setSelectedFilter('all')}
        >
          Tous
        </Button>
        <Button 
          variant={selectedFilter === 'receipts' ? 'default' : 'outline'} 
          size="sm" 
          className="mr-2"
          onClick={() => setSelectedFilter('receipts')}
        >
          Encaissements
        </Button>
        <Button 
          variant={selectedFilter === 'expenses' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setSelectedFilter('expenses')}
        >
          Dépenses
        </Button>
      </div>
      
      <div className="flex items-center w-full md:w-auto space-x-2">
        <div className="relative flex-1 md:w-60">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Rechercher une transaction..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button variant="outline" size="icon">
          <Calendar className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TransactionFilters;

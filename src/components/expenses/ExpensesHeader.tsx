
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus } from 'lucide-react';

interface ExpensesHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateExpense: () => void;
}

export const ExpensesHeader = ({ 
  searchTerm, 
  onSearchChange, 
  onCreateExpense 
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
        <div className="flex items-center mb-4 md:mb-0">
          <Button variant="outline" size="sm" className="mr-2">
            Toutes
          </Button>
          <Button variant="outline" size="sm" className="mr-2">
            Payées
          </Button>
          <Button variant="outline" size="sm" className="mr-2">
            En attente
          </Button>
          <Button variant="outline" size="sm">
            Annulées
          </Button>
        </div>
        
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
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
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

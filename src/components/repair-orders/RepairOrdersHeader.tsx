
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus } from 'lucide-react';

interface RepairOrdersHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateOrder: () => void;
}

export const RepairOrdersHeader = ({
  searchTerm,
  onSearchChange,
  onCreateOrder
}: RepairOrdersHeaderProps) => {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Ordres de réparation</h1>
        <p className="text-gray-600 mt-1">
          Consultez et gérez les ordres de réparation.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        
        <div className="flex items-center w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher un ordre de réparation..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button 
            onClick={onCreateOrder}
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel ordre
          </Button>
        </div>
      </div>
    </>
  );
};

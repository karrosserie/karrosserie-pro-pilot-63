
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

interface QuotesHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateQuote: () => void;
}

export const QuotesHeader = ({ searchTerm, onSearchChange, onCreateQuote }: QuotesHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Devis</h1>
        <p className="text-gray-600">Gérez vos devis</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un devis..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
        
        <Button onClick={onCreateQuote} className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau devis
        </Button>
      </div>
    </div>
  );
};

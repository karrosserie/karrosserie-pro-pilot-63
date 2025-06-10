
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

interface InvoicesHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateInvoice: () => void;
}

export const InvoicesHeader = ({ searchTerm, onSearchChange, onCreateInvoice }: InvoicesHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Factures</h1>
        <p className="text-gray-600">Gérez vos factures</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher une facture..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
        
        <Button onClick={onCreateInvoice} className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle facture
        </Button>
      </div>
    </div>
  );
};

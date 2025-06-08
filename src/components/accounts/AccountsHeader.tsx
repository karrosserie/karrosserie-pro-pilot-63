
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus } from 'lucide-react';

interface AccountsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateAccount: () => void;
}

export const AccountsHeader = ({ 
  searchTerm, 
  onSearchChange, 
  onCreateAccount 
}: AccountsHeaderProps) => {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestion des comptes</h1>
        <p className="text-gray-600 mt-1">
          Gérez vos comptes bancaires et suivez vos soldes.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex-1" />
        
        <div className="flex items-center w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher un compte..." 
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
            onClick={onCreateAccount}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau compte
          </Button>
        </div>
      </div>
    </>
  );
};

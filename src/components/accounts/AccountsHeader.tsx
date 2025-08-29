
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
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Gestion des comptes</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Gérez vos comptes bancaires et suivez vos soldes.
        </p>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
        <div className="flex-1" />
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher un compte..." 
              className="pl-10 text-sm"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
            
            <Button 
              className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 flex-1 sm:flex-none"
              onClick={onCreateAccount}
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="sm:inline">Nouveau compte</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

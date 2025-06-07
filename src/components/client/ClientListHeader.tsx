
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ClientListHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateClient: () => void;
}

const ClientListHeader: React.FC<ClientListHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onCreateClient
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div className="flex items-center w-full md:w-auto space-x-2">
        <div className="relative flex-1 md:w-60">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un client..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-karrosserie-orange"
          />
        </div>
        
        <Button 
          className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
          onClick={onCreateClient}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Nouveau client
        </Button>
      </div>
    </div>
  );
};

export default ClientListHeader;

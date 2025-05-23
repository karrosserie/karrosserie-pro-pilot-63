
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
      <h2 className="text-xl font-semibold text-gray-800">Clients</h2>
      
      <div className="flex items-center mt-4 md:mt-0 w-full md:w-auto space-x-2">
        <div className="relative w-full md:w-64 mr-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un client..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="btn-primary" onClick={onCreateClient}>
          <UserPlus className="h-4 w-4 mr-2" />
          Nouveau client
        </Button>
      </div>
    </div>
  );
};

export default ClientListHeader;

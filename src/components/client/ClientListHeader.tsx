
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
      
      <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4 md:mt-0 w-full md:w-auto">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un client..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-karrosserie-orange"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="bg-white border-gray-200">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem>Tous les clients</DropdownMenuItem>
              <DropdownMenuItem>Clients récents</DropdownMenuItem>
              <DropdownMenuItem>Clients actifs</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
            onClick={onCreateClient}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Nouveau client
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientListHeader;

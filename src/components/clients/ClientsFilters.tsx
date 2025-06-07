
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Search, UserPlus, Filter } from 'lucide-react';

interface ClientsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateClient: () => void;
}

const ClientsFilters: React.FC<ClientsFiltersProps> = ({
  searchTerm,
  onSearchChange,
  onCreateClient
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div className="flex-1" />
      
      <div className="flex items-center w-full md:w-auto space-x-2">
        <div className="relative flex-1 md:w-60">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Rechercher un client..." 
          className="pl-10 bg-white border border-gray-200 focus:outline-none"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
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
        className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white px-4 py-2"
        onClick={onCreateClient}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Nouveau client
      </Button>
      </div>
    </div>
  );
};

export default ClientsFilters;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusOptions = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'brouillon', label: 'Brouillon' },
  { value: 'en_attente_signature', label: 'En attente de signature' },
  { value: 'signee', label: 'Signée' },
  { value: 'envoyee', label: 'Envoyée' },
];

interface CessionsFiltersProps {
  searchTerm: string;
  selectedStatus: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: string) => void;
  onCreateCession: () => void;
}

export const CessionsFilters = ({
  searchTerm,
  selectedStatus,
  onSearchChange,
  onStatusChange,
  onCreateCession
}: CessionsFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div className="flex-1" />
      
      <div className="flex items-center w-full md:w-auto space-x-2">
        <div className="relative flex-1 md:w-60">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Rechercher une cession..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Filter className="h-4 w-4" />
              {selectedStatus !== 'all' && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-karrosserie-orange" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background">
            {statusOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onStatusChange(option.value)}
                className="flex items-center justify-between cursor-pointer"
              >
                {option.label}
                {selectedStatus === option.value && (
                  <Check className="h-4 w-4 ml-2" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
          onClick={onCreateCession}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle cession
        </Button>
      </div>
    </div>
  );
};

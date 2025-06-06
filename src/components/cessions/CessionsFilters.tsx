
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus } from 'lucide-react';

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
  const statusButtons = [
    { key: 'all', label: 'Toutes' },
    { key: 'en_attente', label: 'En attente' },
    { key: 'en_attente_signature', label: 'En attente de signature' },
    { key: 'signee', label: 'Signées' },
    { key: 'signature_refusee', label: 'Signature refusée' },
    { key: 'lettre_recommandee_envoyee', label: 'LR envoyées' },
    { key: 'lettre_recommandee_recue', label: 'LR reçues' },
    { key: 'payee', label: 'Payées' }
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div className="flex items-center mb-4 md:mb-0 overflow-x-auto pb-2">
        {statusButtons.map(({ key, label }) => (
          <Button 
            key={key}
            variant={selectedStatus === key ? "default" : "outline"} 
            size="sm" 
            className="mr-2 whitespace-nowrap"
            onClick={() => onStatusChange(key)}
          >
            {label}
          </Button>
        ))}
      </div>
      
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
        
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        
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

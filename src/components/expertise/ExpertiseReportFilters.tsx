
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Upload } from 'lucide-react';

interface ExpertiseReportFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onImportClick: () => void;
}

const ExpertiseReportFilters: React.FC<ExpertiseReportFiltersProps> = ({
  searchTerm,
  onSearchChange,
  onImportClick
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div className="flex items-center mb-4 md:mb-0">
        <Button variant="outline" size="sm" className="mr-2">
          Tous
        </Button>
        <Button variant="outline" size="sm" className="mr-2">
          Importés
        </Button>
        <Button variant="outline" size="sm" className="mr-2">
          En attente
        </Button>
        <Button variant="outline" size="sm">
          Validés
        </Button>
      </div>
      
      <div className="flex items-center w-full md:w-auto space-x-2">
        <div className="relative flex-1 md:w-60">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Rechercher un rapport..." 
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
          onClick={onImportClick}
        >
          <Upload className="h-4 w-4 mr-2" />
          Importer un rapport
        </Button>
      </div>
    </div>
  );
};

export default ExpertiseReportFilters;

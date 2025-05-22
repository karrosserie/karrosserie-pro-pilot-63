
import React from 'react';
import { Search, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onImportClick: () => void;
}

const SearchBar = ({ onImportClick }: SearchBarProps) => {
  return (
    <div className="hidden md:flex items-center space-x-2 relative max-w-xl w-full mx-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Rechercher..." 
          className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-karrosserie-orange"
        />
      </div>
      <Button 
        className="bg-karrosserie-orange text-white hover:bg-karrosserie-orange/90"
        size="sm"
        onClick={onImportClick}
      >
        <Upload className="h-4 w-4 mr-2" />
        Importer un rapport
      </Button>
    </div>
  );
};

export default SearchBar;

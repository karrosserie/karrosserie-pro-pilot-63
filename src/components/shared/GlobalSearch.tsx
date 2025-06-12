
import React, { useState, useEffect } from 'react';
import { Search, Command, FileText, User, Car, Calendar } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'client' | 'facture' | 'vehicule' | 'rdv';
  url: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  // Simuler des résultats de recherche
  const mockResults: SearchResult[] = [
    { id: '1', title: 'Durand Auto', subtitle: 'Client • Dernière visite: 12/06', type: 'client', url: '/clients/1' },
    { id: '2', title: 'F-2023-124', subtitle: 'Facture • 2 450,75 € • En attente', type: 'facture', url: '/factures/124' },
    { id: '3', title: 'RENAULT MEGANE', subtitle: 'AB-123-CD • En réparation', type: 'vehicule', url: '/vehicules/3' },
    { id: '4', title: 'RDV Martin SARL', subtitle: 'Aujourd\'hui 14h30 • Expertise', type: 'rdv', url: '/calendar/4' },
  ];

  useEffect(() => {
    if (query.length > 1) {
      const filtered = mockResults.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'client': return <User className="h-4 w-4 text-blue-600" />;
      case 'facture': return <FileText className="h-4 w-4 text-green-600" />;
      case 'vehicule': return <Car className="h-4 w-4 text-orange-600" />;
      case 'rdv': return <Calendar className="h-4 w-4 text-purple-600" />;
      default: return <Search className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const configs = {
      client: 'bg-blue-100 text-blue-800',
      facture: 'bg-green-100 text-green-800',
      vehicule: 'bg-orange-100 text-orange-800',
      rdv: 'bg-purple-100 text-purple-800'
    };
    return configs[type as keyof typeof configs] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        <div className="flex items-center border-b px-4 py-3">
          <Search className="h-4 w-4 text-gray-400 mr-3" />
          <Input
            placeholder="Rechercher clients, factures, véhicules..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus:ring-0 text-base"
            autoFocus
          />
          <Badge variant="outline" className="ml-2 text-xs">
            <Command className="h-3 w-3 mr-1" />
            K
          </Badge>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    // Navigation logic here
                    onClose();
                  }}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 mr-3">
                    {getTypeIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-900 truncate mr-2">
                        {result.title}
                      </p>
                      <Badge className={`text-xs ${getTypeBadge(result.type)}`}>
                        {result.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {result.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : query.length > 1 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Aucun résultat trouvé pour "{query}"</p>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">Tapez pour rechercher dans tous vos données</p>
              <div className="flex items-center justify-center mt-4 space-x-4 text-xs">
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1 text-blue-600" />
                  Clients
                </div>
                <div className="flex items-center">
                  <FileText className="h-3 w-3 mr-1 text-green-600" />
                  Factures
                </div>
                <div className="flex items-center">
                  <Car className="h-3 w-3 mr-1 text-orange-600" />
                  Véhicules
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1 text-purple-600" />
                  RDV
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearch;

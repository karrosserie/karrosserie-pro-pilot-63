
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, FileText, Plus, Filter, Download, Eye, Pencil, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Données mockées pour les devis
const mockQuotes = [
  { 
    id: 1, 
    reference: 'D-2023-001', 
    date: '16/05/2023', 
    client: 'Jean Dupont',
    vehicle: 'Peugeot 308 - AB-123-CD', 
    amount: '3 785,00 €',
    status: 'En attente' 
  },
  { 
    id: 2, 
    reference: 'D-2023-002', 
    date: '14/05/2023', 
    client: 'Marie Martin',
    vehicle: 'Renault Clio - EF-456-GH', 
    amount: '2 950,00 €',
    status: 'Accepté' 
  },
  { 
    id: 3, 
    reference: 'D-2023-003', 
    date: '12/05/2023', 
    client: 'Pierre Durand',
    vehicle: 'Citroën C3 - IJ-789-KL', 
    amount: '2 100,00 €',
    status: 'Refusé' 
  },
  { 
    id: 4, 
    reference: 'D-2023-004', 
    date: '10/05/2023', 
    client: 'Sophie Bernard',
    vehicle: 'Toyota Yaris - MN-012-OP', 
    amount: '1 850,00 €',
    status: 'En attente' 
  },
];

const Quotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  
  const filteredQuotes = mockQuotes.filter(quote => 
    quote.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'Accepté':
        return 'bg-green-100 text-green-800';
      case 'Refusé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateQuote = () => {
    setSelectedQuote(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleViewQuote = (quote: any) => {
    setSelectedQuote(quote);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleEditQuote = (quote: any) => {
    setSelectedQuote(quote);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleQuoteSubmit = (data: any) => {
    console.log('Quote data submitted:', data);
    setDialogOpen(false);
  };
  
  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Devis</h1>
        <p className="text-gray-600 mt-1">
          Consultez et gérez les devis de réparation.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <Button variant="outline" size="sm" className="mr-2">
            Tous
          </Button>
          <Button variant="outline" size="sm" className="mr-2">
            En attente
          </Button>
          <Button variant="outline" size="sm" className="mr-2">
            Acceptés
          </Button>
          <Button variant="outline" size="sm">
            Refusés
          </Button>
        </div>
        
        <div className="flex items-center w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher un devis..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button 
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
            onClick={handleCreateQuote}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau devis
          </Button>
        </div>
      </div>
      
      <div className="card-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotes.length > 0 ? (
              filteredQuotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">{quote.reference}</TableCell>
                  <TableCell>{quote.date}</TableCell>
                  <TableCell>{quote.client}</TableCell>
                  <TableCell>{quote.vehicle}</TableCell>
                  <TableCell>{quote.amount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(quote.status)}`}>
                      {quote.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleViewQuote(quote)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditQuote(quote)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  <div className="flex flex-col items-center justify-center py-8">
                    <FileText className="h-10 w-10 text-gray-400 mb-2" />
                    <h3 className="font-medium text-gray-900">Aucun résultat</h3>
                    <p className="text-gray-500 mt-1">
                      Aucun devis correspondant à votre recherche n'a été trouvé.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Quote Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Nouveau devis' : dialogMode === 'edit' ? 'Modifier le devis' : 'Détails du devis'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'create' ? 'Créer un nouveau devis.' : dialogMode === 'edit' ? 'Modifier les informations du devis.' : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Quote form would go here in a real implementation */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="reference" className="text-sm font-medium">Référence</label>
                <Input id="reference" defaultValue={selectedQuote?.reference} readOnly={dialogMode === 'view'} />
              </div>
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">Date</label>
                <Input id="date" type="date" defaultValue={selectedQuote?.date} readOnly={dialogMode === 'view'} />
              </div>
              <div className="space-y-2">
                <label htmlFor="client" className="text-sm font-medium">Client</label>
                <Input id="client" defaultValue={selectedQuote?.client} readOnly={dialogMode === 'view'} />
              </div>
              <div className="space-y-2">
                <label htmlFor="vehicle" className="text-sm font-medium">Véhicule</label>
                <Input id="vehicle" defaultValue={selectedQuote?.vehicle} readOnly={dialogMode === 'view'} />
              </div>
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">Montant</label>
                <Input id="amount" defaultValue={selectedQuote?.amount} readOnly={dialogMode === 'view'} />
              </div>
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">Statut</label>
                <Input id="status" defaultValue={selectedQuote?.status} readOnly={dialogMode === 'view'} />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                {dialogMode === 'view' ? 'Fermer' : 'Annuler'}
              </Button>
              {dialogMode !== 'view' && (
                <Button onClick={() => handleQuoteSubmit(selectedQuote)}>
                  {dialogMode === 'create' ? 'Créer' : 'Enregistrer'}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Quotes;

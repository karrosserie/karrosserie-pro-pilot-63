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
import { Search, FileText, Plus, Filter, Eye, Download, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { useQuotes } from '@/hooks/use-quotes';
import { useToast } from '@/hooks/use-toast';
import QuoteDialog from '@/components/quotes/QuoteDialog';
import { Quote } from '@/services/supabase/quotes';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Printer, Mail, FileCheck, ArrowRight } from 'lucide-react';

const Quotes = () => {
  const { quotes, isLoading, error, deleteQuote } = useQuotes();
  const [searchTerm, setSearchTerm] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const { toast } = useToast();
  
  const filteredQuotes = quotes?.filter(quote => 
    quote.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (quote.clients?.first_name + ' ' + quote.clients?.last_name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (quote.vehicles?.brand + ' ' + quote.vehicles?.model)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.vehicles?.license_plate?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreateQuote = () => {
    setSelectedQuote(null);
    setEditDialogOpen(true);
  };

  const handleEditQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setEditDialogOpen(true);
  };

  const handleDeleteQuote = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
      try {
        await deleteQuote.mutateAsync(id);
      } catch (error: any) {
        console.error('Error deleting quote:', error);
      }
    }
  };

  const handleDownload = (quote: Quote) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement du devis ${quote.reference}...`
    });
  };

  const handlePrint = (quote: Quote) => {
    toast({
      title: "Impression",
      description: `Impression du devis ${quote.reference}...`
    });
  };

  const handleSendEmail = (quote: Quote) => {
    toast({
      title: "Envoi par e-mail",
      description: `Envoi du devis ${quote.reference} par e-mail...`
    });
  };

  const handleRequestDocuments = (quote: Quote) => {
    toast({
      title: "Demande de justificatifs",
      description: `Demande de justificatifs envoyée pour le devis ${quote.reference}`
    });
  };

  const handleConvertToRepairOrder = (quote: Quote) => {
    toast({
      title: "Conversion en ordre de réparation",
      description: `Le devis ${quote.reference} a été converti en ordre de réparation`
    });
  };
  
  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Devis</h1>
          <p className="text-gray-600 mt-1">
            Consultez et gérez les devis de réparation.
          </p>
        </div>
        
        <div className="flex items-center w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher un devis..." 
              className="pl-10 bg-white border border-gray-200 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon" className="bg-white">
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
              <TableHead>Numéro</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Chargement des devis...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-red-500">
                  Erreur lors du chargement des devis: {error.message}
                </TableCell>
              </TableRow>
            ) : filteredQuotes.length > 0 ? (
              filteredQuotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">{quote.reference}</TableCell>
                  <TableCell>{new Date(quote.created_at).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{quote.clients ? `${quote.clients.first_name} ${quote.clients.last_name}` : '-'}</TableCell>
                  <TableCell>
                    {quote.vehicles 
                      ? `${quote.vehicles.brand} ${quote.vehicles.model} - ${quote.vehicles.license_plate}` 
                      : '-'
                    }
                  </TableCell>
                  <TableCell>{quote.amount ? `${quote.amount.toFixed(2)} €` : '-'}</TableCell>
                  <TableCell>
                    <StatusBadge status={quote.status || 'En attente'} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditQuote(quote)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteQuote(quote.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimer
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Envoyer par e-mail
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <FileCheck className="mr-2 h-4 w-4" />
                            Demander les justificatifs
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Convertir en ordre de réparation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

      <QuoteDialog
        quote={selectedQuote}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
};

export default Quotes;

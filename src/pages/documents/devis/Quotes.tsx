
import React, { useState } from 'react';
import { QuotesHeader } from '@/components/quotes/QuotesHeader';
import { QuotesTable } from '@/components/quotes/QuotesTable';
import { QuoteDialog } from '@/components/quotes/QuoteDialog';
import { useQuotes } from '@/hooks/use-quotes';
import { Quote } from '@/services/supabase/quotes';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';

const Quotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  
  const { quotes, isLoading, error, deleteQuote } = useQuotes();
  
  const filteredQuotes = quotes?.filter(quote => 
    quote.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (quote.clients && `${quote.clients.first_name} ${quote.clients.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (quote.vehicles && `${quote.vehicles.brand} ${quote.vehicles.model} - ${quote.vehicles.license_plate}`.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleCreateQuote = () => {
    setSelectedQuote(null);
    setDialogOpen(true);
  };

  const handleEditQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setDialogOpen(true);
  };

  const handleDeleteQuote = (quote: Quote) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
      deleteQuote.mutate(quote.id);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <ErrorMessage message="Erreur lors du chargement des devis" />
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <QuotesHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateQuote={handleCreateQuote}
      />
      
      <QuotesTable
        quotes={filteredQuotes}
        onEdit={handleEditQuote}
        onDelete={handleDeleteQuote}
      />

      <QuoteDialog
        quote={selectedQuote}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Quotes;

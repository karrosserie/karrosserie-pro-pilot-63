
import React, { useState } from 'react';
import { InvoicesHeader } from '@/components/invoices/InvoicesHeader';
import { InvoicesTable } from '@/components/invoices/InvoicesTable';
import { InvoiceDialog } from '@/components/invoices/InvoiceDialog';
import { useInvoices } from '@/hooks/use-invoices';
import { Invoice } from '@/services/supabase/invoices';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  const { invoices, isLoading, error, deleteInvoice } = useInvoices();
  
  const filteredInvoices = invoices?.filter(invoice => 
    invoice.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (invoice.clients && `${invoice.clients.first_name} ${invoice.clients.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (invoice.vehicles && `${invoice.vehicles.brand} ${invoice.vehicles.model} - ${invoice.vehicles.license_plate}`.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleCreateInvoice = () => {
    setSelectedInvoice(null);
    setDialogOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDialogOpen(true);
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      deleteInvoice.mutate(invoice.id);
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
        <ErrorMessage message="Erreur lors du chargement des factures" />
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <InvoicesHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateInvoice={handleCreateInvoice}
      />
      
      <InvoicesTable
        invoices={filteredInvoices}
        onEdit={handleEditInvoice}
        onDelete={handleDeleteInvoice}
      />

      <InvoiceDialog
        invoice={selectedInvoice}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Invoices;

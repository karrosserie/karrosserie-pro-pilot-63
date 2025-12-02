
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ClientsHeader from './ClientsHeader';
import ClientsTable from './ClientsTable';
import ClientsFilters, { ClientSortOption } from './ClientsFilters';
import ClientDialogs from './ClientDialogs';
import VehicleDialog from '@/components/vehicle/VehicleDialog';
import { useClients } from '@/hooks/use-clients';
import { useClientActions } from '@/hooks/use-client-actions';
import { useVehicles } from '@/hooks/use-vehicles';
import { useAuth } from '@/contexts/AuthContext';
import { useCompanyId } from '@/hooks/use-company-id';
import { useNotification } from '@/hooks/use-notification';
import { TableLoading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { Client } from '@/services/supabase/clients';

const ClientsPage = () => {
  const { clients, isLoading, error } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<ClientSortOption>('alphabetical-asc');
  const [searchParams, setSearchParams] = useSearchParams();
  const [highlightedClientId, setHighlightedClientId] = useState<string | null>(null);
  
  // Vehicle dialog state
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [selectedClientForVehicle, setSelectedClientForVehicle] = useState<Client | null>(null);

  // Handle highlighting client from URL parameter
  useEffect(() => {
    const clientId = searchParams.get('clientId');
    if (clientId) {
      setHighlightedClientId(clientId);
      
      // Remove the parameter after 3 seconds
      const timeout = setTimeout(() => {
        setHighlightedClientId(null);
        searchParams.delete('clientId');
        setSearchParams(searchParams, { replace: true });
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [searchParams, setSearchParams]);
  
  const { createVehicle } = useVehicles();
  const { user } = useAuth();
  const { companyId } = useCompanyId();
  const { error: showError } = useNotification();
  
  const {
    // Client dialog state
    dialogOpen,
    setDialogOpen,
    dialogMode,
    selectedClient,
    
    // Document dialog state
    quoteDialogOpen,
    setQuoteDialogOpen,
    invoiceDialogOpen,
    setInvoiceDialogOpen,
    creditDialogOpen,
    setCreditDialogOpen,
    interventionDialogOpen,
    setInterventionDialogOpen,
    selectedClientForDocument,
    setSelectedClientForDocument,
    
    // Action handlers
    handleViewClient,
    handleCreateClient,
    handleEditClient,
    handleDeleteClient,
    handleCreateQuote,
    handleCreateInvoice,
    handleCreateCredit,
    handleCreateIntervention,
    handleRequestDocuments,
    handleClientSubmit
  } = useClientActions();

  const filteredClients = clients?.filter(client => {
    const matchesSearch = 
      client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.postal_code?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];

  // Handle vehicle creation
  const handleCreateVehicle = (client: Client) => {
    setSelectedClientForVehicle(client);
    setVehicleDialogOpen(true);
  };

  const handleVehicleSubmit = async (data: any) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      const vehicleData = {
        client_id: selectedClientForVehicle?.id || null,
        vin: data.vin,
        brand_id: data.brandId,
        model_id: data.modelId,
        license_plate: data.licensePlate,
        engine_number: data.engineNumber,
        year: data.year ? parseInt(data.year) : null,
        color: data.color,
        mileage: data.mileage ? parseInt(data.mileage) : null,
        insurance_company_id: data.insuranceCompanyId || null,
        insurance_expiry_date: data.insuranceExpiryDate || null,
        status: data.status || 'En attente',
        road_test: data.roadTest,
        road_test_notes: data.roadTestNotes,
        fuel_level: data.fuelLevel || 50,
        pre_accident_defects: data.preAccidentDefects,
        work_items: JSON.stringify(data.workItems?.filter((item: string) => item.trim() !== '') || []),
        registration_document_front_url: data.registrationDocumentFrontUrl,
        registration_document_back_url: data.registrationDocumentBackUrl,
        vehicle_image_url: data.vehicleImageUrl,
        vehicle_images: (() => {
          const filteredImages = data.vehicleImages?.filter((img: any) => img.url && img.url.trim() !== '') || [];
          return JSON.stringify(filteredImages);
        })(),
        company_id: companyId
      };

      await createVehicle.mutateAsync(vehicleData);
      setVehicleDialogOpen(false);
    } catch (error) {
      console.error('Error creating vehicle:', error);
    }
  };

  if (isLoading) return <TableLoading />;
  
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <ClientsHeader />
      
      <ClientsFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateClient={handleCreateClient}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />
      
      <ClientsTable 
        clients={filteredClients}
        onViewClient={handleViewClient}
        onEditClient={handleEditClient}
        onDeleteClient={handleDeleteClient}
        onCreateVehicle={handleCreateVehicle}
        onRequestDocuments={handleRequestDocuments}
        highlightedClientId={highlightedClientId}
        sortOption={sortOption}
      />

      <ClientDialogs
        clientDialogOpen={dialogOpen}
        setClientDialogOpen={setDialogOpen}
        dialogMode={dialogMode}
        selectedClient={selectedClient}
        onClientSubmit={handleClientSubmit}
        quoteDialogOpen={quoteDialogOpen}
        setQuoteDialogOpen={setQuoteDialogOpen}
        invoiceDialogOpen={invoiceDialogOpen}
        setInvoiceDialogOpen={setInvoiceDialogOpen}
        creditDialogOpen={creditDialogOpen}
        setCreditDialogOpen={setCreditDialogOpen}
        selectedClientForDocument={selectedClientForDocument}
        setSelectedClientForDocument={setSelectedClientForDocument}
      />

      <VehicleDialog
        open={vehicleDialogOpen}
        onOpenChange={setVehicleDialogOpen}
        title="Nouveau véhicule"
        description={`Créer un nouveau véhicule pour ${selectedClientForVehicle?.first_name} ${selectedClientForVehicle?.last_name}`}
        onSubmit={handleVehicleSubmit}
        mode="create"
        defaultValues={{ client_id: selectedClientForVehicle?.id }}
      />
    </>
  );
};

export default ClientsPage;

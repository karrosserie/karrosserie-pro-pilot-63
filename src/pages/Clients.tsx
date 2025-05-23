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
import { Search, UserPlus, Eye, Pencil } from 'lucide-react';
import ClientDialog from '@/components/client/ClientDialog';
import ClientDeleteDialog from '@/components/client/ClientDeleteDialog';
import { useClients } from '@/hooks/use-clients';
import { Client } from '@/services/supabase/clients';
import { TableLoading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { useAuth } from '@/contexts/AuthContext';

const Clients = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { clients, isLoading, error, createClient, updateClient, deleteClient } = useClients();
  const { user } = useAuth();

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

  const handleCreateClient = () => {
    setSelectedClient(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDeleteClient = (client: Client) => {
    deleteClient.mutate(client.id);
  };

  const handleClientSubmit = (data: any) => {
    if (dialogMode === 'create') {
      createClient.mutate({
        firstName: data.firstName, 
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        zipCode: data.zipCode,
        company: data.company,
        driverLicenseFrontUrl: data.driverLicenseFrontUrl,
        driverLicenseBackUrl: data.driverLicenseBackUrl,
        user_id: user ? user.id : null
      });
    } else if (dialogMode === 'edit' && selectedClient) {
      updateClient.mutate({
        id: selectedClient.id, 
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          zipCode: data.zipCode,
          company: data.company,
          driverLicenseFrontUrl: data.driverLicenseFrontUrl,
          driverLicenseBackUrl: data.driverLicenseBackUrl
        }
      });
    }
  };

  if (isLoading) return <TableLoading />;
  
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Clients</h1>
        <p className="text-gray-600 mt-1">
          Consultez et gérez vos clients.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher un client..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button 
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
            onClick={handleCreateClient}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Nouveau client
          </Button>
        </div>
      </div>
      
      <div className="card-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Société</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    {client.first_name} {client.last_name}
                  </TableCell>
                  <TableCell>{client.email || '-'}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.city}</TableCell>
                  <TableCell>{(client as any).company || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleViewClient(client)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditClient(client)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <ClientDeleteDialog 
                        client={client}
                        onDelete={handleDeleteClient}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  <div className="flex flex-col items-center justify-center py-8">
                    <UserPlus className="h-10 w-10 text-gray-400 mb-2" />
                    <h3 className="font-medium text-gray-900">Aucun résultat</h3>
                    <p className="text-gray-500 mt-1">
                      Aucun client correspondant à votre recherche n'a été trouvé.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ClientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={
          dialogMode === 'create' 
            ? 'Ajouter un client' 
            : dialogMode === 'edit' 
            ? 'Modifier le client' 
            : 'Détails du client'
        }
        description={
          dialogMode === 'create' 
            ? 'Saisissez les informations du nouveau client.'
            : dialogMode === 'edit'
            ? 'Modifiez les informations du client.'
            : ''
        }
        defaultValues={selectedClient ? {
          id: selectedClient.id,
          firstName: selectedClient.first_name || '',
          lastName: selectedClient.last_name || '',
          email: selectedClient.email || '',
          phone: selectedClient.phone || '',
          address: selectedClient.address || '',
          city: selectedClient.city || '',
          zipCode: selectedClient.postal_code || '',
          company: (selectedClient as any).company || '',
          driverLicenseFrontUrl: (selectedClient as any).driver_license_front_url || '',
          driverLicenseBackUrl: (selectedClient as any).driver_license_back_url || '',
        } : {}}
        onSubmit={handleClientSubmit}
        mode={dialogMode}
      />
    </div>
  );
};

export default Clients;

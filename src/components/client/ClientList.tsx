
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, UserPlus, Trash2 } from 'lucide-react';
import ClientDialog from './ClientDialog';
import { useClients } from '@/hooks/use-clients';
import { Client } from '@/services/supabase/clients';
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { TableLoading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ClientList = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { clients, isLoading, error, createClient, updateClient, deleteClient } = useClients();
  const { user } = useAuth();

  // Filtrer les clients en fonction de la recherche
  const filteredClients = useMemo(() => {
    if (!clients || !searchQuery) return clients;
    
    const lowercaseQuery = searchQuery.toLowerCase();
    return clients.filter(client => {
      return (
        client.first_name?.toLowerCase().includes(lowercaseQuery) ||
        client.last_name?.toLowerCase().includes(lowercaseQuery) ||
        client.email?.toLowerCase().includes(lowercaseQuery) ||
        client.phone?.toLowerCase().includes(lowercaseQuery) ||
        client.address?.toLowerCase().includes(lowercaseQuery) ||
        client.city?.toLowerCase().includes(lowercaseQuery) ||
        client.postal_code?.toLowerCase().includes(lowercaseQuery)
      );
    });
  }, [clients, searchQuery]);

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
    console.log('Form submitted with data:', data);
    
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

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "name",
      header: "Nom",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.first_name} {row.original.last_name}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Téléphone",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="text-right space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleViewClient(row.original)}>
            Voir
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleEditClient(row.original)}>
            Éditer
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer le client</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer le client {row.original.first_name} {row.original.last_name} ? 
                  Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => handleDeleteClient(row.original)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  if (isLoading) return <TableLoading />;
  
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="card-container animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Clients</h2>
        
        <div className="flex items-center mt-4 md:mt-0 w-full md:w-auto space-x-2">
          <div className="relative w-full md:w-64 mr-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="btn-primary" onClick={handleCreateClient}>
            <UserPlus className="h-4 w-4 mr-2" />
            Nouveau client
          </Button>
        </div>
      </div>
      
      <DataTable
        columns={columns}
        data={filteredClients || []}
        searchKey="first_name"
        searchPlaceholder="Rechercher un client..."
      />

      {/* Client Dialog */}
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
          company: selectedClient.company || '',
          driverLicenseFrontUrl: selectedClient.driver_license_front_url || '',
          driverLicenseBackUrl: selectedClient.driver_license_back_url || '',
        } : {}}
        onSubmit={handleClientSubmit}
        mode={dialogMode}
      />
    </div>
  );
};

export default ClientList;

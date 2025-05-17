
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, UserPlus } from 'lucide-react';
import ClientDialog from './ClientDialog';

// Données mockées pour l'exemple
const mockClients = [
  { id: '1', name: 'Jean Dupont', email: 'jean.dupont@example.com', phone: '06 12 34 56 78', vehicles: 2 },
  { id: '2', name: 'Marie Martin', email: 'marie.martin@example.com', phone: '07 23 45 67 89', vehicles: 1 },
  { id: '3', name: 'Pierre Durand', email: 'pierre.durand@example.com', phone: '06 34 56 78 90', vehicles: 3 },
  { id: '4', name: 'Sophie Bernard', email: 'sophie.bernard@example.com', phone: '07 45 67 89 01', vehicles: 1 },
  { id: '5', name: 'Luc Petit', email: 'luc.petit@example.com', phone: '06 56 78 90 12', vehicles: 1 },
];

const ClientList = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const handleCreateClient = () => {
    setSelectedClient(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleViewClient = (client: any) => {
    setSelectedClient(client);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleEditClient = (client: any) => {
    setSelectedClient(client);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleClientSubmit = (data: any) => {
    // Logic to handle client creation or update
    console.log('Client data submitted:', data);
    // In a real app, you would update the state or call an API
  };

  return (
    <div className="card-container animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Clients</h2>
        
        <div className="flex items-center mt-4 md:mt-0 w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher un client..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-karrosserie-orange"
            />
          </div>
          
          <Button className="btn-primary" onClick={handleCreateClient}>
            <UserPlus className="h-4 w-4 mr-2" />
            Nouveau client
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Téléphone</th>
              <th className="px-4 py-3">Véhicules</th>
              <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockClients.map((client) => (
              <tr key={client.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{client.name}</td>
                <td className="px-4 py-3 text-gray-600">{client.email}</td>
                <td className="px-4 py-3 text-gray-600">{client.phone}</td>
                <td className="px-4 py-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {client.vehicles}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewClient(client)}>
                    Voir
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditClient(client)}>
                    Éditer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <div>Affichage de 1 à 5 sur 5 entrées</div>
        <div className="flex space-x-1">
          <Button variant="outline" size="sm" disabled>Précédent</Button>
          <Button variant="outline" size="sm" disabled>Suivant</Button>
        </div>
      </div>

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
        defaultValues={selectedClient}
        onSubmit={handleClientSubmit}
        mode={dialogMode}
      />
    </div>
  );
};

export default ClientList;

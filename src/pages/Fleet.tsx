
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Car, Plus, Search, Calendar, User } from 'lucide-react';
import { useFleetVehicles } from '@/hooks/use-fleet-vehicles';
import FleetVehicleDialog from '@/components/fleet/FleetVehicleDialog';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';

// Données mockées pour les prêts en cours
const currentLoans = [
  {
    id: '1',
    vehicle: 'Renault Clio - CC-222-DD',
    client: 'Marie Martin',
    startDate: '15/05/2023',
    expectedReturnDate: '22/05/2023'
  },
  {
    id: '2',
    vehicle: 'Toyota Yaris - GG-444-HH',
    client: 'Pierre Durand',
    startDate: '12/05/2023',
    expectedReturnDate: '19/05/2023'
  }
];

const Fleet = () => {
  const { vehicles, isLoading, error } = useFleetVehicles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: FleetVehicle) => {
    setSelectedVehicle(vehicle);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleViewVehicle = (vehicle: FleetVehicle) => {
    setSelectedVehicle(vehicle);
    setDialogMode('view');
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedVehicle(null);
  };

  const filteredVehicles = vehicles?.filter(vehicle =>
    vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.license_plate?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    return (
      <div className="page-container">
        <div className="text-center py-8">
          <p className="text-red-600">Erreur lors du chargement des véhicules: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Flotte de véhicules</h1>
        <p className="text-gray-600 mt-1">Gérez vos véhicules de courtoisie et les prêts clients.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card-container mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Mes véhicules de courtoisie</h2>
              
              <div className="flex items-center mt-4 md:mt-0 w-full md:w-auto space-x-2">
                <div className="relative flex-1 md:w-60">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-karrosserie-orange"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Button className="btn-primary" onClick={handleAddVehicle}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-2">Chargement...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Véhicule</th>
                      <th className="px-4 py-3">Immatriculation</th>
                      <th className="px-4 py-3">Couleur</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Kilométrage</th>
                      <th className="px-4 py-3 rounded-tr-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVehicles.length > 0 ? (
                      filteredVehicles.map((vehicle) => (
                        <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{vehicle.brand} {vehicle.model}</td>
                          <td className="px-4 py-3 text-gray-600">{vehicle.license_plate}</td>
                          <td className="px-4 py-3 text-gray-600">{vehicle.color || '-'}</td>
                          <td className="px-4 py-3">
                            <span 
                              className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                                vehicle.status === 'Disponible' 
                                  ? 'bg-green-100 text-green-800' 
                                  : vehicle.status === 'Loué'
                                  ? 'bg-amber-100 text-amber-800'
                                  : vehicle.status === 'En maintenance'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {vehicle.status || 'Disponible'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{vehicle.mileage ? `${vehicle.mileage} km` : '-'}</td>
                          <td className="px-4 py-3 space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={vehicle.status === 'Loué'}
                            >
                              Prêter
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewVehicle(vehicle)}
                            >
                              Détails
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditVehicle(vehicle)}
                            >
                              Modifier
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          {searchTerm ? 'Aucun véhicule trouvé' : 'Aucun véhicule de courtoisie'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div className="card-container">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Historique des prêts</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Véhicule</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Date de début</th>
                    <th className="px-4 py-3">Date de fin</th>
                    <th className="px-4 py-3 rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">Peugeot 208</td>
                    <td className="px-4 py-3">Jean Dupont</td>
                    <td className="px-4 py-3 text-gray-600">01/05/2023</td>
                    <td className="px-4 py-3 text-gray-600">09/05/2023</td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm">
                        Voir
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">Citroën C3</td>
                    <td className="px-4 py-3">Sophie Bernard</td>
                    <td className="px-4 py-3 text-gray-600">25/04/2023</td>
                    <td className="px-4 py-3 text-gray-600">05/05/2023</td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm">
                        Voir
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="card-container">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Prêts en cours</h2>
            
            <div className="space-y-4">
              {currentLoans.map((loan) => (
                <div 
                  key={loan.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center mb-2">
                    <Car className="h-4 w-4 text-gray-600 mr-2" />
                    <h4 className="font-medium">{loan.vehicle}</h4>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 ml-6">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{loan.client}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Du {loan.startDate} au {loan.expectedReturnDate}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-x-2">
                    <Button variant="outline" size="sm">Détails</Button>
                    <Button className="btn-primary" size="sm">Retour</Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <Button className="w-full" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Nouveau prêt
              </Button>
            </div>
          </div>
          
          <div className="card-container">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Contraventions</h2>
            
            <div className="text-center py-8">
              <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune contravention en attente</p>
              <Button className="mt-4" variant="outline">
                Importer une contravention
              </Button>
            </div>
          </div>
        </div>
      </div>

      <FleetVehicleDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        vehicle={selectedVehicle}
        mode={dialogMode}
      />
    </div>
  );
};

export default Fleet;

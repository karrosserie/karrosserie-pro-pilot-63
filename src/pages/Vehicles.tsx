
import React from 'react';
import VehicleCard from '@/components/vehicle/VehicleCard';
import { Button } from '@/components/ui/button';
import { Car, Plus, Search } from 'lucide-react';

// Données mockées pour l'exemple
const mockVehicles = [
  { 
    id: '1',
    brand: 'Peugeot',
    model: '308',
    year: 2019,
    licensePlate: 'AB-123-CD',
    status: 'En réparation' as const,
    owner: 'Jean Dupont'
  },
  { 
    id: '2',
    brand: 'Renault',
    model: 'Clio',
    year: 2018,
    licensePlate: 'EF-456-GH',
    status: 'Terminé' as const,
    owner: 'Marie Martin'
  },
  { 
    id: '3',
    brand: 'Citroën',
    model: 'C3',
    year: 2020,
    licensePlate: 'IJ-789-KL',
    status: 'En attente' as const,
    owner: 'Pierre Durand'
  },
  { 
    id: '4',
    brand: 'Toyota',
    model: 'Yaris',
    year: 2021,
    licensePlate: 'MN-012-OP',
    status: 'Diagnostic' as const,
    owner: 'Sophie Bernard'
  },
  { 
    id: '5',
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2017,
    licensePlate: 'QR-345-ST',
    status: 'En réparation' as const,
    owner: 'Luc Petit'
  },
  { 
    id: '6',
    brand: 'BMW',
    model: 'Série 3',
    year: 2020,
    licensePlate: 'UV-678-WX',
    status: 'En attente' as const,
    owner: 'Éric Martin'
  },
];

const Vehicles = () => {
  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Véhicules</h1>
        <p className="text-gray-600 mt-1">Consultez et gérez tous les véhicules de vos clients.</p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center">
          <div className="flex space-x-2">
            <Button variant="outline" className="text-sm">Tous</Button>
            <Button variant="outline" className="text-sm">En réparation</Button>
            <Button variant="outline" className="text-sm">Terminé</Button>
            <Button variant="outline" className="text-sm">En attente</Button>
          </div>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0 w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher un véhicule..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-karrosserie-orange"
            />
          </div>
          
          <Button className="btn-primary">
            <Car className="h-4 w-4 mr-2" />
            Ajouter un véhicule
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            brand={vehicle.brand}
            model={vehicle.model}
            year={vehicle.year}
            licensePlate={vehicle.licensePlate}
            status={vehicle.status}
            owner={vehicle.owner}
          />
        ))}
      </div>
    </div>
  );
};

export default Vehicles;

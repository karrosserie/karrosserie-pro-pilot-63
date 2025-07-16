import React, { useState } from 'react';
import { Calendar, Users, AlertTriangle, Zap, Clock, User, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  plate: string;
  owner: string;
  amount: number;
  duration: string;
  description: string;
  technician?: string;
  status: 'En cours' | 'À planifier' | 'Terminé';
  step: string;
}

const Planning = () => {
  const [currentView, setCurrentView] = useState<'manager' | 'employee'>('manager');
  const [currentTab, setCurrentTab] = useState('etapes');
  const [showWaitingModal, setShowWaitingModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const vehicles: Vehicle[] = [
    {
      id: '1',
      brand: 'Citroën',
      model: 'C4',
      plate: 'EZ-787-KL',
      owner: 'M. Durand',
      amount: 800,
      duration: '0.5h',
      description: 'Devis en cours',
      technician: 'Martin Dubois',
      status: 'En cours',
      step: 'Accueil & Préparation du dossier'
    },
    {
      id: '2',
      brand: 'Mercedes',
      model: 'Classe C',
      plate: 'QR-345-ST',
      owner: 'Mme Leclerc',
      amount: 400,
      duration: '1h',
      description: 'Expertise assurance',
      status: 'À planifier',
      step: 'Accueil & Préparation du dossier'
    },
    {
      id: '3',
      brand: 'Audi',
      model: 'A4',
      plate: 'VS-901-AB',
      owner: 'M. Bernard',
      amount: 520,
      duration: '2h',
      description: 'Débosselage portière',
      technician: 'Sophie Martin',
      status: 'En cours',
      step: 'Remplacement ou débosselage'
    },
    {
      id: '4',
      brand: 'BMW',
      model: 'Série 1',
      plate: 'HT-556-GH',
      owner: 'M. Rousseau',
      amount: 950,
      duration: '3h',
      description: 'Remplacement pare-chocs',
      status: 'À planifier',
      step: 'Remplacement ou débosselage'
    },
    {
      id: '5',
      brand: 'Peugeot',
      model: '308',
      plate: 'AB-789-XY',
      owner: 'Mme Moreau',
      amount: 680,
      duration: '2.5h',
      description: 'Ponçage aile avant',
      technician: 'Sophie Martin',
      status: 'En cours',
      step: 'Préparation peinture'
    },
    {
      id: '6',
      brand: 'Renault',
      model: 'Clio',
      plate: 'CD-123-ZW',
      owner: 'M. Petit',
      amount: 1200,
      duration: '4h',
      description: 'Application base',
      technician: 'Sophie Martin',
      status: 'En cours',
      step: 'Mise en peinture'
    },
    {
      id: '7',
      brand: 'Volkswagen',
      model: 'Golf',
      plate: 'EF-456-UV',
      owner: 'Mme Blanc',
      amount: 350,
      duration: '1.5h',
      description: 'Polissage final',
      technician: 'Martin Dubois',
      status: 'En cours',
      step: 'Finitions & remontage'
    },
    {
      id: '8',
      brand: 'Ford',
      model: 'Focus',
      plate: 'GH-789-ST',
      owner: 'M. Roux',
      amount: 80,
      duration: '0.5h',
      description: 'Contrôle qualité',
      technician: 'Martin Dubois',
      status: 'En cours',
      step: 'Clôture du dossier et livraison'
    }
  ];

  const getStepColor = (step: string) => {
    const colors = {
      'Accueil & Préparation du dossier': 'border-l-blue-500',
      'Remplacement ou débosselage': 'border-l-green-500',
      'Préparation peinture': 'border-l-yellow-500',
      'Mise en peinture': 'border-l-purple-500',
      'Finitions & remontage': 'border-l-orange-500',
      'Clôture du dossier et livraison': 'border-l-red-500'
    };
    return colors[step as keyof typeof colors] || 'border-l-gray-500';
  };

  const getVehiclesByStep = (step: string) => {
    return vehicles.filter(v => v.step === step);
  };

  const steps = [
    'Accueil & Préparation du dossier',
    'Remplacement ou débosselage',
    'Préparation peinture',
    'Mise en peinture',
    'Finitions & remontage',
    'Clôture du dossier et livraison'
  ];

  const totalVehicles = vehicles.length;
  const completedVehicles = 0;
  const waitingVehicles = vehicles.filter(v => v.status === 'À planifier').length;
  const totalAmount = vehicles.reduce((sum, v) => sum + v.amount, 0);

  const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => (
    <div 
      className="bg-white border rounded-lg p-4 mb-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setSelectedVehicle(vehicle)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium text-gray-900">{vehicle.brand} {vehicle.model}</h4>
              <p className="text-sm text-gray-500">{vehicle.plate}</p>
              <p className="text-sm text-gray-600">{vehicle.owner}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-green-600">{vehicle.amount}€</p>
              <p className="text-sm text-gray-500">{vehicle.duration}</p>
            </div>
          </div>
          
          <p className="text-sm text-blue-600 mb-2">{vehicle.description}</p>
          
          {vehicle.technician && (
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <User className="h-4 w-4 mr-1" />
              {vehicle.technician}
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <Badge 
              variant={vehicle.status === 'En cours' ? 'default' : 'secondary'}
              className={vehicle.status === 'En cours' ? 'bg-blue-500' : ''}
            >
              {vehicle.status}
            </Badge>
            
            {vehicle.status === 'À planifier' && (
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-1" />
                Planifier
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const WaitingVehiclesModal = () => {
    if (!showWaitingModal) return null;
    
    const waitingVehiclesList = vehicles.filter(v => v.status === 'À planifier');
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Véhicules en attente</h2>
            <Button variant="ghost" onClick={() => setShowWaitingModal(false)}>×</Button>
          </div>
          
          <div className="space-y-3">
            {waitingVehiclesList.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const VehicleDetailModal = () => {
    if (!selectedVehicle) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {selectedVehicle.brand} {selectedVehicle.model} - {selectedVehicle.plate}
            </h2>
            <Button variant="ghost" onClick={() => setSelectedVehicle(null)}>×</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Informations véhicule</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Propriétaire:</strong> {selectedVehicle.owner}</p>
                <p><strong>Plaque:</strong> {selectedVehicle.plate}</p>
                <p><strong>Montant:</strong> {selectedVehicle.amount}€</p>
                <p><strong>Durée estimée:</strong> {selectedVehicle.duration}</p>
                <p><strong>Description:</strong> {selectedVehicle.description}</p>
                <p><strong>Étape:</strong> {selectedVehicle.step}</p>
                {selectedVehicle.technician && (
                  <p><strong>Technicien:</strong> {selectedVehicle.technician}</p>
                )}
                <p><strong>Statut:</strong> {selectedVehicle.status}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Actions</h3>
              <div className="space-y-2">
                <Button className="w-full" variant="default">
                  Modifier le planning
                </Button>
                <Button className="w-full" variant="outline">
                  Voir les détails complets
                </Button>
                <Button className="w-full" variant="outline">
                  Historique des interventions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant={currentView === 'manager' ? 'default' : 'outline'}
              onClick={() => setCurrentView('manager')}
              className="bg-blue-500 text-white"
            >
              👤 Vue Manager
            </Button>
            <Button
              variant={currentView === 'employee' ? 'default' : 'outline'}
              onClick={() => setCurrentView('employee')}
            >
              👤 Vue Employé
            </Button>
          </div>
          
          <Button variant="destructive" className="bg-red-500">
            <Zap className="h-4 w-4 mr-2" />
            Véhicule Urgence
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setCurrentTab('etapes')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              currentTab === 'etapes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Zap className="h-4 w-4 inline mr-2" />
            Étapes atelier
          </button>
          <button
            onClick={() => setCurrentTab('planning')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              currentTab === 'planning'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            Planning
          </button>
          <button
            onClick={() => setCurrentTab('employees')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              currentTab === 'employees'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock className="h-4 w-4 inline mr-2" />
            Planning Employés
          </button>
          <button
            onClick={() => setCurrentTab('staff')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              currentTab === 'staff'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Employés
          </button>
          <button
            onClick={() => setCurrentTab('process')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              currentTab === 'process'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Process
          </button>
        </div>
      </div>

      <div className="p-6">
        {currentTab === 'etapes' && (
          <>
            {/* Header Section */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Étapes atelier</h1>
              <p className="text-gray-600 mb-6">Parcours complet avec synchronisation planning automatique</p>
              
              {/* Stats */}
              <div className="grid grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{totalVehicles}</div>
                  <div className="text-sm text-gray-500">VÉHICULES</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{completedVehicles}</div>
                  <div className="text-sm text-gray-500">TERMINÉS</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{waitingVehicles}</div>
                  <div className="text-sm text-gray-500">EN ATTENTE</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{totalAmount}€</div>
                  <div className="text-sm text-gray-500">CA EN COURS</div>
                </div>
              </div>

              {/* Alert Section */}
              <div 
                className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 cursor-pointer hover:bg-orange-100 transition-colors"
                onClick={() => setShowWaitingModal(true)}
              >
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                  <div>
                    <p className="font-medium text-orange-800">{waitingVehicles} véhicules en attente</p>
                    <p className="text-sm text-orange-600">Pièces: 2 • Approbations: 1 • Techniciens: 1</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Workshop Steps */}
            <div className="space-y-6">
              {steps.map((step) => {
                const stepVehicles = getVehiclesByStep(step);
                return (
                  <div key={step} className={`border-l-4 ${getStepColor(step)} bg-white rounded-r-lg p-6`}>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      {step} <span className="text-sm font-normal text-gray-500">{stepVehicles.length} véhicule(s)</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {stepVehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {currentTab === 'planning' && (
          <div className="text-center py-20">
            <Calendar className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-500">Vue Planning</h2>
            <p className="text-gray-400">Cette vue sera développée prochainement</p>
          </div>
        )}

        {currentTab === 'employees' && (
          <div className="text-center py-20">
            <Clock className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-500">Planning Employés</h2>
            <p className="text-gray-400">Cette vue sera développée prochainement</p>
          </div>
        )}

        {currentTab === 'staff' && (
          <div className="text-center py-20">
            <Users className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-500">Gestion des Employés</h2>
            <p className="text-gray-400">Cette vue sera développée prochainement</p>
          </div>
        )}

        {currentTab === 'process' && (
          <div className="text-center py-20">
            <Zap className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-500">Gestion des Processus</h2>
            <p className="text-gray-400">Cette vue sera développée prochainement</p>
          </div>
        )}
      </div>

      <WaitingVehiclesModal />
      <VehicleDetailModal />
    </div>
  );
};

export default Planning;
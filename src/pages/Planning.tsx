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
    
    const waitingVehicles = [
      {
        id: '1',
        brand: 'Peugeot',
        model: '308',
        plate: 'AB-123-CD',
        client: 'M. Dupont',
        price: 2500,
        blockedStage: 'Réparation carrosserie',
        waitingDays: 196,
        status: 'Normale',
        reason: 'Attente pièces',
        detail: 'Pare-chocs avant en commande - Délai 5-7 jours'
      },
      {
        id: '2',
        brand: 'Renault',
        model: 'Clio',
        plate: 'FG-456-GH',
        client: 'Mme Martin',
        price: 1200,
        blockedStage: 'Expertise',
        waitingDays: 197,
        status: 'Urgent',
        reason: 'Accord expert assurance',
        detail: 'En attente validation devis par expert AXA'
      },
      {
        id: '3',
        brand: 'BMW',
        model: 'Série 3',
        plate: 'PQ-012-UV',
        client: 'M. Leroy',
        price: 3200,
        blockedStage: 'Réparation',
        waitingDays: 106,
        status: 'Normale',
        reason: 'Attente pièces',
        detail: 'Optique avant droite en commande'
      }
    ];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Véhicules en Attente</h2>
              <p className="text-sm text-gray-500">5 véhicule(s) bloqué(s) dans les étapes atelier</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                ← Retour
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowWaitingModal(false)}>
                ✕
              </Button>
            </div>
          </div>

          {/* Vehicle List */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
            {waitingVehicles.map((vehicle) => (
              <div key={vehicle.id} className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {vehicle.plate}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      vehicle.status === 'Urgent' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      ● {vehicle.status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      ✓ Débloquer
                    </Button>
                    <Button variant="outline" size="sm">
                      📅 Planifier
                    </Button>
                    <Button variant="outline" size="sm">
                      ✏️ Modifier
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Client :</span>
                    <p className="font-medium">{vehicle.client}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Prix :</span>
                    <p className="font-medium text-green-600">{vehicle.price}€</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Étape bloquée :</span>
                    <p className="font-medium">{vehicle.blockedStage}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">En attente depuis :</span>
                    <p className="font-medium text-red-600">{vehicle.waitingDays} jour(s)</p>
                  </div>
                </div>

                <div className="mt-4 bg-orange-50 border border-orange-200 rounded p-3">
                  <div className="flex items-start space-x-2">
                    <span className="text-orange-600">⚠️</span>
                    <div>
                      <p className="font-medium text-orange-800">
                        Raison du blocage : {vehicle.reason}
                      </p>
                      <p className="text-sm text-orange-700 mt-1">
                        {vehicle.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t p-4 bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Répartition des blocages :</span>
              <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Pièces: 2</span>
              <span className="ml-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Expertise: 1</span>
              <span className="ml-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Technicien: 1</span>
              <span className="ml-1 bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Problèmes: 1</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                📊 Exporter
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowWaitingModal(false)}>
                Fermer
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const VehicleDetailModal = () => {
    if (!selectedVehicle) return null;
    
    const workshopSteps = [
      { name: 'Accueil & Préparation', progress: 100, status: 'completed' },
      { name: 'Remplacement ou débosselage', progress: 60, status: 'in-progress' },
      { name: 'Préparation peinture', progress: 0, status: 'pending' },
      { name: 'Mise en peinture', progress: 0, status: 'pending' },
      { name: 'Finitions & remontage', progress: 0, status: 'pending' },
      { name: 'Clôture & livraison', progress: 0, status: 'pending' }
    ];

    const repairs = [
      { name: 'Pare-chocs avant', type: 'Remplacement', price: 450, status: 'Terminé' },
      { name: 'Aile avant droite', type: 'Débosselage + peinture', price: 680, status: 'En cours' },
      { name: 'Optique avant', type: 'Remplacement', price: 220, status: 'À planifier' }
    ];

    const parts = [
      { name: 'Pare-chocs avant', ref: 'PC-AV-001', price: 180, status: 'disponible' },
      { name: 'Optique avant droite', ref: 'OPT-AV-R', price: 95, status: 'commande' },
      { name: 'Peinture RAL 9003', ref: 'PEIN-RAL', price: 45, status: 'disponible' }
    ];

    const history = [
      { date: '08/01/2025 09:00', user: 'Martin Dubois', action: 'Réception véhicule' },
      { date: '08/01/2025 10:30', user: 'Martin Dubois', action: 'Début démontage pare-chocs' },
      { date: '08/01/2025 14:00', user: 'Martin Dubois', action: 'Démontage terminé' },
      { date: '09/01/2025 08:00', user: 'Sophie Martin', action: 'Début débosselage aile' }
    ];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-lg font-medium text-gray-900">
              Détail du véhicule - {selectedVehicle.plate}
            </h2>
            <div className="flex items-center space-x-3">
              <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
                En cours
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedVehicle(null)}>
                ✕
              </Button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[80vh]">
            {/* Vehicle and Client Info */}
            <div className="p-6 grid grid-cols-2 gap-8 border-b">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="flex items-center text-sm font-medium text-gray-900 mb-3">
                  📄 Informations véhicule
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Modèle:</span>
                    <span className="font-medium">{selectedVehicle.brand} {selectedVehicle.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plaque:</span>
                    <span className="font-medium">{selectedVehicle.plate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Étape actuelle:</span>
                    <span className="font-medium text-blue-600">{selectedVehicle.step}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Temps estimé:</span>
                    <span className="font-medium">{selectedVehicle.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix total:</span>
                    <span className="font-medium text-blue-600">{selectedVehicle.amount}€</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="flex items-center text-sm font-medium text-gray-900 mb-3">
                  👤 Informations client
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">👤</span>
                    <span className="font-medium">{selectedVehicle.owner}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">📞</span>
                    <span>06.12.34.56.78</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">✉️</span>
                    <span>client@example.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">📍</span>
                    <span>123 Rue de la République, 75001 Paris</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Workshop Progress */}
            <div className="p-6 border-b">
              <h3 className="flex items-center text-sm font-medium text-gray-900 mb-4">
                ✅ Progression des étapes atelier (27%)
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '27%' }}></div>
              </div>
              
              <div className="space-y-4">
                {workshopSteps.map((step, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-700">{step.name}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium">{step.progress}%</span>
                      {step.status === 'completed' && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">100% ✓</span>
                      )}
                      {step.status === 'in-progress' && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">60% ⏱️</span>
                      )}
                      {step.status === 'pending' && (
                        <span className="text-gray-400 text-xs">0%</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insurance and Repairs sections */}
            <div className="p-6 grid grid-cols-2 gap-8 border-b">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="flex items-center text-sm font-medium text-gray-900 mb-3">
                  🛡️ Assurance
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Compagnie:</span>
                    <span className="font-medium">AXA Assurance</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">N° Sinistre:</span>
                    <span className="font-medium">SIN-2025-001234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expert:</span>
                    <span className="font-medium">M. Dupont</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Franchise:</span>
                    <span className="font-medium">300€</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="flex items-center text-sm font-medium text-gray-900 mb-3">
                  🔧 Réparations
                </h3>
                <div className="space-y-2">
                  {repairs.map((repair, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{repair.name}</p>
                        <p className="text-xs text-gray-500">{repair.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{repair.price}€</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          repair.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                          repair.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {repair.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Parts and History sections */}
            <div className="p-6 grid grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="flex items-center text-sm font-medium text-gray-900 mb-3">
                  ⚠️ Pièces
                </h3>
                <div className="space-y-2">
                  {parts.map((part, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{part.name}</p>
                        <p className="text-xs text-gray-500">{part.ref}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{part.price}€</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          part.status === 'disponible' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {part.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="flex items-center text-sm font-medium text-gray-900 mb-3">
                  📅 Historique
                </h3>
                <div className="space-y-2">
                  {history.map((entry, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-3">
                      <p className="text-sm font-medium">{entry.action}</p>
                      <p className="text-xs text-gray-500">{entry.date} - {entry.user}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-4 bg-gray-50 flex justify-end">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">👤 Technicien: {selectedVehicle.technician || 'Martin Dubois'}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedVehicle(null)}>
                Fermer
              </Button>
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
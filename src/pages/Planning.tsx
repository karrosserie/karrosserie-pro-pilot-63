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
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b bg-white">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Véhicules en Attente</h2>
              <p className="text-sm text-gray-500">5 véhicule(s) bloqué(s) dans les étapes atelier</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
                ← Retour
              </button>
              <button 
                onClick={() => setShowWaitingModal(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[70vh] space-y-4">
            {/* Peugeot 308 */}
            <div className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold">Peugeot 308</h3>
                  <span className="bg-gray-100 px-2 py-1 rounded text-sm">AB-123-CD</span>
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-600">Normale</span>
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    ✓ Débloquer
                  </button>
                  <button className="border px-3 py-1 rounded text-sm hover:bg-gray-50">
                    📅 Planifier
                  </button>
                  <button className="border px-3 py-1 rounded text-sm hover:bg-gray-50">
                    ✏️ Modifier
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-3 text-sm">
                <div>
                  <div className="text-gray-600">Client :</div>
                  <div className="font-medium">M. Dupont</div>
                </div>
                <div>
                  <div className="text-gray-600">Prix :</div>
                  <div className="font-medium text-green-600">2500€</div>
                </div>
                <div>
                  <div className="text-gray-600">Étape bloquée :</div>
                  <div className="font-medium">Réparation carrosserie</div>
                </div>
                <div>
                  <div className="text-gray-600">En attente depuis :</div>
                  <div className="font-medium text-red-600">196 jour(s)</div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-600">⚠️</span>
                  <div>
                    <div className="font-medium text-yellow-800">Raison du blocage : Attente pièces</div>
                    <div className="text-sm text-yellow-700">Pare-chocs avant en commande - Délai 5-7 jours</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Renault Clio */}
            <div className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold">Renault Clio</h3>
                  <span className="bg-gray-100 px-2 py-1 rounded text-sm">FG-456-GH</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">Urgent</span>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    ✓ Débloquer
                  </button>
                  <button className="border px-3 py-1 rounded text-sm hover:bg-gray-50">
                    📅 Planifier
                  </button>
                  <button className="border px-3 py-1 rounded text-sm hover:bg-gray-50">
                    ✏️ Modifier
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-3 text-sm">
                <div>
                  <div className="text-gray-600">Client :</div>
                  <div className="font-medium">Mme Martin</div>
                </div>
                <div>
                  <div className="text-gray-600">Prix :</div>
                  <div className="font-medium text-green-600">1200€</div>
                </div>
                <div>
                  <div className="text-gray-600">Étape bloquée :</div>
                  <div className="font-medium">Expertise</div>
                </div>
                <div>
                  <div className="text-gray-600">En attente depuis :</div>
                  <div className="font-medium text-red-600">197 jour(s)</div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-600">⚠️</span>
                  <div>
                    <div className="font-medium text-yellow-800">Raison du blocage : Accord expert assurance</div>
                    <div className="text-sm text-yellow-700">En attente validation devis par expert AXA</div>
                  </div>
                </div>
              </div>
            </div>

            {/* BMW Série 3 */}
            <div className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold">BMW Série 3</h3>
                  <span className="bg-gray-100 px-2 py-1 rounded text-sm">PQ-012-UV</span>
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-600">Normale</span>
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    ✓ Débloquer
                  </button>
                  <button className="border px-3 py-1 rounded text-sm hover:bg-gray-50">
                    📅 Planifier
                  </button>
                  <button className="border px-3 py-1 rounded text-sm hover:bg-gray-50">
                    ✏️ Modifier
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-3 text-sm">
                <div>
                  <div className="text-gray-600">Client :</div>
                  <div className="font-medium">M. Leroy</div>
                </div>
                <div>
                  <div className="text-gray-600">Prix :</div>
                  <div className="font-medium text-green-600">3200€</div>
                </div>
                <div>
                  <div className="text-gray-600">Étape bloquée :</div>
                  <div className="font-medium">Réparation</div>
                </div>
                <div>
                  <div className="text-gray-600">En attente depuis :</div>
                  <div className="font-medium text-red-600">106 jour(s)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-600">Répartition des blocages :</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Pièces: 2</span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Expertise: 1</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Technicien: 1</span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Problèmes: 1</span>
              </div>
              <div className="flex space-x-2">
                <button className="border px-3 py-1 rounded text-sm hover:bg-gray-50">
                  📊 Exporter
                </button>
                <button 
                  onClick={() => setShowWaitingModal(false)}
                  className="border px-3 py-1 rounded text-sm hover:bg-gray-50"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const VehicleDetailModal = () => {
    if (!selectedVehicle) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Détail du véhicule - {selectedVehicle.plate}</h2>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm">En cours</span>
              <button 
                onClick={() => setSelectedVehicle(null)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[80vh]">
            {/* Vehicle and Client Info Grid */}
            <div className="p-6 grid grid-cols-2 gap-6">
              {/* Vehicle Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="flex items-center text-base font-semibold mb-4">
                  📄 Informations véhicule
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Modèle:</span>
                    <span className="font-medium">Citroën C4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plaque:</span>
                    <span className="font-medium">{selectedVehicle.plate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Étape actuelle:</span>
                    <span className="font-medium text-blue-600">Devis en cours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Temps estimé:</span>
                    <span className="font-medium">0.5h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix total:</span>
                    <span className="font-medium text-blue-600">800€</span>
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="flex items-center text-base font-semibold mb-4">
                  👤 Informations client
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span>👤</span>
                    <span className="font-medium">M. Durand</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>📞</span>
                    <span>06.12.34.56.78</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>✉️</span>
                    <span>client@example.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>📍</span>
                    <span>123 Rue de la République, 75001 Paris</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="px-6 pb-6">
              <h3 className="flex items-center text-base font-semibold mb-4">
                ✅ Progression des étapes atelier (27%)
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div className="bg-blue-600 h-3 rounded-full" style={{ width: '27%' }}></div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm">Accueil & Préparation</span>
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">100% ✓</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm">Remplacement ou débosselage</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">60% ⏱️</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm">Préparation peinture</span>
                  <span className="text-gray-400 text-xs">0%</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm">Mise en peinture</span>
                  <span className="text-gray-400 text-xs">0%</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm">Finitions & remontage</span>
                  <span className="text-gray-400 text-xs">0%</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">Clôture & livraison</span>
                  <span className="text-gray-400 text-xs">0%</span>
                </div>
              </div>
            </div>

            {/* Bottom Grid Sections */}
            <div className="px-6 pb-6 grid grid-cols-2 gap-6">
              {/* Insurance */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="flex items-center text-base font-semibold mb-4">
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

              {/* Repairs */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="flex items-center text-base font-semibold mb-4">
                  🔧 Réparations
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">Pare-chocs avant</div>
                      <div className="text-xs text-gray-500">Remplacement</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">450€</div>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Terminé</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">Aile avant droite</div>
                      <div className="text-xs text-gray-500">Débosselage + peinture</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">680€</div>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">En cours</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">Optique avant</div>
                      <div className="text-xs text-gray-500">Remplacement</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">220€</div>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">À planifier</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Bottom Grid */}
            <div className="px-6 pb-6 grid grid-cols-2 gap-6">
              {/* Parts */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="flex items-center text-base font-semibold mb-4">
                  ⚠️ Pièces
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">Pare-chocs avant</div>
                      <div className="text-xs text-gray-500">PC-AV-001</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">180€</div>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">disponible</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">Optique avant droite</div>
                      <div className="text-xs text-gray-500">OPT-AV-R</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">95€</div>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">commande</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">Peinture RAL 9003</div>
                      <div className="text-xs text-gray-500">PEIN-RAL</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">45€</div>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">disponible</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* History */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="flex items-center text-base font-semibold mb-4">
                  📅 Historique
                </h3>
                <div className="space-y-3">
                  <div className="border-l-2 border-blue-200 pl-3">
                    <div className="font-medium text-sm">Réception véhicule</div>
                    <div className="text-xs text-gray-500">08/01/2025 09:00 - Martin Dubois</div>
                  </div>
                  <div className="border-l-2 border-blue-200 pl-3">
                    <div className="font-medium text-sm">Début démontage pare-chocs</div>
                    <div className="text-xs text-gray-500">08/01/2025 10:30 - Martin Dubois</div>
                  </div>
                  <div className="border-l-2 border-blue-200 pl-3">
                    <div className="font-medium text-sm">Démontage terminé</div>
                    <div className="text-xs text-gray-500">08/01/2025 14:00 - Martin Dubois</div>
                  </div>
                  <div className="border-l-2 border-blue-200 pl-3">
                    <div className="font-medium text-sm">Début débosselage aile</div>
                    <div className="text-xs text-gray-500">09/01/2025 08:00 - Sophie Martin</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-4 py-3 flex justify-end">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">👤 Technicien: Martin Dubois</span>
              <button 
                onClick={() => setSelectedVehicle(null)}
                className="border px-3 py-1 rounded text-sm hover:bg-gray-50"
              >
                Fermer
              </button>
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
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Planning Détaillé</h1>
              <p className="text-gray-600">Toutes les tâches par véhicule et jour par jour</p>
            </div>

            {/* Weekly Planning Grid */}
            <div className="grid grid-cols-5 gap-4">
              {/* Lundi */}
              <div className="bg-white rounded-lg border p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-blue-600">Lundi</h3>
                  <p className="text-sm text-gray-500">3 tâche(s)</p>
                </div>
                <div className="space-y-3">
                  {/* Card 1 */}
                  <div className="border-l-4 border-l-blue-500 bg-gray-50 rounded-r p-3">
                    <div className="flex items-center text-xs text-blue-600 mb-1">
                      <span className="mr-1">🕘</span>
                      9h-10h
                    </div>
                    <div className="font-semibold text-sm mb-1">EZ-787-KL</div>
                    <div className="text-xs text-gray-600 mb-1">Citroën C4</div>
                    <div className="text-xs text-blue-600 font-medium mb-1">Accueil & Préparation</div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <span className="mr-1">👤</span>
                      Martin Dubois
                    </div>
                    <div className="text-xs text-gray-500">Client: M. Durand</div>
                    <div className="mt-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded text-center">
                      Accueil & Préparation du dossier
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="border-l-4 border-l-green-500 bg-gray-50 rounded-r p-3">
                    <div className="flex items-center text-xs text-blue-600 mb-1">
                      <span className="mr-1">🕙</span>
                      10h-12h
                    </div>
                    <div className="font-semibold text-sm mb-1">VS-901-AB</div>
                    <div className="text-xs text-gray-600 mb-1">Audi A4</div>
                    <div className="text-xs text-green-600 font-medium mb-1">Débosselage portière</div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <span className="mr-1">👤</span>
                      Sophie Martin
                    </div>
                    <div className="text-xs text-gray-500">Client: M. Bernard</div>
                    <div className="mt-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded text-center">
                      Remplacement ou débosselage
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="border-l-4 border-l-yellow-500 bg-gray-50 rounded-r p-3">
                    <div className="flex items-center text-xs text-blue-600 mb-1">
                      <span className="mr-1">🕕</span>
                      14h-16h30
                    </div>
                    <div className="font-semibold text-sm mb-1">AB-789-XY</div>
                    <div className="text-xs text-gray-600 mb-1">Peugeot 308</div>
                    <div className="text-xs text-yellow-600 font-medium mb-1">Ponçage aile avant</div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <span className="mr-1">👤</span>
                      Sophie Martin
                    </div>
                    <div className="text-xs text-gray-500">Client: Mme Moreau</div>
                    <div className="mt-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded text-center">
                      Préparation peinture
                    </div>
                  </div>
                </div>
              </div>

              {/* Mardi */}
              <div className="bg-white rounded-lg border p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-blue-600">Mardi</h3>
                  <p className="text-sm text-gray-500">3 tâche(s)</p>
                </div>
                <div className="space-y-3">
                  {/* Card 1 */}
                  <div className="border-l-4 border-l-blue-500 bg-gray-50 rounded-r p-3">
                    <div className="flex items-center text-xs text-blue-600 mb-1">
                      <span className="mr-1">🕗</span>
                      8h-9h
                    </div>
                    <div className="font-semibold text-sm mb-1">QR-345-ST</div>
                    <div className="text-xs text-gray-600 mb-1">Mercedes Classe C</div>
                    <div className="text-xs text-blue-600 font-medium mb-1">Expertise assurance</div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <span className="mr-1">👤</span>
                      Martin Dubois
                    </div>
                    <div className="text-xs text-gray-500">Client: Mme Leclerc</div>
                    <div className="mt-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded text-center">
                      Accueil & Préparation du dossier
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="border-l-4 border-l-red-500 bg-gray-50 rounded-r p-3">
                    <div className="flex items-center text-xs text-blue-600 mb-1">
                      <span className="mr-1">🕘</span>
                      9h-13h
                    </div>
                    <div className="font-semibold text-sm mb-1">CD-123-ZW</div>
                    <div className="text-xs text-gray-600 mb-1">Renault Clio</div>
                    <div className="text-xs text-red-600 font-medium mb-1">Application base peinture</div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <span className="mr-1">👤</span>
                      Sophie Martin
                    </div>
                    <div className="text-xs text-gray-500">Client: M. Petit</div>
                    <div className="mt-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded text-center">
                      Mise en peinture
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="border-l-4 border-l-orange-500 bg-gray-50 rounded-r p-3">
                    <div className="flex items-center text-xs text-blue-600 mb-1">
                      <span className="mr-1">🕔</span>
                      14h-15h30
                    </div>
                    <div className="font-semibold text-sm mb-1">EF-456-UV</div>
                    <div className="text-xs text-gray-600 mb-1">Volkswagen Golf</div>
                    <div className="text-xs text-orange-600 font-medium mb-1">Polissage final</div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <span className="mr-1">👤</span>
                      Martin Dubois
                    </div>
                    <div className="text-xs text-gray-500">Client: Mme Blanc</div>
                    <div className="mt-2 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded text-center">
                      Finitions & remontage
                    </div>
                  </div>
                </div>
              </div>

              {/* Mercredi */}
              <div className="bg-white rounded-lg border p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-blue-600">Mercredi</h3>
                  <p className="text-sm text-gray-500">3 tâche(s)</p>
                </div>
                <div className="space-y-3">
                  {/* Card 1 */}
                  <div className="border-l-4 border-l-green-500 bg-gray-50 rounded-r p-3">
                    <div className="flex items-center text-xs text-blue-600 mb-1">
                      <span className="mr-1">🕗</span>
                      8h-11h
                    </div>
                    <div className="font-semibold text-sm mb-1">HT-556-GH</div>
                    <div className="text-xs text-gray-600 mb-1">BMW Série 1</div>
                    <div className="text-xs text-green-600 font-medium mb-1">Remplacement pare-chocs</div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <span className="mr-1">👤</span>
                      Sophie Martin
                    </div>
                    <div className="text-xs text-gray-500">Client: M. Rousseau</div>
                    <div className="mt-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded text-center">
                      Remplacement ou débosselage
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="border-l-4 border-l-gray-500 bg-gray-50 rounded-r p-3">
                    <div className="flex items-center text-xs text-blue-600 mb-1">
                      <span className="mr-1">🕚</span>
                      11h-11h30
                    </div>
                    <div className="font-semibold text-sm mb-1">GH-789-ST</div>
                    <div className="text-xs text-gray-600 mb-1">Ford Focus</div>
                    <div className="text-xs text-gray-600 font-medium mb-1">Contrôle qualité</div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <span className="mr-1">👤</span>
                      Martin Dubois
                    </div>
                    <div className="text-xs text-gray-500">Client: M. Roux</div>
                    <div className="mt-2 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded text-center">
                      Clôture du dossier et livraison
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="border-l-4 border-l-yellow-500 bg-gray-50 rounded-r p-3">
                    <div className="flex items-center text-xs text-blue-600 mb-1">
                      <span className="mr-1">🕑</span>
                      14h-15h
                    </div>
                    <div className="font-semibold text-sm mb-1">CD-123-ZW</div>
                    <div className="text-xs text-gray-600 mb-1">Renault Clio</div>
                    <div className="text-xs text-yellow-600 font-medium mb-1">Finitions peinture</div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <span className="mr-1">👤</span>
                      Sophie Martin
                    </div>
                    <div className="text-xs text-gray-500">Client: M. Petit</div>
                    <div className="mt-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded text-center">
                      Finitions & remontage
                    </div>
                  </div>
                </div>
              </div>

              {/* Jeudi */}
              <div className="bg-white rounded-lg border p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-blue-600">Jeudi</h3>
                  <p className="text-sm text-gray-500">2 tâche(s)</p>
                </div>
                <div className="space-y-3">
                  {/* Card 1 */}
                  <div className="border-l-4 border-l-red-500 bg-gray-50 rounded-r p-3">
                    <div className="flex items-center text-xs text-blue-600 mb-1">
                      <span className="mr-1">🕘</span>
                      9h-12h
                    </div>
                    <div className="font-semibold text-sm mb-1">AB-789-XY</div>
                    <div className="text-xs text-gray-600 mb-1">Peugeot 308</div>
                    <div className="text-xs text-red-600 font-medium mb-1">Application peinture</div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <span className="mr-1">👤</span>
                      Sophie Martin
                    </div>
                    <div className="text-xs text-gray-500">Client: Mme Moreau</div>
                    <div className="mt-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded text-center">
                      Mise en peinture
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="border-l-4 border-l-green-500 bg-gray-50 rounded-r p-3">
                    <div className="flex items-center text-xs text-blue-600 mb-1">
                      <span className="mr-1">🕔</span>
                      14h-16h
                    </div>
                    <div className="font-semibold text-sm mb-1">EZ-787-KL</div>
                    <div className="text-xs text-gray-600 mb-1">Citroën C4</div>
                    <div className="text-xs text-green-600 font-medium mb-1">Débosselage léger</div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <span className="mr-1">👤</span>
                      Martin Dubois
                    </div>
                    <div className="text-xs text-gray-500">Client: M. Durand</div>
                    <div className="mt-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded text-center">
                      Remplacement ou débosselage
                    </div>
                  </div>
                </div>
              </div>

              {/* Vendredi */}
              <div className="bg-white rounded-lg border p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-blue-600">Vendredi</h3>
                  <p className="text-sm text-gray-500">3 tâche(s)</p>
                </div>
                <div className="space-y-3">
                  {/* Card 1 */}
                  <div className="border-l-4 border-l-yellow-500 bg-gray-50 rounded-r p-3">
                    <div className="flex items-center text-xs text-blue-600 mb-1">
                      <span className="mr-1">🕗</span>
                      8h-10h
                    </div>
                    <div className="font-semibold text-sm mb-1">HT-556-GH</div>
                    <div className="text-xs text-gray-600 mb-1">BMW Série 1</div>
                    <div className="text-xs text-yellow-600 font-medium mb-1">Préparation peinture</div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <span className="mr-1">👤</span>
                      Sophie Martin
                    </div>
                    <div className="text-xs text-gray-500">Client: M. Rousseau</div>
                    <div className="mt-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded text-center">
                      Préparation peinture
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="border-l-4 border-l-orange-500 bg-gray-50 rounded-r p-3">
                    <div className="flex items-center text-xs text-blue-600 mb-1">
                      <span className="mr-1">🕙</span>
                      10h-12h
                    </div>
                    <div className="font-semibold text-sm mb-1">AB-789-XY</div>
                    <div className="text-xs text-gray-600 mb-1">Peugeot 308</div>
                    <div className="text-xs text-orange-600 font-medium mb-1">Finitions & remontage</div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <span className="mr-1">👤</span>
                      Martin Dubois
                    </div>
                    <div className="text-xs text-gray-500">Client: Mme Moreau</div>
                    <div className="mt-2 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded text-center">
                      Finitions & remontage
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="border-l-4 border-l-gray-500 bg-gray-50 rounded-r p-3">
                    <div className="flex items-center text-xs text-blue-600 mb-1">
                      <span className="mr-1">🕑</span>
                      14h-14h30
                    </div>
                    <div className="font-semibold text-sm mb-1">EZ-787-KL</div>
                    <div className="text-xs text-gray-600 mb-1">Citroën C4</div>
                    <div className="text-xs text-gray-600 font-medium mb-1">Livraison client</div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <span className="mr-1">👤</span>
                      Martin Dubois
                    </div>
                    <div className="text-xs text-gray-500">Client: M. Durand</div>
                    <div className="mt-2 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded text-center">
                      Clôture du dossier et livraison
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Week Summary */}
            <div className="mt-8">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                🗂️ Résumé de la semaine
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">14</div>
                  <div className="text-sm text-gray-600">Tâches totales</div>
                </div>
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">8</div>
                  <div className="text-sm text-gray-600">Véhicules traités</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">2</div>
                  <div className="text-sm text-gray-600">Techniciens mobilisés</div>
                </div>
              </div>
            </div>
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
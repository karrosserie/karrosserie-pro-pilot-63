import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Calendar, Edit } from 'lucide-react';

interface VehiclesWaitingTabProps {
  vehicles?: any[];
  schedules?: any[];
  employees?: any[];
  onAddToWorkflow?: (vehicleId: string) => void;
}

export const VehiclesWaitingTab = ({ 
  vehicles = [], 
  schedules = [], 
  employees = [],
  onAddToWorkflow 
}: VehiclesWaitingTabProps) => {
  
  // Données de test qui correspondent à l'image
  const waitingVehicles = [
    {
      id: '1',
      brand: 'Peugeot',
      model: '308',
      licensePlate: 'AB-123-CD',
      client: 'M. Dupont',
      price: '2500€',
      blockedStage: 'Réparation carrosserie',
      waitingSince: '254 jour(s)',
      blockingReason: 'Attente pièces',
      blockingDescription: 'Pare-chocs avant en commande - Délai 5-7 jours',
      urgent: false
    },
    {
      id: '2',
      brand: 'Renault',
      model: 'Clio',
      licensePlate: 'FG-456-GH',
      client: 'Mme Martin',
      price: '1200€',
      blockedStage: 'Expertise',
      waitingSince: '255 jour(s)',
      blockingReason: 'Accord expert assurance',
      blockingDescription: 'En attente validation devis par expert AXA',
      urgent: true
    },
    {
      id: '3',
      brand: 'BMW',
      model: 'Série 3',
      licensePlate: 'PQ-012-UV',
      client: 'M. Leroy',
      price: '3200€',
      blockedStage: 'Préparation',
      waitingSince: '253 jour(s)',
      blockingReason: 'Attente technicien',
      blockingDescription: 'Spécialiste BMW requis - Disponible jeudi',
      urgent: false
    },
    {
      id: '4',
      brand: 'Volkswagen',
      model: 'Golf',
      licensePlate: 'XY-789-ZA',
      client: 'M. Durand',
      price: '1800€',
      blockedStage: 'Peinture',
      waitingSince: '254 jour(s)',
      blockingReason: 'Problème découvert',
      blockingDescription: 'Corrosion cachée détectée - Devis supplémentaire requis',
      urgent: false
    }
  ];

  const blockedCount = waitingVehicles.length;

  return (
    <div className="space-y-6">
      {/* Header avec badge rouge */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-bold">Véhicules en Attente</h2>
          <Badge className="bg-red-500 text-white font-medium px-3 py-1">
            {blockedCount} véhicule{blockedCount > 1 ? 's' : ''} bloqué{blockedCount > 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Sous-titre */}
      <div className="text-sm text-muted-foreground mb-6">
        {blockedCount} véhicule{blockedCount > 1 ? 's' : ''} bloqué{blockedCount > 1 ? 's' : ''} dans les étapes atelier
      </div>

      {/* Liste des véhicules */}
      <div className="space-y-4">
        {waitingVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white border border-slate-200 rounded-lg p-6">
            {/* En-tête avec marque/modèle et plaque */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900">
                  {vehicle.brand} {vehicle.model}
                </h3>
                <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                  {vehicle.licensePlate}
                </span>
                {vehicle.urgent && (
                  <Badge className="bg-red-500 text-white text-xs">Urgent</Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  Débloquer
                </Button>
                <Button size="sm" variant="default" className="bg-blue-600 hover:bg-blue-700">
                  <Calendar className="w-4 h-4 mr-1" />
                  Planifier
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4 mr-1" />
                  Modifier
                </Button>
              </div>
            </div>

            {/* Informations en colonnes */}
            <div className="grid grid-cols-4 gap-6 mb-4 text-sm">
              <div>
                <span className="text-slate-500">Client :</span>
                <div className="font-medium text-slate-900">{vehicle.client}</div>
              </div>
              <div>
                <span className="text-slate-500">Prix :</span>
                <div className="font-medium text-slate-900">{vehicle.price}</div>
              </div>
              <div>
                <span className="text-slate-500">Étape bloquée :</span>
                <div className="font-medium text-blue-600">{vehicle.blockedStage}</div>
              </div>
              <div>
                <span className="text-slate-500">En attente depuis :</span>
                <div className="font-medium text-orange-600">{vehicle.waitingSince}</div>
              </div>
            </div>

            {/* Raison du blocage */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Raison du blocage : {vehicle.blockingReason}</span>
              </div>
              <div className="text-sm text-yellow-700">
                {vehicle.blockingDescription}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
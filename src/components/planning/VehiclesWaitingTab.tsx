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
  
  // Utiliser les vraies données de la base
  const waitingVehicles = vehicles.filter(vehicle => 
    !schedules.some(schedule => schedule.vehicle_id === vehicle.id)
  ).map(vehicle => ({
    id: vehicle.id,
    brand: vehicle.car_brands?.name || 'Marque inconnue',
    model: vehicle.car_models?.name || 'Modèle inconnu',
    licensePlate: vehicle.license_plate || 'N/A',
    client: vehicle.clients ? `${vehicle.clients.first_name} ${vehicle.clients.last_name}` : 'Client inconnu',
    price: '0€',
    blockedStage: 'En attente de planification',
    waitingSince: '0 jour(s)',
    blockingReason: 'En attente',
    blockingDescription: 'Véhicule en attente de planification dans l\'atelier',
    urgent: false
  }));

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
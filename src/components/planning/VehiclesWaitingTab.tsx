import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Calendar, Edit } from 'lucide-react';
import { PlanVehicleModal } from './PlanVehicleModal';

interface VehiclesWaitingTabProps {
  vehicles?: any[];
  employees?: any[];
  onAddToWorkflow?: (vehicleId: string) => void;
  companyId?: string | null;
  onRefresh?: () => void;
}

export const VehiclesWaitingTab = ({ 
  vehicles = [], 
  employees = [],
  onAddToWorkflow,
  companyId,
  onRefresh
}: VehiclesWaitingTabProps) => {
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  
  // Utiliser directement les données du hook useWaitingVehicles qui sont déjà consolidées
  const waitingVehicles = vehicles.map(vehicle => {
    console.log('🔍 Processing waiting vehicle:', {
      id: vehicle.id,
      license_plate: vehicle.license_plate,
      waiting_reason: vehicle.waiting_reason,
      waiting_since: vehicle.waiting_since
    });

    const hasWaitingReason = !!vehicle.waiting_reason;
    const waitingSinceDays = vehicle.waiting_since ? 
      Math.floor((new Date().getTime() - new Date(vehicle.waiting_since).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    return {
      id: vehicle.id,
      brand: vehicle.car_brands?.name || 'Marque non renseignée',
      model: vehicle.car_models?.name || 'Modèle non renseigné',
      licensePlate: vehicle.license_plate || 'N/A',
      client: vehicle.clients ? `${vehicle.clients.first_name} ${vehicle.clients.last_name}` : 'Client non renseigné',
      price: '0€',
      blockedStage: hasWaitingReason ? 'Mis en attente par employé' : 'En attente de planification',
      waitingSince: `${waitingSinceDays} jour(s)`,
      blockingReason: hasWaitingReason ? vehicle.waiting_reason : 'En attente de planification',
      blockingDescription: hasWaitingReason ? 
        `Véhicule mis en attente par un employé pour la raison suivante : ${vehicle.waiting_reason}` :
        'Véhicule en attente de planification dans l\'atelier',
      urgent: false,
      hasWaitingReason: hasWaitingReason
    };
  });

  console.log('✅ Final processed waitingVehicles:', waitingVehicles.map(v => ({
    id: v.id,
    licensePlate: v.licensePlate,
    blockingReason: v.blockingReason,
    hasWaitingReason: v.hasWaitingReason
  })));

  const blockedCount = waitingVehicles.length;

  const handlePlanVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setIsPlanModalOpen(true);
  };

  const handlePlanSuccess = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleUnblockVehicle = (vehicleId: string) => {
    console.log('Débloquer véhicule:', vehicleId);
    // TODO: Implémenter la logique de déblocage
  };

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
        {waitingVehicles.map((vehicle, index) => (
          <div key={`vehicle-${vehicle.id || index}-${vehicle.licensePlate || index}`} className="bg-white border border-slate-200 rounded-lg p-6">
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
                <Button 
                  size="sm" 
                  variant="default" 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => handlePlanVehicle(vehicle)}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Planifier
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
            <div className={`rounded-lg p-3 ${
              vehicle.hasWaitingReason 
                ? 'bg-red-50 border border-red-200' 
                : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={`w-4 h-4 ${
                  vehicle.hasWaitingReason ? 'text-red-600' : 'text-yellow-600'
                }`} />
                <span className={`font-medium ${
                  vehicle.hasWaitingReason ? 'text-red-800' : 'text-yellow-800'
                }`}>
                  {vehicle.hasWaitingReason ? 'Mis en attente par l\'employé' : 'Raison du blocage'} : {vehicle.blockingReason}
                </span>
              </div>
              <div className={`text-sm ${
                vehicle.hasWaitingReason ? 'text-red-700' : 'text-yellow-700'
              }`}>
                {vehicle.blockingDescription}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de planification */}
      <PlanVehicleModal
        isOpen={isPlanModalOpen}
        onClose={() => {
          setIsPlanModalOpen(false);
          setSelectedVehicle(null);
        }}
        vehicle={selectedVehicle}
        employees={employees}
        companyId={companyId}
        onSuccess={handlePlanSuccess}
      />
    </div>
  );
};
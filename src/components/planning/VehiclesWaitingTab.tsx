import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Car, User, Euro, ArrowRight } from 'lucide-react';

interface WaitingVehicle {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
  client: string;
  price: string;
  estimatedDuration: string;
  description: string;
  priority: 'Normal' | 'Urgent' | 'Très urgent';
  arrivalDate: string;
  waitingTime: string;
}

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
  const getPriorityBadge = (priority: WaitingVehicle['priority']) => {
    switch (priority) {
      case 'Très urgent':
        return <Badge className="bg-red-100 text-red-800">Très urgent</Badge>;
      case 'Urgent':
        return <Badge className="bg-orange-100 text-orange-800">Urgent</Badge>;
      case 'Normal':
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getPriorityOrder = (priority: WaitingVehicle['priority']) => {
    switch (priority) {
      case 'Très urgent': return 0;
      case 'Urgent': return 1;
      case 'Normal': return 2;
    }
  };

  // Helper functions
  const calculateWaitingTime = (createdAt: string): string => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} jour${days > 1 ? 's' : ''}`;
    }
  };

  const getVehiclePriority = (vehicle: any): 'Normal' | 'Urgent' | 'Très urgent' => {
    // Déterminer la priorité basée sur certains critères
    // Pour l'instant, on retourne Normal par défaut
    return 'Normal';
  };

  const findEmployeeName = (userId: string): string => {
    const employee = employees.find(emp => emp.user_id === userId);
    return employee ? employee.nom : 'Non assigné';
  };

  // Convertir les véhicules de la base de données en format WaitingVehicle
  const waitingVehicles: WaitingVehicle[] = vehicles
    .filter(vehicle => {
      // Filtrer les véhicules qui ne sont pas encore dans un planning actif
      const hasActiveSchedule = schedules.some(schedule => 
        schedule.vehicle_id === vehicle.id && 
        (schedule.status === 'En cours' || schedule.status === 'En attente')
      );
      return !hasActiveSchedule;
    })
    .map(vehicle => ({
      id: vehicle.id,
      brand: vehicle.car_brands?.name || 'Marque inconnue',
      model: vehicle.car_models?.name || 'Modèle inconnu',
      licensePlate: vehicle.license_plate || 'Plaque inconnue',
      client: vehicle.clients ? `${vehicle.clients.first_name} ${vehicle.clients.last_name}` : 'Client inconnu',
      price: '0€', // TODO: Calculer le prix réel depuis les ordres de réparation
      estimatedDuration: '2h', // TODO: Calculer la durée estimée
      description: 'En attente de planification',
      priority: getVehiclePriority(vehicle),
      arrivalDate: new Date(vehicle.created_at).toLocaleDateString('fr-FR'),
      waitingTime: calculateWaitingTime(vehicle.created_at)
    }));

  const sortedVehicles = [...waitingVehicles].sort((a, b) => 
    getPriorityOrder(a.priority) - getPriorityOrder(b.priority)
  );

  const handleAddToWorkflow = (vehicleId: string) => {
    console.log('Adding vehicle to workflow:', vehicleId);
    if (onAddToWorkflow) {
      onAddToWorkflow(vehicleId);
    }
  };

  const stats = {
    total: waitingVehicles.length,
    urgent: waitingVehicles.filter(v => v.priority === 'Urgent').length,
    veryUrgent: waitingVehicles.filter(v => v.priority === 'Très urgent').length,
    totalValue: waitingVehicles.reduce((acc, v) => acc + parseFloat(v.price.replace('€', '')), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Véhicules en Attente</h2>
        <p className="text-muted-foreground">Véhicules prêts à intégrer le processus de réparation</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total véhicules</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.veryUrgent}</div>
            <div className="text-sm text-muted-foreground">Très urgent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.urgent}</div>
            <div className="text-sm text-muted-foreground">Urgent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalValue.toLocaleString()}€</div>
            <div className="text-sm text-muted-foreground">Valeur totale</div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicles List */}
      <div className="grid gap-4">
        {sortedVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  {/* Vehicle Info */}
                  <div className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="font-semibold text-lg">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
                    </div>
                    {getPriorityBadge(vehicle.priority)}
                  </div>

                  {/* Client & Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{vehicle.client}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{vehicle.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>~{vehicle.estimatedDuration}</span>
                    </div>
                    <div className="text-muted-foreground">
                      En attente: <span className="font-medium">{vehicle.waitingTime}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm bg-muted p-2 rounded">
                    <strong>Travaux:</strong> {vehicle.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="ml-4 flex flex-col gap-2">
                  <Button 
                    onClick={() => handleAddToWorkflow(vehicle.id)}
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Démarrer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {waitingVehicles.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun véhicule en attente</h3>
            <p className="text-muted-foreground">Tous les véhicules sont dans le processus de réparation</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
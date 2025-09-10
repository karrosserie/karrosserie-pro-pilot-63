import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Car, User, Euro, ArrowRight, AlertTriangle } from 'lucide-react';

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

const mockWaitingVehicles: WaitingVehicle[] = [
  {
    id: '1',
    brand: 'Peugeot',
    model: '308',
    licensePlate: 'AB-123-CD',
    client: 'M. Dupont',
    price: '2500€',
    estimatedDuration: '252 jour(s)',
    description: 'Raison du blocage : Attente pièces',
    priority: 'Urgent',
    arrivalDate: '2024-01-15',
    waitingTime: '252 jour(s)'
  },
  {
    id: '2',
    brand: 'Renault',
    model: 'Megane',
    licensePlate: 'FG-456-GH',
    client: 'Mme Martin',
    price: '3800€',
    estimatedDuration: '248 jour(s)',
    description: 'Raison du blocage : Validation assurance',
    priority: 'Normal',
    arrivalDate: '2024-01-16',
    waitingTime: '248 jour(s)'
  },
  {
    id: '3',
    brand: 'BMW',
    model: 'Série 3',
    licensePlate: 'PQ-012-UV',
    client: 'M. Leroy',
    price: '3200€',
    estimatedDuration: '251 jour(s)',
    description: 'Raison du blocage : Attente technicien',
    priority: 'Très urgent',
    arrivalDate: '2024-01-17',
    waitingTime: '251 jour(s)'
  },
  {
    id: '4',
    brand: 'Volkswagen',
    model: 'Golf',
    licensePlate: 'XY-789-ZA',
    client: 'M. Durand',
    price: '1800€',
    estimatedDuration: '252 jour(s)',
    description: 'Raison du blocage : Attente pièces',
    priority: 'Normal',
    arrivalDate: '2024-01-17',
    waitingTime: '252 jour(s)'
  }
];

export const VehiclesWaitingTab = () => {
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

  const sortedVehicles = [...mockWaitingVehicles].sort((a, b) => 
    getPriorityOrder(a.priority) - getPriorityOrder(b.priority)
  );

  const handleAddToWorkflow = (vehicleId: string) => {
    console.log('Adding vehicle to workflow:', vehicleId);
    // TODO: Implement add to workflow logic
  };

  const stats = {
    total: mockWaitingVehicles.length,
    urgent: mockWaitingVehicles.filter(v => v.priority === 'Urgent').length,
    veryUrgent: mockWaitingVehicles.filter(v => v.priority === 'Très urgent').length,
    totalValue: mockWaitingVehicles.reduce((acc, v) => acc + parseFloat(v.price.replace('€', '')), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold">Véhicules en Attente</h2>
            <Badge className="bg-red-100 text-red-800">{mockWaitingVehicles.length} véhicule(s) bloqué(s)</Badge>
          </div>
          <p className="text-muted-foreground mt-1">{mockWaitingVehicles.length} véhicule(s) bloqué(s) dans les étapes atelier</p>
        </div>
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
      <div className="space-y-4">
        {sortedVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{vehicle.brand} {vehicle.model}</h3>
                    <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Client :</div>
                    <div className="font-medium">{vehicle.client}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Prix :</div>
                    <div className="font-medium">{vehicle.price}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Étape bloquée :</div>
                    <div className="font-medium">Réparation carrosserie</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">En attente depuis :</div>
                    <div className="font-medium text-orange-600">{vehicle.waitingTime}</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      className="bg-green-500 text-white hover:bg-green-600"
                      onClick={() => handleAddToWorkflow(vehicle.id)}
                    >
                      Débloquer
                    </Button>
                    <Button variant="outline">
                      Planifier
                    </Button>
                    <Button variant="outline">
                      Modifier
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Blocking reason */}
              <div className="bg-orange-50 border-t border-orange-200 px-6 py-3">
                <div className="flex items-center gap-2 text-sm text-orange-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{vehicle.description}</span>
                  <span className="text-muted-foreground">- Pare-chocs avant en commande - Délai 5-7 jours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockWaitingVehicles.length === 0 && (
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
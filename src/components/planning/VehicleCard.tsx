import { User, Clock, Euro } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface VehicleCardProps {
  vehicle: {
    id: string;
    brand: string;
    model: string;
    licensePlate: string;
    client: string;
    price: string;
    duration: string;
    description: string;
    technician?: string;
    status: 'En cours' | 'À planifier' | 'Terminé';
  };
  onPlan?: (vehicleId: string) => void;
}

export const VehicleCard = ({ vehicle, onPlan }: VehicleCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'En cours':
        return <Badge className="bg-green-100 text-green-800">En cours</Badge>;
      case 'À planifier':
        return <Badge className="bg-amber-100 text-amber-800">À planifier</Badge>;
      case 'Terminé':
        return <Badge className="bg-gray-100 text-gray-800">Terminé</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* En-tête avec marque et modèle */}
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-base">{vehicle.brand} {vehicle.model}</h4>
            {getStatusBadge(vehicle.status)}
          </div>

          {/* Plaque et client */}
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">{vehicle.licensePlate}</div>
            <div className="text-sm text-muted-foreground">{vehicle.client}</div>
          </div>

          {/* Prix et durée */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Euro className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{vehicle.price}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{vehicle.duration}</span>
            </div>
          </div>

          {/* Description */}
          <div className="text-sm text-muted-foreground">{vehicle.description}</div>

          {/* Technicien si assigné */}
          {vehicle.technician && (
            <div className="flex items-center gap-1 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>{vehicle.technician}</span>
            </div>
          )}

          {/* Bouton planifier si statut À planifier */}
          {vehicle.status === 'À planifier' && onPlan && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPlan(vehicle.id)}
              className="w-full mt-2"
            >
              Planifier
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
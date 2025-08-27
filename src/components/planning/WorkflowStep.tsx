import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleCard } from "./VehicleCard";

interface Vehicle {
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
}

interface WorkflowStepProps {
  title: string;
  vehicles: Vehicle[];
  count: number;
  onPlanVehicle?: (vehicleId: string) => void;
}

export const WorkflowStep = ({ title, vehicles, count, onPlanVehicle }: WorkflowStepProps) => {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm font-normal bg-muted px-2 py-1 rounded">
            {count} véhicule{count !== 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {vehicles.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Aucun véhicule à cette étape
          </div>
        ) : (
          vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onPlan={onPlanVehicle}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};
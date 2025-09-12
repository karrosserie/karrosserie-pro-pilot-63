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
    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <span className="text-sm text-slate-600 bg-white px-2 py-1 rounded border">
          {count} véhicule{count !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="space-y-3">
        {vehicles.length === 0 ? (
          <div className="text-center text-slate-500 py-8 bg-white rounded border-2 border-dashed">
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
      </div>
    </div>
  );
};
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
  stepColor: string;
  onPlanVehicle?: (vehicleId: string) => void;
}

export const WorkflowStep = ({ title, vehicles, count, stepColor, onPlanVehicle }: WorkflowStepProps) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 mb-6">
      <div className={`${stepColor} text-white p-4 rounded-t-lg flex items-center justify-between`}>
        <h3 className="font-semibold text-lg">{title}</h3>
        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
          {count} véhicule{count !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="p-4">
        {vehicles.length === 0 ? (
          <div className="text-center text-slate-500 py-8 border-2 border-dashed border-slate-200 rounded">
            Aucun véhicule à cette étape
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onPlan={onPlanVehicle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
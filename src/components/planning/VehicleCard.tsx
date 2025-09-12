import { User, Clock, Euro } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-base text-slate-900">{vehicle.brand} {vehicle.model}</h4>
          <p className="text-sm text-slate-600">{vehicle.licensePlate}</p>
          <p className="text-xs text-slate-500 mt-1">{vehicle.description}</p>
        </div>
        <div className="text-right">
          <div className="font-semibold text-lg text-slate-900">{vehicle.price}</div>
          <div className="text-xs text-slate-500">{vehicle.duration}</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          {vehicle.technician || 'À planifier'}
        </div>
      </div>
    </div>
  );
};
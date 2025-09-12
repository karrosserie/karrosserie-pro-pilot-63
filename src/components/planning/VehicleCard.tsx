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
  return (
    <div className="bg-white p-4 rounded-md border border-slate-200 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center text-sm font-medium">
            {vehicle.brand.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-sm text-slate-900">{vehicle.brand} {vehicle.model}</h4>
            <p className="text-xs text-slate-600">{vehicle.licensePlate} • {vehicle.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-900">{vehicle.price}</div>
            {vehicle.duration && (
              <div className="text-xs text-slate-500">{vehicle.duration}</div>
            )}
          </div>
          <button className="px-3 py-1.5 bg-slate-600 text-white text-xs font-medium rounded hover:bg-slate-700 transition-colors">
            Planifier
          </button>
        </div>
      </div>
    </div>
  );
};
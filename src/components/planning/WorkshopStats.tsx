import { Car, CheckCircle, Clock, Euro } from "lucide-react";

interface WorkshopStatsProps {
  totalVehicles: number;
  completedVehicles: number;
  waitingVehicles: number;
  totalRevenue: number;
}

export const WorkshopStats = ({ 
  totalVehicles, 
  completedVehicles, 
  waitingVehicles, 
  totalRevenue 
}: WorkshopStatsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="text-center">
        <div className="text-3xl font-bold text-primary">{totalVehicles}</div>
        <div className="text-sm text-muted-foreground">VÉHICULES</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-green-600">{completedVehicles}</div>
        <div className="text-sm text-muted-foreground">TERMINÉS</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-amber-600">{waitingVehicles}</div>
        <div className="text-sm text-muted-foreground">EN ATTENTE</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-primary">{totalRevenue.toLocaleString()}€</div>
        <div className="text-sm text-muted-foreground">CA EN COURS</div>
      </div>
    </div>
  );
};
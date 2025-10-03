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
    <div className="bg-slate-50 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
      <h1 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Étapes atelier</h1>
      <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">Parcours complet avec synchronisation planning automatique</p>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">{totalVehicles}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">VÉHICULES</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-gray-600">{completedVehicles}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">TERMINÉS</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">{waitingVehicles}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">EN ATTENTE</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-orange-600">{totalRevenue.toLocaleString('fr-FR')}€</div>
          <div className="text-xs sm:text-sm text-muted-foreground">CA EN COURS</div>
        </div>
      </div>
    </div>
  );
};
import { DashboardProductivityData } from '@/hooks/dashboard/use-dashboard-productivity';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  evolution: number;
  currentValue: string;
  previousValue: string;
}

const KPICard = ({ title, value, subtitle, evolution, currentValue, previousValue }: KPICardProps) => {
  const isPositive = evolution > 0;
  const isNeutral = evolution === 0;
  
  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      
      <div className="flex items-center gap-1.5 mt-2">
        {isNeutral ? (
          <Minus className="w-3 h-3 text-muted-foreground" />
        ) : isPositive ? (
          <TrendingUp className="w-3 h-3 text-green-600" />
        ) : (
          <TrendingDown className="w-3 h-3 text-red-600" />
        )}
        <span className={`text-xs font-medium ${isNeutral ? 'text-muted-foreground' : isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{evolution.toFixed(1)}%
        </span>
      </div>
      
      <div className="flex gap-4 mt-3 pt-3 border-t border-border text-xs">
        <div>
          <p className="text-muted-foreground">Période 2</p>
          <p className="font-medium text-foreground">{currentValue}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Période 1</p>
          <p className="font-medium text-foreground">{previousValue}</p>
        </div>
      </div>
    </div>
  );
};

interface DashboardKPIGridProps {
  data: DashboardProductivityData;
}

export const DashboardKPIGrid = ({ data }: DashboardKPIGridProps) => {
  const previousProductivity = Math.round(data.globalProductivity / (1 + data.globalProductivityEvolution / 100));
  const previousRevenue = Math.round(data.totalRevenue / (1 + data.revenueEvolution / 100));
  const previousVehicles = Math.round(data.vehiclesCount / (1 + data.vehiclesEvolution / 100));
  const previousMargin = (data.grossMargin - data.grossMarginEvolution).toFixed(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KPICard
        title="Productivité Globale"
        value={`${data.globalProductivity}%`}
        subtitle="Objectif : 120%"
        evolution={data.globalProductivityEvolution}
        currentValue={`${data.globalProductivity}%`}
        previousValue={`${previousProductivity}%`}
      />
      
      <KPICard
        title="CA Main d'Œuvre"
        value={`${(data.totalRevenue / 1000).toFixed(1)}k€`}
        subtitle="Chiffre d'affaires total"
        evolution={data.revenueEvolution}
        currentValue={`${data.totalRevenue.toLocaleString('fr-FR')}€`}
        previousValue={`${previousRevenue.toLocaleString('fr-FR')}€`}
      />
      
      <KPICard
        title="Véhicules Traités"
        value={data.vehiclesCount.toString()}
        subtitle="Nombre total"
        evolution={data.vehiclesEvolution}
        currentValue={data.vehiclesCount.toString()}
        previousValue={previousVehicles.toString()}
      />
      
      <KPICard
        title="Marge Brute MO"
        value={`${data.grossMargin}%`}
        subtitle="Objectif : 65-75%"
        evolution={data.grossMarginEvolution}
        currentValue={`${data.grossMargin}%`}
        previousValue={`${previousMargin}%`}
      />
    </div>
  );
};

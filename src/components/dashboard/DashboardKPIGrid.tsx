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
  const previousRevenue = data.revenueEvolution !== 0 
    ? Math.round(data.totalRevenue / (1 + data.revenueEvolution / 100)) 
    : data.totalRevenue;
  const previousVehicles = data.vehiclesEvolution !== 0 
    ? Math.round(data.vehiclesCount / (1 + data.vehiclesEvolution / 100)) 
    : data.vehiclesCount;

  const hasProductivityData = data.hasTimesheetData && data.globalProductivity > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      {/* Productivité - seulement si données de pointage disponibles */}
      <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Productivité Globale</p>
        {hasProductivityData ? (
          <>
            <p className="text-2xl font-bold text-foreground mt-1">{data.globalProductivity}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">Objectif : 120%</p>
            <div className="flex items-center gap-1.5 mt-2">
              {data.globalProductivityEvolution >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-600" />
              )}
              <span className={`text-xs font-medium ${data.globalProductivityEvolution >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.globalProductivityEvolution >= 0 ? '+' : ''}{data.globalProductivityEvolution.toFixed(1)}%
              </span>
            </div>
          </>
        ) : (
          <>
            <p className="text-lg font-medium text-muted-foreground mt-1 italic">Données indisponibles</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Pointages requis</p>
          </>
        )}
      </div>
      
      {/* Heures Expertisées - EXCLUSIVEMENT depuis expertise_reports */}
      <KPICard
        title="Heures Expertisées"
        value={data.totalSoldHours > 0 ? `${data.totalSoldHours.toFixed(0)}h` : '0h'}
        subtitle="Total heures vendues"
        evolution={data.soldHoursEvolution}
        currentValue={`${data.totalSoldHours.toFixed(1)}h`}
        previousValue={`${(data.totalSoldHoursP1 || 0).toFixed(1)}h`}
      />
      
      <KPICard
        title="CA Main d'Œuvre"
        value={data.totalRevenue > 0 ? `${(data.totalRevenue / 1000).toFixed(1)}k€` : '0€'}
        subtitle="Somme des factures"
        evolution={data.revenueEvolution}
        currentValue={`${data.totalRevenue.toLocaleString('fr-FR')}€`}
        previousValue={`${previousRevenue.toLocaleString('fr-FR')}€`}
      />
      
      <KPICard
        title="Véhicules Traités"
        value={data.vehiclesCount.toString()}
        subtitle="OR signés/en cours"
        evolution={data.vehiclesEvolution}
        currentValue={data.vehiclesCount.toString()}
        previousValue={previousVehicles.toString()}
      />
      
      {/* Marge Brute - avec données calculées */}
      <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Marge Brute MO</p>
        {data.hasTimesheetData && data.totalRevenue > 0 ? (
          <>
            <p className="text-2xl font-bold text-foreground mt-1">{data.grossMarginPercent}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">Objectif : 65-75%</p>
            <div className="flex items-center gap-1.5 mt-2">
              {data.grossMarginPercent >= 65 ? (
                <TrendingUp className="w-3 h-3 text-green-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-amber-600" />
              )}
              <span className={`text-xs font-medium ${data.grossMarginPercent >= 65 ? 'text-green-600' : 'text-amber-600'}`}>
                {data.grossMarginPercent >= 65 ? 'Dans l\'objectif' : 'Sous l\'objectif'}
              </span>
            </div>
          </>
        ) : (
          <>
            <p className="text-lg font-medium text-muted-foreground mt-1 italic">Données indisponibles</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              {!data.hasTimesheetData ? 'Pointages requis' : 'CA requis'}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

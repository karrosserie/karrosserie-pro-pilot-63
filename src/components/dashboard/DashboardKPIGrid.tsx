
import { DashboardProductivityData } from '@/hooks/dashboard/use-dashboard-productivity';

interface DashboardKPIGridProps {
  data: DashboardProductivityData;
}

const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  evolution, 
  isPositive,
  currentValue,
  previousValue,
  currentLabel,
  previousLabel,
  analysis,
  colorClass
}: {
  title: string;
  value: string;
  subtitle: string;
  evolution: string;
  isPositive: boolean;
  currentValue: string;
  previousValue: string;
  currentLabel: string;
  previousLabel: string;
  analysis: string;
  colorClass: string;
}) => (
  <div className="bg-card rounded-3xl p-7 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
    <div className="text-xs uppercase text-muted-foreground font-semibold tracking-wide mb-4">
      {title}
    </div>
    <div className={`text-5xl font-bold mb-3 ${colorClass}`}>
      {value}
    </div>
    <div className="text-muted-foreground mb-4">{subtitle}</div>
    <span className={`inline-block px-4 py-2 rounded-xl text-sm font-bold ${
      isPositive 
        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    }`}>
      {evolution}
    </span>
    
    <div className="flex gap-5 pt-4 mt-4 border-t border-border">
      <div className="flex-1">
        <div className="text-xs text-muted-foreground mb-1">{currentLabel}</div>
        <div className="text-lg font-semibold">{currentValue}</div>
      </div>
      <div className="flex-1">
        <div className="text-xs text-muted-foreground mb-1">{previousLabel}</div>
        <div className="text-lg font-semibold">{previousValue}</div>
      </div>
    </div>
    
    <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground leading-relaxed">
      <strong className="text-foreground">💡 Analyse :</strong><br/>
      {analysis}
    </div>
  </div>
);

export const DashboardKPIGrid = ({ data }: DashboardKPIGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      <KPICard
        title="Productivité Globale"
        value={`${data.globalProductivity}%`}
        subtitle="Objectif : 120%"
        evolution={`${data.globalProductivityEvolution >= 0 ? '+' : ''}${data.globalProductivityEvolution}%`}
        isPositive={data.globalProductivityEvolution >= 0}
        currentValue={`${data.globalProductivity}%`}
        previousValue={`${(data.globalProductivity - data.globalProductivityEvolution).toFixed(1)}%`}
        currentLabel="Période 2 (actuelle)"
        previousLabel="Période 1 (précédente)"
        analysis="La productivité mesure le ratio entre les heures vendues aux clients et les heures payées aux employés. Un taux de 120% signifie que vous vendez 1,2 heure pour chaque heure achetée."
        colorClass="text-blue-500"
      />
      
      <KPICard
        title="CA Main d'Œuvre"
        value={`${(data.totalRevenue / 1000).toFixed(1)}k€`}
        subtitle="Chiffre d'affaires total"
        evolution={`${data.revenueEvolution >= 0 ? '+' : ''}${data.revenueEvolution}%`}
        isPositive={data.revenueEvolution >= 0}
        currentValue={`${data.totalRevenue.toLocaleString('fr-FR')}€`}
        previousValue={`${Math.round(data.totalRevenue / (1 + data.revenueEvolution / 100)).toLocaleString('fr-FR')}€`}
        currentLabel="Mois N"
        previousLabel="Mois N-1"
        analysis="Le CA Main d'Œuvre représente uniquement la facturation du temps de travail (hors pièces et fournitures). C'est le résultat direct des heures vendues combinées aux taux horaires."
        colorClass="text-green-500"
      />
      
      <KPICard
        title="Véhicules Traités"
        value={String(data.vehiclesCount)}
        subtitle="Nombre total"
        evolution={`${data.vehiclesEvolution >= 0 ? '+' : ''}${data.vehiclesEvolution}%`}
        isPositive={data.vehiclesEvolution >= 0}
        currentValue={String(data.vehiclesCount)}
        previousValue={String(Math.round(data.vehiclesCount / (1 + data.vehiclesEvolution / 100)))}
        currentLabel="Mois N"
        previousLabel="Mois N-1"
        analysis={`Le nombre de véhicules traités mesure le volume d'activité global. Avec ${data.totalEmployees} employés, cela représente environ ${(data.vehiclesCount / data.totalEmployees).toFixed(1)} véhicules par employé.`}
        colorClass="text-purple-500"
      />
      
      <KPICard
        title="Marge Brute MO"
        value={`${data.grossMargin}%`}
        subtitle="Objectif : 65-75%"
        evolution={`${data.grossMarginEvolution >= 0 ? '+' : ''}${data.grossMarginEvolution} pts`}
        isPositive={data.grossMarginEvolution >= 0}
        currentValue={`${data.grossMargin}%`}
        previousValue={`${(data.grossMargin - data.grossMarginEvolution).toFixed(1)}%`}
        currentLabel="Mois N"
        previousLabel="Mois N-1"
        analysis={`La marge brute MO est le rapport entre le CA généré et les coûts salariaux directs. Un taux de ${data.grossMargin}% signifie que sur 100€ facturés, ${data.grossMargin}€ restent après paiement des salaires.`}
        colorClass="text-pink-500"
      />
    </div>
  );
};

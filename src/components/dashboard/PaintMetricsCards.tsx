import React from 'react';
import { PaintBucket, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import StatsCard from './StatsCard';

interface PaintMetrics {
  totalCost: number;
  totalReports: number;
  averageVariancePercentage: number;
  mostUsedPaintType: {
    name: string;
    brand: string;
    usage_count: number;
  } | null;
  wasteAmount: number;
  costChange: string;
  costIsPositive: boolean;
  reportsChange: string;
  reportsIsPositive: boolean;
}

interface PaintMetricsCardsProps {
  paintMetrics: PaintMetrics;
}

const PaintMetricsCards: React.FC<PaintMetricsCardsProps> = ({ paintMetrics }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatVariancePercentage = (variance: number) => {
    const absVariance = Math.abs(variance);
    const sign = variance >= 0 ? '+' : '-';
    return `${sign}${absVariance.toFixed(1)}%`;
  };

  return (
    <>
      {/* Coût total peinture */}
      <StatsCard
        title="Coût peinture"
        value={formatCurrency(paintMetrics.totalCost)}
        change={paintMetrics.costChange}
        isPositive={!paintMetrics.costIsPositive} // Inverse car moins de coût = mieux
        icon={<PaintBucket className="h-6 w-6 text-white" />}
        iconBg="bg-purple-500"
      />

      {/* Nombre de pesées */}
      <StatsCard
        title="Pesées effectuées"
        value={paintMetrics.totalReports}
        change={paintMetrics.reportsChange}
        isPositive={paintMetrics.reportsIsPositive}
        icon={<Target className="h-6 w-6 text-white" />}
        iconBg="bg-blue-500"
      />

      {/* Précision moyenne (variance) */}
      <StatsCard
        title="Précision moyenne"
        value={formatVariancePercentage(paintMetrics.averageVariancePercentage)}
        icon={<TrendingUp className="h-6 w-6 text-white" />}
        iconBg={Math.abs(paintMetrics.averageVariancePercentage) <= 5 ? "bg-green-500" : "bg-orange-500"}
      />

      {/* Gaspillage/Économies */}
      {paintMetrics.wasteAmount > 0 && (
        <StatsCard
          title="Gaspillage peinture"
          value={formatCurrency(paintMetrics.wasteAmount)}
          icon={<AlertTriangle className="h-6 w-6 text-white" />}
          iconBg="bg-red-500"
        />
      )}
    </>
  );
};

export default PaintMetricsCards;
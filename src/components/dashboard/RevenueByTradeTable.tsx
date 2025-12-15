
import { TradeMetrics } from '@/hooks/dashboard/use-dashboard-productivity';

interface RevenueByTradeTableProps {
  tradeMetrics: TradeMetrics[];
  totalRevenue: number;
  revenueEvolution: number;
}

const TradeBadge = ({ trade }: { trade: string }) => {
  const styles = {
    carrosserie: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    peinture: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
    mecanique: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
  };
  
  const labels = {
    carrosserie: 'Carrosserie',
    peinture: 'Peinture',
    mecanique: 'Mécanique'
  };
  
  return (
    <span className={`inline-block px-3 py-1.5 rounded-xl text-sm font-semibold ${styles[trade as keyof typeof styles]}`}>
      {labels[trade as keyof typeof labels]}
    </span>
  );
};

export const RevenueByTradeTable = ({ tradeMetrics, totalRevenue, revenueEvolution }: RevenueByTradeTableProps) => {
  const previousRevenue = Math.round(totalRevenue / (1 + revenueEvolution / 100));
  
  return (
    <div className="bg-card rounded-3xl p-7 shadow-sm mb-8">
      <h2 className="text-2xl font-bold mb-5 flex items-center gap-3">
        💰 Chiffre d'Affaires par Métier
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase rounded-tl-2xl">Métier</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase">Taux Horaire</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase">CA Période 2</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase">CA Période 1</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase">Évolution</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase rounded-tr-2xl">Part du CA</th>
            </tr>
          </thead>
          <tbody>
            {tradeMetrics.map((metric) => {
              const previousTradeRevenue = Math.round(metric.revenue / (1 + metric.revenueEvolution / 100));
              
              return (
                <tr key={metric.trade} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-4"><TradeBadge trade={metric.trade} /></td>
                  <td className="px-4 py-4 font-medium">{metric.hourlyRate}€</td>
                  <td className="px-4 py-4 font-bold">{metric.revenue.toLocaleString('fr-FR')}€</td>
                  <td className="px-4 py-4">{previousTradeRevenue.toLocaleString('fr-FR')}€</td>
                  <td className="px-4 py-4">
                    <span className={`inline-block px-3 py-1.5 rounded-xl text-sm font-bold ${
                      metric.revenueEvolution >= 0 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {metric.revenueEvolution >= 0 ? '+' : ''}{metric.revenueEvolution}%
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium">{metric.revenueShare}%</td>
                </tr>
              );
            })}
            <tr className="bg-green-50 dark:bg-green-900/20 font-bold">
              <td className="px-4 py-4">TOTAL MO</td>
              <td className="px-4 py-4">-</td>
              <td className="px-4 py-4 text-green-600">{totalRevenue.toLocaleString('fr-FR')}€</td>
              <td className="px-4 py-4">{previousRevenue.toLocaleString('fr-FR')}€</td>
              <td className="px-4 py-4">
                <span className="inline-block px-3 py-1.5 rounded-xl text-sm font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                  +{revenueEvolution}%
                </span>
              </td>
              <td className="px-4 py-4">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-5 p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl text-sm text-muted-foreground leading-relaxed">
        <strong className="text-foreground">💡 Analyse :</strong><br/>
        Le CA se calcule en multipliant les heures vendues par le taux horaire de chaque métier 
        (carrosserie 55€, peinture 50€, mécanique 45€). La "part du CA" indique la contribution 
        de chaque métier au chiffre d'affaires global de la main d'œuvre.
      </div>
    </div>
  );
};

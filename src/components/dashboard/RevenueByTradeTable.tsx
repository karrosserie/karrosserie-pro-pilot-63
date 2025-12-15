import { TradeMetrics } from '@/hooks/dashboard/use-dashboard-productivity';
import { Wallet } from 'lucide-react';

interface RevenueByTradeTableProps {
  tradeMetrics: TradeMetrics[];
  totalRevenue: number;
  revenueEvolution: number;
}

const TradeBadge = ({ trade }: { trade: string }) => {
  const styles = {
    carrosserie: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    peinture: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    mecanique: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
  };
  
  const labels = {
    carrosserie: 'Carrosserie',
    peinture: 'Peinture',
    mecanique: 'Mécanique'
  };
  
  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${styles[trade as keyof typeof styles]}`}>
      {labels[trade as keyof typeof labels]}
    </span>
  );
};

export const RevenueByTradeTable = ({ tradeMetrics, totalRevenue, revenueEvolution }: RevenueByTradeTableProps) => {
  const previousRevenue = Math.round(totalRevenue / (1 + revenueEvolution / 100));
  
  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
      <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
        <Wallet className="w-4 h-4 text-muted-foreground" />
        Chiffre d'Affaires par Métier
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Métier</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Taux Horaire</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">CA Période 2</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">CA Période 1</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Évolution</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Part du CA</th>
            </tr>
          </thead>
          <tbody>
            {tradeMetrics.map((metric) => {
              const previousTradeRevenue = Math.round(metric.revenue / (1 + metric.revenueEvolution / 100));
              
              return (
                <tr key={metric.trade} className="border-b border-border hover:bg-muted/30">
                  <td className="px-3 py-2"><TradeBadge trade={metric.trade} /></td>
                  <td className="px-3 py-2">{metric.hourlyRate}€</td>
                  <td className="px-3 py-2 font-medium">{metric.revenue.toLocaleString('fr-FR')}€</td>
                  <td className="px-3 py-2 text-muted-foreground">{previousTradeRevenue.toLocaleString('fr-FR')}€</td>
                  <td className="px-3 py-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      metric.revenueEvolution >= 0 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {metric.revenueEvolution >= 0 ? '+' : ''}{metric.revenueEvolution}%
                    </span>
                  </td>
                  <td className="px-3 py-2">{metric.revenueShare}%</td>
                </tr>
              );
            })}
            <tr className="bg-muted/30 font-medium">
              <td className="px-3 py-2">TOTAL MO</td>
              <td className="px-3 py-2">-</td>
              <td className="px-3 py-2 text-green-600">{totalRevenue.toLocaleString('fr-FR')}€</td>
              <td className="px-3 py-2 text-muted-foreground">{previousRevenue.toLocaleString('fr-FR')}€</td>
              <td className="px-3 py-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  +{revenueEvolution}%
                </span>
              </td>
              <td className="px-3 py-2">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

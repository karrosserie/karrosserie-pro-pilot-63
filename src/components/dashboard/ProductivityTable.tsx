
import { TradeMetrics } from '@/hooks/dashboard/use-dashboard-productivity';

interface ProductivityTableProps {
  tradeMetrics: TradeMetrics[];
  totalBoughtHours: number;
  totalSoldHours: number;
  totalEmployees: number;
  globalProductivity: number;
  globalProductivityEvolution: number;
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

export const ProductivityTable = ({
  tradeMetrics,
  totalBoughtHours,
  totalSoldHours,
  totalEmployees,
  globalProductivity,
  globalProductivityEvolution
}: ProductivityTableProps) => {
  return (
    <div className="bg-card rounded-3xl p-7 shadow-sm mb-8">
      <h2 className="text-2xl font-bold mb-5 flex items-center gap-3">
        ⏱️ Heures Achetées vs Vendues
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase rounded-tl-2xl">Métier</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase">Employés</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase">H. Achetées Période 2</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase">H. Vendues Période 2</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase">Productivité</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase rounded-tr-2xl">Évolution</th>
            </tr>
          </thead>
          <tbody>
            {tradeMetrics.map((metric) => (
              <tr key={metric.trade} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-4 py-4"><TradeBadge trade={metric.trade} /></td>
                <td className="px-4 py-4 font-medium">{metric.employeeCount}</td>
                <td className="px-4 py-4 font-bold">{metric.boughtHours}</td>
                <td className="px-4 py-4 font-bold">{metric.soldHours}</td>
                <td className="px-4 py-4">
                  <strong className={metric.productivity >= 100 ? 'text-green-600' : 'text-red-600'}>
                    {metric.productivity}%
                  </strong>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-block px-3 py-1.5 rounded-xl text-sm font-bold ${
                    metric.evolution >= 0 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {metric.evolution >= 0 ? '+' : ''}{metric.evolution}%
                  </span>
                </td>
              </tr>
            ))}
            <tr className="bg-blue-50 dark:bg-blue-900/20 font-bold">
              <td className="px-4 py-4">TOTAL</td>
              <td className="px-4 py-4">{totalEmployees}</td>
              <td className="px-4 py-4">{totalBoughtHours}h</td>
              <td className="px-4 py-4">{totalSoldHours}h</td>
              <td className="px-4 py-4 text-green-600">{globalProductivity}%</td>
              <td className="px-4 py-4">
                <span className="inline-block px-3 py-1.5 rounded-xl text-sm font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                  +{globalProductivityEvolution}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-5 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-sm text-muted-foreground leading-relaxed">
        <strong className="text-foreground">💡 Analyse :</strong><br/>
        Les heures achetées correspondent au temps salarial total (base 152h/mois × nombre d'employés). 
        Les heures vendues représentent les heures facturées aux clients. 
        L'écart positif génère la marge : ici {totalSoldHours}h vendues vs {totalBoughtHours}h achetées = {totalSoldHours - totalBoughtHours}h de "surproductivité".
      </div>
    </div>
  );
};

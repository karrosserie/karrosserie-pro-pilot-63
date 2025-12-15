import { TradeMetrics } from '@/hooks/dashboard/use-dashboard-productivity';
import { Clock } from 'lucide-react';

interface ProductivityTableProps {
  tradeMetrics: TradeMetrics[];
  totalBoughtHours: number;
  totalSoldHours: number;
  globalProductivity: number;
  totalEmployees: number;
  globalProductivityEvolution: number;
  hasTimesheetData?: boolean;
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

export const ProductivityTable = ({ 
  tradeMetrics, 
  totalBoughtHours, 
  totalSoldHours, 
  globalProductivity, 
  totalEmployees,
  globalProductivityEvolution,
  hasTimesheetData = true
}: ProductivityTableProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
      <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        Heures Achetées vs Vendues
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Métier</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Employés</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">H. Achetées</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">H. Vendues</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Productivité</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Évolution</th>
            </tr>
          </thead>
          <tbody>
            {tradeMetrics.map((metric) => (
              <tr key={metric.trade} className="border-b border-border hover:bg-muted/30">
                <td className="px-3 py-2"><TradeBadge trade={metric.trade} /></td>
                <td className="px-3 py-2">{metric.employeeCount}</td>
                <td className="px-3 py-2 font-medium">
                  {metric.hasTimesheetData ? `${metric.boughtHours}h` : (
                    <span className="text-muted-foreground italic">N/A</span>
                  )}
                </td>
                <td className="px-3 py-2 font-medium">{metric.soldHours}h</td>
                <td className="px-3 py-2">
                  {metric.hasTimesheetData ? (
                    <span className={`font-medium ${metric.productivity >= 100 ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.productivity}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground italic">N/A</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {metric.hasTimesheetData ? (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      metric.evolution >= 0 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {metric.evolution >= 0 ? '+' : ''}{metric.evolution}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground italic">N/A</span>
                  )}
                </td>
              </tr>
            ))}
            <tr className="bg-muted/30 font-medium">
              <td className="px-3 py-2">TOTAL</td>
              <td className="px-3 py-2">{totalEmployees}</td>
              <td className="px-3 py-2">
                {hasTimesheetData ? `${totalBoughtHours}h` : (
                  <span className="text-muted-foreground italic">N/A</span>
                )}
              </td>
              <td className="px-3 py-2">{totalSoldHours}h</td>
              <td className="px-3 py-2">
                {hasTimesheetData ? (
                  <span className="text-green-600">{globalProductivity}%</span>
                ) : (
                  <span className="text-muted-foreground italic">N/A</span>
                )}
              </td>
              <td className="px-3 py-2">
                {hasTimesheetData ? (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    globalProductivityEvolution >= 0
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {globalProductivityEvolution >= 0 ? '+' : ''}{globalProductivityEvolution}%
                  </span>
                ) : (
                  <span className="text-muted-foreground italic">N/A</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

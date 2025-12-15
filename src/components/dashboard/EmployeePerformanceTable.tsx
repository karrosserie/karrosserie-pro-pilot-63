import { EmployeeProductivity } from '@/hooks/dashboard/use-dashboard-productivity';
import { Users } from 'lucide-react';

interface EmployeePerformanceTableProps {
  employees: EmployeeProductivity[];
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
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${styles[trade as keyof typeof styles] || 'bg-gray-100 text-gray-700'}`}>
      {labels[trade as keyof typeof labels] || trade}
    </span>
  );
};

const PerformanceBadge = ({ level }: { level: string }) => {
  const styles = {
    'Excellent': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Bon': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Correct': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    'À améliorer': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
  };
  
  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${styles[level as keyof typeof styles] || styles['Correct']}`}>
      {level}
    </span>
  );
};

export const EmployeePerformanceTable = ({ employees }: EmployeePerformanceTableProps) => {
  const performanceLabels: Record<string, string> = {
    'excellent': 'Excellent',
    'bon': 'Bon',
    'correct': 'Correct',
    'a_ameliorer': 'À améliorer'
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
      <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
        <Users className="w-4 h-4 text-muted-foreground" />
        Détail par Employé
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Employé</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Métier</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">H. Achetées</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">H. Vendues</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Productivité</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Véhicules</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Performance</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-3 py-2 font-medium">{employee.name}</td>
                <td className="px-3 py-2"><TradeBadge trade={employee.trade} /></td>
                <td className="px-3 py-2">{employee.boughtHours}h</td>
                <td className="px-3 py-2">{employee.soldHours}h</td>
                <td className="px-3 py-2">
                  <span className={`font-medium ${employee.productivity >= 100 ? 'text-green-600' : 'text-red-600'}`}>
                    {employee.productivity}%
                  </span>
                </td>
                <td className="px-3 py-2">{employee.vehiclesCount}</td>
                <td className="px-3 py-2"><PerformanceBadge level={performanceLabels[employee.performance] || 'Correct'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


import { EmployeeProductivity } from '@/hooks/dashboard/use-dashboard-productivity';

interface EmployeePerformanceTableProps {
  employees: EmployeeProductivity[];
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

const PerformanceBadge = ({ performance }: { performance: string }) => {
  const styles = {
    excellent: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    bon: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    correct: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    a_ameliorer: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
  };
  
  const labels = {
    excellent: 'Excellent',
    bon: 'Bon',
    correct: 'Correct',
    a_ameliorer: 'À améliorer'
  };
  
  return (
    <span className={`inline-block px-3 py-1.5 rounded-xl text-sm font-bold ${styles[performance as keyof typeof styles]}`}>
      {labels[performance as keyof typeof labels]}
    </span>
  );
};

export const EmployeePerformanceTable = ({ employees }: EmployeePerformanceTableProps) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4 text-foreground">👥 Détail par Employé</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-cyan-100 to-pink-100 dark:from-cyan-900/30 dark:to-pink-900/30">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase rounded-tl-2xl">Employé</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase">Métier</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase">H. Achetées</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase">H. Vendues</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase">Productivité</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase">Véhicules</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase rounded-tr-2xl">Performance</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-4 py-4 font-semibold">{employee.name}</td>
                <td className="px-4 py-4"><TradeBadge trade={employee.trade} /></td>
                <td className="px-4 py-4">{employee.boughtHours}h</td>
                <td className="px-4 py-4">{employee.soldHours}h</td>
                <td className="px-4 py-4">
                  <strong className={employee.productivity >= 100 ? 'text-green-600' : 'text-red-600'}>
                    {employee.productivity}%
                  </strong>
                </td>
                <td className="px-4 py-4">{employee.vehiclesCount}</td>
                <td className="px-4 py-4"><PerformanceBadge performance={employee.performance} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

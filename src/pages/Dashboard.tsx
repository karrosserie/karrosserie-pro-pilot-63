
import { useState } from 'react';
import { format, subMonths } from 'date-fns';
import { useDashboardProductivity } from '@/hooks/dashboard/use-dashboard-productivity';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardKPIGrid } from '@/components/dashboard/DashboardKPIGrid';
import { ProductivityTable } from '@/components/dashboard/ProductivityTable';
import { EmployeePerformanceTable } from '@/components/dashboard/EmployeePerformanceTable';
import { PerformanceExplanation } from '@/components/dashboard/PerformanceExplanation';
import { RevenueByTradeTable } from '@/components/dashboard/RevenueByTradeTable';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const now = new Date();
  const [period1, setPeriod1] = useState(format(subMonths(now, 1), 'yyyy-MM'));
  const [period2, setPeriod2] = useState(format(now, 'yyyy-MM'));
  
  const { data, isLoading, error } = useDashboardProductivity(period1, period2);

  const handleRefresh = () => {
    // La query sera automatiquement re-exécutée quand les périodes changent
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des données de productivité...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-destructive mb-2">Erreur lors du chargement des données</p>
          <p className="text-muted-foreground text-sm">Veuillez réessayer</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <DashboardHeader
        period1={period1}
        period2={period2}
        onPeriod1Change={setPeriod1}
        onPeriod2Change={setPeriod2}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />
      
      {/* Base de calcul */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 rounded-2xl p-4 mb-8">
        <strong>ℹ️ Base de calcul :</strong> 152 heures par mois et par ouvrier
      </div>
      
      <DashboardKPIGrid data={data} />
      
      <ProductivityTable
        tradeMetrics={data.tradeMetrics}
        totalBoughtHours={data.totalBoughtHours}
        totalSoldHours={data.totalSoldHours}
        totalEmployees={data.totalEmployees}
        globalProductivity={data.globalProductivity}
        globalProductivityEvolution={data.globalProductivityEvolution}
      />
      
      <div className="bg-card rounded-3xl p-7 shadow-sm mb-8">
        <EmployeePerformanceTable employees={data.employees} />
        <PerformanceExplanation />
      </div>
      
      <RevenueByTradeTable
        tradeMetrics={data.tradeMetrics}
        totalRevenue={data.totalRevenue}
        revenueEvolution={data.revenueEvolution}
      />
    </div>
  );
};

export default Dashboard;

import { useState } from 'react';
import { format, subMonths } from 'date-fns';
import { useDashboardProductivity } from '@/hooks/dashboard/use-dashboard-productivity';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardKPIGrid } from '@/components/dashboard/DashboardKPIGrid';
import { ProductivityTable } from '@/components/dashboard/ProductivityTable';
import { EmployeePerformanceTable } from '@/components/dashboard/EmployeePerformanceTable';
import { PerformanceExplanation } from '@/components/dashboard/PerformanceExplanation';
import { RevenueByTradeTable } from '@/components/dashboard/RevenueByTradeTable';
import { Loader2, Info } from 'lucide-react';

const Dashboard = () => {
  const now = new Date();
  const [period1, setPeriod1] = useState(format(subMonths(now, 1), 'yyyy-MM'));
  const [period2, setPeriod2] = useState(format(now, 'yyyy-MM'));

  const { data, isLoading, error } = useDashboardProductivity(period1, period2);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Erreur lors du chargement des données</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        period1={period1}
        period2={period2}
        onPeriod1Change={setPeriod1}
        onPeriod2Change={setPeriod2}
        onRefresh={() => {}}
        isLoading={isLoading}
      />
      
      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
        <Info className="w-4 h-4" />
        <span>Base de calcul : 152 heures par mois et par ouvrier</span>
      </div>

      <DashboardKPIGrid data={data} />

      <ProductivityTable
        tradeMetrics={data.tradeMetrics}
        totalBoughtHours={data.totalBoughtHours}
        totalSoldHours={data.totalSoldHours}
        globalProductivity={data.globalProductivity}
        totalEmployees={data.totalEmployees}
        globalProductivityEvolution={data.globalProductivityEvolution}
      />

      <EmployeePerformanceTable employees={data.employees} />

      <PerformanceExplanation />

      <RevenueByTradeTable
        tradeMetrics={data.tradeMetrics}
        totalRevenue={data.totalRevenue}
        revenueEvolution={data.revenueEvolution}
      />
    </div>
  );
};

export default Dashboard;

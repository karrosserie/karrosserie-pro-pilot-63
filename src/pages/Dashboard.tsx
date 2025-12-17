import { useState } from 'react';
import { format, subMonths } from 'date-fns';
import { useDashboardProductivity } from '@/hooks/dashboard/use-dashboard-productivity';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardKPIGrid } from '@/components/dashboard/DashboardKPIGrid';
import { LaborProfitabilitySection } from '@/components/dashboard/LaborProfitabilitySection';
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
    <div className="p-6 space-y-6">
      <DashboardHeader
        period1={period1}
        period2={period2}
        onPeriod1Change={setPeriod1}
        onPeriod2Change={setPeriod2}
        onRefresh={() => {}}
        isLoading={isLoading}
      />
      
      {/* Avertissements de données manquantes */}
      {data.dataWarnings && data.dataWarnings.length > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-medium">
            <Info className="w-5 h-5" />
            <span>Données partielles</span>
          </div>
          <ul className="text-sm text-amber-600 dark:text-amber-500 space-y-1 ml-7">
            {data.dataWarnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      <DashboardKPIGrid data={data} />

      <LaborProfitabilitySection data={data} />

      <ProductivityTable
        tradeMetrics={data.tradeMetrics}
        totalBoughtHours={data.totalBoughtHours}
        totalSoldHours={data.totalSoldHours}
        globalProductivity={data.globalProductivity}
        totalEmployees={data.totalEmployees}
        globalProductivityEvolution={data.globalProductivityEvolution}
        hasTimesheetData={data.hasTimesheetData}
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

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/hooks/use-company';
import { startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';

interface PaintMetrics {
  totalCost: number;
  totalReports: number;
  averageVariancePercentage: number;
  mostUsedPaintType: {
    name: string;
    brand: string;
    usage_count: number;
  } | null;
  wasteAmount: number; // Coût du gaspillage/économies
  costChange: string;
  costIsPositive: boolean;
  reportsChange: string;
  reportsIsPositive: boolean;
}

export const usePaintMetrics = () => {
  const { companyData } = useCompany();

  const { data: paintMetrics, isLoading } = useQuery({
    queryKey: ['paint-metrics', companyData?.id],
    queryFn: async (): Promise<PaintMetrics> => {
      if (!companyData?.id) {
        return {
          totalCost: 0,
          totalReports: 0,
          averageVariancePercentage: 0,
          mostUsedPaintType: null,
          wasteAmount: 0,
          costChange: '',
          costIsPositive: true,
          reportsChange: '',
          reportsIsPositive: true
        };
      }

      const now = new Date();
      const currentMonthStart = startOfMonth(now);
      const currentMonthEnd = endOfMonth(now);
      const lastMonthStart = startOfMonth(subMonths(now, 1));
      const lastMonthEnd = endOfMonth(subMonths(now, 1));

      // Récupérer les rapports de pesée avec les types de peinture
      const { data: weighingReports, error } = await supabase
        .from('weighing_reports')
        .select(`
          *,
          paint_types (
            id,
            name,
            brand,
            price_per_liter
          )
        `)
        .eq('company_id', companyData.id)
        .order('weighing_timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching weighing reports:', error);
        throw error;
      }

      if (!weighingReports || weighingReports.length === 0) {
        return {
          totalCost: 0,
          totalReports: 0,
          averageVariancePercentage: 0,
          mostUsedPaintType: null,
          wasteAmount: 0,
          costChange: '',
          costIsPositive: true,
          reportsChange: '',
          reportsIsPositive: true
        };
      }

      // Filtrer par période
      const currentMonthReports = weighingReports.filter(report => {
        const reportDate = new Date(report.weighing_timestamp);
        return isWithinInterval(reportDate, { start: currentMonthStart, end: currentMonthEnd });
      });

      const lastMonthReports = weighingReports.filter(report => {
        const reportDate = new Date(report.weighing_timestamp);
        return isWithinInterval(reportDate, { start: lastMonthStart, end: lastMonthEnd });
      });

      // Calculs pour le mois actuel
      const currentMonthCost = currentMonthReports.reduce((sum, report) =>
        sum + (report.total_cost || 0), 0
      );

      const currentMonthReportsCount = currentMonthReports.length;

      // Calculs pour le mois précédent
      const lastMonthCost = lastMonthReports.reduce((sum, report) =>
        sum + (report.total_cost || 0), 0
      );

      const lastMonthReportsCount = lastMonthReports.length;

      // Calcul des variations
      let costChange = 0;
      let costChangeText = '';
      if (lastMonthCost > 0) {
        costChange = ((currentMonthCost - lastMonthCost) / lastMonthCost) * 100;
        costChangeText = `${costChange >= 0 ? '+' : ''}${Math.round(costChange)}%`;
      } else if (currentMonthCost > 0) {
        costChangeText = '+100%';
        costChange = 100;
      }

      let reportsChange = 0;
      let reportsChangeText = '';
      if (lastMonthReportsCount > 0) {
        reportsChange = ((currentMonthReportsCount - lastMonthReportsCount) / lastMonthReportsCount) * 100;
        reportsChangeText = `${reportsChange >= 0 ? '+' : ''}${Math.round(reportsChange)}%`;
      } else if (currentMonthReportsCount > 0) {
        reportsChangeText = '+100%';
        reportsChange = 100;
      }

      // Calcul de la variance moyenne (pour les rapports avec variance)
      const reportsWithVariance = currentMonthReports.filter(report =>
        report.variance_percentage !== null && report.variance_percentage !== undefined
      );

      const averageVariancePercentage = reportsWithVariance.length > 0
        ? reportsWithVariance.reduce((sum, report) => sum + (report.variance_percentage || 0), 0) / reportsWithVariance.length
        : 0;

      // Trouver le type de peinture le plus utilisé ce mois
      const paintTypeUsage = currentMonthReports.reduce((acc, report) => {
        if (report.paint_types) {
          const key = `${report.paint_types.name}-${report.paint_types.brand}`;
          if (!acc[key]) {
            acc[key] = {
              name: report.paint_types.name,
              brand: report.paint_types.brand,
              usage_count: 0
            };
          }
          acc[key].usage_count++;
        }
        return acc;
      }, {} as Record<string, { name: string; brand: string; usage_count: number }>);

      const mostUsedPaintType = Object.values(paintTypeUsage)
        .sort((a, b) => b.usage_count - a.usage_count)[0] || null;

      // Calcul du gaspillage (basé sur la variance en coût)
      const wasteAmount = currentMonthReports.reduce((sum, report) => {
        if (report.variance && report.paint_types?.price_per_liter) {
          // Si la variance est positive (plus consommé que prévu), c'est du gaspillage
          const varianceInLiters = (report.variance / 1000) / 1.2; // Conversion g -> kg -> L (densité moyenne)
          const wasteCost = varianceInLiters * report.paint_types.price_per_liter;
          return sum + (wasteCost > 0 ? wasteCost : 0);
        }
        return sum;
      }, 0);

      return {
        totalCost: currentMonthCost,
        totalReports: currentMonthReportsCount,
        averageVariancePercentage: Math.round(averageVariancePercentage * 100) / 100,
        mostUsedPaintType,
        wasteAmount,
        costChange: costChangeText,
        costIsPositive: costChange >= 0,
        reportsChange: reportsChangeText,
        reportsIsPositive: reportsChange >= 0
      };
    },
    enabled: !!companyData?.id
  });

  return {
    paintMetrics,
    isLoading
  };
};
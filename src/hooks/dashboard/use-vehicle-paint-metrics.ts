import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/hooks/use-company';

interface VehiclePaintMetrics {
  totalCost: number;
  totalReports: number;
  averageVariancePercentage: number;
  paintTypesUsed: {
    name: string;
    brand: string;
    color_code: string | null;
    usage_count: number;
    total_cost: number;
  }[];
  reports: Array<{
    id: string;
    weighing_timestamp: string;
    theoretical_weight: number;
    actual_weight: number;
    variance_percentage: number | null;
    total_cost: number | null;
    operator_name: string | null;
    notes: string | null;
    paint_types: {
      name: string;
      brand: string;
      color_code: string | null;
    };
  }>;
  averageWastePercentage: number;
  mostUsedPaintType: {
    name: string;
    brand: string;
    color_code: string | null;
    usage_count: number;
  } | null;
}

export const useVehiclePaintMetrics = (vehicleId: string | null) => {
  const { companyData } = useCompany();

  const { data: vehiclePaintMetrics, isLoading } = useQuery({
    queryKey: ['vehicle-paint-metrics', vehicleId, companyData?.id],
    queryFn: async (): Promise<VehiclePaintMetrics> => {
      if (!vehicleId || !companyData?.id) {
        return {
          totalCost: 0,
          totalReports: 0,
          averageVariancePercentage: 0,
          paintTypesUsed: [],
          reports: [],
          averageWastePercentage: 0,
          mostUsedPaintType: null
        };
      }

      // Récupérer les rapports de pesée pour ce véhicule spécifique
      const { data: weighingReports, error } = await supabase
        .from('weighing_reports')
        .select(`
          id,
          weighing_timestamp,
          theoretical_weight,
          actual_weight,
          variance_percentage,
          total_cost,
          operator_name,
          notes,
          paint_types (
            name,
            brand,
            color_code
          )
        `)
        .eq('company_id', companyData.id)
        .eq('vehicle_id', vehicleId)
        .order('weighing_timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching vehicle weighing reports:', error);
        throw error;
      }

      if (!weighingReports || weighingReports.length === 0) {
        return {
          totalCost: 0,
          totalReports: 0,
          averageVariancePercentage: 0,
          paintTypesUsed: [],
          reports: [],
          averageWastePercentage: 0,
          mostUsedPaintType: null
        };
      }

      // Calculs des métriques
      const totalCost = weighingReports.reduce((sum, report) => sum + (report.total_cost || 0), 0);
      const totalReports = weighingReports.length;

      // Calcul de la variance moyenne
      const reportsWithVariance = weighingReports.filter(report =>
        report.variance_percentage !== null && report.variance_percentage !== undefined
      );

      const averageVariancePercentage = reportsWithVariance.length > 0
        ? reportsWithVariance.reduce((sum, report) => sum + (report.variance_percentage || 0), 0) / reportsWithVariance.length
        : 0;

      // Calcul du gaspillage moyen (variances positives uniquement)
      const positiveVariances = reportsWithVariance.filter(report =>
        (report.variance_percentage || 0) > 0
      );

      const averageWastePercentage = positiveVariances.length > 0
        ? positiveVariances.reduce((sum, report) => sum + (report.variance_percentage || 0), 0) / positiveVariances.length
        : 0;

      // Analyse des types de peinture utilisés
      const paintTypeUsage = weighingReports.reduce((acc, report) => {
        if (report.paint_types) {
          const key = `${report.paint_types.name}-${report.paint_types.brand}`;
          if (!acc[key]) {
            acc[key] = {
              name: report.paint_types.name,
              brand: report.paint_types.brand,
              color_code: report.paint_types.color_code,
              usage_count: 0,
              total_cost: 0
            };
          }
          acc[key].usage_count++;
          acc[key].total_cost += report.total_cost || 0;
        }
        return acc;
      }, {} as Record<string, { name: string; brand: string; color_code: string | null; usage_count: number; total_cost: number }>);

      const paintTypesUsed = Object.values(paintTypeUsage)
        .sort((a, b) => b.usage_count - a.usage_count);

      const mostUsedPaintType = paintTypesUsed[0] || null;

      return {
        totalCost,
        totalReports,
        averageVariancePercentage: Math.round(averageVariancePercentage * 100) / 100,
        paintTypesUsed,
        reports: weighingReports,
        averageWastePercentage: Math.round(averageWastePercentage * 100) / 100,
        mostUsedPaintType
      };
    },
    enabled: !!vehicleId && !!companyData?.id
  });

  return {
    vehiclePaintMetrics,
    isLoading
  };
};
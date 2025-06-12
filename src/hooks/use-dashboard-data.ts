
import { useDashboardStats } from './dashboard/use-dashboard-stats';
import { useRecentVehicles } from './dashboard/use-recent-vehicles';
import { useRecentDocuments } from './dashboard/use-recent-documents';
import { useRecentActivity } from './dashboard/use-recent-activity';

export const useDashboardData = () => {
  const { dashboardStats, isLoading } = useDashboardStats();
  const { recentVehicles } = useRecentVehicles();
  const { recentDocuments } = useRecentDocuments();
  const { recentActivity } = useRecentActivity();

  return {
    dashboardStats,
    recentVehicles,
    recentDocuments,
    recentActivity,
    isLoading
  };
};

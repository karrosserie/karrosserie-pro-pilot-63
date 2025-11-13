import { useCallback } from 'react';
import { trackingService } from '@/services/tracking/TrackingService';
import { ActionType } from '@/types/activity-categories';

export const useDetailedTracking = () => {
  const trackAction = useCallback(async (
    actionType: ActionType,
    metadata?: Record<string, any>
  ) => {
    try {
      const userId = trackingService.getUserId();
      const companyId = trackingService.getCompanyId();

      if (!userId || !companyId) {
        console.warn('Cannot track detailed action: user not authenticated or no company_id');
        return;
      }

      await trackingService.trackDetailedAction(actionType, metadata);
    } catch (error) {
      console.error('Error tracking detailed action:', error);
      // Ne pas bloquer l'application si le tracking échoue
    }
  }, []);

  return { trackAction };
};

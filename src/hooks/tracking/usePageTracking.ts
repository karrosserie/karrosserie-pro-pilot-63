import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackingService } from '@/services/tracking/TrackingService';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Tracker la nouvelle page de manière sûre
    try {
      trackingService.trackPageView(location.pathname + location.search);
    } catch (error) {
      console.warn('Failed to track page view:', error);
    }
  }, [location.pathname, location.search]);

  return {
    trackCustomEvent: (eventName: string, metadata?: Record<string, any>) => {
      trackingService.trackEvent({
        eventType: 'page_view',
        eventCategory: 'navigation',
        eventName,
        pageUrl: location.pathname,
        metadata,
      });
    }
  };
};
import { useCallback } from 'react';
import { trackingService } from '@/services/tracking/TrackingService';

interface UseFormTrackingProps {
  formName: string;
  funnelName?: string;
  stepName?: string;
  stepOrder?: number;
}

export const useFormTracking = ({ 
  formName, 
  funnelName, 
  stepName, 
  stepOrder 
}: UseFormTrackingProps) => {
  
  const trackFormStart = useCallback(() => {
    if (funnelName && stepName && stepOrder !== undefined) {
      trackingService.trackFunnelStep({
        funnelName,
        stepName,
        stepOrder,
        status: 'started',
      });
    }
  }, [funnelName, stepName, stepOrder]);

  const trackFieldInteraction = useCallback((
    fieldName: string,
    action: 'focus' | 'blur' | 'change',
    value?: any
  ) => {
    trackingService.trackFormInteraction(formName, fieldName, action, value);
  }, [formName]);

  const trackFormSubmit = useCallback((formData: Record<string, any>) => {
    trackingService.trackFormInteraction(formName, 'form', 'submit');
    
    if (funnelName && stepName && stepOrder !== undefined) {
      trackingService.trackFunnelStep({
        funnelName,
        stepName,
        stepOrder,
        status: 'completed',
        formData,
      });
    }
  }, [formName, funnelName, stepName, stepOrder]);

  const trackFormError = useCallback((
    error: string,
    fieldName?: string,
    formData?: Record<string, any>
  ) => {
    trackingService.trackFormInteraction(formName, fieldName || 'form', 'error', error);
    
    trackingService.trackError({
      errorType: 'form_error',
      errorMessage: error,
      pageUrl: window.location.pathname,
      componentName: formName,
      funnelName,
      stepName,
      formData,
    });
  }, [formName, funnelName, stepName]);

  const trackFormAbandon = useCallback((formData: Record<string, any>) => {
    if (funnelName && stepName && stepOrder !== undefined) {
      trackingService.trackFunnelStep({
        funnelName,
        stepName,
        stepOrder,
        status: 'abandoned',
        formData,
      });
    }

    trackingService.trackError({
      errorType: 'funnel_abandon',
      errorMessage: `Form abandoned: ${formName}`,
      pageUrl: window.location.pathname,
      componentName: formName,
      funnelName,
      stepName,
      formData,
    });
  }, [formName, funnelName, stepName, stepOrder]);

  return {
    trackFormStart,
    trackFieldInteraction,
    trackFormSubmit,
    trackFormError,
    trackFormAbandon,
  };
};
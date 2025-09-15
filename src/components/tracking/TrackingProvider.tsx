import React, { useEffect } from 'react';
import { usePageTracking } from '@/hooks/tracking/usePageTracking';
import { trackingService } from '@/services/tracking/TrackingService';

interface TrackingProviderProps {
  children: React.ReactNode;
}

export const TrackingProvider: React.FC<TrackingProviderProps> = ({ children }) => {
  // Activer le tracking automatique des pages
  usePageTracking();

  useEffect(() => {
    // Gestionnaire d'erreurs global - ne pas tracker les erreurs lors de l'initialisation
    const handleGlobalError = (event: ErrorEvent) => {
      try {
        trackingService.trackError({
          errorType: 'system_error',
          errorMessage: event.message || 'Unknown error',
          pageUrl: window.location.pathname,
          stackTrace: event.error?.stack,
          metadata: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
        }).catch(() => {
          // Ignore tracking errors to prevent loops
        });
      } catch (trackingError) {
        // Ignore tracking errors completely
      }
    };

    // Gestionnaire d'erreurs de promesses non gérées
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      try {
        trackingService.trackError({
          errorType: 'system_error',
          errorMessage: `Unhandled promise rejection: ${event.reason}`,
          pageUrl: window.location.pathname,
          metadata: {
            type: 'unhandled_promise_rejection',
            reason: String(event.reason),
          },
        }).catch(() => {
          // Ignore tracking errors to prevent loops
        });
      } catch (trackingError) {
        // Ignore tracking errors completely
      }
    };

    // Ajouter les listeners d'erreurs globales avec un délai
    setTimeout(() => {
      window.addEventListener('error', handleGlobalError);
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
    }, 1000);

    // Nettoyer les listeners
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <>{children}</>;
};
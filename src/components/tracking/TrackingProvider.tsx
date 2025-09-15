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
    // Gestionnaire d'erreurs global
    const handleGlobalError = (event: ErrorEvent) => {
      trackingService.trackError({
        errorType: 'system_error',
        errorMessage: event.message,
        pageUrl: window.location.pathname,
        stackTrace: event.error?.stack,
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    };

    // Gestionnaire d'erreurs de promesses non gérées
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackingService.trackError({
        errorType: 'system_error',
        errorMessage: `Unhandled promise rejection: ${event.reason}`,
        pageUrl: window.location.pathname,
        metadata: {
          type: 'unhandled_promise_rejection',
          reason: String(event.reason),
        },
      });
    };

    // Ajouter les listeners d'erreurs globales
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Nettoyer les listeners
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <>{children}</>;
};
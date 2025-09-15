import { useCallback } from 'react';
import { trackingService } from '@/services/tracking/TrackingService';

export const useBusinessActionTracking = () => {
  
  const trackClientAction = useCallback((
    action: 'create' | 'update' | 'delete' | 'view',
    clientId?: string,
    metadata?: Record<string, any>
  ) => {
    trackingService.trackBusinessAction(
      `client_${action}`,
      'client',
      clientId,
      metadata
    );
  }, []);

  const trackVehicleAction = useCallback((
    action: 'create' | 'update' | 'delete' | 'view',
    vehicleId?: string,
    metadata?: Record<string, any>
  ) => {
    trackingService.trackBusinessAction(
      `vehicle_${action}`,
      'vehicle',
      vehicleId,
      metadata
    );
  }, []);

  const trackQuoteAction = useCallback((
    action: 'create' | 'update' | 'delete' | 'view' | 'generate_pdf' | 'send',
    quoteId?: string,
    metadata?: Record<string, any>
  ) => {
    trackingService.trackBusinessAction(
      `quote_${action}`,
      'quote',
      quoteId,
      metadata
    );
  }, []);

  const trackInvoiceAction = useCallback((
    action: 'create' | 'update' | 'delete' | 'view' | 'generate_pdf' | 'send' | 'payment_received',
    invoiceId?: string,
    metadata?: Record<string, any>
  ) => {
    trackingService.trackBusinessAction(
      `invoice_${action}`,
      'invoice',
      invoiceId,
      metadata
    );
  }, []);

  const trackRepairOrderAction = useCallback((
    action: 'create' | 'update' | 'delete' | 'view' | 'start' | 'complete',
    repairOrderId?: string,
    metadata?: Record<string, any>
  ) => {
    trackingService.trackBusinessAction(
      `repair_order_${action}`,
      'repair_order',
      repairOrderId,
      metadata
    );
  }, []);

  const trackPlanningAction = useCallback((
    action: 'view' | 'create_task' | 'update_task' | 'complete_task' | 'assign_vehicle',
    taskId?: string,
    metadata?: Record<string, any>
  ) => {
    trackingService.trackBusinessAction(
      `planning_${action}`,
      'planning',
      taskId,
      metadata
    );
  }, []);

  const trackDocumentAction = useCallback((
    action: 'upload' | 'download' | 'delete' | 'view' | 'generate',
    documentId?: string,
    metadata?: Record<string, any>
  ) => {
    trackingService.trackBusinessAction(
      `document_${action}`,
      'document',
      documentId,
      metadata
    );
  }, []);

  const trackFleetAction = useCallback((
    action: 'create_reservation' | 'update_reservation' | 'return_vehicle' | 'view_violations',
    entityId?: string,
    metadata?: Record<string, any>
  ) => {
    trackingService.trackBusinessAction(
      `fleet_${action}`,
      'fleet',
      entityId,
      metadata
    );
  }, []);

  const trackExpenseAction = useCallback((
    action: 'create' | 'update' | 'delete' | 'view' | 'validate',
    expenseId?: string,
    metadata?: Record<string, any>
  ) => {
    trackingService.trackBusinessAction(
      `expense_${action}`,
      'expense',
      expenseId,
      metadata
    );
  }, []);

  const trackSettingsAction = useCallback((
    action: 'view' | 'update_preferences' | 'manage_subscription' | 'manage_users',
    metadata?: Record<string, any>
  ) => {
    trackingService.trackBusinessAction(
      `settings_${action}`,
      'settings',
      undefined,
      metadata
    );
  }, []);

  return {
    trackClientAction,
    trackVehicleAction,
    trackQuoteAction,
    trackInvoiceAction,
    trackRepairOrderAction,
    trackPlanningAction,
    trackDocumentAction,
    trackFleetAction,
    trackExpenseAction,
    trackSettingsAction,
  };
};
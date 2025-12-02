import { useEffect, useRef, useState } from 'react';
import { useClientValidationNotification } from '@/contexts/ClientValidationNotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { ClientDataValidationReport } from './ClientDataValidationReport';
import { sendSmsNotification } from '@/utils/smsSender';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/hooks/use-company';

const REMINDER_DELAY_MS = 2 * 60 * 60 * 1000; // 2 heures
const STORAGE_KEY_PREFIX = 'client_validation_reminder_';
const SEEN_NOTIFICATIONS_KEY = 'seen_validation_notifications';
const SEEN_NOTIFICATIONS_TIMESTAMPS_KEY = 'seen_validation_notifications_timestamps';

// Nettoyer les anciennes notifications vues (plus de 24h)
const cleanOldSeenNotifications = () => {
  try {
    const timestamps = JSON.parse(localStorage.getItem(SEEN_NOTIFICATIONS_TIMESTAMPS_KEY) || '{}');
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    
    const validEntries = Object.entries(timestamps)
      .filter(([_, ts]) => (ts as number) > oneDayAgo);
    
    const validIds = validEntries.map(([id]) => id);
    localStorage.setItem(SEEN_NOTIFICATIONS_KEY, JSON.stringify(validIds));
    localStorage.setItem(SEEN_NOTIFICATIONS_TIMESTAMPS_KEY, JSON.stringify(Object.fromEntries(validEntries)));
  } catch (error) {
    console.error('Error cleaning old seen notifications:', error);
  }
};

// Marquer une notification comme vue
const markNotificationAsSeen = (reportId: string) => {
  try {
    const seen = JSON.parse(localStorage.getItem(SEEN_NOTIFICATIONS_KEY) || '[]');
    const timestamps = JSON.parse(localStorage.getItem(SEEN_NOTIFICATIONS_TIMESTAMPS_KEY) || '{}');
    
    if (!seen.includes(reportId)) {
      seen.push(reportId);
      timestamps[reportId] = Date.now();
      localStorage.setItem(SEEN_NOTIFICATIONS_KEY, JSON.stringify(seen));
      localStorage.setItem(SEEN_NOTIFICATIONS_TIMESTAMPS_KEY, JSON.stringify(timestamps));
    }
  } catch (error) {
    console.error('Error marking notification as seen:', error);
  }
};

// Vérifier si une notification a déjà été vue
const hasNotificationBeenSeen = (reportId: string): boolean => {
  try {
    const seen = JSON.parse(localStorage.getItem(SEEN_NOTIFICATIONS_KEY) || '[]');
    return seen.includes(reportId);
  } catch {
    return false;
  }
};

export function ClientValidationWatcher() {
  const { notification, clearNotification } = useClientValidationNotification();
  const { profile } = useAuth();
  const { companyData } = useCompany();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clientData, setClientData] = useState<any>(null);
  
  const processingReportIds = useRef<Set<string>>(new Set());
  const processedDocRequestsRef = useRef<Set<string>>(new Set());

  const sendSms = async (
    reportId: string, 
    clientId: string,
    clientName: string,
    missingFields: string[],
    isReminder: boolean = false
  ) => {
    if (processingReportIds.current.has(reportId)) {
      console.log(`Already processing SMS for report ${reportId}, skipping`);
      return;
    }

    processingReportIds.current.add(reportId);

    try {
      const phone = profile?.phone_number;
      if (!phone) {
        console.warn('⚠️ Cannot send SMS: No phone number in profile');
        toast.error('Impossible d\'envoyer le SMS : numéro de téléphone manquant dans votre profil');
        return;
      }

      if (!companyData?.id) {
        console.warn('⚠️ Cannot send SMS: No company ID');
        toast.error('Impossible d\'envoyer le SMS : entreprise non identifiée');
        return;
      }

      const result = await sendSmsNotification(
        phone,
        reportId,
        clientId,
        clientName,
        companyData.id,
        missingFields,
        isReminder
      );
      
      if (result.success) {
        toast.success(isReminder ? '📱 SMS de rappel envoyé' : '📱 SMS de notification envoyé');
        console.log(`✅ SMS sent for report ${reportId} (reminder: ${isReminder})`);
      } else {
        if (result.error?.includes('24h')) {
          console.log(`⏭️ ${result.error}`);
        } else {
          console.error('Failed to send SMS:', result.error);
          toast.error(`Échec de l'envoi du SMS : ${result.error}`);
        }
      }
    } finally {
      setTimeout(() => {
        processingReportIds.current.delete(reportId);
      }, 5000);
    }
  };

  const scheduleReminder = (reportId: string, clientId: string, clientName: string) => {
    const reminderTime = Date.now() + REMINDER_DELAY_MS;
    const reminderData = {
      reportId,
      clientId,
      clientName,
      scheduledFor: reminderTime,
      notificationData: notification
    };
    
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}${reportId}`,
      JSON.stringify(reminderData)
    );
    
    console.log(`⏰ Reminder scheduled for report ${reportId} at ${new Date(reminderTime)}`);
    toast.info('Un rappel vous sera envoyé dans 2 heures');
  };

  const checkPendingReminders = async () => {
    const now = Date.now();
    const keys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_KEY_PREFIX));
    
    for (const key of keys) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        
        if (data.scheduledFor && now >= data.scheduledFor) {
          console.log(`⏰ Reminder triggered for report ${data.reportId}`);
          
          const missingFields = data.notificationData?.validationResults?.missing?.missingFields || [];
          
          await sendSms(
            data.reportId, 
            data.clientId,
            data.clientName, 
            missingFields,
            true
          );
          
          if (data.notificationData?.clientId) {
            const { data: client } = await supabase
              .from('clients')
              .select('*')
              .eq('id', data.notificationData.clientId)
              .single();
            
            if (client) {
              setClientData(client);
              setIsDialogOpen(true);
            }
          }
          
          localStorage.removeItem(key);
        }
      } catch (error) {
        console.error('Error checking reminder:', error);
        localStorage.removeItem(key);
      }
    }
  };

  // Nettoyer les anciennes notifications au montage
  useEffect(() => {
    cleanOldSeenNotifications();
  }, []);

  useEffect(() => {
    if (!notification) return;

    const { reportId, clientId, clientName, validationResults } = notification;
    
    // Vérifier si cette notification a déjà été vue
    if (hasNotificationBeenSeen(reportId)) {
      console.log('⏭️ Notification already seen, skipping:', reportId);
      clearNotification();
      return;
    }

    const missingFields = validationResults.missing?.missingFields || [];

    const fetchClientData = async () => {
      const { data: client, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (error) {
        console.error('Error fetching client:', error);
        return;
      }

      setClientData(client);
      setIsDialogOpen(true);

      await sendSms(reportId, clientId, clientName, missingFields, false);

      // Envoyer automatiquement la demande de documents au client (avec protection contre les doublons)
      if (missingFields.length > 0 && companyData?.id && !processedDocRequestsRef.current.has(reportId)) {
        try {
          processedDocRequestsRef.current.add(reportId);
          console.log('🔒 Report marked for document request processing:', reportId);
          
          const { sendDocumentsRequest } = await import('@/services/documentsRequestService');
          await sendDocumentsRequest(clientId, companyData.id);
          console.log('✅ Demande de documents envoyée automatiquement au client');
        } catch (error) {
          console.error('❌ Erreur envoi demande documents:', error);
          // Retirer du set en cas d'erreur pour permettre une nouvelle tentative
          processedDocRequestsRef.current.delete(reportId);
        }
      } else if (processedDocRequestsRef.current.has(reportId)) {
        console.log('⏭️ Demande de documents déjà envoyée pour ce rapport, ignoré');
      }
    };

    fetchClientData();
  }, [notification, profile, companyData, clearNotification]);

  useEffect(() => {
    checkPendingReminders();
    
    const interval = setInterval(checkPendingReminders, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    if (notification) {
      markNotificationAsSeen(notification.reportId);
      scheduleReminder(
        notification.reportId, 
        notification.clientId,
        notification.clientName
      );
    }
    setIsDialogOpen(false);
    clearNotification();
  };

  // Handler pour onOpenChange : traite toute fermeture comme "Plus tard"
  const handleDialogOpenChange = (open: boolean) => {
    if (!open && isDialogOpen) {
      // Le dialogue se ferme (X, clic extérieur, ESC) → traiter comme "Plus tard"
      handleDismiss();
      return;
    }
    setIsDialogOpen(open);
  };

  const handleEditClient = () => {
    if (!clientData?.id) return;
    if (notification) {
      markNotificationAsSeen(notification.reportId);
    }
    window.location.href = `/clients?edit=${clientData.id}`;
    setIsDialogOpen(false);
    clearNotification();
  };

  const handleCreateQuoteAnyway = async () => {
    if (!notification?.reportId) return;
    
    markNotificationAsSeen(notification.reportId);
    
    try {
      const { quotesService } = await import('@/services/supabase/quotes');
      
      const { data: report } = await supabase
        .from('expertise_reports')
        .select('*')
        .eq('id', notification.reportId)
        .single();
      
      if (report) {
        const newQuote = await quotesService.createFromReport(report);
        toast.success('Devis créé malgré les informations manquantes');
        
        setTimeout(() => {
          window.location.href = `/documents/devis?openQuote=${newQuote.id}`;
        }, 1000);
      }
    } catch (error) {
      console.error('Error creating quote:', error);
      toast.error('Erreur lors de la création du devis');
    }
    
    setIsDialogOpen(false);
    clearNotification();
  };

  if (!notification || !clientData) {
    return null;
  }

  return (
    <ClientDataValidationReport
      open={isDialogOpen}
      onOpenChange={handleDialogOpenChange}
      client={clientData}
      validationResults={notification.validationResults}
      onEditClient={handleEditClient}
      onDismiss={handleDismiss}
      onCreateQuoteAnyway={handleCreateQuoteAnyway}
    />
  );
}

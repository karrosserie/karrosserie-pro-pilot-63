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

export function ClientValidationWatcher() {
  const { notification, clearNotification } = useClientValidationNotification();
  const { profile } = useAuth();
  const { companyData } = useCompany();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clientData, setClientData] = useState<any>(null);
  
  const processingReportIds = useRef<Set<string>>(new Set());

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

  useEffect(() => {
    if (!notification) return;

    const { reportId, clientId, clientName, validationResults } = notification;
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

      // Envoyer automatiquement la demande de documents au client
      if (missingFields.length > 0 && companyData?.id) {
        try {
          const { sendDocumentsRequest } = await import('@/services/documentsRequestService');
          await sendDocumentsRequest(clientId, companyData.id);
          console.log('✅ Demande de documents envoyée automatiquement au client');
        } catch (error) {
          console.error('❌ Erreur envoi demande documents:', error);
        }
      }
    };

    fetchClientData();
  }, [notification, profile, companyData]);

  useEffect(() => {
    checkPendingReminders();
    
    const interval = setInterval(checkPendingReminders, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    if (notification) {
      scheduleReminder(
        notification.reportId, 
        notification.clientId,
        notification.clientName
      );
    }
    setIsDialogOpen(false);
    clearNotification();
  };

  const handleEditClient = () => {
    if (!clientData?.id) return;
    window.location.href = `/clients?edit=${clientData.id}`;
    setIsDialogOpen(false);
    clearNotification();
  };

  const handleCreateQuoteAnyway = async () => {
    if (!notification?.reportId) return;
    
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
      onOpenChange={setIsDialogOpen}
      client={clientData}
      validationResults={notification.validationResults}
      onEditClient={handleEditClient}
      onDismiss={handleDismiss}
      onCreateQuoteAnyway={handleCreateQuoteAnyway}
    />
  );
}
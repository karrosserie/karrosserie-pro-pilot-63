import { supabase } from '@/integrations/supabase/client';

export interface SmsResult {
  success: boolean;
  error?: string;
  smsId?: string;
}

/**
 * Mapping des codes de champs vers des labels courts pour SMS
 */
const FIELD_LABELS: Record<string, string> = {
  // Identité
  'prenom': 'Prénom',
  'nom': 'Nom',
  'telephone': 'Tél',
  'email': 'Email',
  'adresse': 'Adresse',
  'code_postal': 'CP',
  'ville': 'Ville',
  'date_naissance': 'Date naiss.',
  
  // Permis
  'permis_recto': 'Permis R°',
  'permis_verso': 'Permis V°',
  'driver_license_front_url': 'Permis R°',
  'driver_license_back_url': 'Permis V°',
  
  // Carte grise
  'carte_grise_recto': 'CG R°',
  'carte_grise_verso': 'CG V°',
  'registration_document_front_url': 'CG R°',
  'registration_document_back_url': 'CG V°',
  
  // Autres
  'iban': 'RIB',
  'assurance': 'Assurance',
};

/**
 * Génère un message SMS poli et contextualisé avec les champs manquants
 */
function generateSmsMessage(
  clientName: string,
  missingFields: string[],
  isReminder: boolean
): string {
  // Convertir les codes en labels courts et dédupliquer
  const readableFields = missingFields
    .map(field => FIELD_LABELS[field] || field)
    .filter((value, index, self) => self.indexOf(value) === index);

  const fieldsList = readableFields.join(', ');

  if (isReminder) {
    // SMS de rappel (plus court)
    return `Rappel : Dossier ${clientName} incomplet (${fieldsList}). Merci de finaliser. 🔔`;
  } else {
    // SMS initial (plus détaillé)
    return `Bonjour, le dossier de ${clientName} est incomplet. Il manque : ${fieldsList}. Merci de compléter pour continuer. 🚗`;
  }
}

/**
 * Vérifie si un SMS a déjà été envoyé pour ce rapport dans les dernières 24h
 */
export async function checkSmsAlreadySent(
  reportId: string,
  isReminder: boolean = false
): Promise<boolean> {
  try {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const { data, error } = await supabase
      .from('client_validation_sms')
      .select('id')
      .eq('report_id', reportId)
      .eq('is_reminder', isReminder)
      .gte('sent_at', twentyFourHoursAgo.toISOString())
      .limit(1);

    if (error) {
      console.error('Error checking SMS history:', error);
      return false;
    }

    return (data?.length || 0) > 0;
  } catch (error) {
    console.error('Error in checkSmsAlreadySent:', error);
    return false;
  }
}

/**
 * Enregistre un SMS en base de données
 */
export async function recordSms(params: {
  companyId: string;
  clientId: string;
  reportId: string;
  phone: string;
  message: string;
  missingFields: string[];
  isReminder: boolean;
  status: 'sent' | 'failed';
  webhookResponse?: any;
}): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('client_validation_sms')
      .insert({
        company_id: params.companyId,
        client_id: params.clientId,
        report_id: params.reportId,
        phone: params.phone,
        message: params.message,
        missing_fields: params.missingFields,
        is_reminder: params.isReminder,
        status: params.status,
        webhook_response: params.webhookResponse || null,
        sent_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error recording SMS:', error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error('Error in recordSms:', error);
    return null;
  }
}

/**
 * Envoie un SMS via le webhook n8n
 */
export async function sendSmsNotification(
  phone: string,
  reportId: string,
  clientId: string,
  clientName: string,
  companyId: string,
  missingFields: string[],
  isReminder: boolean = false
): Promise<SmsResult> {
  // Générer le message personnalisé avec les champs manquants (avant le try pour qu'il soit accessible dans le catch)
  const message = generateSmsMessage(clientName, missingFields, isReminder);

  try {
    if (!phone) {
      console.error('SMS Error: Phone is required');
      return { success: false, error: 'Phone is required' };
    }

    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    if (!cleanPhone.startsWith('+')) {
      console.error('SMS Error: Phone must start with +');
      return { 
        success: false, 
        error: 'Phone number must be in international format (+33...)' 
      };
    }

    const alreadySent = await checkSmsAlreadySent(reportId, isReminder);
    if (alreadySent) {
      console.warn(`⚠️ SMS already sent for report ${reportId} (reminder: ${isReminder}) in the last 24h`);
      return { 
        success: false, 
        error: 'Un SMS a déjà été envoyé pour ce rapport dans les dernières 24h' 
      };
    }

    console.log(`📱 Sending SMS to ${cleanPhone} via n8n webhook...`);

    const webhookUrl = 'https://n8n.karrosserie.pro/webhook/send-alert-sms';

    const payload = [{
      phone: cleanPhone,
      message,
      report_id: reportId,
      client_name: clientName,
      company_id: companyId,
      missing_fields: missingFields,
      timestamp: new Date().toISOString()
    }];

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      console.error('n8n webhook error:', response.status, responseData);
      
      await recordSms({
        companyId,
        clientId,
        reportId,
        phone: cleanPhone,
        message,
        missingFields,
        isReminder,
        status: 'failed',
        webhookResponse: { error: responseData, status: response.status }
      });

      return { 
        success: false, 
        error: `Webhook failed: ${response.status}` 
      };
    }

    console.log('✅ SMS sent successfully via n8n');

    const smsId = await recordSms({
      companyId,
      clientId,
      reportId,
      phone: cleanPhone,
      message,
      missingFields,
      isReminder,
      status: 'sent',
      webhookResponse: responseData
    });

    return { success: true, smsId: smsId || undefined };

  } catch (error) {
    console.error('SMS Error (catch):', error);
    
    await recordSms({
      companyId,
      clientId,
      reportId,
      phone: phone.replace(/[\s\-\(\)]/g, ''),
      message,
      missingFields,
      isReminder,
      status: 'failed',
      webhookResponse: { error: error instanceof Error ? error.message : 'Unknown error' }
    });

    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
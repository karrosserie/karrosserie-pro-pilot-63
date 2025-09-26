import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/hooks/use-company';

type ChannelType = 'phone' | 'email' | 'sms' | 'whatsapp' | 'vms' | 'courrier' | 'courrier_recommande';
type ToneType = 'amical' | 'ferme' | 'serieux' | 'menacant';

export const useSendRelance = () => {
  const { toast } = useToast();
  const { companyData } = useCompany();

  const checkDailyLimit = async (clientId: string, channel: ChannelType): Promise<boolean> => {
    if (!companyData?.id) return false;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('client_relances')
        .select('id')
        .eq('company_id', companyData.id)
        .eq('client_id', clientId)
        .eq('channel', channel)
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`);

      if (error) {
        console.error('Error checking daily limit:', error);
        return false;
      }

      return (data?.length || 0) === 0;
    } catch (error) {
      console.error('Error in checkDailyLimit:', error);
      return false;
    }
  };

  const sendWebhook = async (params: {
    invoice: any;
    channel: string;
    relanceNumber: string;
  }) => {
    try {
      // Récupérer les informations du client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', params.invoice.client_id)
        .single();

      if (clientError) {
        throw new Error('Impossible de récupérer les informations du client');
      }

      // Construire les paramètres pour le webhook GET
      const webhookParams = new URLSearchParams({
        // Informations du client
        client_id: params.invoice.client_id,
        client_first_name: clientData.first_name || '',
        client_last_name: clientData.last_name || '',
        client_email: clientData.email || '',
        client_phone: clientData.phone || '',
        client_address: clientData.address || '',
        client_postal_code: clientData.postal_code || '',
        client_city: clientData.city || '',
        
        // Informations de la facture
        invoice_id: params.invoice.id,
        invoice_reference: params.invoice.reference,
        invoice_amount: params.invoice.amount.toString(),
        invoice_due_date: params.invoice.due_date || '',
        invoice_status: params.invoice.status,
        
        // Informations de la compagnie
        company_id: companyData?.id || '',
        company_name: companyData?.name || '',
        company_email: companyData?.email || '',
        company_phone: companyData?.phone || '',
        company_address: companyData?.address || '',
        company_zipcode: companyData?.zipcode || '',
        company_city: companyData?.city || '',
        
        // Informations de la relance
        relance_number: params.relanceNumber,
        channel: params.channel,
        timestamp: new Date().toISOString()
      });

      const webhookUrl = `https://n8n.karrosserie.pro/webhook/15461cdf-61d9-49ab-8b76-1dc4e4a5a19c?${webhookParams.toString()}`;

      const response = await fetch(webhookUrl, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error sending webhook:', error);
      throw error;
    }
  };

  const recordRelance = async (params: {
    clientId: string;
    invoiceId: string;
    channel: ChannelType;
    tone: ToneType;
    message: string;
    subject?: string;
  }) => {
    if (!companyData?.id) return null;

    try {
      const { data, error } = await supabase
        .from('client_relances')
        .insert({
          company_id: companyData.id,
          client_id: params.clientId,
          invoice_id: params.invoiceId,
          channel: params.channel,
          tone: params.tone,
          status: 'envoye' as const,
          subject: params.subject,
          message: params.message,
          is_automated: false,
          sent_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error recording relance:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in recordRelance:', error);
      throw error;
    }
  };

  const sendRelance = async (params: {
    invoice: any;
    channel: string;
    message: string;
    subject?: string;
    relanceNumber: string;
  }) => {
    try {
      // Mapper les types d'action vers les canaux de la base de données
      const channelMap: { [key: string]: ChannelType } = {
        'sms': 'sms',
        'whatsapp': 'whatsapp',
        'vms': 'vms',
        'mail': 'email',
        'recommande': 'courrier_recommande'
      };

      const mappedChannel = channelMap[params.channel];

      if (!mappedChannel) {
        throw new Error(`Type de canal non supporté: ${params.channel}`);
      }

      // Vérifier la limite quotidienne
      const canSend = await checkDailyLimit(params.invoice.client_id, mappedChannel);
      if (!canSend) {
        toast({
          title: "Limite atteinte",
          description: `Une relance ${params.channel} a déjà été envoyée aujourd'hui à ce client.`,
          variant: "destructive",
        });
        return false;
      }

      // Envoyer le webhook
      await sendWebhook({
        invoice: params.invoice,
        channel: params.channel,
        relanceNumber: params.relanceNumber,
      });

      // Enregistrer dans l'historique
      await recordRelance({
        clientId: params.invoice.client_id,
        invoiceId: params.invoice.id,
        channel: mappedChannel,
        tone: 'amical', // Ton par défaut
        message: params.message,
        subject: params.subject,
      });

      toast({
        title: "Relance envoyée",
        description: `Relance ${params.channel} envoyée avec succès`,
      });

      return true;
    } catch (error) {
      console.error('Error sending relance:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la relance. Veuillez réessayer.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    sendRelance,
    checkDailyLimit,
  };
};
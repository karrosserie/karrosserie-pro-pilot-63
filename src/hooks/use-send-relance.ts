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
    invoiceId: string;
    clientId: string;
    carrosserieId: string;
    relanceType: string;
    relanceText: string;
  }) => {
    try {
      const response = await fetch('https://n8n.karrosserie.pro/webhook/karrosserie-relance-manuelle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoice_id: params.invoiceId,
          client_id: params.clientId,
          carrosserie_id: params.carrosserieId,
          relance_type: params.relanceType,
          relance_text: params.relanceText,
        }),
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
    tone: string;
    message: string;
    subject?: string;
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

      const toneMap: { [key: string]: ToneType } = {
        'amical': 'amical',
        'ferme': 'ferme',
        'serieux': 'serieux',
        'menacant': 'menacant'
      };

      const mappedChannel = channelMap[params.channel];
      const mappedTone = toneMap[params.tone];

      if (!mappedChannel || !mappedTone) {
        throw new Error(`Type de canal ou ton non supporté: ${params.channel}, ${params.tone}`);
      }

      // Vérifier la limite quotidienne
      const canSend = await checkDailyLimit(params.invoice.clientId, mappedChannel);
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
        invoiceId: params.invoice.id,
        clientId: params.invoice.clientId,
        carrosserieId: companyData?.id || '',
        relanceType: params.channel,
        relanceText: params.message,
      });

      // Enregistrer dans l'historique
      await recordRelance({
        clientId: params.invoice.clientId,
        invoiceId: params.invoice.id,
        channel: mappedChannel,
        tone: mappedTone,
        message: params.message,
        subject: params.subject,
      });

      toast({
        title: "Relance envoyée",
        description: `Relance ${params.channel} envoyée avec succès à ${params.invoice.client}`,
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
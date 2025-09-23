import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface TriggerTaskStartedWebhookParams {
  taskId: string;
  webhookUrl?: string;
}

/**
 * Déclenche le webhook N8N quand une tâche est démarrée
 */
export const triggerTaskStartedWebhook = async ({ 
  taskId, 
  webhookUrl 
}: TriggerTaskStartedWebhookParams) => {
  try {
    console.log('🚀 Déclenchement du webhook pour la tâche:', taskId);

    const { data, error } = await supabase.functions.invoke('task-started-webhook', {
      body: {
        taskId,
        webhookUrl
      }
    });

    if (error) {
      console.error('❌ Erreur lors du déclenchement du webhook:', error);
      toast({
        title: "Erreur webhook",
        description: `Impossible de déclencher le webhook N8N: ${error.message}`,
        variant: "destructive"
      });
      return false;
    }

    console.log('✅ Webhook déclenché avec succès:', data);
    
    // Toast de succès uniquement si on a vraiment envoyé un webhook
    if (data?.message?.includes('succès')) {
      toast({
        title: "Webhook envoyé",
        description: "Le webhook N8N a été déclenché avec succès",
      });
    }

    return true;
  } catch (error) {
    console.error('❌ Erreur générale webhook:', error);
    toast({
      title: "Erreur webhook",
      description: "Erreur lors de l'appel du webhook N8N",
      variant: "destructive"
    });
    return false;
  }
};
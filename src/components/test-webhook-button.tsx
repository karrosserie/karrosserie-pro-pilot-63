import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const TestWebhookButton = () => {
  const testWebhook = async () => {
    try {
      console.log('🧪 Test de la fonction edge...');
      
      const { data, error } = await supabase.functions.invoke('test-task-webhook', {
        body: { test: true }
      });

      if (error) {
        console.error('❌ Erreur test:', error);
        toast({
          title: "Erreur test",
          description: `Erreur: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Résultat test:', data);
      toast({
        title: "Test réussi",
        description: data?.message || "Test webhook exécuté avec succès",
      });

      // Vérifier si les instructions ont été sauvegardées
      if (data?.success && data?.task_id) {
        console.log('🔍 Vérification de la sauvegarde pour task_id:', data.task_id);
        
        const { data: task } = await supabase
          .from('employee_schedule')
          .select('detailed_instructions')
          .eq('id', data.task_id)
          .single();

        console.log('📋 Tâche après test:', task);
        
        if (task?.detailed_instructions) {
          const instructions = task.detailed_instructions as any;
          toast({
            title: "✅ Instructions sauvegardées",
            description: `${instructions.instructions?.length || 0} instructions trouvées`,
          });
        }
      }
    } catch (error) {
      console.error('❌ Erreur générale:', error);
      toast({
        title: "Erreur test",
        description: "Erreur lors du test de webhook",
        variant: "destructive"
      });
    }
  };

  return (
    <Button onClick={testWebhook} variant="outline">
      🧪 Test Webhook N8N
    </Button>
  );
};
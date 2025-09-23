import { supabase } from '@/integrations/supabase/client';

export const testTaskWebhook = async () => {
  console.log('🧪 Test de la fonction edge...');
  
  try {
    const { data, error } = await supabase.functions.invoke('test-task-webhook', {
      body: { test: true }
    });

    if (error) {
      console.error('❌ Erreur test:', error);
      return { success: false, error };
    }

    console.log('✅ Résultat test:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erreur générale test:', error);
    return { success: false, error };
  }
};

// Pour appeler depuis la console du navigateur :
// import { testTaskWebhook } from '/src/test-webhook.ts'; testTaskWebhook();
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TaskStartedPayload {
  taskId: string;
  webhookUrl?: string;
}

interface N8NTaskInstruction {
  number: number;
  task: string;
}

interface N8NResponse {
  instructions?: N8NTaskInstruction[];
  output?: {
    task_type: string;
    vehicules_id: string;
    task_id: string;
  };
  // Pour les réponses sous forme de tableau (comme dans les logs)
  [index: number]: N8NTaskInstruction | { output: any };
}

// Fonction pour traiter les instructions N8N
async function processN8NInstructions(
  n8nResponse: any, 
  taskId: string, 
  taskData: TaskData, 
  webhookPayload: any,
  supabaseClient: any
) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  let instructions: N8NTaskInstruction[] = [];
  let outputData: any = null;

  // Analyser le format de la réponse N8N
  if (Array.isArray(n8nResponse)) {
    // Format tableau : extraire les instructions et l'output
    instructions = n8nResponse.filter((item: any) => 
      typeof item.number === 'number' && typeof item.task === 'string'
    ) as N8NTaskInstruction[];
    
    const outputItem = n8nResponse.find((item: any) => item.output);
    outputData = outputItem?.output;
  } else if (n8nResponse.instructions && Array.isArray(n8nResponse.instructions)) {
    // Format objet avec propriété instructions
    instructions = n8nResponse.instructions;
    outputData = n8nResponse.output;
  }

  console.log(`🔍 Instructions trouvées: ${instructions.length}`);
  console.log('🔍 Output data:', outputData);

  if (instructions && instructions.length > 0) {
    // Préparer les instructions détaillées
    const detailedInstructions = {
      instructions: instructions,
      received_at: new Date().toISOString(),
      task_type_confirmed: outputData?.task_type || taskData.task_type,
      source: 'n8n_analysis'
    };

    console.log('💾 Sauvegarde des instructions pour la tâche:', taskId);

    // Mettre à jour la tâche avec les instructions détaillées
    const { error: updateError } = await supabaseClient
      .from('employee_schedule')
      .update({
        detailed_instructions: detailedInstructions,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);

    if (updateError) {
      console.error('❌ Erreur mise à jour tâche:', updateError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to save instructions',
          details: updateError.message
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ Instructions sauvegardées avec succès');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Instructions N8N reçues et sauvegardées',
        instructions_count: instructions.length,
        payload: webhookPayload 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } else {
    console.log('⚠️ Aucune instruction reçue de N8N');
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Webhook N8N déclenché avec succès - aucune instruction reçue',
        payload: webhookPayload 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

interface TaskData {
  id: string;
  task_type: string;
  vehicle_id: string | null;
  user_id: string;
  company_id: string;
  real_start_datetime: string;
  vehicles?: {
    id: string;
    license_plate: string;
    car_brands?: { name: string } | null;
    car_models?: { name: string } | null;
    clients?: {
      id: string;
      first_name: string;
      last_name: string;
      email?: string;
      phone?: string;
    } | null;
  } | null;
}

Deno.serve(async (req) => {
  console.log('🚀 DEBUT: Task-started-webhook appelée!', new Date().toISOString());
  console.log('🔍 Method:', req.method);
  console.log('🔍 URL:', req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS request handled');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔧 Création client Supabase...');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('📥 Lecture du payload...');
    const rawBody = await req.text();
    console.log('📄 Raw body:', rawBody);
    
    const { taskId, webhookUrl }: TaskStartedPayload = JSON.parse(rawBody);
    console.log('📋 taskId reçu:', taskId);
    console.log('🌐 webhookUrl fourni:', webhookUrl);

    if (!taskId) {
      console.error('❌ TaskId manquant dans le payload');
      return new Response(
        JSON.stringify({ error: 'taskId is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`🚀 Traitement de la tâche démarrée: ${taskId}`);

    // 1. Récupérer les détails de la tâche
    const { data: taskData, error: taskError } = await supabaseClient
      .from('employee_schedule')
      .select(`
        id,
        task_type,
        vehicle_id,
        user_id,
        company_id,
        real_start_datetime
      `)
      .eq('id', taskId)
      .maybeSingle() as { data: TaskData | null; error: any };

    if (taskError || !taskData) {
      console.error('❌ Erreur lors de la récupération de la tâche:', taskError);
      return new Response(
        JSON.stringify({ error: 'Tâche non trouvée' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`📋 Tâche récupérée: ${taskData.id}, vehicle_id: ${taskData.vehicle_id}`);

    // 3. Préparer les données pour N8N (payload simplifié)
    const webhookPayload = {
      task_id: taskData.id,
      company_id: taskData.company_id,
      vehicle_id: taskData.vehicle_id
    };

    console.log('📤 Payload préparé pour N8N:', JSON.stringify(webhookPayload, null, 2));

    // 4. Déterminer l'URL du webhook N8N à utiliser
    // URL globale par défaut pour toutes les entreprises
    const globalWebhookUrl = 'https://n8n.karrosserie.pro/webhook/af159b59-5852-42d7-8298-1a3f1bf8cd67';
    
    let targetWebhookUrl = globalWebhookUrl;
    
    // Si une URL spécifique est fournie dans le payload, l'utiliser en priorité
    if (webhookUrl) {
      targetWebhookUrl = webhookUrl;
    } else {
      // Sinon, essayer de récupérer depuis les préférences de l'entreprise
      const { data: preferences } = await supabaseClient
        .from('company_preferences')
        .select('n8n_webhook_url')
        .eq('company_id', taskData.company_id)
        .maybeSingle();
      
      if (preferences?.n8n_webhook_url) {
        targetWebhookUrl = preferences.n8n_webhook_url;
      }
    }
    
    console.log('🎯 URL webhook cible:', targetWebhookUrl);

    // 5. Envoyer les données à N8N et attendre la réponse avec les instructions
    try {
      console.log('📡 Tentative POST vers N8N...');
      
      // Essayer d'abord avec POST (plus simple pour N8N)
      const webhookResponse = await fetch(targetWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(webhookPayload)
      });

      console.log(`📡 Webhook N8N appelé avec statut: ${webhookResponse.status}`);
      console.log('📋 Headers de réponse:', Object.fromEntries(webhookResponse.headers.entries()));

      if (!webhookResponse.ok) {
        // Si POST échoue, essayer GET en fallback
        console.log('⚠️ POST échoué, tentative GET...');
        
        const queryParams = new URLSearchParams({
          data: JSON.stringify(webhookPayload)
        });
        
        const webhookUrlWithParams = `${targetWebhookUrl}?${queryParams.toString()}`;
        console.log('🔗 URL GET (tronquée):', webhookUrlWithParams.substring(0, 200) + '...');
        
        const getResponse = await fetch(webhookUrlWithParams, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log(`📡 Webhook GET N8N statut: ${getResponse.status}`);

        if (!getResponse.ok) {
          // Tenter de lire le corps de la réponse pour plus de détails
          let errorBody = '';
          try {
            errorBody = await getResponse.text();
            console.error('❌ Corps de l\'erreur N8N:', errorBody);
          } catch (bodyError) {
            console.error('❌ Impossible de lire le corps de l\'erreur:', bodyError);
          }

          console.error('❌ Erreur webhook N8N (GET):', getResponse.statusText);
          return new Response(
            JSON.stringify({ 
              success: false,
              message: `Webhook N8N a échoué POST(${webhookResponse.status}) et GET(${getResponse.status})`,
              post_error: webhookResponse.statusText,
              get_error: getResponse.statusText,
              error_body: errorBody,
              payload: webhookPayload 
            }),
            { 
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Utiliser la réponse GET
        const responseText = await getResponse.text();
        console.log('📥 Réponse N8N GET:', responseText);
        
        try {
          const n8nResponse = JSON.parse(responseText);
          console.log('📥 Réponse N8N parsée (GET):', JSON.stringify(n8nResponse, null, 2));
          
          // Traiter les instructions de la réponse GET
          return await processN8NInstructions(n8nResponse, taskId, taskData, webhookPayload, supabaseClient);
        } catch (parseError) {
          console.error('❌ Erreur parsing réponse GET:', parseError);
          return new Response(
            JSON.stringify({ 
              success: false,
              message: 'Réponse N8N GET invalide (pas JSON)',
              response_body: responseText,
              payload: webhookPayload 
            }),
            { 
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      }

      // 6. Traiter la réponse N8N avec les instructions détaillées (POST réussi)
      const responseText = await webhookResponse.text();
      console.log('📥 Réponse N8N POST brute:', responseText);

      let n8nResponse: N8NResponse;
      try {
        n8nResponse = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Erreur parsing réponse POST:', parseError);
        console.error('📄 Contenu réponse:', responseText);
        
        return new Response(
          JSON.stringify({ 
            success: false,
            message: 'Réponse N8N POST invalide (pas JSON)',
            response_body: responseText,
            payload: webhookPayload 
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      console.log('📥 Réponse N8N POST parsée:', JSON.stringify(n8nResponse, null, 2));

      // Traiter les instructions de la réponse POST
      console.log('🔄 Appel processN8NInstructions avec réponse POST...');
      return await processN8NInstructions(n8nResponse, taskId, taskData, webhookPayload, supabaseClient);

    } catch (fetchError) {
      console.error('❌ Erreur lors de l\'appel du webhook:', fetchError);
      console.error('🔍 Type d\'erreur:', fetchError.name);
      console.error('💬 Message d\'erreur:', fetchError.message);
      
      // Ne pas retourner une erreur 500, juste loguer et continuer  
      return new Response(
        JSON.stringify({ 
          success: false,
          message: `Erreur réseau lors de l'appel du webhook N8N: ${fetchError.message}`,
          error_type: fetchError.name,
          payload: webhookPayload,
          debug_info: {
            webhook_url: targetWebhookUrl,
            payload_size: JSON.stringify(webhookPayload).length
          }
        }),
        { 
          status: 200, // Retourner 200 au lieu de 500
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('❌ Erreur générale dans task-started-webhook:', error);
    console.error('🔍 Stack trace:', error.stack);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur interne du serveur', 
        details: error.message,
        stack: error.stack 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
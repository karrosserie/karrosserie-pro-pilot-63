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
  instructions: N8NTaskInstruction[];
  output: {
    task_type: string;
    vehicules_id: string;
    task_id: string;
  };
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

interface ExpertiseReport {
  id: string;
  report_number?: string | null;
  expert_name?: string | null;
  report_date?: string | null;
  claim_number?: string | null;
  policy_number?: string | null;
  repairs_data?: string | null;
  parts_data?: string | null;
  amount?: number | null;
  status?: string | null;
  document_url?: string | null;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { taskId, webhookUrl }: TaskStartedPayload = await req.json();

    if (!taskId) {
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

    // 2. Récupérer directement le rapport d'expertise avec le vehicle_id de la tâche
    let expertiseReport: ExpertiseReport | null = null;
    
    if (taskData.vehicle_id) {
      console.log(`📋 Recherche du rapport d'expertise pour vehicle_id: ${taskData.vehicle_id} et company_id: ${taskData.company_id}`);
      
      const { data: reportData, error: reportError } = await supabaseClient
        .from('expertise_reports')
        .select('*')
        .eq('vehicle_id', taskData.vehicle_id)
        .eq('company_id', taskData.company_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log(`📋 Résultat requête rapport - Data:`, reportData);
      console.log(`📋 Résultat requête rapport - Error:`, reportError);

      if (reportData && !reportError) {
        expertiseReport = reportData as ExpertiseReport;
        console.log(`✅ Rapport d'expertise trouvé: ${reportData.report_number || reportData.id}`);
      } else if (reportError) {
        console.error(`❌ Erreur lors de la récupération du rapport d'expertise:`, reportError);
      } else {
        console.log(`⚠️ Aucun rapport d'expertise trouvé pour ce véhicule`);
      }
    } else {
      console.log(`⚠️ Pas de vehicle_id disponible pour chercher le rapport d'expertise`);
    }

    // 3. Préparer les données pour N8N
    const webhookPayload = {
      timestamp: new Date().toISOString(),
      event_type: 'task_started',
      task: {
        id: taskData.id,
        type: taskData.task_type,
        started_at: taskData.real_start_datetime,
        employee_id: taskData.user_id,
        company_id: taskData.company_id,
        vehicle_id: taskData.vehicle_id
      },
      vehicle: null, // Non récupéré pour optimiser les performances
      client: null,  // Non récupéré pour optimiser les performances
      expertise_report: expertiseReport ? {
        id: expertiseReport.id,
        report_number: expertiseReport.report_number,
        expert_name: expertiseReport.expert_name,
        report_date: expertiseReport.report_date,
        claim_number: expertiseReport.claim_number,
        policy_number: expertiseReport.policy_number,
        repairs_data: expertiseReport.repairs_data,
        parts_data: expertiseReport.parts_data,
        amount: expertiseReport.amount,
        status: expertiseReport.status,
        document_url: expertiseReport.document_url
      } : null
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
      console.log('📡 Appel synchrone de N8N avec POST...');
      
      const webhookResponse = await fetch(targetWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload)
      });

      console.log(`📡 Webhook N8N appelé avec statut: ${webhookResponse.status}`);

      if (!webhookResponse.ok) {
        console.error('❌ Erreur webhook N8N:', webhookResponse.statusText);
        return new Response(
          JSON.stringify({ 
            success: false,
            message: `Webhook N8N a échoué (${webhookResponse.status}): ${webhookResponse.statusText}`,
            payload: webhookPayload 
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // 6. Traiter la réponse N8N avec les instructions détaillées
      const n8nResponse: N8NResponse = await webhookResponse.json();
      console.log('📥 Réponse N8N reçue:', JSON.stringify(n8nResponse, null, 2));

      if (n8nResponse.instructions && n8nResponse.instructions.length > 0) {
        // Préparer les instructions détaillées
        const detailedInstructions = {
          instructions: n8nResponse.instructions,
          received_at: new Date().toISOString(),
          task_type_confirmed: n8nResponse.output?.task_type || taskData.task_type,
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
            instructions_count: n8nResponse.instructions.length,
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

    } catch (fetchError) {
      console.error('❌ Erreur lors de l\'appel du webhook:', fetchError);
      // Ne pas retourner une erreur 500, juste loguer et continuer  
      return new Response(
        JSON.stringify({ 
          success: false,
          message: `Erreur réseau lors de l'appel du webhook N8N: ${fetchError.message}`,
          payload: webhookPayload
        }),
        { 
          status: 200, // Retourner 200 au lieu de 500
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
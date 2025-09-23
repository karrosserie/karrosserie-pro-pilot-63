import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TaskStartedPayload {
  taskId: string;
  webhookUrl?: string;
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
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
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

    // 1. Récupérer les détails de la tâche avec les informations du véhicule et client
    const { data: taskData, error: taskError } = await supabase
      .from('employee_schedule')
      .select(`
        id,
        task_type,
        vehicle_id,
        user_id,
        company_id,
        real_start_datetime,
        vehicles (
          id,
          license_plate,
          car_brands (name),
          car_models (name),
          clients (
            id,
            first_name,
            last_name,
            email,
            phone
          )
        )
      `)
      .eq('id', taskId)
      .single() as { data: TaskData | null; error: any };

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

    // 2. Récupérer le rapport d'expertise lié au véhicule si il existe
    let expertiseReport: ExpertiseReport | null = null;
    
    if (taskData.vehicle_id) {
      const { data: reportData, error: reportError } = await supabase
        .from('expertise_reports')
        .select('*')
        .eq('vehicle_id', taskData.vehicle_id)
        .eq('company_id', taskData.company_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (reportData && !reportError) {
        expertiseReport = reportData as ExpertiseReport;
        console.log(`📋 Rapport d'expertise trouvé: ${reportData.report_number}`);
      }
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
        company_id: taskData.company_id
      },
      vehicle: taskData.vehicles ? {
        id: taskData.vehicles.id,
        license_plate: taskData.vehicles.license_plate,
        brand: taskData.vehicles.car_brands?.name || null,
        model: taskData.vehicles.car_models?.name || null
      } : null,
      client: taskData.vehicles?.clients ? {
        id: taskData.vehicles.clients.id,
        first_name: taskData.vehicles.clients.first_name,
        last_name: taskData.vehicles.clients.last_name,
        email: taskData.vehicles.clients.email || null,
        phone: taskData.vehicles.clients.phone || null
      } : null,
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
        status: expertiseReport.status
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
      const { data: preferences } = await supabase
        .from('company_preferences')
        .select('n8n_webhook_url')
        .eq('company_id', taskData.company_id)
        .single();
      
      if (preferences?.n8n_webhook_url) {
        targetWebhookUrl = preferences.n8n_webhook_url;
      }
    }
    
    console.log('🎯 URL webhook cible:', targetWebhookUrl);

    // 5. Envoyer les données à N8N
    try {
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
            error: 'Erreur lors de l\'appel du webhook N8N',
            status: webhookResponse.status,
            payload: webhookPayload
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          message: 'Webhook N8N déclenché avec succès',
          payload: webhookPayload 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );

    } catch (fetchError) {
      console.error('❌ Erreur lors de l\'appel du webhook:', fetchError);
      return new Response(
        JSON.stringify({ 
          error: 'Erreur réseau lors de l\'appel du webhook N8N',
          details: fetchError.message,
          payload: webhookPayload
        }),
        { 
          status: 500, 
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
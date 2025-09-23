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

    // 1.5. Récupérer les détails du véhicule et du client si vehicle_id existe
    let vehicleData = null;
    if (taskData.vehicle_id) {
      const { data: vehicle, error: vehicleError } = await supabaseClient
        .from('vehicles')
        .select(`
          id,
          license_plate,
          client_id,
          car_brands (name),
          car_models (name)
        `)
        .eq('id', taskData.vehicle_id)
        .maybeSingle();

      if (!vehicleError && vehicle) {
        vehicleData = vehicle;
        console.log(`📊 Données véhicule récupérées:`, vehicleData);
        
        // Récupérer séparément les données client si client_id existe
        if (vehicle.client_id) {
          const { data: clientData, error: clientError } = await supabaseClient
            .from('clients')
            .select('id, first_name, last_name, email, phone')
            .eq('id', vehicle.client_id)
            .maybeSingle();
            
          if (!clientError && clientData) {
            vehicleData.clients = clientData;
            console.log(`👤 Données client récupérées:`, clientData);
          }
        }
      } else {
        console.error(`❌ Erreur lors de la récupération du véhicule:`, vehicleError);
      }
    }

    // 2. Récupérer le rapport d'expertise lié au véhicule si il existe
    let expertiseReport: ExpertiseReport | null = null;
    
    if (taskData.vehicle_id) {
      const { data: reportData, error: reportError } = await supabaseClient
        .from('expertise_reports')
        .select('*')
        .eq('vehicle_id', taskData.vehicle_id)
        .eq('company_id', taskData.company_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

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
      vehicle: vehicleData ? {
        id: vehicleData.id,
        license_plate: vehicleData.license_plate,
        brand: vehicleData.car_brands?.name || null,
        model: vehicleData.car_models?.name || null
      } : null,
      client: vehicleData?.clients ? {
        id: vehicleData.clients.id,
        first_name: vehicleData.clients.first_name,
        last_name: vehicleData.clients.last_name,
        email: vehicleData.clients.email || null,
        phone: vehicleData.clients.phone || null
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
        status: expertiseReport.status,
        document_url: expertiseReport.document_url // Ajout de l'URL du document
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

    // 5. Envoyer les données à N8N (méthode GET avec query parameters)
    try {
      // Encoder les données comme paramètres de query string
      const queryParams = new URLSearchParams({
        data: JSON.stringify(webhookPayload)
      });
      
      const webhookUrlWithParams = `${targetWebhookUrl}?${queryParams.toString()}`;
      
      const webhookResponse = await fetch(webhookUrlWithParams, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log(`📡 Webhook N8N appelé avec statut: ${webhookResponse.status}`);

      if (!webhookResponse.ok) {
        console.error('❌ Erreur webhook N8N:', webhookResponse.statusText);
        // Ne pas retourner une erreur 500, juste loguer et continuer
        return new Response(
          JSON.stringify({ 
            success: false,
            message: `Webhook N8N a échoué (${webhookResponse.status}): ${webhookResponse.statusText}`,
            payload: webhookPayload 
          }),
          { 
            status: 200, // Retourner 200 au lieu de 500 pour ne pas casser l'interface
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true,
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
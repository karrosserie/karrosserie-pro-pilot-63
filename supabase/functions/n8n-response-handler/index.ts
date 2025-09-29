import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface N8NTaskInstruction {
  number: number;
  task: string;
}

interface N8NResponsePayload {
  instructions: N8NTaskInstruction[];
  output: {
    task_type: string;
    vehicules_id: string;
    task_id: string;
  };
}

interface DetailedInstructions {
  instructions: N8NTaskInstruction[];
  received_at: string;
  task_type_confirmed: string;
  source: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    console.log('🤖 N8N Response Handler - Début du traitement');

    // Parse le payload JSON
    let payload: N8NResponsePayload;
    try {
      const rawPayload = await req.json();
      console.log('📦 Payload reçu:', JSON.stringify(rawPayload, null, 2));
      
      // Extraire les instructions et l'objet output
      const instructions = rawPayload.filter((item: any) => item.number && item.task);
      const outputItem = rawPayload.find((item: any) => item.output);
      
      if (!outputItem?.output) {
        throw new Error('Objet output manquant dans le payload');
      }
      
      payload = {
        instructions,
        output: outputItem.output
      };
      
      console.log('✅ Payload parsé:', JSON.stringify(payload, null, 2));
    } catch (parseError) {
      console.error('❌ Erreur parsing JSON:', parseError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid JSON payload',
          details: parseError instanceof Error ? parseError.message : String(parseError)
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validation des données requises
    const { instructions, output } = payload;
    const { task_id, vehicules_id, task_type } = output;

    if (!task_id || !vehicules_id || !task_type || !instructions || instructions.length === 0) {
      console.error('❌ Données manquantes:', { task_id, vehicules_id, task_type, instructionsCount: instructions?.length });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: task_id, vehicules_id, task_type, or instructions' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialiser le client Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🔍 Vérification de la tâche:', task_id);

    // Vérifier que la tâche existe et récupérer ses détails
    const { data: taskData, error: taskError } = await supabaseClient
      .from('employee_schedule')
      .select('id, task_type, vehicle_id, company_id, user_id')
      .eq('id', task_id)
      .maybeSingle();

    if (taskError) {
      console.error('❌ Erreur requête tâche:', taskError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Database error while fetching task',
          details: taskError.message
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!taskData) {
      console.error('❌ Tâche non trouvée:', task_id);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Task not found',
          task_id 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Tâche trouvée:', taskData);

    // Vérifications de cohérence
    if (taskData.vehicle_id !== vehicules_id) {
      console.warn('⚠️ Incohérence vehicle_id:', { 
        task_vehicle_id: taskData.vehicle_id, 
        payload_vehicle_id: vehicules_id 
      });
    }

    if (taskData.task_type !== task_type) {
      console.warn('⚠️ Incohérence task_type:', { 
        task_type: taskData.task_type, 
        payload_task_type: task_type 
      });
    }

    // Préparer les instructions détaillées
    const detailedInstructions: DetailedInstructions = {
      instructions: instructions,
      received_at: new Date().toISOString(),
      task_type_confirmed: task_type,
      source: 'n8n_analysis'
    };

    console.log('💾 Sauvegarde des instructions pour la tâche:', task_id);

    // Mettre à jour la tâche avec les instructions détaillées
    const { error: updateError } = await supabaseClient
      .from('employee_schedule')
      .update({
        detailed_instructions: detailedInstructions,
        updated_at: new Date().toISOString()
      })
      .eq('id', task_id);

    if (updateError) {
      console.error('❌ Erreur mise à jour tâche:', updateError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to update task with instructions',
          details: updateError.message
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Instructions sauvegardées avec succès pour la tâche:', task_id);
    console.log('📝 Instructions reçues:', instructions.length, 'étapes');

    // Réponse de succès
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Instructions received and stored successfully',
        task_id,
        instructions_count: instructions.length,
        received_at: detailedInstructions.received_at
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
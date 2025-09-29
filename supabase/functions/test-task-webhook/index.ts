import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  console.log('🧪 TEST: Fonction de test appelée!', new Date().toISOString());

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Données de test N8N fournies par l'utilisateur
    const mockN8NResponse = [
      {
        "number": 1,
        "task": "1. Vérifier l'identité du client et les informations du véhicule."
      },
      {
        "number": 2,
        "task": "2. Confirmer la couverture de l'assurance et les conditions de prise en charge."
      },
      {
        "number": 3,
        "task": "3. Commander les pièces nécessaires (projecteur droit, pare-boue AVD, support d'aile, calandre)."
      },
      {
        "number": 4,
        "task": "4. Préparer les outils spécifiques pour le démontage et le remplacement."
      },
      {
        "number": 5,
        "task": "5. Établir un calendrier prévisionnel pour chaque étape de réparation."
      },
      {
        "number": 6,
        "task": "6. Informer le client des délais estimés et obtenir une signature pour validation du devis."
      },
      {
        "output": {
          "task_type": "Accueil & Préparation du dossier", 
          "vehicules_id": "468add44-6063-4a5f-b1c7-3c2d476e3634",
          "task_id": "b3ff5387-5bc0-4830-8339-730f8db3a979"
        }
      }
    ];

    console.log('🔍 Test avec données N8N mock:', JSON.stringify(mockN8NResponse, null, 2));

    // Extraire les instructions comme dans la fonction principale
    const instructions = mockN8NResponse.filter((item: any) => 
      typeof item.number === 'number' && typeof item.task === 'string'
    );
    
    const outputItem = mockN8NResponse.find((item: any) => item.output);
    const outputData = outputItem?.output;

    console.log('📋 Instructions extraites:', instructions.length);
    console.log('📋 Output data:', outputData);

    if (instructions && instructions.length > 0) {
      const detailedInstructions = {
        instructions: instructions,
        received_at: new Date().toISOString(),
        task_type_confirmed: outputData?.task_type || 'Test',
        source: 'test_n8n_data'
      };

      console.log('💾 Instructions à sauvegarder:', JSON.stringify(detailedInstructions, null, 2));

      // Test de sauvegarde sur la tâche spécifiée dans l'output
      if (outputData?.task_id) {
        console.log('💾 Tentative mise à jour tâche:', outputData.task_id);

        const { error: updateError } = await supabaseClient
          .from('employee_schedule')
          .update({
            detailed_instructions: detailedInstructions,
            updated_at: new Date().toISOString()
          })
          .eq('id', outputData.task_id);

        if (updateError) {
          console.error('❌ Erreur mise à jour:', updateError);
          return new Response(
            JSON.stringify({ 
              success: false,
              error: 'Failed to save test instructions',
              details: updateError.message,
              task_id: outputData.task_id
            }),
            { 
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        console.log('✅ Test réussi - Instructions sauvegardées!');

        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Test instructions saved successfully',
            instructions_count: instructions.length,
            task_id: outputData.task_id,
            detailed_instructions: detailedInstructions
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } else {
        return new Response(
          JSON.stringify({ 
            success: false,
            message: 'No task_id found in output data',
            output_data: outputData
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ 
          success: false,
          message: 'No instructions found in mock data',
          raw_data: mockN8NResponse
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('❌ Erreur test:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Test function error', 
        details: error instanceof Error ? error.message : String(error) 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
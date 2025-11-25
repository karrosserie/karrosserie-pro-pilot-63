import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.6";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cessionId } = await req.json();
    
    if (!cessionId) {
      throw new Error('cessionId est requis');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Récupérer la cession pour obtenir l'oodrive_contract_id et repair_order_id
    const { data: cession, error: cessionError } = await supabase
      .from('cessions')
      .select('oodrive_contract_id, reference, company_id, repair_order_id')
      .eq('id', cessionId)
      .single();

    if (cessionError || !cession) {
      throw new Error(`Impossible de récupérer la cession: ${cessionError?.message}`);
    }

    if (!cession.oodrive_contract_id) {
      throw new Error('Aucun contrat Oodrive associé à cette cession');
    }

    console.log(`Téléchargement du contrat signé pour la cession ${cession.reference}, contrat ID: ${cession.oodrive_contract_id}`);

    // Télécharger le document signé depuis Oodrive
    const oodriveToken = Deno.env.get('OODRIVE_J_TOKEN');
    if (!oodriveToken) {
      throw new Error('Token Oodrive non configuré');
    }

    const downloadUrl = `https://api.sign.oodrive.com/api/v4/contracts/${cession.oodrive_contract_id}/transaction/signedcontract?filename=contract.pdf`;
    
    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'j_token': oodriveToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du téléchargement: ${response.status} ${response.statusText}`);
    }

    const documentBlob = await response.blob();
    const documentBuffer = await documentBlob.arrayBuffer();
    
    // Générer le nom du fichier avec un timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `cession-${cession.reference}-signed-${timestamp}.pdf`;
    const filePath = `${cession.company_id}/cessions/${fileName}`;

    // Stocker le document sur Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, documentBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Erreur lors du stockage: ${uploadError.message}`);
    }

    // Obtenir l'URL publique du document
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    if (!urlData.publicUrl) {
      throw new Error('Impossible d\'obtenir l\'URL publique du document');
    }

    // Mettre à jour la cession avec l'URL du document signé
    const { error: updateError } = await supabase
      .from('cessions')
      .update({ signed_document_url: urlData.publicUrl })
      .eq('id', cessionId);

    if (updateError) {
      throw new Error(`Erreur lors de la mise à jour de la cession: ${updateError.message}`);
    }

    console.log(`Document signé téléchargé et stocké avec succès: ${urlData.publicUrl}`);

    // Si la cession a un repair_order_id associé, vérifier et mettre à jour l'OR si nécessaire
    if (cession.repair_order_id) {
      // Récupérer l'ordre de réparation associé
      const { data: repairOrder, error: roError } = await supabase
        .from('repair_orders')
        .select('id, client_signature, status, clients(first_name, last_name)')
        .eq('id', cession.repair_order_id)
        .single();

      // Si l'OR n'était pas signé, le marquer comme signé via la cession
      if (repairOrder && !repairOrder.client_signature && repairOrder.status !== 'Signé') {
        const clientName = repairOrder.clients 
          ? `${repairOrder.clients.first_name} ${repairOrder.clients.last_name}`
          : '';
          
        const { error: roUpdateError } = await supabase
          .from('repair_orders')
          .update({
            status: 'Signé',
            signature_date: new Date().toISOString(),
            client_name_signature: clientName,
            // Note: client_signature restera null car on n'extrait pas l'image
            // mais le statut "Signé" indique que l'OR a été signé via la cession
          })
          .eq('id', repairOrder.id);
          
        if (roUpdateError) {
          console.error(`Erreur lors de la mise à jour de l'OR: ${roUpdateError.message}`);
        } else {
          console.log(`OR ${repairOrder.id} marqué comme signé via la cession`);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        documentUrl: urlData.publicUrl,
        message: 'Document signé téléchargé et stocké avec succès'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Erreur dans download-signed-contract:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erreur inconnue'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
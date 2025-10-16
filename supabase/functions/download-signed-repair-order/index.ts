import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.6";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 200
    });
  }

  try {
    // Vérifier que c'est une requête POST
    if (req.method !== 'POST') {
      throw new Error('Méthode non autorisée. Utilisez POST.');
    }

    const { repairOrderId } = await req.json();

    if (!repairOrderId) {
      throw new Error('repairOrderId est requis');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Récupérer l'ordre de réparation pour obtenir l'oodrive_contract_id
    const { data: repairOrder, error: repairOrderError } = await supabase
      .from('repair_orders')
      .select('oodrive_contract_id, reference, company_id')
      .eq('id', repairOrderId)
      .single();

    if (repairOrderError || !repairOrder) {
      throw new Error(`Impossible de récupérer l'ordre de réparation: ${repairOrderError?.message}`);
    }

    if (!repairOrder.oodrive_contract_id) {
      throw new Error('Aucun contrat Oodrive associé à cet ordre de réparation');
    }

    console.log(`Téléchargement du contrat signé pour l'ordre de réparation ${repairOrder.reference}, contrat ID: ${repairOrder.oodrive_contract_id}`);

    // Télécharger le document signé depuis Oodrive
    const oodriveToken = Deno.env.get('OODRIVE_J_TOKEN');
    if (!oodriveToken) {
      throw new Error('Token Oodrive non configuré');
    }

    const downloadUrl = `https://api.sign.oodrive.com/api/v4/contracts/${repairOrder.oodrive_contract_id}/transaction/signedcontract?filename=contract.pdf`;

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
    const fileName = `repair-order-${repairOrder.reference}-signed-${timestamp}.pdf`;
    const filePath = `${repairOrder.company_id}/repair_orders/${fileName}`;

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

    // Mettre à jour l'ordre de réparation avec l'URL du document signé
    const { error: updateError } = await supabase
      .from('repair_orders')
      .update({
        signed_document_url: urlData.publicUrl,
        status: 'Signé'
      })
      .eq('id', repairOrderId);

    if (updateError) {
      throw new Error(`Erreur lors de la mise à jour de l'ordre de réparation: ${updateError.message}`);
    }

    console.log(`Document signé téléchargé et stocké avec succès: ${urlData.publicUrl}`);

    // Déclencher le webhook n8n pour notifier la signature
    try {
      console.log('📤 Envoi du webhook signature OR vers n8n...', {
        repair_order_id: repairOrderId,
        repair_order_reference: repairOrder.reference
      });

      // Récupérer le user_id depuis le JWT
      const authHeader = req.headers.get('authorization');
      let userId = null;
      
      if (authHeader) {
        try {
          const token = authHeader.replace('Bearer ', '');
          const { data: { user } } = await supabase.auth.getUser(token);
          userId = user?.id;
        } catch (e) {
          console.warn('Impossible de récupérer le user_id depuis le JWT:', e);
        }
      }

      const webhookPayload = {
        user_id: userId,
        action_type: 'signature_or',
        repair_order_id: repairOrderId,
        repair_order_reference: repairOrder.reference,
        signed_document_url: urlData.publicUrl,
        timestamp: new Date().toISOString()
      };

      console.log('📦 Payload webhook:', JSON.stringify(webhookPayload, null, 2));

      const webhookResponse = await fetch(
        'https://n8n.karrosserie.pro/webhook/cb45ad92-6f2a-4ead-ac63-e8b207642cf1',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
        }
      );

      console.log('📡 Réponse webhook n8n:', {
        status: webhookResponse.status,
        statusText: webhookResponse.statusText,
        ok: webhookResponse.ok
      });

      if (!webhookResponse.ok) {
        const responseText = await webhookResponse.text();
        console.warn(`⚠️ Webhook n8n failed: ${webhookResponse.status}`, responseText);
      } else {
        console.log('✅ Webhook n8n envoyé avec succès');
      }
    } catch (webhookError) {
      console.error('❌ Erreur lors de l\'envoi du webhook n8n:', webhookError);
      // On ne bloque pas la réponse même si le webhook échoue
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
    console.error('Erreur dans download-signed-repair-order:', error);
    
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
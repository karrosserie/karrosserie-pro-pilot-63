import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuration email simple sans nodemailer
async function sendEmail(to: string, subject: string, html: string): Promise<{ success: boolean; messageId?: string; message: string; }> {
  try {
    // Pour cette démo, on simule l'envoi d'email
    // En production, vous pourriez utiliser un service comme SendGrid, Mailgun, etc.
    console.log('Email simulation:', { to, subject });
    
    return { 
      success: true, 
      messageId: `sim-${Date.now()}`, 
      message: 'Email simulé avec succès (remplacer par un vrai service SMTP)' 
    };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { success: false, message: `Erreur: ${error instanceof Error ? error.message : String(error)}` };
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Gestion des requêtes CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clientId, companyId } = await req.json();

    if (!clientId || !companyId) {
      return new Response(
        JSON.stringify({ error: 'clientId et companyId sont requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialiser le client Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Récupérer les informations du client
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('first_name, last_name, email, phone')
      .eq('id', clientId)
      .single();

    if (clientError || !clientData) {
      console.error('Erreur récupération client:', clientError);
      return new Response(
        JSON.stringify({ error: 'Client non trouvé' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Récupérer les informations de la compagnie
    const { data: companyData, error: companyError } = await supabase
      .from('company_info')
      .select('name, email')
      .eq('id', companyId)
      .single();

    if (companyError || !companyData) {
      console.error('Erreur récupération compagnie:', companyError);
      return new Response(
        JSON.stringify({ error: 'Compagnie non trouvée' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Créer l'email de notification
    const clientName = `${clientData.first_name} ${clientData.last_name}`;
    const subject = `Documents reçus - ${clientName}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { background-color: #e9ecef; padding: 15px; text-align: center; font-size: 12px; color: #666; }
            .highlight { background-color: #d4edda; padding: 10px; border-left: 4px solid #28a745; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="color: #2c5530; margin: 0;">📄 Documents reçus</h1>
          </div>
          
          <div class="content">
            <div class="highlight">
              <h2 style="margin-top: 0; color: #28a745;">✅ Justificatifs complets</h2>
              <p><strong>${clientName}</strong> a terminé l'envoi de tous ses documents.</p>
            </div>
            
            <h3>Informations client :</h3>
            <ul>
              <li><strong>Nom :</strong> ${clientName}</li>
              <li><strong>Email :</strong> ${clientData.email || 'Non renseigné'}</li>
              <li><strong>Téléphone :</strong> ${clientData.phone || 'Non renseigné'}</li>
            </ul>
            
            <p>Vous pouvez maintenant consulter ces documents dans votre interface de gestion pour poursuivre le traitement du dossier.</p>
            
            <p style="margin-top: 30px;">
              <em>Cette notification automatique vous informe de la réception complète des justificatifs demandés.</em>
            </p>
          </div>
          
          <div class="footer">
            <p>Notification automatique - ${companyData.name}</p>
          </div>
        </body>
      </html>
    `;

    // Envoyer l'email à la compagnie
    const emailResult = await sendEmail(companyData.email, subject, html);

    if (!emailResult.success) {
      return new Response(
        JSON.stringify({ error: emailResult.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Email de notification envoyé à ${companyData.email} pour le client ${clientName}`);

    // Déclencher le webhook n8n
    try {
      const webhookResponse = await fetch('https://n8n.karrosserie.pro/webhook/3b7decda-859c-46bc-836a-cfe53eed5b70', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idClient: clientId
        })
      });

      if (webhookResponse.ok) {
        console.log(`Webhook n8n déclenché avec succès pour le client ${clientId}`);
      } else {
        console.error(`Erreur webhook n8n: ${webhookResponse.status} - ${webhookResponse.statusText}`);
      }
    } catch (webhookError) {
      console.error('Erreur lors de l\'appel du webhook n8n:', webhookError);
      // On ne fait pas échouer le processus si le webhook échoue
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification envoyée avec succès',
        messageId: emailResult.messageId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Erreur dans notify-company-documents-complete:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
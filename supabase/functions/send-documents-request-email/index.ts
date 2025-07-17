import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  tokenId: string;
}

const sendEmail = async (to: string, subject: string, html: string) => {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  const smtpFromEmail = Deno.env.get('SMTP_FROM_EMAIL');

  if (!resendApiKey) {
    throw new Error('Clé API Resend manquante');
  }

  if (!smtpFromEmail) {
    throw new Error('Email expéditeur manquant');
  }

  console.log('Envoi email via Resend:', { 
    to, 
    from: smtpFromEmail,
    subject 
  });

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: smtpFromEmail,
      to: [to],
      subject: subject,
      html: html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Erreur Resend:', error);
    throw new Error(`Erreur envoi email: ${response.status} - ${error}`);
  }

  const result = await response.json();
  console.log('Email envoyé avec succès:', result);
  return result;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Début de la fonction send-documents-request-email');
    
    const { tokenId }: EmailRequest = await req.json();
    console.log('Token ID reçu:', tokenId);

    if (!tokenId) {
      throw new Error('Token ID manquant');
    }

    // Initialiser le client Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Récupérer les informations du token
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens')
      .select('*')
      .eq('id', tokenId)
      .single();

    if (tokenError || !tokenData) {
      console.error('Erreur lors de la récupération du token:', tokenError);
      throw new Error('Token non trouvé');
    }

    console.log('Données du token récupérées:', tokenData);

    // Récupérer les informations du client
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('id, first_name, last_name, email')
      .eq('id', tokenData.client_id)
      .single();

    if (clientError || !clientData) {
      console.error('Erreur lors de la récupération du client:', clientError);
      throw new Error('Client non trouvé');
    }

    // Récupérer les informations du véhicule avec marque et modèle
    const { data: vehicleData, error: vehicleError } = await supabase
      .from('vehicles')
      .select(`
        id,
        license_plate,
        brand_id,
        model_id
      `)
      .eq('id', tokenData.vehicule_id)
      .single();

    if (vehicleError || !vehicleData) {
      console.error('Erreur lors de la récupération du véhicule:', vehicleError);
      throw new Error('Véhicule non trouvé');
    }

    // Récupérer la marque du véhicule
    const { data: brandData, error: brandError } = await supabase
      .from('car_brands')
      .select('name')
      .eq('id', vehicleData.brand_id)
      .single();

    // Récupérer le modèle du véhicule
    const { data: modelData, error: modelError } = await supabase
      .from('car_models')
      .select('name')
      .eq('id', vehicleData.model_id)
      .single();

    // Récupérer les informations de l'entreprise
    const { data: companyData, error: companyError } = await supabase
      .from('company_info')
      .select('id, name')
      .eq('id', tokenData.company_id)
      .single();

    if (companyError || !companyData) {
      console.error('Erreur lors de la récupération de l\'entreprise:', companyError);
      throw new Error('Informations de l\'entreprise non trouvées');
    }

    console.log('Client:', clientData);
    console.log('Véhicule:', vehicleData);
    console.log('Marque:', brandData);
    console.log('Modèle:', modelData);
    console.log('Entreprise:', companyData);

    if (!clientData.email) {
      throw new Error('Email du client non trouvé');
    }

    // Construire le contenu de l'email
    const prenom = clientData.first_name || 'Client';
    const marque = brandData?.name || 'Marque inconnue';
    const modele = modelData?.name || 'Modèle inconnu';
    const immatriculation = vehicleData.license_plate || 'Immatriculation inconnue';
    const nomEntreprise = companyData.name || 'Notre entreprise';

    const subject = 'Justificatifs manquants - Réparation véhicule';
    const emailContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50;">Demande de justificatifs</h2>
            
            <p>Bonjour ${prenom},</p>
            
            <p>Des justificatifs nous manquent dans le cadre des travaux sur votre véhicule <strong>${marque} ${modele}</strong> immatriculé <strong>${immatriculation}</strong>.</p>
            
            <p>Vous pouvez nous les fournir en vous rendant sur cette page :</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://app.karrosserie.pro/documents/upload/${tokenId}" 
                 style="background-color: #e67e22; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Télécharger mes justificatifs
              </a>
            </div>
            
            <p>Cordialement,</p>
            <p><strong>${nomEntreprise}</strong></p>
            
            <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              Ce message a été envoyé automatiquement. Si vous avez des questions, veuillez contacter ${nomEntreprise}.
            </p>
          </div>
        </body>
      </html>
    `;

    console.log('Envoi de l\'email à:', clientData.email);
    
    // Envoyer l'email
    console.log('Tentative d\'envoi de l\'email...');
    const emailResult = await sendEmail(clientData.email, subject, emailContent);
    console.log('Résultat de l\'envoi email:', emailResult);

    console.log('Email envoyé avec succès');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email envoyé avec succès',
        recipient: clientData.email
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Erreur dans send-documents-request-email:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocumentsRequest {
  tokenId: string;
  targetEmail?: string; // Email de destination optionnel pour override
}

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
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { success: false, message: `Erreur: ${error?.message || error}` };
  }
}

const sendSMS = async (phone: string, link: string) => {
  try {
    console.log('📱 Début de sendSMS');
    console.log('📱 Envoi SMS vers:', phone);
    console.log('📱 Lien:', link);

    const response = await fetch('https://n8n.karrosserie.pro/webhook/edb07668-2f9a-4815-b4f9-2e1b64ba2a7f', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone,
        link: link
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ SMS envoyé avec succès:', result);
    
    return { 
      success: true, 
      message: 'SMS envoyé avec succès'
    };
    
  } catch (error) {
    console.error('❌ Erreur dans sendSMS:', error);
    throw error;
  }
};

const detectEnvironment = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const isLovable = supabaseUrl.includes('lovable') || supabaseUrl.includes('localhost');
  console.log('🌍 Environnement détecté:', { supabaseUrl, isLovable });
  return isLovable;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Début de la fonction send-documents-request-email');
    
    const { tokenId, targetEmail }: DocumentsRequest = await req.json();
    console.log('Paramètres reçus:', { tokenId, targetEmail });

    if (!tokenId) {
      throw new Error('Token ID manquant');
    }

    // Initialiser le client Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Récupérer les informations du token avec système de retry
    let tokenData: any = null;
    let tokenError: any = null;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      console.log(`Tentative ${retryCount + 1} de récupération du token:`, tokenId);
      
      const { data, error } = await supabase
        .from('tokens')
        .select('*')
        .eq('id', tokenId)
        .single();

      if (!error && data) {
        tokenData = data;
        tokenError = null;
        console.log('Token récupéré avec succès à la tentative', retryCount + 1);
        break;
      }

      tokenError = error;
      retryCount++;
      
      if (retryCount < maxRetries) {
        console.log(`Token non trouvé, retry dans 2 secondes (tentative ${retryCount}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (tokenError || !tokenData) {
      console.error('Erreur lors de la récupération du token après', maxRetries, 'tentatives:', tokenError);
      throw new Error(`Token non trouvé après ${maxRetries} tentatives: ${tokenError?.message || 'Token inexistant'}`);
    }

    console.log('Données du token récupérées:', tokenData);

    // Récupérer les informations du client avec le numéro de téléphone
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('id, first_name, last_name, email, phone')
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

    // Construire le lien de téléchargement
    const baseUrl = Deno.env.get('FRONTEND_BASE_URL') || 
                   req.headers.get('origin') || 
                   req.headers.get('referer')?.split('/').slice(0, 3).join('/') ||
                   'https://app.karrosserie.pro';
    
    const uploadLink = `${baseUrl}/documents/upload/${tokenId}`;

    // Déterminer le mode d'envoi : email ou SMS
    let sendMode: 'email' | 'sms' | 'none' = 'none';
    let recipient: string = '';

    if (targetEmail) {
      // Si un email cible est spécifié, l'utiliser
      sendMode = 'email';
      recipient = targetEmail;
      console.log('📧 Email cible spécifié:', recipient);
    } else {
      // Logique de choix automatique
      const isLovable = detectEnvironment();
      
      if (isLovable) {
        // En environnement de test, privilégier l'email
        sendMode = 'email';
        recipient = 'karrosseriepro@yopmail.com';
        console.log('📧 Environnement Lovable détecté, utilisation de l\'email de test');
      } else {
        // En production, choisir selon les données disponibles
        if (clientData.email) {
          sendMode = 'email';
          recipient = clientData.email;
          console.log('📧 Email client disponible:', recipient);
        } else if (clientData.phone) {
          sendMode = 'sms';
          recipient = clientData.phone;
          console.log('📱 Pas d\'email, utilisation du SMS vers:', recipient);
        } else {
          throw new Error('Aucun moyen de contact disponible (email ou téléphone)');
        }
      }
    }

    let result;
    
    if (sendMode === 'email') {
      // Envoyer par email
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
              
              <p>Des justificatifs manquent dans le cadre des travaux sur votre véhicule <strong>${marque} ${modele}</strong> immatriculé <strong>${immatriculation}</strong>.</p>
              
              <p>Vous pouvez nous les fournir en vous rendant sur cette page :</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${uploadLink}" 
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

      console.log('Envoi de l\'email à:', recipient);
      result = await sendEmail(recipient, subject, emailContent);
      
    } else if (sendMode === 'sms') {
      // Envoyer par SMS
      console.log('Envoi du SMS à:', recipient);
      result = await sendSMS(recipient, uploadLink);
    }

    console.log('Demande de justificatifs envoyée avec succès via', sendMode);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Demande de justificatifs envoyée avec succès via ${sendMode}`,
        sendMode: sendMode,
        recipient: recipient,
        originalClientEmail: clientData.email,
        originalClientPhone: clientData.phone
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
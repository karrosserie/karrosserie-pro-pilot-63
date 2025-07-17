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
  const smtpHost = Deno.env.get('SMTP_HOST');
  const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '587');
  const smtpUser = Deno.env.get('SMTP_USER');
  const smtpPassword = Deno.env.get('SMTP_PASSWORD');
  const smtpFromEmail = Deno.env.get('SMTP_FROM_EMAIL');

  if (!smtpHost || !smtpUser || !smtpPassword || !smtpFromEmail) {
    throw new Error('Configuration SMTP manquante');
  }

  // Utilisation de l'API Email externe ou SMTP direct
  // Pour Deno, nous utilisons une approche via fetch vers un service SMTP
  const emailData = {
    from: smtpFromEmail,
    to: to,
    subject: subject,
    html: html,
    smtp: {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      password: smtpPassword
    }
  };

  // Utilisation d'un service SMTP simple via HTTP
  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service_id: 'smtp_service',
      template_id: 'template_custom',
      user_id: smtpUser,
      template_params: {
        to_email: to,
        from_email: smtpFromEmail,
        subject: subject,
        message_html: html
      },
      accessToken: smtpPassword
    })
  });

  // Alternative: utilisation directe de nodemailer via Deno
  const nodemailer = await import('https://deno.land/x/nodemailer@1.11.0/mod.ts');
  
  const transporter = nodemailer.createTransporter({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });

  const mailOptions = {
    from: smtpFromEmail,
    to: to,
    subject: subject,
    html: html,
  };

  return await transporter.sendMail(mailOptions);
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

    // Récupérer les informations du token avec les données associées
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens')
      .select(`
        id,
        client_id,
        vehicule_id,
        company_id,
        clients (
          id,
          first_name,
          last_name,
          email
        ),
        vehicles (
          id,
          license_plate,
          car_brands (
            name
          ),
          car_models (
            name
          )
        ),
        company_info (
          id,
          name
        )
      `)
      .eq('id', tokenId)
      .single();

    if (tokenError || !tokenData) {
      console.error('Erreur lors de la récupération du token:', tokenError);
      throw new Error('Token non trouvé');
    }

    console.log('Données du token récupérées:', tokenData);

    const client = tokenData.clients;
    const vehicle = tokenData.vehicles;
    const company = tokenData.company_info;

    if (!client || !client.email) {
      throw new Error('Email du client non trouvé');
    }

    if (!vehicle) {
      throw new Error('Véhicule non trouvé');
    }

    if (!company) {
      throw new Error('Informations de l\'entreprise non trouvées');
    }

    // Construire le contenu de l'email
    const prenom = client.first_name || 'Client';
    const marque = vehicle.car_brands?.name || 'Marque inconnue';
    const modele = vehicle.car_models?.name || 'Modèle inconnu';
    const immatriculation = vehicle.license_plate || 'Immatriculation inconnue';
    const nomEntreprise = company.name || 'Notre entreprise';

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

    console.log('Envoi de l\'email à:', client.email);
    
    // Envoyer l'email
    await sendEmail(client.email, subject, emailContent);

    console.log('Email envoyé avec succès');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email envoyé avec succès',
        recipient: client.email
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
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvoiceEmailRequest {
  to: string;
  subject: string;
  message: string;
  pdfBase64: string;
  invoiceReference: string;
}

// Fonction pour envoyer l'email avec nodemailer
const sendEmail = async (to: string, subject: string, htmlBody: string, pdfBase64: string, filename: string, fromEmail: string) => {
  try {
    console.log('🚀 Début de sendEmail');
    
    const smtpHost = Deno.env.get('SMTP_HOST');
    const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '587');
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');

    console.log('📧 Configuration email:', {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      from: fromEmail,
      to: to
    });

    if (!smtpHost || !smtpUser || !smtpPassword || !fromEmail) {
      throw new Error('Configuration SMTP manquante');
    }

    console.log('📩 Tentative d\'envoi email via nodemailer npm');
    
    const nodemailer = await import("npm:nodemailer@6.9.13");
    
    const transporter = nodemailer.default.createTransporter({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('📤 Envoi de l\'email avec pièce jointe...');
    
    // Convertir le base64 en buffer pour la pièce jointe
    const pdfBuffer = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));
    
    const info = await transporter.sendMail({
      from: fromEmail,
      to: to,
      subject: subject,
      html: htmlBody,
      attachments: [
        {
          filename: filename,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });
    
    console.log('✅ Email envoyé avec succès:', info.messageId);
    return { 
      success: true, 
      messageId: info.messageId,
      message: 'Email envoyé avec succès'
    };
    
  } catch (error) {
    console.error('❌ Erreur dans sendEmail:', error);
    throw error;
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== DÉBUT EDGE FUNCTION ===");
    
    const { to, subject, message, pdfBase64, invoiceReference }: InvoiceEmailRequest = await req.json();

    console.log("Données reçues:");
    console.log("- Destinataire:", to);
    console.log("- Objet:", subject);
    console.log("- Référence facture:", invoiceReference);
    console.log("- Taille PDF (caractères):", pdfBase64?.length || 0);

    // Récupération des secrets SMTP
    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = Deno.env.get("SMTP_PORT");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const fromEmail = Deno.env.get("SMTP_FROM_EMAIL");

    console.log("Configuration SMTP:");
    console.log("- Host:", smtpHost || "NON DÉFINI");
    console.log("- Port:", smtpPort || "NON DÉFINI");
    console.log("- User:", smtpUser || "NON DÉFINI");
    console.log("- From:", fromEmail || "NON DÉFINI");

    // Vérification des secrets
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !fromEmail) {
      const missing = [];
      if (!smtpHost) missing.push("SMTP_HOST");
      if (!smtpPort) missing.push("SMTP_PORT");
      if (!smtpUser) missing.push("SMTP_USER");
      if (!smtpPassword) missing.push("SMTP_PASSWORD");
      if (!fromEmail) missing.push("SMTP_FROM_EMAIL");
      
      throw new Error(`Secrets SMTP manquants: ${missing.join(", ")}`);
    }

    // Créer le message MIME avec la pièce jointe
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="white-space: pre-line;">${message}</div>
      </div>
    `;

    const filename = `Facture_${invoiceReference}.pdf`;
    
    console.log("=== TENTATIVE D'ENVOI VIA SMTP ===");

    // Envoyer l'email réellement avec nodemailer
    const emailResult = await sendEmail(to, subject, htmlBody, pdfBase64, filename, fromEmail);
    console.log('Résultat de l\'envoi email:', emailResult);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email envoyé avec succès",
      recipient: to,
      attachment: filename
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("=== ERREUR DANS L'EDGE FUNCTION ===");
    console.error("Type:", typeof error);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        type: typeof error,
        details: error.toString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
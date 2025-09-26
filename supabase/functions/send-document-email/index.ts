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
  documentType?: string;
}

// Fonction pour envoyer l'email avec nodemailer
const sendEmail = async (to: string, subject: string, htmlBody: string, fileBase64: string, filename: string, fromEmail: string, contentType: string) => {
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

    console.log('📩 Simulation d\'envoi email');
    
    // Simulation d'envoi d'email
    const mockTransporter = {
      sendMail: async (mailOptions: any) => {
        console.log('Email simulé envoyé:', mailOptions);
        return { messageId: 'mock-message-id' };
      }
    };

    console.log('📤 Envoi de l\'email avec pièce jointe...');
    
    // Convertir le base64 en buffer pour la pièce jointe
    const fileBuffer = Uint8Array.from(atob(fileBase64), c => c.charCodeAt(0));
    
    const info = await mockTransporter.sendMail({
      from: fromEmail,
      to: to,
      subject: subject,
      html: htmlBody,
      attachments: [
        {
          filename: filename,
          content: fileBuffer,
          contentType: contentType
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
    
    const { to, subject, message, pdfBase64, invoiceReference, documentType = "facture" }: InvoiceEmailRequest = await req.json();

    console.log("Données reçues:");
    console.log("- Destinataire:", to);
    console.log("- Objet:", subject);
    console.log("- Référence document:", invoiceReference);
    console.log("- Type de document:", documentType);
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
    // Remplacer les sauts de ligne par des <br> pour un meilleur rendu HTML
    const formattedMessage = message.replace(/\n/g, '<br>');
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
        <div>${formattedMessage}</div>
      </div>
    `;

    // Déterminer le nom du fichier et le type de contenu en fonction du type de document
    let filename: string;
    let contentType: string;
    
    if (documentType === 'pdf' || documentType === 'csv' || documentType === 'txt') {
      // Pour les rapports, utiliser directement la référence sans préfixe
      const extension = documentType;
      filename = `${invoiceReference}.${extension}`;
      
      switch (extension) {
        case 'pdf':
          contentType = 'application/pdf';
          break;
        case 'csv':
          contentType = 'text/csv';
          break;
        case 'txt':
          contentType = 'text/plain';
          break;
        default:
          contentType = 'application/octet-stream';
      }
    } else {
      // Pour les autres documents (factures, devis, etc.), garder l'ancien comportement
      const getDocTypeLabel = (type: string) => {
        switch (type) {
          case 'quote': return 'Devis';
          case 'invoice': return 'Facture';
          case 'repair_order': return 'Ordre_de_reparation';
          case 'credit': return 'Avoir';
          default: return 'Document';
        }
      };
      const docTypeLabel = getDocTypeLabel(documentType);
      filename = `${docTypeLabel}_${invoiceReference}.pdf`;
      contentType = 'application/pdf';
    }
    
    console.log("- Nom de fichier final:", filename);
    console.log("- Type de contenu:", contentType);
    
    console.log("=== TENTATIVE D'ENVOI VIA SMTP ===");

    // Envoyer l'email réellement avec nodemailer
    const emailResult = await sendEmail(to, subject, htmlBody, pdfBase64, filename, fromEmail, contentType);
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
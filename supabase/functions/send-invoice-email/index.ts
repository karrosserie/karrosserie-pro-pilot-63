import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, message, pdfBase64, invoiceReference }: InvoiceEmailRequest = await req.json();

    console.log("=== DÉBUT ENVOI EMAIL ===");
    console.log("Destinataire:", to);
    console.log("Objet:", subject);
    console.log("Référence facture:", invoiceReference);

    // Configuration SMTP à partir des secrets Supabase
    const smtpConfig = {
      hostname: Deno.env.get("SMTP_HOST")!,
      port: parseInt(Deno.env.get("SMTP_PORT") || "587"),
      username: Deno.env.get("SMTP_USER")!,
      password: Deno.env.get("SMTP_PASSWORD")!,
    };

    const fromEmail = Deno.env.get("SMTP_FROM_EMAIL")!;

    console.log("Configuration SMTP:");
    console.log("- Host:", smtpConfig.hostname);
    console.log("- Port:", smtpConfig.port);
    console.log("- Username:", smtpConfig.username);
    console.log("- From email:", fromEmail);

    // Vérifier que toutes les variables sont définies
    if (!smtpConfig.hostname || !smtpConfig.username || !smtpConfig.password || !fromEmail) {
      throw new Error("Configuration SMTP incomplète. Vérifiez vos secrets Supabase.");
    }

    console.log("Connecting to SMTP server:", smtpConfig.hostname);

    const client = new SmtpClient();

    await client.connectTLS({
      hostname: smtpConfig.hostname,
      port: smtpConfig.port,
      username: smtpConfig.username,
      password: smtpConfig.password,
    });

    console.log("SMTP connection established");

    // Convertir base64 en Uint8Array pour la pièce jointe PDF
    const pdfBuffer = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));

    // Créer le boundary pour multipart
    const boundary = "boundary-" + Math.random().toString(36).substring(2);

    // Construire le corps de l'email multipart avec pièce jointe
    const emailBody = [
      `--${boundary}`,
      "Content-Type: text/html; charset=UTF-8",
      "Content-Transfer-Encoding: 7bit",
      "",
      `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">`,
      `  <div style="white-space: pre-line;">${message}</div>`,
      `</div>`,
      "",
      `--${boundary}`,
      `Content-Type: application/pdf; name="Facture_${invoiceReference}.pdf"`,
      "Content-Transfer-Encoding: base64",
      `Content-Disposition: attachment; filename="Facture_${invoiceReference}.pdf"`,
      "",
      pdfBase64,
      "",
      `--${boundary}--`
    ].join("\r\n");

    await client.send({
      from: fromEmail,
      to: to,
      subject: subject,
      content: emailBody,
      headers: {
        "MIME-Version": "1.0",
        "Content-Type": `multipart/mixed; boundary="${boundary}"`,
      },
    });

    await client.close();

    console.log("Email sent successfully to:", to);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email sent successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("=== ERREUR DANS L'EDGE FUNCTION ===");
    console.error("Type d'erreur:", typeof error);
    console.error("Message d'erreur:", error.message);
    console.error("Stack trace:", error.stack);
    console.error("Erreur complète:", error);
    
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
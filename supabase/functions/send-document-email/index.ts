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
  fileBase64: string;
  invoiceReference: string;
  documentType?: string;
}


const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== ENVOI AU WEBHOOK N8N ===");
    
    const { to, subject, message, fileBase64, invoiceReference, documentType = "facture" }: InvoiceEmailRequest = await req.json();

    console.log("📧 Données reçues:", {
      to,
      subject,
      invoiceReference,
      documentType,
      fileSize: fileBase64?.length || 0
    });

    // Déterminer le nom du fichier
    const getDocTypeLabel = (type: string) => {
      switch (type) {
        case 'quote': return 'Devis';
        case 'invoice': return 'Facture';
        case 'repair_order': return 'Ordre_de_reparation';
        case 'credit': return 'Avoir';
        case 'pdf': return 'Rapport';
        case 'csv': return 'Rapport';
        case 'txt': return 'FEC';
        default: return 'Document';
      }
    };
    
    const docTypeLabel = getDocTypeLabel(documentType);
    const extension = documentType === 'csv' ? 'csv' : documentType === 'txt' ? 'txt' : 'pdf';
    const filename = `${docTypeLabel}_${invoiceReference}.${extension}`;
    
    console.log("📎 Fichier:", filename);

    // Préparer le payload pour le webhook n8n
    const webhookPayload = {
      to,
      subject,
      message,
      fileBase64,
      filename,
      invoiceReference,
      documentType
    };

    console.log("🚀 Envoi au webhook n8n...");
    
    // Envoyer au webhook n8n (POST car le PDF en base64 est trop volumineux pour GET)
    const webhookUrl = 'https://n8n.karrosserie.pro/webhook/7a30467f-2039-4329-a954-c0b9cc358fd6';
    
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload)
    });

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error("❌ Erreur webhook:", errorText);
      throw new Error(`Erreur webhook: ${webhookResponse.status} ${webhookResponse.statusText}`);
    }

    console.log("✅ Données envoyées au webhook avec succès");

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email envoyé avec succès via webhook n8n",
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
    console.error("❌ ERREUR:", error.message);
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
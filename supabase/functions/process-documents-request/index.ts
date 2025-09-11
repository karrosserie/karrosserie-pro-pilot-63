import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProcessDocumentsRequest {
  tokenId: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const handler = async (req: Request): Promise<Response> => {
  console.log('Début de la fonction process-documents-request');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tokenId }: ProcessDocumentsRequest = await req.json();
    console.log('Token ID reçu:', tokenId);

    // Appeler l'edge function send-documents-request-email
    const { data: emailResponse, error: emailError } = await supabase.functions.invoke('send-documents-request-email', {
      body: { tokenId }
    });

    if (emailError) {
      console.error('Erreur lors de l\'appel à send-documents-request-email:', emailError);
      throw emailError;
    }

    console.log('Email envoyé avec succès via process-documents-request');

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Document request processed successfully',
      emailResponse 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Erreur dans process-documents-request:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
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
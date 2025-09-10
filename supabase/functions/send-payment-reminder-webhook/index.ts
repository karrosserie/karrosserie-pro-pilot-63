import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentReminderRequest {
  clientId: string;
  invoiceId: string;
  companyId: string;
  relanceNumber: number;
  channel: 'email' | 'sms' | 'whatsapp' | 'phone' | 'courrier' | 'courrier_recommande';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { clientId, invoiceId, companyId, relanceNumber, channel }: PaymentReminderRequest = await req.json();

    console.log('Processing payment reminder webhook:', { clientId, invoiceId, companyId, relanceNumber, channel });

    // Récupérer les informations du client
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (clientError) {
      console.error('Error fetching client:', clientError);
      throw new Error('Client non trouvé');
    }

    // Récupérer les informations de la facture
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    if (invoiceError) {
      console.error('Error fetching invoice:', invoiceError);
      throw new Error('Facture non trouvée');
    }

    // Récupérer les informations de la carrosserie
    const { data: companyData, error: companyError } = await supabase
      .from('company_info')
      .select('*')
      .eq('id', companyId)
      .single();

    if (companyError) {
      console.error('Error fetching company:', companyError);
      throw new Error('Entreprise non trouvée');
    }

    // Construire le payload pour N8N
    const payload = {
      relance_number: relanceNumber,
      channel: channel,
      client: {
        first_name: clientData.first_name,
        last_name: clientData.last_name,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        postal_code: clientData.postal_code,
        city: clientData.city
      },
      invoice: {
        reference: invoiceData.reference,
        amount: parseFloat(invoiceData.amount),
        due_date: invoiceData.due_date,
        status: invoiceData.status,
        date: invoiceData.date
      },
      company: {
        name: companyData.name,
        email: companyData.email,
        phone: companyData.phone,
        address: `${companyData.address}, ${companyData.zipcode} ${companyData.city}`.trim()
      },
      timestamp: new Date().toISOString()
    };

    console.log('Payload prepared for N8N:', JSON.stringify(payload, null, 2));

    // Envoyer vers N8N (URL à configurer selon votre instance N8N)
    const n8nWebhookUrl = 'https://n8n.karrosserie.pro/webhook/payment-reminder';
    
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error('N8N webhook failed:', response.status, await response.text());
      throw new Error(`Erreur N8N: ${response.status}`);
    }

    const result = await response.json();
    console.log('N8N webhook success:', result);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Relance envoyée vers N8N avec succès',
        payload: payload
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
    console.error('Error in payment reminder webhook:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erreur interne du serveur',
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
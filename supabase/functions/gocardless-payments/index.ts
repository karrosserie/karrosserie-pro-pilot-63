import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuration GoCardless basée sur l'environnement
const IS_SANDBOX = Deno.env.get('ENVIRONMENT') !== 'production';
const GOCARDLESS_ACCESS_TOKEN = IS_SANDBOX 
  ? Deno.env.get('GOCARDLESS_SANDBOX_ACCESS_TOKEN')
  : Deno.env.get('GOCARDLESS_ACCESS_TOKEN');
const GOCARDLESS_ENDPOINT_URL = IS_SANDBOX
  ? Deno.env.get('GOCARDLESS_SANDBOX_ENDPOINT_URL')
  : Deno.env.get('GOCARDLESS_ENDPOINT_URL');

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface CreateCustomerParams {
  companyId: string;
  customerData: {
    given_name: string;
    family_name: string;
    email: string;
    phone_number?: string;
    address_line1: string;
    city: string;
    postal_code: string;
    country_code: string;
  };
}

interface CreateMandateParams {
  customerId: string;
  bankAccount: {
    iban: string;
    account_holder_name: string;
  };
}

interface CreatePaymentParams {
  mandateId: string;
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, string>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();
    
    console.log(`GoCardless action: ${action}`, params);

    switch (action) {
      case 'create_customer':
        return await createCustomer(params as CreateCustomerParams);
      case 'create_mandate':
        return await createMandate(params as CreateMandateParams);
      case 'create_payment':
        return await createPayment(params as CreatePaymentParams);
      case 'get_mandate_status':
        return await getMandateStatus(params.mandateId);
      case 'cancel_mandate':
        return await cancelMandate(params.mandateId);
      case 'webhook':
        return await handleWebhook(req);
      default:
        throw new Error(`Action non supportée: ${action}`);
    }
  } catch (error) {
    console.error('Erreur GoCardless:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function createCustomer({ companyId, customerData }: CreateCustomerParams) {
  console.log('Création du client GoCardless:', customerData);

  const response = await fetch(`${GOCARDLESS_ENDPOINT_URL}/customers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GOCARDLESS_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'GoCardless-Version': '2015-07-06',
    },
    body: JSON.stringify({
      customers: customerData
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Erreur création client: ${JSON.stringify(data)}`);
  }

  // Sauvegarder l'ID client GoCardless dans company_info
  const { error: updateError } = await supabase
    .from('company_info')
    .update({ 
      gocardless_customer_id: data.customers.id 
    })
    .eq('id', companyId);

  if (updateError) {
    console.error('Erreur sauvegarde customer_id:', updateError);
  }

  console.log('Client GoCardless créé:', data.customers.id);
  
  return new Response(
    JSON.stringify({ customer: data.customers }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function createMandate({ customerId, bankAccount }: CreateMandateParams) {
  console.log('Création du mandat GoCardless:', { customerId, bankAccount });

  // Étape 1: Créer le compte bancaire
  const bankAccountResponse = await fetch(`${GOCARDLESS_ENDPOINT_URL}/customer_bank_accounts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GOCARDLESS_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'GoCardless-Version': '2015-07-06',
    },
    body: JSON.stringify({
      customer_bank_accounts: {
        ...bankAccount,
        country_code: 'FR',
        currency: 'EUR',
        links: {
          customer: customerId
        }
      }
    }),
  });

  const bankAccountData = await bankAccountResponse.json();
  
  if (!bankAccountResponse.ok) {
    throw new Error(`Erreur création compte bancaire: ${JSON.stringify(bankAccountData)}`);
  }

  // Étape 2: Créer le mandat
  const mandateResponse = await fetch(`${GOCARDLESS_ENDPOINT_URL}/mandates`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GOCARDLESS_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'GoCardless-Version': '2015-07-06',
    },
    body: JSON.stringify({
      mandates: {
        scheme: 'sepa_core',
        links: {
          customer_bank_account: bankAccountData.customer_bank_accounts.id
        }
      }
    }),
  });

  const mandateData = await mandateResponse.json();
  
  if (!mandateResponse.ok) {
    throw new Error(`Erreur création mandat: ${JSON.stringify(mandateData)}`);
  }

  console.log('Mandat GoCardless créé:', mandateData.mandates.id);
  
  return new Response(
    JSON.stringify({ 
      mandate: mandateData.mandates,
      bank_account: bankAccountData.customer_bank_accounts 
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function createPayment({ mandateId, amount, currency, description, metadata }: CreatePaymentParams) {
  console.log('Création du paiement GoCardless:', { mandateId, amount, currency });

  const response = await fetch(`${GOCARDLESS_ENDPOINT_URL}/payments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GOCARDLESS_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'GoCardless-Version': '2015-07-06',
    },
    body: JSON.stringify({
      payments: {
        amount: Math.round(amount * 100), // GoCardless attend les montants en centimes
        currency: currency.toUpperCase(),
        description,
        metadata: metadata || {},
        links: {
          mandate: mandateId
        }
      }
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Erreur création paiement: ${JSON.stringify(data)}`);
  }

  console.log('Paiement GoCardless créé:', data.payments.id);
  
  return new Response(
    JSON.stringify({ payment: data.payments }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function getMandateStatus(mandateId: string) {
  console.log('Récupération du statut du mandat:', mandateId);

  const response = await fetch(`${GOCARDLESS_ENDPOINT_URL}/mandates/${mandateId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${GOCARDLESS_ACCESS_TOKEN}`,
      'GoCardless-Version': '2015-07-06',
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Erreur récupération mandat: ${JSON.stringify(data)}`);
  }

  return new Response(
    JSON.stringify({ mandate: data.mandates }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function cancelMandate(mandateId: string) {
  console.log('Annulation du mandat:', mandateId);

  const response = await fetch(`${GOCARDLESS_ENDPOINT_URL}/mandates/${mandateId}/actions/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GOCARDLESS_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'GoCardless-Version': '2015-07-06',
    },
    body: JSON.stringify({
      data: {}
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Erreur annulation mandat: ${JSON.stringify(data)}`);
  }

  return new Response(
    JSON.stringify({ mandate: data.mandates }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function handleWebhook(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('webhook-signature');
  
  console.log('Webhook GoCardless reçu:', { signature, body });

  // Ici vous pourriez vérifier la signature du webhook si nécessaire
  
  const events = JSON.parse(body).events;
  
  for (const event of events) {
    console.log('Traitement de l\'événement:', event);
    
    // Traiter les différents types d'événements
    switch (event.resource_type) {
      case 'payments':
        await handlePaymentEvent(event);
        break;
      case 'mandates':
        await handleMandateEvent(event);
        break;
      default:
        console.log('Type d\'événement non géré:', event.resource_type);
    }
  }

  return new Response('OK', {
    status: 200,
    headers: corsHeaders,
  });
}

async function handlePaymentEvent(event: any) {
  const paymentId = event.links.payment;
  const action = event.action;
  
  console.log(`Événement de paiement: ${action} pour ${paymentId}`);
  
  // Mapper les actions GoCardless vers les statuts de la base
  let newStatus = 'pending_submission';
  
  switch(action) {
    case 'created':
      newStatus = 'pending_submission';
      break;
    case 'submitted':
      newStatus = 'submitted';
      break;
    case 'confirmed':
      newStatus = 'confirmed';
      break;
    case 'paid_out':
      newStatus = 'paid_out';
      break;
    case 'failed':
      newStatus = 'failed';
      break;
    case 'cancelled':
      newStatus = 'cancelled';
      break;
    case 'charged_back':
      newStatus = 'charged_back';
      break;
  }
  
  // Mettre à jour le paiement dans la base de données
  const { error } = await supabase
    .from('gocardless_payments')
    .update({ 
      status: newStatus, 
      updated_at: new Date().toISOString() 
    })
    .eq('gocardless_payment_id', paymentId);
  
  if (error) {
    console.error('Erreur mise à jour paiement:', error);
  } else {
    console.log(`Paiement ${paymentId} mis à jour: ${newStatus}`);
  }
  
  // Si le paiement est confirmé, mettre à jour l'abonnement
  if (action === 'paid_out') {
    // Récupérer le paiement pour avoir le subscription_id
    const { data: payment } = await supabase
      .from('gocardless_payments')
      .select('subscription_id')
      .eq('gocardless_payment_id', paymentId)
      .single();
    
    if (payment?.subscription_id) {
      const { error: subError } = await supabase
        .from('company_subscriptions')
        .update({ 
          last_payment_date: new Date().toISOString(),
          last_payment_status: 'success'
        })
        .eq('id', payment.subscription_id);
        
      if (subError) {
        console.error('Erreur mise à jour abonnement:', subError);
      } else {
        console.log(`Abonnement ${payment.subscription_id} mis à jour`);
      }
    }
  }
}

async function handleMandateEvent(event: any) {
  const mandateId = event.links.mandate;
  const action = event.action;
  
  console.log(`Événement de mandat: ${action} pour ${mandateId}`);
  
  // Mapper les actions GoCardless vers les statuts de la base
  let newStatus = 'pending_submission';
  
  switch(action) {
    case 'created':
      newStatus = 'pending_submission';
      break;
    case 'submitted':
      newStatus = 'submitted';
      break;
    case 'active':
      newStatus = 'active';
      break;
    case 'cancelled':
      newStatus = 'cancelled';
      break;
    case 'failed':
      newStatus = 'failed';
      break;
    case 'expired':
      newStatus = 'expired';
      break;
  }
  
  // Mettre à jour le mandat dans la base de données
  const { error: mandateError } = await supabase
    .from('gocardless_mandates')
    .update({ 
      status: newStatus, 
      updated_at: new Date().toISOString() 
    })
    .eq('gocardless_mandate_id', mandateId);
  
  if (mandateError) {
    console.error('Erreur mise à jour mandat:', mandateError);
  } else {
    console.log(`Mandat ${mandateId} mis à jour: ${newStatus}`);
  }
  
  // Mettre à jour aussi le statut dans company_info si c'est le mandat principal
  if (action === 'active' || action === 'cancelled' || action === 'failed') {
    const { error: companyError } = await supabase
      .from('company_info')
      .update({ 
        gocardless_mandate_status: newStatus 
      })
      .eq('gocardless_mandate_id', mandateId);
      
    if (companyError) {
      console.error('Erreur mise à jour company_info:', companyError);
    }
  }
}
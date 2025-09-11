import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.6";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface SendCessionEmailRequest {
  cessionId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cessionId }: SendCessionEmailRequest = await req.json();
    
    console.log('Processing cession email for ID:', cessionId);

    // Récupérer la cession avec la compagnie d'assurance
    const { data: cession, error: cessionError } = await supabase
      .from('cessions')
      .select(`
        *,
        insurance_companies (
          name,
          address,
          city,
          zipcode,
          phone,
          email
        )
      `)
      .eq('id', cessionId)
      .single();

    if (cessionError || !cession) {
      console.error('Error fetching cession:', cessionError);
      throw new Error('Cession non trouvée');
    }

    // Vérifier que la cession est signée
    if (cession.status !== 'signee') {
      throw new Error('La cession doit être signée avant d\'être envoyée par courrier');
    }

    // Vérifier qu'il y a une compagnie d'assurance
    if (!cession.insurance_companies) {
      throw new Error('Aucune compagnie d\'assurance associée à cette cession');
    }

    // Vérifier qu'il y a un document signé
    if (!cession.signed_document_url) {
      throw new Error('Aucun document signé disponible pour cette cession');
    }

    const insuranceCompany = cession.insurance_companies;

    // Construire le titre avec le numéro de sinistre
    const title = `Cession de créance${cession.incident_number ? `, ${cession.incident_number}` : ''}`;

    // Préparer les paramètres pour le webhook N8N
    const webhookData = {
      civility: '', // Vide car destinataire entreprise
      lastName: '', // Vide car destinataire entreprise
      firstName: '', // Vide car destinataire entreprise
      address: insuranceCompany.address || '',
      zipCode: insuranceCompany.zipcode || '',
      city: insuranceCompany.city || '',
      company: insuranceCompany.name || '',
      phone: insuranceCompany.phone || '',
      email: insuranceCompany.email || '',
      filepath: cession.signed_document_url,
      title: title,
      // Paramètres laissés vides comme spécifié
      author: '',
      subject: '',
      description: '',
      papier: '',
      papier_delai: '',
      papier_rectoverso: '',
      papier_couleur: '',
      papier_enveloppe: ''
    };

    console.log('Sending webhook data:', webhookData);

    // Appeler le webhook N8N
    const webhookResponse = await fetch('https://n8n.karrosserie.pro/webhook/5f39c262-4fa4-477b-8635-f04c9bb61308', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData)
    });

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error('Webhook error response:', errorText);
      throw new Error(`Erreur lors de l'envoi du courrier: ${webhookResponse.status} ${webhookResponse.statusText}`);
    }

    console.log('Webhook called successfully');

    // Consommer les jetons (10 jetons pour l'envoi de cession)
    const { data: subscription, error: subscriptionError } = await supabase
      .from('company_subscriptions')
      .select('*')
      .eq('company_id', cession.company_id)
      .eq('status', 'active')
      .single();

    if (subscriptionError || !subscription) {
      console.error('Error fetching subscription:', subscriptionError);
      throw new Error('Aucun abonnement actif trouvé');
    }

    if (subscription.tokens_remaining < 10) {
      throw new Error('Jetons insuffisants pour cette opération (10 jetons requis)');
    }

    // Consommer les jetons
    const { error: tokenError } = await supabase
      .from('company_subscriptions')
      .update({
        tokens_remaining: subscription.tokens_remaining - 10,
        tokens_used: subscription.tokens_used + 10
      })
      .eq('id', subscription.id);

    if (tokenError) {
      console.error('Error consuming tokens:', tokenError);
      throw new Error('Erreur lors de la consommation des jetons');
    }

    // Enregistrer l'usage des jetons
    const { error: usageError } = await supabase
      .from('token_usage')
      .insert({
        company_id: cession.company_id,
        subscription_id: subscription.id,
        operation_type: 'CESSION_CREANCE',
        tokens_consumed: 10,
        description: `Envoi de cession de créance par courrier électronique - ${cession.reference || cession.id}`
      });

    if (usageError) {
      console.error('Error logging token usage:', usageError);
      // Non-bloquant, on continue
    }

    // Mettre à jour le statut de la cession
    const { error: updateError } = await supabase
      .from('cessions')
      .update({
        status: 'lettre_recommandee_envoyee'
      })
      .eq('id', cessionId);

    if (updateError) {
      console.error('Error updating cession status:', updateError);
      throw new Error('Erreur lors de la mise à jour du statut de la cession');
    }

    console.log('Cession email sent successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cession envoyée par courrier électronique avec succès',
        tokensConsumed: 10
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in send-cession-registered-mail function:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});